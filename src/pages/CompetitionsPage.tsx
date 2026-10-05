import { useMemo, useState } from 'react';
import { Clock, Plus, Search, Trophy } from 'lucide-react';
import {
  Badge,
  Button,
  EmptyState,
  FilterSelect,
  SectionTitle,
  Tabs,
} from '@/components/ui';
import type { TabItem } from '@/components/ui';
import { CompetitionCard } from '@/components/domain/CompetitionCard';
import { AddCompetitionModal } from '@/components/domain/AddCompetitionModal';
import { categories, tiers } from '@/components/domain/competitionMeta';
import { useStore } from '@/context/StoreContext';
import type { CompetitionCategory, CompetitionStatus, CompetitionTier } from '@/types';

type TabValue = Extract<CompetitionStatus, 'mendatang' | 'berjalan' | 'selesai'>;

export default function CompetitionsPage() {
  const { competitions, loading } = useStore();
  const [tab, setTab] = useState<TabValue>('mendatang');
  const [category, setCategory] = useState<CompetitionCategory | 'semua'>('semua');
  const [tier, setTier] = useState<CompetitionTier | 'semua'>('semua');
  const [fee, setFee] = useState<'semua' | 'gratis' | 'berbayar'>('semua');
  const [query, setQuery] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const pendingModeration = competitions.filter((c) => c.status === 'moderasi');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return competitions
      .filter((c) => c.status === tab)
      .filter((c) => category === 'semua' || c.category === category)
      .filter((c) => tier === 'semua' || c.tier === tier)
      .filter((c) => (fee === 'gratis' ? c.fee === 0 : fee === 'berbayar' ? c.fee > 0 : true))
      .filter((c) => !q || `${c.name} ${c.organizer}`.toLowerCase().includes(q))
      .sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [competitions, tab, category, tier, fee, query]);

  const tabs: TabItem<TabValue>[] = [
    { value: 'mendatang', label: 'Upcoming', count: competitions.filter((c) => c.status === 'mendatang').length },
    { value: 'berjalan', label: 'In progress', count: competitions.filter((c) => c.status === 'berjalan').length },
    { value: 'selesai', label: 'Finished', count: competitions.filter((c) => c.status === 'selesai').length },
  ];

  const resetFilters = () => {
    setCategory('semua');
    setTier('semua');
    setFee('semua');
    setQuery('');
  };

  const hasActiveFilter = category !== 'semua' || tier !== 'semua' || fee !== 'semua' || query !== '';

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Competitions"
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={16} /> Add competition
          </Button>
        }
      />

      {toast && (
        <div className="glass flex items-center gap-3 border-amber/30 bg-amber/10 p-4 text-sm text-amber-soft">
          <Clock size={18} className="shrink-0" />
          <p>{toast}</p>
          <button onClick={() => setToast(null)} className="ml-auto text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {pendingModeration.length > 0 && (
        <section aria-label="Competitions under review" className="glass p-5">
          <h2 className="font-display text-base font-semibold text-white">Under review</h2>
          <ul className="mt-3 space-y-2">
            {pendingModeration.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-white">{c.name}</p>
                  <p className="text-xs text-ink-muted">
                    {c.organizer} · {c.category} · {c.tier}
                  </p>
                </div>
                <Badge tone="amber">Under review</Badge>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Tabs items={tabs} value={tab} onChange={setTab} ariaLabel="Competition status" />

      <div className="glass flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-[12rem] flex-[2]">
          <label
            htmlFor="cari-lomba"
            className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-faint"
          >
            Search
          </label>
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              id="cari-lomba"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Competition or organizer"
              className="w-full rounded-lg border border-white/15 bg-space-900/70 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/30"
            />
          </div>
        </div>

        <FilterSelect
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as CompetitionCategory | 'semua')}
        >
          <option value="semua">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Tier"
          value={tier}
          onChange={(e) => setTier(e.target.value as CompetitionTier | 'semua')}
        >
          <option value="semua">All tiers</option>
          {tiers.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Fee"
          value={fee}
          onChange={(e) => setFee(e.target.value as 'semua' | 'gratis' | 'berbayar')}
        >
          <option value="semua">Any</option>
          <option value="gratis">Free</option>
          <option value="berbayar">Paid</option>
        </FilterSelect>

        {hasActiveFilter && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset filter
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass h-72 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Trophy size={22} />}
          title="No competitions match"
          action={
            hasActiveFilter ? (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset filter
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <CompetitionCard key={c.id} competition={c} />
          ))}
        </div>
      )}

      <AddCompetitionModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={(name) =>
          setToast(`"${name}" was submitted and is under review.`)
        }
      />
    </div>
  );
}
