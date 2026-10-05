import { useState } from 'react';
import { Button, Modal, SelectField, TextAreaField } from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import type { RecruitmentView } from '@/services/recruitmentService';

interface ApplyModalProps {
  recruitment: RecruitmentView | null;
  onClose: () => void;
}

export function ApplyModal({ recruitment, onClose }: ApplyModalProps) {
  const { applyToTeam, studentById } = useStore();
  const { currentUserId } = useAuth();
  const me = studentById(currentUserId);

  const [message, setMessage] = useState('');
  const [portfolioId, setPortfolioId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!recruitment) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    await applyToTeam({
      teamId: recruitment.teamId,
      slotId: recruitment.slotId,
      applicantId: currentUserId,
      message: message.trim() || 'I\'d like to join this team.',
      portfolioId: portfolioId || undefined,
    });
    setSubmitting(false);
    setMessage('');
    setPortfolioId('');
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`Apply: ${recruitment.role}`}
      description={`${recruitment.teamName} · ${recruitment.competitionName}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? 'Sending…' : 'Send application'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-sm">
          <p className="text-ink-muted">
            Role: <span className="text-white">{recruitment.role}</span>
          </p>
          <p className="mt-1 text-xs text-ink-faint">{recruitment.commitment}</p>
        </div>

        <TextAreaField
          label="Short message"
          hint="Relevant experience and how much time you have. 2 or 3 sentences is plenty."
          placeholder="Hi, I'd like this spot because…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <SelectField
          label="Attach a portfolio item"
          hint={
            me && me.portfolio.length === 0
              ? 'You haven\'t added anything to your portfolio yet.'
              : 'Optional, but it helps the captain decide.'
          }
          value={portfolioId}
          onChange={(e) => setPortfolioId(e.target.value)}
        >
          <option value="">None</option>
          {me?.portfolio.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </SelectField>
      </div>
    </Modal>
  );
}
