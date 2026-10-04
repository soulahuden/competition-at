import { db, delay } from './client';
import { activityPointsFor } from '@/lib/points';
import type { CompetitionCategory, LeaderboardEntry, LeaderboardPeriod } from '@/types';

export interface LeaderboardFilters {
  period?: LeaderboardPeriod;
  cohort?: number | 'semua';
  category?: CompetitionCategory | 'semua';
}

/**
 * Periode "semester" memakai riwayat dari tahun berjalan,
 * "tahun" memakai dua tahun akademik terakhir.
 */
export async function getLeaderboard(filters: LeaderboardFilters = {}): Promise<LeaderboardEntry[]> {
  const { period = 'semester', cohort = 'semua', category = 'semua' } = filters;
  const currentYear = 2026;
  const minYear = period === 'semester' ? currentYear : currentYear - 1;

  const competitionCategory = new Map(db.competitions.map((c) => [c.id, c.category]));

  const entries = db.students
    .filter((s) => cohort === 'semua' || s.cohort === cohort)
    .map((student) => {
      const relevant = student.history.filter((h) => {
        if (h.year < minYear) return false;
        if (category === 'semua') return true;
        return competitionCategory.get(h.competitionId) === category;
      });

      // Tiap keikutsertaan memberi poin keaktifan sesuai tier; sisanya poin kemenangan.
      let activityPoints = 0;
      let winPoints = 0;
      for (const h of relevant) {
        const activity = Math.min(h.points, activityPointsFor(h.tier));
        activityPoints += activity;
        winPoints += h.points - activity;
      }

      return {
        rank: 0,
        student,
        activityPoints,
        winPoints,
        totalPoints: activityPoints + winPoints,
        competitions: relevant.length,
      } satisfies LeaderboardEntry;
    })
    .filter((e) => e.competitions > 0)
    .sort((a, b) => b.totalPoints - a.totalPoints || b.competitions - a.competitions)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  return delay(entries);
}

export async function getMyRank(studentId: string): Promise<LeaderboardEntry | undefined> {
  const entries = await getLeaderboard({ period: 'semester' });
  return entries.find((e) => e.student.id === studentId);
}

export const cohortOptions = [2021, 2022, 2023, 2024];
