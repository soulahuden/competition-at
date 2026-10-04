import type { CompetitionTier } from '@/types';

/** Bobot poin per tier lomba — dipakai leaderboard dan input hasil penyelenggara. */
export const TIER_WEIGHT: Record<CompetitionTier, number> = {
  Internal: 1,
  Regional: 2,
  Nasional: 3,
  Internasional: 4,
};

/** Poin keaktifan: didapat hanya jika tim didaftarkan lewat COM@T sebelum lomba dimulai. */
export const ACTIVITY_POINT_BASE = 20;

const RANK_BASE: Record<string, number> = {
  'Juara 1': 100,
  'Juara 2': 75,
  'Juara 3': 55,
  Finalis: 35,
  'Tidak lolos': 0,
  Mundur: 0,
};

export function activityPointsFor(tier: CompetitionTier): number {
  return ACTIVITY_POINT_BASE * TIER_WEIGHT[tier];
}

export function winPointsFor(tier: CompetitionTier, outcome: string): number {
  return (RANK_BASE[outcome] ?? 0) * TIER_WEIGHT[tier];
}

export const POINT_RULES_TOOLTIP =
  'Poin hanya dihitung dari lomba yang didaftarkan lewat COM@T sebelum lomba dimulai. ' +
  'Bobot mengikuti tier lomba: Internal ×1, Regional ×2, Nasional ×3, Internasional ×4.';
