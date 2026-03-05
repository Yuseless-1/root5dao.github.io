import React, { useState } from 'react';

interface NewProposalFormProps {
  onClose: () => void;
  onSubmit: (proposal: { title: string; subject: string; budget: number }) => Promise<void>;
  submitError?: string | null;
}

const NewProposalForm: React.FC<NewProposalFormProps> = ({ onClose, onSubmit, submitError }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [budget, setBudget] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || budget === '') return;
    setIsSubmitting(true);
    try {
      await onSubmit({ title, subject, budget: Number(budget) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="glass neon-border p-8 rounded-2xl w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold gradient-text">Create New Proposal</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-white/70 text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              id="title"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white transition-colors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Proposal title"
              required
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-white/70 text-sm font-medium mb-2">Description</label>
            <textarea
              id="subject"
              rows={4}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white transition-colors resize-none"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Describe the proposal and its objectives..."
              required
            />
          </div>

          <div>
            <label htmlFor="budget" className="block text-white/70 text-sm font-medium mb-2">Budget (ETH)</label>
            <input
              type="number"
              id="budget"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white transition-colors"
              value={budget}
              onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0.00"
              required
              min="0"
              step="0.01"
            />
          </div>

          {submitError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {submitError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                isSubmitting
                ? 'bg-green-700/50 text-white/40 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing...
                </>
              ) : 'Submit Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProposalForm;
