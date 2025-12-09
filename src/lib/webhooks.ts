import { getSupabaseServer } from './supabase-server';
import { createHmac } from 'crypto';

export interface WebhookPayload {
  orderId: string;
  eventType: string;
  data: any;
  timestamp: string;
}

export async function triggerWebhooks(
  orderId: string,
  eventType: string,
  data: any
): Promise<void> {
  try {
    const supabase = getSupabaseServer();
    // Get active webhooks for this event type
    const { data: webhooks, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('event_type', eventType)
      .eq('is_active', true);

    if (error || !webhooks || webhooks.length === 0) {
      return;
    }

    const payload: WebhookPayload = {
      orderId,
      eventType,
      data,
      timestamp: new Date().toISOString(),
    };

    // Send webhooks in parallel
    await Promise.allSettled(
      webhooks.map(async (webhook: any) => {
        try {
          const signature = webhook.secret
            ? generateSignature(JSON.stringify(payload), webhook.secret)
            : null;

          const response = await fetch(webhook.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(signature && { 'X-Webhook-Signature': signature }),
            },
            body: JSON.stringify(payload),
          });

          // Record webhook delivery
          try {
            await supabase.from('webhook_deliveries').insert({
              webhook_id: webhook.id,
              order_id: orderId,
              payload,
              response_status: response.status,
              response_body: await response.text().catch(() => null),
              delivered_at: response.ok ? new Date().toISOString() : null,
              error_message: response.ok ? null : `HTTP ${response.status}`,
            });
          } catch (deliveryError) {
            console.error('Error recording webhook delivery (non-fatal):', deliveryError);
          }
        } catch (error: any) {
          // Record failed delivery
          try {
            await supabase.from('webhook_deliveries').insert({
              webhook_id: webhook.id,
              order_id: orderId,
              payload,
              response_status: null,
              response_body: null,
              delivered_at: null,
              error_message: error.message,
            });
          } catch (deliveryError) {
            console.error('Error recording failed webhook delivery (non-fatal):', deliveryError);
          }
        }
      })
    );
  } catch (error) {
    console.error('Error triggering webhooks:', error);
  }
}

function generateSignature(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

