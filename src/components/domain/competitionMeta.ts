import type { BadgeTone } from '@/components/ui';
import type { CompetitionStatus, CompetitionTier } from '@/types';

export const tierTone: Record<CompetitionTier, BadgeTone> = {
  Internal: 'neutral',
  Regional: 'cyan',
  Nasional: 'violet',
  Internasional: 'amber',
};

export const statusLabel: Record<CompetitionStatus, string> = {
  mendatang: 'Mendatang',
  berjalan: 'Sedang berjalan',
  selesai: 'Selesai',
  moderasi: 'Menunggu moderasi',
};

export const statusTone: Record<CompetitionStatus, BadgeTone> = {
  mendatang: 'cyan',
  berjalan: 'success',
  selesai: 'neutral',
  moderasi: 'amber',
};

export const posterGradient: Record<string, string> = {
  cyan: 'from-cyan/40 via-sky-500/20 to-violet/30',
  violet: 'from-violet/45 via-fuchsia-500/20 to-cyan/25',
  amber: 'from-amber/40 via-orange-500/20 to-violet/30',
};

export const categories = [
  'IT',
  'Bisnis',
  'Desain',
  'Esai',
  'Sains',
  'Robotika',
  'Debat',
] as const;

export const tiers = ['Internal', 'Regional', 'Nasional', 'Internasional'] as const;

export const benefitOptions = [
  'Bisa ajukan dana kampus',
  'Dispensasi kuliah',
  'Konversi SKS',
  'Poin SKKM',
] as const;
