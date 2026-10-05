import { db, delay, uid, TODAY_ISO } from './client';
import { activityPointsFor, winPointsFor } from '@/lib/points';
import type {
  CampusBenefit,
  Competition,
  CompetitionCategory,
  CompetitionStatus,
  CompetitionTier,
  Winner,
} from '@/types';

export interface CompetitionFilters {
  status?: CompetitionStatus;
  category?: CompetitionCategory | 'semua';
  tier?: CompetitionTier | 'semua';
  fee?: 'semua' | 'gratis' | 'berbayar';
  query?: string;
}

export async function getCompetitions(filters: CompetitionFilters = {}): Promise<Competition[]> {
  const { status, category = 'semua', tier = 'semua', fee = 'semua', query = '' } = filters;
  const q = query.trim().toLowerCase();

  const result = db.competitions.filter((c) => {
    if (status && c.status !== status) return false;
    if (category !== 'semua' && c.category !== category) return false;
    if (tier !== 'semua' && c.tier !== tier) return false;
    if (fee === 'gratis' && c.fee > 0) return false;
    if (fee === 'berbayar' && c.fee === 0) return false;
    if (q && !`${c.name} ${c.organizer}`.toLowerCase().includes(q)) return false;
    return true;
  });

  // Lomba Featured diangkat ke atas dalam daftar.
  result.sort((a, b) => Number(b.featured) - Number(a.featured));
  return delay(result);
}

export async function getCompetitionById(id: string): Promise<Competition | undefined> {
  return delay(db.competitions.find((c) => c.id === id));
}

export async function getRecommendedCompetitions(studentId: string): Promise<Competition[]> {
  const student = db.students.find((s) => s.id === studentId);
  if (!student) return delay([]);
  const joinedCompetitionIds = db.teams
    .filter((t) => t.members.some((m) => m.studentId === studentId))
    .map((t) => t.competitionId);

  const available = db.competitions
    .filter((c) => c.status === 'mendatang' && !joinedCompetitionIds.includes(c.id))
    .sort((a, b) => Number(b.featured) - Number(a.featured));

  const matches = available.filter((c) => student.interests.includes(c.category));
  // Lengkapi sampai tiga kartu dengan lomba lain yang sedang dipromosikan.
  const filler = available.filter((c) => !matches.includes(c));

  return delay([...matches, ...filler].slice(0, 3));
}

export interface NewCompetitionInput {
  name: string;
  organizer: string;
  organizerId?: string;
  category: CompetitionCategory;
  tier: CompetitionTier;
  description: string;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  teamSizeMin: number;
  teamSizeMax: number;
  fee: number;
  benefits: CampusBenefit[];
  location: string;
}

/** Lomba baru masuk antrean moderasi sebelum tampil di katalog publik. */
export async function createCompetition(input: NewCompetitionInput): Promise<Competition> {
  const competition: Competition = {
    id: uid('c'),
    ...input,
    organizerId: input.organizerId ?? 'o09',
    status: 'moderasi',
    featured: false,
    poster: 'violet',
    timeline: [
      { label: 'Registration opens', date: TODAY_ISO, done: true },
      { label: 'Registration deadline', date: input.registrationDeadline, done: false },
      { label: 'Competition starts', date: input.startDate, done: false },
      { label: 'Competition ends', date: input.endDate, done: false },
    ],
    participantTeamIds: [],
  };

  db.competitions.unshift(competition);
  return delay(competition);
}

export async function setFeatured(competitionId: string, featured: boolean): Promise<void> {
  const competition = db.competitions.find((c) => c.id === competitionId);
  if (competition) competition.featured = featured;
  return delay(undefined);
}

export async function approveCompetition(competitionId: string): Promise<void> {
  const competition = db.competitions.find((c) => c.id === competitionId);
  if (competition && competition.status === 'moderasi') competition.status = 'mendatang';
  return delay(undefined);
}

export interface ResultInput {
  teamId: string;
  rank: 1 | 2 | 3 | 0;
}

/**
 * Menutup lomba dan menuliskan hasilnya.
 * Efek berantai: status tim jadi `selesai`, riwayat & poin anggota diperbarui
 * (keaktifan + kemenangan sesuai bobot tier), lalu peer review dibuka.
 */
export async function submitResults(
  competitionId: string,
  results: ResultInput[],
): Promise<Competition | undefined> {
  const competition = db.competitions.find((c) => c.id === competitionId);
  if (!competition) return delay(undefined);

  const outcomeByRank: Record<number, '1st place' | '2nd place' | '3rd place' | 'Finalist'> = {
    1: '1st place',
    2: '2nd place',
    3: '3rd place',
    0: 'Finalist',
  };

  const winners: Winner[] = [];

  for (const teamId of competition.participantTeamIds) {
    const team = db.teams.find((t) => t.id === teamId);
    if (!team) continue;

    const entry = results.find((r) => r.teamId === teamId);
    const outcome = entry ? outcomeByRank[entry.rank] : 'Eliminated';

    team.status = 'selesai';
    team.result = outcome;

    if (entry) {
      winners.push({
        rank: entry.rank,
        teamId: team.id,
        teamName: team.name,
        memberIds: team.members.map((m) => m.studentId),
      });
    }

    const activity = activityPointsFor(competition.tier);
    const win = winPointsFor(competition.tier, outcome);

    for (const member of team.members) {
      const student = db.students.find((s) => s.id === member.studentId);
      if (!student) continue;

      student.competitionsJoined += 1;
      student.activityPoints += activity;
      student.winPoints += win;
      student.history.unshift({
        id: uid('h'),
        competitionId: competition.id,
        competitionName: competition.name,
        tier: competition.tier,
        teamName: team.name,
        year: new Date(competition.endDate).getFullYear(),
        outcome,
        points: activity + win,
      });

      if (entry && entry.rank !== 0) {
        student.achievements.unshift({
          id: uid('a'),
          title: `${outcome}, ${competition.name}`,
          competitionName: competition.name,
          year: new Date(competition.endDate).getFullYear(),
          verification: 'penyelenggara',
        });
      }

      db.notifications.unshift({
        id: uid('n'),
        kind: 'poin',
        title: `${competition.name} results are out`,
        body: `${team.name}: ${outcome}. ${activity + win} points added to the leaderboard.`,
        createdAt: TODAY_ISO,
        read: false,
        href: '/leaderboard',
        forUserId: member.studentId,
      });

      db.notifications.unshift({
        id: uid('n'),
        kind: 'review',
        title: 'Peer review is open',
        body: `Review your ${team.name} teammates.`,
        createdAt: TODAY_ISO,
        read: false,
        href: '/tim',
        forUserId: member.studentId,
      });
    }
  }

  winners.sort((a, b) => (a.rank === 0 ? 99 : a.rank) - (b.rank === 0 ? 99 : b.rank));
  competition.winners = [...(competition.winners ?? []), ...winners];
  competition.status = 'selesai';
  competition.timeline = competition.timeline.map((t) => ({ ...t, done: true }));

  return delay(competition);
}
