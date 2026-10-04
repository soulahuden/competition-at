const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('id-ID', {
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
  if (value === 0) return 'Gratis';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value);
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
  if (days < 0) return 'Pendaftaran ditutup';
  if (days === 0) return 'Ditutup hari ini';
  if (days === 1) return 'Tinggal 1 hari';
  if (days <= 14) return `Tinggal ${days} hari`;
  return `Ditutup ${formatDate(iso)}`;
}

export function relativeTime(iso: string): string {
  const days = Math.round((TODAY.getTime() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Hari ini';
  if (days === 1) return 'Kemarin';
  if (days < 7) return `${days} hari lalu`;
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
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
