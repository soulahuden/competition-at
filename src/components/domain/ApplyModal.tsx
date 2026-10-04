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
      message: message.trim() || 'Saya tertarik bergabung dengan tim ini.',
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
      title={`Lamar: ${recruitment.role}`}
      description={`${recruitment.teamName} · ${recruitment.competitionName}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? 'Mengirim…' : 'Kirim lamaran'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-sm">
          <p className="text-ink-muted">
            Dibutuhkan: <span className="text-white">{recruitment.role}</span>
          </p>
          <p className="mt-1 text-xs text-ink-faint">{recruitment.commitment}</p>
        </div>

        <TextAreaField
          label="Pesan singkat"
          hint="Ceritakan pengalaman relevan dan ketersediaan waktumu. Cukup 2–3 kalimat."
          placeholder="Halo, saya tertarik mengisi slot ini karena…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <SelectField
          label="Lampirkan portfolio"
          hint={
            me && me.portfolio.length === 0
              ? 'Kamu belum menambahkan portfolio di profil.'
              : 'Opsional, tapi sangat membantu kapten menilai.'
          }
          value={portfolioId}
          onChange={(e) => setPortfolioId(e.target.value)}
        >
          <option value="">Tanpa portfolio</option>
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
