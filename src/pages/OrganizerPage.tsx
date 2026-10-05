import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Banknote,
  Building2,
  ClipboardList,
  Plus,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  Modal,
  SectionTitle,
  SelectField,
  StatCard,
  Tabs,
} from '@/components/ui';
import type { TabItem } from '@/components/ui';
import { AddCompetitionModal } from '@/components/domain/AddCompetitionModal';
import { statusLabel, statusTone, tierTone } from '@/components/domain/competitionMeta';
import { teamStatusLabel, teamStatusTone } from '@/components/domain/teamMeta';
import { useStore } from '@/context/StoreContext';
import { getManagedCompetitions, featuredListingPrice, platformFeeRate } from '@/services/organizerService';
import type { ManagedCompetition } from '@/services/organizerService';
import { formatDate, formatRupiah } from '@/lib/format';
import type { ResultInput } from '@/services/competitionService';

type TabValue = 'ringkasan' | 'pendaftar' | 'hasil' | 'featured';

export default function OrganizerPage() {
  const { students, version, submitResults, setFeatured } = useStore();
  const [managed, setManaged] = useState<ManagedCompetition[]>([]);
  const [tab, setTab] = useState<TabValue>('ringkasan');
  const [addOpen, setAddOpen] = useState(false);
  const [resultTarget, setResultTarget] = useState<ManagedCompetition | null>(null);
  const [featuredTarget, setFeaturedTarget] = useState<ManagedCompetition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void getManagedCompetitions().then((list) => {
      if (!active) return;
      setManaged(list);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [version]);

  const totalTeams = managed.reduce((sum, m) => sum + m.registeredTeams, 0);
  const totalGross = managed.reduce((sum, m) => sum + m.grossRevenue, 0);
  const totalFee = managed.reduce((sum, m) => sum + m.platformFee, 0);
  const totalNet = managed.reduce((sum, m) => sum + m.netRevenue, 0);

  const tabs: TabItem<TabValue>[] = [
    { value: 'ringkasan', label: 'Competitions', count: managed.length },
    { value: 'pendaftar', label: 'Registrants', count: totalTeams },
    { value: 'hasil', label: 'Results' },
    { value: 'featured', label: 'Featured Listing' },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Organizer Portal"
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={16} /> New competition
          </Button>
        }
      />

      <div className="glass flex flex-wrap items-center gap-3 p-4">
        <span className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-cyan-soft">
          <Building2 size={18} />
        </span>
        <div>
          <p className="font-display font-semibold text-white">BINUS Student Tech Club</p>
          <p className="text-xs text-ink-muted">Organizer account (demo)</p>
        </div>
      </div>

      <section aria-label="Organizer summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Competitions" value={managed.length} icon={<Trophy size={16} />} tone="cyan" />
        <StatCard label="Registered teams" value={totalTeams} icon={<Users size={16} />} tone="violet" />
        <StatCard
          label="Collected"
          value={formatRupiah(totalGross)}
          sub={`Platform fee ${Math.round(platformFeeRate * 100)}%: ${formatRupiah(totalFee)}`}
          icon={<Banknote size={16} />}
          tone="amber"
        />
        <StatCard label="Net received" value={formatRupiah(totalNet)} tone="cyan" />
      </section>

      <Tabs items={tabs} value={tab} onChange={setTab} ariaLabel="Organizer sections" />

      {loading ? (
        <div className="glass h-72 animate-pulse" />
      ) : managed.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={22} />}
          title="No competitions yet"
          action={<Button onClick={() => setAddOpen(true)}>New competition</Button>}
        />
      ) : (
        <>
          {tab === 'ringkasan' && (
            <div className="grid gap-4 lg:grid-cols-2">
              {managed.map((m) => (
                <article key={m.competition.id} className="glass p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to={`/lomba/${m.competition.id}`}
                        className="font-display text-lg font-semibold text-white hover:text-cyan-soft"
                      >
                        {m.competition.name}
                      </Link>
                      <p className="mt-1 text-xs text-ink-muted">
                        {formatDate(m.competition.startDate)} to {formatDate(m.competition.endDate)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {m.competition.featured && (
                        <Badge tone="amber" icon={<Sparkles size={12} />}>
                          Featured
                        </Badge>
                      )}
                      <Badge tone={statusTone[m.competition.status]}>
                        {statusLabel[m.competition.status]}
                      </Badge>
                    </div>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-sm sm:grid-cols-4">
                    <div>
                      <dt className="text-xs text-ink-faint">Teams</dt>
                      <dd className="mt-0.5 font-display font-semibold text-ink">
                        {m.registeredTeams}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-faint">Paid</dt>
                      <dd className="mt-0.5 font-display font-semibold text-ink">{m.paidTeams}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-faint">Collected</dt>
                      <dd className="mt-0.5 font-display font-semibold text-amber">
                        {formatRupiah(m.grossRevenue)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-faint">After platform fee</dt>
                      <dd className="mt-0.5 font-display font-semibold text-ink">
                        {formatRupiah(m.netRevenue)}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}

          {tab === 'pendaftar' && (
            <div className="space-y-4">
              {managed.map((m) => (
                <section key={m.competition.id} className="glass p-5">
                  <h2 className="font-display text-lg font-semibold text-white">
                    {m.competition.name}
                  </h2>
                  {m.teams.length === 0 ? (
                    <p className="mt-2 text-sm text-ink-muted">No teams have registered yet.</p>
                  ) : (
                    <ul className="mt-4 space-y-2">
                      {m.teams.map((team) => (
                        <li
                          key={team.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-white">{team.name}</p>
                            <p className="mt-0.5 text-xs text-ink-muted">
                              {team.members.length} members ·{' '}
                              {team.members.filter((x) => x.confirmed).length} confirmed
                            </p>
                            <div className="mt-2 flex -space-x-2">
                              {team.members.map((mem) => {
                                const s = students.find((x) => x.id === mem.studentId);
                                return s ? (
                                  <Avatar
                                    key={mem.studentId}
                                    name={s.name}
                                    size="xs"
                                    className="ring-2 ring-space-900"
                                  />
                                ) : null;
                              })}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge tone={teamStatusTone[team.status]}>
                              {teamStatusLabel[team.status]}
                            </Badge>
                            <Badge tone={team.paid ? 'success' : 'amber'}>
                              {team.paid ? 'Paid' : 'Unpaid'}
                            </Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          )}

          {tab === 'hasil' && (
            <div className="space-y-4">
              <p className="text-sm text-ink-muted">
                Announcing results closes the competition, locks every team, opens peer review, and
                adds points to the leaderboard.
              </p>
              {managed.map((m) => (
                <div
                  key={m.competition.id}
                  className="glass flex flex-wrap items-center justify-between gap-3 p-5"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-white">{m.competition.name}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {m.registeredTeams} {m.registeredTeams === 1 ? 'team' : 'teams'} · {m.competition.tier}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={tierTone[m.competition.tier]}>{m.competition.tier}</Badge>
                    {m.competition.status === 'selesai' ? (
                      <Badge tone="neutral">Results announced</Badge>
                    ) : (
                      <Button
                        size="sm"
                        disabled={m.registeredTeams === 0}
                        onClick={() => setResultTarget(m)}
                      >
                        <Trophy size={15} /> Enter results
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'featured' && (
            <div className="space-y-4">
              <div className="glass border-amber/30 bg-amber/10 p-5">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-amber-soft">
                  <Sparkles size={18} /> Featured Listing
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  Pinned to the top of the catalog with a "Featured" badge.
                </p>
                <p className="mt-3 font-display text-2xl font-bold text-amber">
                  {formatRupiah(featuredListingPrice)}
                  <span className="ml-2 text-sm font-normal text-ink-muted">/ 30 days</span>
                </p>
              </div>

              {managed.map((m) => (
                <div
                  key={m.competition.id}
                  className="glass flex flex-wrap items-center justify-between gap-3 p-5"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-white">{m.competition.name}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {m.competition.featured
                        ? 'Featured right now'
                        : 'Standard listing'}
                    </p>
                  </div>
                  {m.competition.featured ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void setFeatured(m.competition.id, false)}
                    >
                      Stop featuring
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => setFeaturedTarget(m)}>
                      <Sparkles size={15} /> Upgrade
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <AddCompetitionModal open={addOpen} onClose={() => setAddOpen(false)} />

      {resultTarget && (
        <ResultModal
          managed={resultTarget}
          onClose={() => setResultTarget(null)}
          onSubmit={async (results) => {
            await submitResults(resultTarget.competition.id, results);
            setResultTarget(null);
          }}
        />
      )}

      {featuredTarget && (
        <Modal
          open
          onClose={() => setFeaturedTarget(null)}
          title="Upgrade to Featured Listing"
          description={featuredTarget.competition.name}
          size="sm"
          footer={
            <>
              <Button variant="ghost" onClick={() => setFeaturedTarget(null)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await setFeatured(featuredTarget.competition.id, true);
                  setFeaturedTarget(null);
                }}
              >
                Pay {formatRupiah(featuredListingPrice)}
              </Button>
            </>
          }
        >
          <ul className="list-disc space-y-2 pl-4 text-sm text-ink-muted marker:text-ink-faint">
            <li>Top of the competition catalog for 30 days</li>
            <li>A "Featured" badge on the competition card</li>
            <li>Shown in student dashboard suggestions</li>
          </ul>
          <p className="mt-4 rounded-xl border border-amber/25 bg-amber/10 p-3 text-xs text-amber-soft">
            Sample price. This prototype doesn't take real payments.
          </p>
        </Modal>
      )}
    </div>
  );
}

interface ResultModalProps {
  managed: ManagedCompetition;
  onClose: () => void;
  onSubmit: (results: ResultInput[]) => Promise<void>;
}

function ResultModal({ managed, onClose, onSubmit }: ResultModalProps) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const results: ResultInput[] = Object.entries(assignments)
    .filter(([, rank]) => rank !== '')
    .map(([teamId, rank]) => ({ teamId, rank: Number(rank) as 1 | 2 | 3 | 0 }));

  return (
    <Modal
      open
      onClose={onClose}
      title="Enter results"
      description={managed.competition.name}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true);
              await onSubmit(results);
              setSubmitting(false);
            }}
          >
            {submitting ? 'Saving…' : 'Announce results'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-ink-muted">
          Teams without a place are recorded as "Eliminated" and still get activity points.
        </p>

        {managed.teams.map((team) => (
          <SelectField
            key={team.id}
            label={team.name}
            value={assignments[team.id] ?? ''}
            onChange={(e) =>
              setAssignments((prev) => ({ ...prev, [team.id]: e.target.value }))
            }
          >
            <option value="">Eliminated</option>
            <option value="1">1st place</option>
            <option value="2">2nd place</option>
            <option value="3">3rd place</option>
            <option value="0">Finalist</option>
          </SelectField>
        ))}

        <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-ink-muted">
          Bobot tier {managed.competition.tier} akan dikalikan ke poin kemenangan setiap anggota
          tim.
        </p>
      </div>
    </Modal>
  );
}
