import { db, delay } from './client';
import { featuredListingPrice, platformFeeRate } from '@/data/organizers';
import type { Competition, Team } from '@/types';

export interface ManagedCompetition {
  competition: Competition;
  teams: Team[];
  registeredTeams: number;
  paidTeams: number;
  grossRevenue: number;
  platformFee: number;
  netRevenue: number;
}

export async function getManagedCompetitions(): Promise<ManagedCompetition[]> {
  const managed = db.competitions.filter(
    (c) => db.managedCompetitionIds.includes(c.id) || c.organizerId === 'o09',
  );

  const result = managed.map((competition) => {
    const teams = db.teams.filter((t) => t.competitionId === competition.id);
    const paidTeams = teams.filter((t) => t.paid).length;
    const gross = paidTeams * competition.fee;
    const platformFee = Math.round(gross * platformFeeRate);

    return {
      competition,
      teams,
      registeredTeams: teams.length,
      paidTeams,
      grossRevenue: gross,
      platformFee,
      netRevenue: gross - platformFee,
    } satisfies ManagedCompetition;
  });

  return delay(result);
}

export async function registerManagedCompetition(competitionId: string): Promise<void> {
  if (!db.managedCompetitionIds.includes(competitionId)) {
    db.managedCompetitionIds.push(competitionId);
  }
  return delay(undefined);
}

export { featuredListingPrice, platformFeeRate };
