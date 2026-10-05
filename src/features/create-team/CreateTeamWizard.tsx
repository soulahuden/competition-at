import { useMemo, useState } from 'react';
import { Check, Plus, Search, Trash2, X } from 'lucide-react';
import {
  Avatar,
  Badge,
  Button,
  Modal,
  ProgressSteps,
  TextField,
} from '@/components/ui';
import { CheckoutPanel } from '@/features/checkout/CheckoutPanel';
import { roleSuggestions } from '@/components/domain/teamMeta';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { deadlineLabel, formatDate, formatRupiah } from '@/lib/format';
import type { Competition, Team } from '@/types';

interface CreateTeamWizardProps {
  open: boolean;
  onClose: () => void;
  preselectedCompetitionId?: string;
  onCreated?: (team: Team) => void;
}

interface DraftSlot {
  role: string;
  skills: string[];
  note: string;
}

const BASE_STEPS = ['Competition', 'Team and members', 'Open slots'];

export function CreateTeamWizard({
  open,
  onClose,
  preselectedCompetitionId,
  onCreated,
}: CreateTeamWizardProps) {
  const { competitions, students, createTeam, payRegistration } = useStore();
  const { currentUserId } = useAuth();

  const [step, setStep] = useState(0);
  const [competitionId, setCompetitionId] = useState(preselectedCompetitionId ?? '');
  const [teamName, setTeamName] = useState('');
  const [captainRole, setCaptainRole] = useState('');
  const [invited, setInvited] = useState<Array<{ studentId: string; role: string }>>([]);
  const [memberQuery, setMemberQuery] = useState('');
  const [slots, setSlots] = useState<DraftSlot[]>([]);
  const [slotDraft, setSlotDraft] = useState<DraftSlot>({ role: '', skills: [], note: '' });
  const [skillDraft, setSkillDraft] = useState('');
  const [createdTeam, setCreatedTeam] = useState<Team | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const openCompetitions = competitions.filter((c) => c.status === 'mendatang');
  const competition: Competition | undefined = competitions.find((c) => c.id === competitionId);
  const isPaid = (competition?.fee ?? 0) > 0;
  const steps = isPaid ? [...BASE_STEPS, 'Payment'] : BASE_STEPS;

  const candidates = useMemo(() => {
    const q = memberQuery.trim().toLowerCase();
    return students
      .filter((s) => s.id !== currentUserId && !invited.some((i) => i.studentId === s.id))
      .filter((s) => !q || `${s.name} ${s.major} ${s.skills.join(' ')}`.toLowerCase().includes(q))
      .slice(0, 6);
  }, [students, memberQuery, invited, currentUserId]);

  const reset = () => {
    setStep(0);
    setCompetitionId(preselectedCompetitionId ?? '');
    setTeamName('');
    setCaptainRole('');
    setInvited([]);
    setMemberQuery('');
    setSlots([]);
    setSlotDraft({ role: '', skills: [], note: '' });
    setSkillDraft('');
    setCreatedTeam(null);
  };

  const handleClose = () => {
    onClose();
    // Beri waktu animasi modal menutup sebelum state dibersihkan.
    setTimeout(reset, 200);
  };

  const addSlot = () => {
    if (!slotDraft.role.trim()) return;
    setSlots((list) => [...list, slotDraft]);
    setSlotDraft({ role: '', skills: [], note: '' });
    setSkillDraft('');
  };

  const addSkillToDraft = () => {
    const value = skillDraft.trim();
    if (!value || slotDraft.skills.includes(value)) return;
    setSlotDraft((d) => ({ ...d, skills: [...d.skills, value] }));
    setSkillDraft('');
  };

  const submitTeam = async () => {
    if (!competition) return;
    setSubmitting(true);
    const team = await createTeam({
      name: teamName.trim(),
      competitionId: competition.id,
      captainId: currentUserId,
      captainRole: captainRole.trim() || 'Captain',
      invitedIds: invited,
      openSlots: slots.map((s) => ({ role: s.role, skills: s.skills, note: s.note })),
    });
    setSubmitting(false);
    setCreatedTeam(team);
    onCreated?.(team);

    if (isPaid) {
      setStep(3);
    } else {
      handleClose();
    }
  };

  const canContinue =
    step === 0 ? Boolean(competitionId) : step === 1 ? teamName.trim().length >= 2 : true;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create a team"
      description={
        step === 3
          ? 'Pay the registration fee to lock in your team.'
          : `Step ${step + 1} of ${steps.length}`
      }
      size="lg"
      footer={
        step === 3 ? undefined : (
          <>
            {step > 0 && (
              <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            {step < 2 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue}>
                Next
              </Button>
            ) : (
              <Button onClick={() => void submitTeam()} disabled={submitting}>
                {submitting ? 'Creating team…' : isPaid ? 'Continue to payment' : 'Create team'}
              </Button>
            )}
          </>
        )
      }
    >
      <div className="space-y-6">
        <ProgressSteps steps={steps} current={step} />

        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-ink-muted">
              Activity points only count if you register before the competition starts.
            </p>
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {openCompetitions.map((c) => {
                const active = c.id === competitionId;
                return (
                  <label
                    key={c.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                      active
                        ? 'border-cyan/60 bg-cyan/10'
                        : 'border-white/10 bg-white/5 hover:border-white/25'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pilih-lomba"
                      value={c.id}
                      checked={active}
                      onChange={() => setCompetitionId(c.id)}
                      className="sr-only"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-white">{c.name}</span>
                      <span className="mt-0.5 block text-xs text-ink-muted">
                        {c.organizer} · {c.category} · {c.tier}
                      </span>
                      <span className="mt-2 flex flex-wrap gap-2">
                        <Badge tone="outline">{deadlineLabel(c.registrationDeadline)}</Badge>
                        <Badge tone={c.fee > 0 ? 'amber' : 'success'}>{formatRupiah(c.fee)}</Badge>
                        <Badge tone="outline">
                          {c.teamSizeMin}-{c.teamSizeMax} people
                        </Badge>
                      </span>
                    </span>
                    {active && <Check size={18} className="mt-1 shrink-0 text-cyan" />}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Team name"
                required
                placeholder="e.g. NullByte"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <TextField
                label="Your role"
                placeholder="e.g. Web Exploitation"
                list="role-suggestions"
                value={captainRole}
                onChange={(e) => setCaptainRole(e.target.value)}
              />
              <datalist id="role-suggestions">
                {roleSuggestions.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-ink">Invite members</p>
              {invited.length > 0 && (
                <ul className="mb-3 space-y-2">
                  {invited.map((inv) => {
                    const s = students.find((x) => x.id === inv.studentId);
                    if (!s) return null;
                    return (
                      <li
                        key={inv.studentId}
                        className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                      >
                        <Avatar name={s.name} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white">{s.name}</p>
                          <p className="text-xs text-ink-muted">{s.major}</p>
                        </div>
                        <input
                          aria-label={`Role for ${s.name}`}
                          value={inv.role}
                          onChange={(e) =>
                            setInvited((list) =>
                              list.map((i) =>
                                i.studentId === inv.studentId ? { ...i, role: e.target.value } : i,
                              ),
                            )
                          }
                          placeholder="Role"
                          className="w-36 rounded-lg border border-white/15 bg-space-900/70 px-2.5 py-1.5 text-xs text-ink placeholder:text-ink-faint focus:border-cyan/60 focus:outline-none"
                        />
                        <button
                          onClick={() =>
                            setInvited((list) => list.filter((i) => i.studentId !== inv.studentId))
                          }
                          aria-label={`Remove ${s.name}`}
                          className="rounded-lg p-1.5 text-ink-muted transition hover:bg-white/10 hover:text-white"
                        >
                          <X size={15} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="relative">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
                />
                <input
                  value={memberQuery}
                  onChange={(e) => setMemberQuery(e.target.value)}
                  placeholder="Search by name, major, or skill"
                  aria-label="Search students to invite"
                  className="w-full rounded-lg border border-white/15 bg-space-900/70 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/30"
                />
              </div>

              <ul className="mt-2 max-h-48 space-y-1.5 overflow-y-auto pr-1">
                {candidates.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() =>
                        setInvited((list) => [
                          ...list,
                          { studentId: s.id, role: s.skills[0] ?? 'Member' },
                        ])
                      }
                      className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2.5 text-left transition hover:border-cyan/40"
                    >
                      <Avatar name={s.name} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-white">{s.name}</span>
                        <span className="block truncate text-xs text-ink-muted">
                          {s.major} · {s.skills.slice(0, 2).join(', ')}
                        </span>
                      </span>
                      <Plus size={16} className="shrink-0 text-cyan-soft" />
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-ink-faint">
                Invited members stay unconfirmed until they accept.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-ink-muted">
              Add the roles you still need. They show up on Find a Team right away.
            </p>

            {slots.length > 0 && (
              <ul className="space-y-2">
                {slots.map((slot, i) => (
                  <li
                    key={`${slot.role}-${i}`}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{slot.role}</p>
                      {slot.skills.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {slot.skills.map((sk) => (
                            <Badge key={sk} tone="cyan">
                              {sk}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {slot.note && <p className="mt-1.5 text-xs text-ink-muted">{slot.note}</p>}
                    </div>
                    <button
                      onClick={() => setSlots((list) => list.filter((_, idx) => idx !== i))}
                      aria-label={`Remove ${slot.role} slot`}
                      className="rounded-lg p-1.5 text-ink-muted transition hover:bg-white/10 hover:text-white"
                    >
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-3 rounded-xl border border-dashed border-white/20 p-4">
              <TextField
                label="Role needed"
                placeholder="e.g. Cryptography Specialist"
                list="role-suggestions"
                value={slotDraft.role}
                onChange={(e) => setSlotDraft((d) => ({ ...d, role: e.target.value }))}
              />

              <div>
                <label
                  htmlFor="skill-draft"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Skills wanted
                </label>
                {slotDraft.skills.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {slotDraft.skills.map((sk) => (
                      <button
                        key={sk}
                        onClick={() =>
                          setSlotDraft((d) => ({ ...d, skills: d.skills.filter((x) => x !== sk) }))
                        }
                        className="inline-flex items-center gap-1 rounded-full border border-cyan/35 bg-cyan/15 px-2.5 py-1 text-xs text-cyan-soft"
                      >
                        {sk} <X size={12} />
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    id="skill-draft"
                    value={skillDraft}
                    onChange={(e) => setSkillDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkillToDraft();
                      }
                    }}
                    placeholder="Type a skill and press Enter"
                    className="flex-1 rounded-lg border border-white/15 bg-space-900/70 px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/30"
                  />
                  <Button variant="outline" size="sm" onClick={addSkillToDraft}>
                    Add
                  </Button>
                </div>
              </div>

              <TextField
                label="Commitment"
                placeholder="e.g. 3 weeks, meeting twice a week"
                value={slotDraft.note}
                onChange={(e) => setSlotDraft((d) => ({ ...d, note: e.target.value }))}
              />

              <Button variant="outline" size="sm" onClick={addSlot} disabled={!slotDraft.role.trim()}>
                <Plus size={15} /> Add slot
              </Button>
            </div>

            {competition && (
              <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-ink-muted">
                The roster locks on{' '}
                <span className="text-white">{formatDate(competition.registrationDeadline)}</span>.
                After that, members can't be added or swapped.
              </p>
            )}
          </div>
        )}

        {step === 3 && competition && createdTeam && (
          <CheckoutPanel
            competition={competition}
            teamName={createdTeam.name}
            memberCount={createdTeam.members.length}
            onPaid={async (method) => {
              await payRegistration(createdTeam.id, method);
            }}
            onCancel={handleClose}
          />
        )}
      </div>
    </Modal>
  );
}
