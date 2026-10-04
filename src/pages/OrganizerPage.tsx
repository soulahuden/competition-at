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
    { value: 'ringkasan', label: 'Lomba dikelola', count: managed.length },
    { value: 'pendaftar', label: 'Kelola pendaftar', count: totalTeams },
    { value: 'hasil', label: 'Input hasil' },
    { value: 'featured', label: 'Featured Listing' },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Portal Penyelenggara"
        description="Kelola lomba, pendaftar, hasil, dan promosi listing."
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={16} /> Buat lomba baru
          </Button>
        }
      />

      <div className="glass flex flex-wrap items-center gap-3 p-4">
        <span className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-cyan-soft">
          <Building2 size={18} />
        </span>
        <div>
          <p className="font-display font-semibold text-white">BINUS Student Tech Club</p>
          <p className="text-xs text-ink-muted">Akun penyelenggara (mode demo)</p>
        </div>
      </div>

      <section aria-label="Ringkasan penyelenggara" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Lomba dikelola" value={managed.length} icon={<Trophy size={16} />} tone="cyan" />
        <StatCard label="Tim terdaftar" value={totalTeams} icon={<Users size={16} />} tone="violet" />
        <StatCard
          label="Dana terkumpul"
          value={formatRupiah(totalGross)}
          sub={`Fee platform ${Math.round(platformFeeRate * 100)}%: ${formatRupiah(totalFee)}`}
          icon={<Banknote size={16} />}
          tone="amber"
        />
        <StatCard label="Diterima bersih" value={formatRupiah(totalNet)} tone="cyan" />
      </section>

      <Tabs items={tabs} value={tab} onChange={setTab} ariaLabel="Menu penyelenggara" />

      {loading ? (
        <div className="glass h-72 animate-pulse" />
      ) : managed.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={22} />}
          title="Belum ada lomba yang dikelola"
          action={<Button onClick={() => setAddOpen(true)}>Buat lomba baru</Button>}
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
                        {formatDate(m.competition.startDate)} – {formatDate(m.competition.endDate)}
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
                      <dt className="text-xs text-ink-faint">Tim terdaftar</dt>
                      <dd className="mt-0.5 font-display font-semibold text-ink">
                        {m.registeredTeams}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-faint">Sudah bayar</dt>
                      <dd className="mt-0.5 font-display font-semibold text-ink">{m.paidTeams}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-faint">Dana terkumpul</dt>
                      <dd className="mt-0.5 font-display font-semibold text-amber">
                        {formatRupiah(m.grossRevenue)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-faint">Setelah fee platform</dt>
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
                    <p className="mt-2 text-sm text-ink-muted">Belum ada tim yang mendaftar.</p>
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
                              {team.members.length} anggota ·{' '}
                              {team.members.filter((x) => x.confirmed).length} terkonfirmasi
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
                              {team.paid ? 'Lunas' : 'Belum bayar'}
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
                Mengumumkan hasil akan menutup lomba, mengunci status tim, membuka peer review, dan
                menambahkan poin ke leaderboard.
              </p>
              {managed.map((m) => (
                <div
                  key={m.competition.id}
                  className="glass flex flex-wrap items-center justify-between gap-3 p-5"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-white">{m.competition.name}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {m.registeredTeams} tim terdaftar · Tier {m.competition.tier}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={tierTone[m.competition.tier]}>{m.competition.tier}</Badge>
                    {m.competition.status === 'selesai' ? (
                      <Badge tone="neutral">Hasil sudah diumumkan</Badge>
                    ) : (
                      <Button
                        size="sm"
                        disabled={m.registeredTeams === 0}
                        onClick={() => setResultTarget(m)}
                      >
                        <Trophy size={15} /> Input hasil
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
                  Lomba tampil di urutan teratas katalog dan mendapat badge "Featured" selama 30
                  hari.
                </p>
                <p className="mt-3 font-display text-2xl font-bold text-amber">
                  {formatRupiah(featuredListingPrice)}
                  <span className="ml-2 text-sm font-normal text-ink-muted">/ 30 hari</span>
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
                        ? 'Sedang tampil sebagai Featured'
                        : 'Listing standar'}
                    </p>
                  </div>
                  {m.competition.featured ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void setFeatured(m.competition.id, false)}
                    >
                      Hentikan Featured
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
          title="Upgrade ke Featured Listing"
          description={featuredTarget.competition.name}
          size="sm"
          footer={
            <>
              <Button variant="ghost" onClick={() => setFeaturedTarget(null)}>
                Batal
              </Button>
              <Button
                onClick={async () => {
                  await setFeatured(featuredTarget.competition.id, true);
                  setFeaturedTarget(null);
                }}
              >
                Bayar {formatRupiah(featuredListingPrice)}
              </Button>
            </>
          }
        >
          <ul className="space-y-2 text-sm text-ink-muted">
            <li>· Tampil di urutan teratas katalog lomba selama 30 hari</li>
            <li>· Badge "Featured" pada kartu lomba</li>
            <li>· Muncul di rekomendasi dashboard mahasiswa</li>
          </ul>
          <p className="mt-4 rounded-xl border border-amber/25 bg-amber/10 p-3 text-xs text-amber-soft">
            Harga mock — prototipe ini tidak memproses pembayaran sungguhan.
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
      title="Input hasil lomba"
      description={managed.competition.name}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true);
              await onSubmit(results);
              setSubmitting(false);
            }}
          >
            {submitting ? 'Menyimpan…' : 'Umumkan hasil'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-ink-muted">
          Tim yang tidak diberi peringkat akan tercatat sebagai "Tidak lolos" dan tetap mendapat
          poin keaktifan.
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
            <option value="">Tidak lolos</option>
            <option value="1">Juara 1</option>
            <option value="2">Juara 2</option>
            <option value="3">Juara 3</option>
            <option value="0">Finalis</option>
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
