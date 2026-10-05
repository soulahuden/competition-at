import type { BadgeTone } from '@/components/ui';
import type { CompetitionStatus, CompetitionTier } from '@/types';

export const tierTone: Record<CompetitionTier, BadgeTone> = {
  Internal: 'neutral',
  Regional: 'cyan',
  National: 'violet',
  International: 'amber',
};

export const statusLabel: Record<CompetitionStatus, string> = {
  mendatang: 'Upcoming',
  berjalan: 'In progress',
  selesai: 'Finished',
  moderasi: 'Under review',
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
  'Business',
  'Design',
  'Essay',
  'Science',
  'Robotics',
  'Debate',
] as const;

export const tiers = ['Internal', 'Regional', 'National', 'International'] as const;

export const benefitOptions = [
  'Campus funding',
  'Class dispensation',
  'Credit transfer',
  'SKKM points',
] as const;
