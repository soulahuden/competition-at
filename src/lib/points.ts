import type { CompetitionTier } from '@/types';

/** Bobot poin per tier lomba — dipakai leaderboard dan input hasil penyelenggara. */
export const TIER_WEIGHT: Record<CompetitionTier, number> = {
  Internal: 1,
  Regional: 2,
  National: 3,
  International: 4,
};

/** Poin keaktifan: didapat hanya jika tim didaftarkan lewat COM@T sebelum lomba dimulai. */
export const ACTIVITY_POINT_BASE = 20;

const RANK_BASE: Record<string, number> = {
  '1st place': 100,
  '2nd place': 75,
  '3rd place': 55,
  Finalist: 35,
  'Eliminated': 0,
  Withdrew: 0,
};

export function activityPointsFor(tier: CompetitionTier): number {
  return ACTIVITY_POINT_BASE * TIER_WEIGHT[tier];
}

export function winPointsFor(tier: CompetitionTier, outcome: string): number {
  return (RANK_BASE[outcome] ?? 0) * TIER_WEIGHT[tier];
}

export const POINT_RULES_TOOLTIP =
  'Points only count for competitions registered on COM@T before they start. ' +
  'Weighted by tier: Internal ×1, Regional ×2, National ×3, International ×4.';
