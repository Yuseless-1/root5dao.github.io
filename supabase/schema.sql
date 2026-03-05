-- ============================================================
-- Root5 DAO Governance — Supabase Schema
-- Paste this entire file into the Supabase SQL Editor and run.
-- ============================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.proposals (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  title          text        NOT NULL,
  description    text        NOT NULL,
  creator_wallet text        NOT NULL,
  status         text        NOT NULL DEFAULT 'Active'
                             CHECK (status IN ('Active', 'Pending', 'Passed', 'Rejected', 'Executed')),
  votes_for      bigint      NOT NULL DEFAULT 0,
  votes_against  bigint      NOT NULL DEFAULT 0,
  votes_abstain  bigint      NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  expires_at     timestamptz NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

CREATE TABLE IF NOT EXISTS public.votes (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id    uuid        NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  wallet_address text        NOT NULL,
  vote_choice    text        NOT NULL CHECK (vote_choice IN ('FOR', 'AGAINST', 'ABSTAIN')),
  chain          text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (proposal_id, wallet_address)
);

-- One-time nonces for wallet signature auth
CREATE TABLE IF NOT EXISTS public.web3_nonces (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address text        NOT NULL,
  nonce          text        NOT NULL,
  expires_at     timestamptz NOT NULL,
  used           boolean     NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- GOVERNANCE CONFIG
-- Stores adjustable thresholds. Edit values here any time —
-- no redeployment needed. See UPDATE examples at bottom.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.governance_config (
  key        text        PRIMARY KEY,
  value      text        NOT NULL,
  note       text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Initial threshold values (ROOT5 token amounts, whole numbers)
INSERT INTO public.governance_config (key, value, note) VALUES
  ('vote_threshold',     '5000000',  'Minimum ROOT5 tokens held to vote on proposals'),
  ('proposal_threshold', '10000000', 'Minimum ROOT5 tokens held to create proposals')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_proposals_status     ON public.proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON public.proposals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_proposal_id    ON public.votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_votes_wallet         ON public.votes(wallet_address);
CREATE INDEX IF NOT EXISTS idx_nonces_wallet        ON public.web3_nonces(wallet_address);
CREATE INDEX IF NOT EXISTS idx_nonces_lookup        ON public.web3_nonces(wallet_address, nonce);
-- Added: efficient lookup for expired nonce cleanup
CREATE INDEX IF NOT EXISTS idx_nonces_expires_at    ON public.web3_nonces(expires_at);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.proposals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web3_nonces       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_config ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read proposals"
  ON public.proposals FOR SELECT USING (true);

CREATE POLICY "Public read votes"
  ON public.votes FOR SELECT USING (true);

CREATE POLICY "Public read governance_config"
  ON public.governance_config FOR SELECT USING (true);

-- web3_nonces: deny all client access (service role bypasses RLS)
CREATE POLICY "No client access nonces"
  ON public.web3_nonces FOR ALL TO PUBLIC USING (false) WITH CHECK (false);

-- Explicitly deny client INSERT on write tables
-- (INSERT policies use WITH CHECK only, not USING)
CREATE POLICY "No client write votes"
  ON public.votes FOR INSERT TO PUBLIC WITH CHECK (false);

CREATE POLICY "No client write proposals"
  ON public.proposals FOR INSERT TO PUBLIC WITH CHECK (false);

CREATE POLICY "No client write governance_config"
  ON public.governance_config FOR INSERT TO PUBLIC WITH CHECK (false);

-- ============================================================
-- RPC FUNCTION: cast_vote
-- Called server-side only (service role key).
-- Token balance check happens in the API layer BEFORE this is called.
-- Normalizes vote_choice to uppercase so callers can pass any case.
-- ============================================================

CREATE OR REPLACE FUNCTION public.cast_vote(
  p_proposal_id    uuid,
  p_wallet_address text,
  p_vote_choice    text,
  p_chain          text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count  int;
  v_choice text := upper(p_vote_choice);
BEGIN
  IF v_choice NOT IN ('FOR', 'AGAINST', 'ABSTAIN') THEN
    RETURN jsonb_build_object('error', 'invalid_vote_choice');
  END IF;

  SELECT count(*) INTO v_count
    FROM public.proposals
   WHERE id = p_proposal_id AND status = 'Active';

  IF v_count = 0 THEN
    RETURN jsonb_build_object('error', 'proposal_not_active');
  END IF;

  BEGIN
    INSERT INTO public.votes (proposal_id, wallet_address, vote_choice, chain)
    VALUES (p_proposal_id, p_wallet_address, v_choice, p_chain);
  EXCEPTION WHEN unique_violation THEN
    RETURN jsonb_build_object('error', 'already_voted');
  WHEN others THEN
    RETURN jsonb_build_object('error', 'insert_failed', 'detail', sqlerrm);
  END;

  IF v_choice = 'FOR' THEN
    UPDATE public.proposals SET votes_for     = votes_for     + 1 WHERE id = p_proposal_id;
  ELSIF v_choice = 'AGAINST' THEN
    UPDATE public.proposals SET votes_against = votes_against + 1 WHERE id = p_proposal_id;
  ELSIF v_choice = 'ABSTAIN' THEN
    UPDATE public.proposals SET votes_abstain = votes_abstain + 1 WHERE id = p_proposal_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'vote_choice', v_choice);
END;
$$;

-- ============================================================
-- RPC FUNCTION: create_proposal
-- Called server-side only after token balance check.
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_proposal(
  p_title          text,
  p_description    text,
  p_creator_wallet text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.proposals (title, description, creator_wallet)
  VALUES (p_title, p_description, p_creator_wallet)
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('success', true, 'id', v_id);
EXCEPTION WHEN others THEN
  RETURN jsonb_build_object('error', 'create_failed', 'detail', sqlerrm);
END;
$$;

-- ============================================================
-- UTILITY FUNCTION: cleanup_expired_nonces
-- Returns the number of rows deleted.
-- Call periodically from a cron job or pg_cron extension.
-- ============================================================

CREATE OR REPLACE FUNCTION public.cleanup_expired_nonces()
RETURNS int
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH deleted AS (
    DELETE FROM public.web3_nonces WHERE expires_at < now() RETURNING 1
  )
  SELECT count(*)::int FROM deleted;
$$;

-- ============================================================
-- REVOKE direct execution from client roles
-- ============================================================

REVOKE EXECUTE ON FUNCTION public.cast_vote(uuid, text, text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_proposal(text, text, text)  FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE EXECUTE ON FUNCTION public.cast_vote(uuid, text, text, text)  FROM authenticated;
    REVOKE EXECUTE ON FUNCTION public.create_proposal(text, text, text)  FROM authenticated;
  END IF;

  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE EXECUTE ON FUNCTION public.cast_vote(uuid, text, text, text)  FROM anon;
    REVOKE EXECUTE ON FUNCTION public.create_proposal(text, text, text)  FROM anon;
  END IF;
END
$$;

-- ============================================================
-- ADJUSTING THRESHOLDS LATER (no redeployment needed)
-- Run in the Supabase SQL editor whenever token value changes:
--
-- UPDATE public.governance_config
--   SET value = '7500000', updated_at = now()
--   WHERE key = 'vote_threshold';
--
-- UPDATE public.governance_config
--   SET value = '15000000', updated_at = now()
--   WHERE key = 'proposal_threshold';
-- ============================================================
