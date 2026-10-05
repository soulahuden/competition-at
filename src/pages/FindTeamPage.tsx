import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, CheckCircle2, Search, Send, UserPlus, Users } from 'lucide-react';
import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  FilterSelect,
  Modal,
  SectionTitle,
  SelectField,
  Tabs,
  TextField,
} from '@/components/ui';
import type { TabItem } from '@/components/ui';
import { ApplyModal } from '@/components/domain/ApplyModal';
import { ReliabilityScore } from '@/components/domain/ReliabilityScore';
import { categories } from '@/components/domain/competitionMeta';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { deadlineLabel, daysUntil } from '@/lib/format';
import { getRecommendedPeople } from '@/services/recruitmentService';
import type { PersonRecommendation, RecruitmentView } from '@/services/recruitmentService';

type TabValue = 'lowongan' | 'orang';

export default function FindTeamPage() {
  const { recruitments, applications, teams, loading, version, invitePerson } = useStore();
  const { currentUserId } = useAuth();

  const [tab, setTab] = useState<TabValue>('lowongan');
  const [roleQuery, setRoleQuery] = useState('');
  const [category, setCategory] = useState<string>('semua');
  const [deadlineFilter, setDeadlineFilter] = useState<'semua' | '7' | '30'>('semua');
  const [applyTarget, setApplyTarget] = useState<RecruitmentView | null>(null);
  const [people, setPeople] = useState<PersonRecommendation[]>([]);
  const [inviteTarget, setInviteTarget] = useState<PersonRecommendation | null>(null);

  useEffect(() => {
    let active = true;
    void getRecommendedPeople(currentUserId).then((list) => {
      if (active) setPeople(list);
    });
    return () => {
      active = false;
    };
  }, [currentUserId, version]);

  const myApplications = applications.filter((a) => a.applicantId === currentUserId);
  const appliedSlotIds = new Set(myApplications.map((a) => a.slotId));

  const filtered = useMemo(() => {
    const q = roleQuery.trim().toLowerCase();
    return recruitments
      .filter((r) => {
        if (!q) return true;
        return `${r.role} ${r.skills.join(' ')} ${r.teamName}`.toLowerCase().includes(q);
      })
      .filter((r) => category === 'semua' || r.competitionCategory === category)
      .filter((r) => {
        if (deadlineFilter === 'semua') return true;
        const days = daysUntil(r.deadline);
        return days >= 0 && days <= Number(deadlineFilter);
      })
      // Tim sendiri tidak perlu dilamar.
      .filter((r) => r.captainId !== currentUserId);
  }, [recruitments, roleQuery, category, deadlineFilter, currentUserId]);

  const myCaptainTeams = teams.filter((t) => t.captainId === currentUserId);

  const tabs: TabItem<TabValue>[] = [
    { value: 'lowongan', label: 'Open spots', count: filtered.length },
    { value: 'orang', label: 'Suggested people', count: people.length },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Find a Team"
      />

      <Tabs items={tabs} value={tab} onChange={setTab} ariaLabel="Search mode" />

      {tab === 'lowongan' && (
        <>
          <div className="glass flex flex-wrap items-end gap-3 p-4">
            <div className="min-w-[12rem] flex-[2]">
              <label
                htmlFor="cari-role"
                className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-faint"
              >
                Role or skill
              </label>
              <div className="relative">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
                />
                <input
                  id="cari-role"
                  value={roleQuery}
                  onChange={(e) => setRoleQuery(e.target.value)}
                  placeholder="e.g. Frontend, Figma, Python"
                  className="w-full rounded-lg border border-white/15 bg-space-900/70 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/30"
                />
              </div>
            </div>

            <FilterSelect
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="semua">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              label="Deadline"
              value={deadlineFilter}
              onChange={(e) => setDeadlineFilter(e.target.value as 'semua' | '7' | '30')}
            >
              <option value="semua">Any time</option>
              <option value="7">Next 7 days</option>
              <option value="30">Next 30 days</option>
            </FilterSelect>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="glass h-40 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Users size={22} />}
              title="No open spots match"
            />
          ) : (
            <ul className="space-y-3">
              {filtered.map((r) => {
                const applied = appliedSlotIds.has(r.slotId);
                const applicationStatus = myApplications.find((a) => a.slotId === r.slotId)?.status;

                return (
                  <li key={r.id} className="glass p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg font-semibold text-white">{r.title}</h3>
                        <Link
                          to={`/lomba/${r.competitionId}`}
                          className="mt-1 inline-block text-sm text-ink-muted hover:text-cyan-soft"
                        >
                          {r.competitionName}
                        </Link>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge tone="cyan">{r.role}</Badge>
                          <Badge tone="outline">{r.competitionCategory}</Badge>
                          {r.skills.map((s) => (
                            <Badge key={s} tone="neutral">
                              {s}
                            </Badge>
                          ))}
                        </div>

                        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
                          <div className="flex items-center gap-1.5">
                            <CalendarClock size={14} className="text-cyan-soft" />
                            <dt className="sr-only">Deadline</dt>
                            <dd>{deadlineLabel(r.deadline)}</dd>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users size={14} className="text-cyan-soft" />
                            <dt className="sr-only">Members</dt>
                            <dd>
                              {r.memberCount}/{r.teamSizeMax} members · {r.teamName}
                            </dd>
                          </div>
                        </dl>

                        <p className="mt-2 text-sm text-ink-muted">{r.commitment}</p>
                        <p className="mt-2 text-xs text-ink-faint">
                          Captain:{' '}
                          <Link to={`/profil/${r.captainId}`} className="link-quiet">
                            {r.captainName}
                          </Link>
                        </p>
                      </div>

                      <div className="shrink-0">
                        {applied ? (
                          <Badge
                            tone={applicationStatus === 'ditolak' ? 'danger' : 'success'}
                            icon={<CheckCircle2 size={13} />}
                          >
                            {applicationStatus === 'ditolak' ? 'Not accepted' : 'Applied'}
                          </Badge>
                        ) : (
                          <Button size="sm" onClick={() => setApplyTarget(r)}>
                            <Send size={15} /> Apply
                          </Button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {tab === 'orang' && (
        <>
          <p className="text-sm text-ink-muted">
            Sorted by how well their skills match your open slots.
          </p>

          {people.length === 0 ? (
            <EmptyState
              icon={<UserPlus size={22} />}
              title="No suggestions yet"
              description="Create a team and add an open slot first."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {people.map(({ student, matchedSkills, connectionNote }) => (
                <article key={student.id} className="glass flex flex-col p-5">
                  <div className="flex items-start gap-3">
                    <Avatar name={student.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/profil/${student.id}`}
                        className="font-display font-semibold text-white hover:text-cyan-soft"
                      >
                        {student.name}
                      </Link>
                      <p className="text-xs text-ink-muted">
                        {student.major} · Class of {student.cohort}
                      </p>
                    </div>
                  </div>

                  {student.lookingForTeam && (
                    <div className="mt-3">
                      <Badge tone="success">Looking for a team</Badge>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {student.skills.slice(0, 4).map((s) => (
                      <Badge key={s} tone={matchedSkills.includes(s) ? 'cyan' : 'outline'}>
                        {s}
                      </Badge>
                    ))}
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs">
                    <div>
                      <dt className="text-ink-faint">Reliability</dt>
                      <dd className="mt-1">
                        <ReliabilityScore student={student} showLabel={false} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-faint">Competitions</dt>
                      <dd className="mt-1 font-display text-sm font-semibold text-ink">
                        {student.competitionsJoined}
                      </dd>
                    </div>
                  </dl>

                  {connectionNote && (
                    <p className="mt-3 rounded-lg border border-violet/25 bg-violet/10 p-2.5 text-xs text-violet-soft">
                      {connectionNote}
                    </p>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-4"
                    fullWidth
                    onClick={() => setInviteTarget({ student, matchedSkills, connectionNote, mutualCount: 0 })}
                  >
                    <UserPlus size={15} /> Invite to team
                  </Button>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      <ApplyModal recruitment={applyTarget} onClose={() => setApplyTarget(null)} />

      {inviteTarget && (
        <InviteModal
          person={inviteTarget}
          teams={myCaptainTeams.map((t) => ({ id: t.id, name: t.name }))}
          onClose={() => setInviteTarget(null)}
          onInvite={async (teamId, role) => {
            await invitePerson(teamId, inviteTarget.student.id, role);
            setInviteTarget(null);
          }}
        />
      )}
    </div>
  );
}

interface InviteModalProps {
  person: PersonRecommendation;
  teams: Array<{ id: string; name: string }>;
  onClose: () => void;
  onInvite: (teamId: string, role: string) => Promise<void>;
}

function InviteModal({ person, teams, onClose, onInvite }: InviteModalProps) {
  const [teamId, setTeamId] = useState(teams[0]?.id ?? '');
  const [role, setRole] = useState(person.student.skills[0] ?? 'Member');
  const [submitting, setSubmitting] = useState(false);

  return (
    <Modal
      open
      onClose={onClose}
      title={`Invite ${person.student.name}`}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!teamId || submitting}
            onClick={async () => {
              setSubmitting(true);
              await onInvite(teamId, role);
              setSubmitting(false);
            }}
          >
            {submitting ? 'Sending…' : 'Send invite'}
          </Button>
        </>
      }
    >
      {teams.length === 0 ? (
        <p className="text-sm text-ink-muted">
          You're not captain of any team yet. Create one in My Teams first.
        </p>
      ) : (
        <div className="space-y-4">
          <SelectField label="Team" value={teamId} onChange={(e) => setTeamId(e.target.value)}>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Role offered"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
      )}
    </Modal>
  );
}
