const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
});

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(new Date(iso));
}

export function formatRupiah(value: number): string {
  if (value === 0) return 'Free';
  return `Rp ${new Intl.NumberFormat('en-US').format(value)}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/** Tanggal acuan prototipe. Diambil terpusat supaya mudah diganti saat integrasi API. */
export const TODAY = new Date('2026-09-28T09:00:00+07:00');

export function daysUntil(iso: string): number {
  const target = new Date(iso);
  const diff = target.getTime() - TODAY.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function deadlineLabel(iso: string): string {
  const days = daysUntil(iso);
  if (days < 0) return 'Registration closed';
  if (days === 0) return 'Closes today';
  if (days === 1) return '1 day left';
  if (days <= 14) return `${days} days left`;
  return `Closes ${formatDate(iso)}`;
}

export function relativeTime(iso: string): string {
  const days = Math.round((TODAY.getTime() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return formatShortDate(iso);
}

export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}
