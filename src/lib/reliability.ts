import type { Student } from '@/types';

/** Skor reliabilitas baru ditampilkan setelah minimal 3 lomba. */
export const MIN_COMPETITIONS_FOR_SCORE = 3;

export interface ReliabilityView {
  hasEnoughData: boolean;
  score: number;
  label: string;
  tone: 'positive' | 'neutral' | 'warning' | 'unknown';
}

export function reliabilityView(student: Student): ReliabilityView {
  if (student.competitionsJoined < MIN_COMPETITIONS_FOR_SCORE || student.reliability === 0) {
    return {
      hasEnoughData: false,
      score: 0,
      label: 'Not enough data',
      tone: 'unknown',
    };
  }

  const score = student.reliability;
  const tone = score >= 85 ? 'positive' : score >= 70 ? 'neutral' : 'warning';
  const label = score >= 85 ? 'Very reliable' : score >= 70 ? 'Reliable' : 'Needs attention';

  return { hasEnoughData: true, score, label, tone };
}
