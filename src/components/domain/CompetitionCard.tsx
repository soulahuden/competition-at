import { Link } from 'react-router-dom';
import { CalendarClock, Coins, Sparkles, Users } from 'lucide-react';
import { Badge } from '@/components/ui';
import { deadlineLabel, formatRupiah } from '@/lib/format';
import { posterGradient, statusLabel, statusTone, tierTone } from './competitionMeta';
import type { Competition } from '@/types';

export function CompetitionCard({ competition }: { competition: Competition }) {
  const c = competition;

  return (
    <Link
      to={`/lomba/${c.id}`}
      className="glass group flex flex-col overflow-hidden transition hover:border-cyan/40 hover:bg-white/[0.07]"
    >
      <div
        className={`relative h-24 bg-gradient-to-br ${posterGradient[c.poster] ?? posterGradient.cyan}`}
      >
        <div className="absolute inset-0 bg-space-950/35" />
        {c.featured && (
          <span className="absolute left-4 top-4">
            <Badge tone="amber" icon={<Sparkles size={12} />}>
              Featured
            </Badge>
          </span>
        )}
        <span className="absolute right-4 top-4">
          <Badge tone={statusTone[c.status]}>{statusLabel[c.status]}</Badge>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-white transition group-hover:text-cyan-soft">
          {c.name}
        </h3>
        <p className="mt-1 text-sm text-ink-muted">{c.organizer}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="outline">{c.category}</Badge>
          <Badge tone={tierTone[c.tier]}>{c.tier}</Badge>
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-ink-muted">
            <CalendarClock size={15} className="shrink-0 text-cyan-soft" />
            <dt className="sr-only">Deadline pendaftaran</dt>
            <dd>{deadlineLabel(c.registrationDeadline)}</dd>
          </div>
          <div className="flex items-center gap-2 text-ink-muted">
            <Users size={15} className="shrink-0 text-cyan-soft" />
            <dt className="sr-only">Ukuran tim</dt>
            <dd>
              {c.teamSizeMin === c.teamSizeMax
                ? `${c.teamSizeMax} orang`
                : `${c.teamSizeMin}–${c.teamSizeMax} orang`}
            </dd>
          </div>
          <div className="flex items-center gap-2 text-ink-muted">
            <Coins size={15} className="shrink-0 text-cyan-soft" />
            <dt className="sr-only">Biaya</dt>
            <dd>{formatRupiah(c.fee)}</dd>
          </div>
        </dl>

        {c.benefits.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
            {c.benefits.map((b) => (
              <Badge key={b} tone="success">
                {b}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
