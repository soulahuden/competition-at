import { useState } from 'react';
import { Avatar, Button, Modal, RatingScale } from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import type { PeerReviewAnswer, Team } from '@/types';

interface PeerReviewModalProps {
  open: boolean;
  onClose: () => void;
  team: Team;
}

const QUESTIONS = [
  { key: 'contribution', text: 'Apakah rekan ini berkontribusi sesuai perannya?' },
  { key: 'responsiveness', text: 'Apakah rekan ini responsif saat dihubungi?' },
  { key: 'persistence', text: 'Apakah rekan ini bertahan sampai lomba selesai?' },
] as const;

export function PeerReviewModal({ open, onClose, team }: PeerReviewModalProps) {
  const { students, submitPeerReview } = useStore();
  const { currentUserId } = useAuth();

  const teammates = team.members.filter((m) => m.studentId !== currentUserId);
  const [answers, setAnswers] = useState<Record<string, PeerReviewAnswer>>(() =>
    Object.fromEntries(
      teammates.map((m) => [
        m.studentId,
        { revieweeId: m.studentId, contribution: 0, responsiveness: 0, persistence: 0 },
      ]),
    ),
  );
  const [submitting, setSubmitting] = useState(false);

  const complete = teammates.every((m) => {
    const a = answers[m.studentId];
    return a && a.contribution > 0 && a.responsiveness > 0 && a.persistence > 0;
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    await submitPeerReview(team.id, currentUserId, Object.values(answers));
    setSubmitting(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Peer Review"
      description="Jawaban bersifat anonim bagi rekan tim dan hanya dipakai untuk menghitung skor reliabilitas."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Nanti saja
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={!complete || submitting}>
            {submitting ? 'Mengirim…' : 'Kirim peer review'}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {teammates.map((member) => {
          const student = students.find((s) => s.id === member.studentId);
          if (!student) return null;
          const answer = answers[member.studentId];

          return (
            <section
              key={member.studentId}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center gap-3">
                <Avatar name={student.name} size="sm" />
                <div>
                  <p className="font-medium text-white">{student.name}</p>
                  <p className="text-xs text-ink-muted">{member.role}</p>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {QUESTIONS.map((q) => (
                  <RatingScale
                    key={q.key}
                    name={`${member.studentId}-${q.key}`}
                    question={q.text}
                    value={answer[q.key]}
                    onChange={(value) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [member.studentId]: { ...prev[member.studentId], [q.key]: value },
                      }))
                    }
                  />
                ))}
              </div>
            </section>
          );
        })}

        <p className="text-xs text-ink-faint">
          Tidak ada kolom komentar bebas. Penilaian hanya berupa skala 1–5 agar umpan balik tetap
          terukur dan tidak menyerang pribadi.
        </p>
      </div>
    </Modal>
  );
}
