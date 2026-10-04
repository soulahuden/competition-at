import { students as seedStudents } from '@/data/students';
import { competitions as seedCompetitions } from '@/data/competitions';
import { teams as seedTeams } from '@/data/teams';
import { applications as seedApplications, recruitments as seedRecruitments } from '@/data/recruitments';
import { notifications as seedNotifications } from '@/data/notifications';
import { organizers as seedOrganizers, managedCompetitionIds as seedManaged } from '@/data/organizers';
import type {
  AppNotification,
  Application,
  Competition,
  Organizer,
  PeerReview,
  Recruitment,
  Student,
  Team,
} from '@/types';

export interface Database {
  students: Student[];
  competitions: Competition[];
  teams: Team[];
  recruitments: Recruitment[];
  applications: Application[];
  notifications: AppNotification[];
  peerReviews: PeerReview[];
  organizers: Organizer[];
  managedCompetitionIds: string[];
}

function seed(): Database {
  return {
    students: structuredClone(seedStudents),
    competitions: structuredClone(seedCompetitions),
    teams: structuredClone(seedTeams),
    recruitments: structuredClone(seedRecruitments),
    applications: structuredClone(seedApplications),
    notifications: structuredClone(seedNotifications),
    peerReviews: [],
    organizers: structuredClone(seedOrganizers),
    managedCompetitionIds: [...seedManaged],
  };
}

/**
 * Penyimpanan in-memory yang menggantikan backend.
 * Saat integrasi nyata, cukup ganti isi tiap fungsi di `src/services/*`
 * dengan panggilan `fetch` — tanda tangan fungsinya tetap sama.
 */
export const db: Database = seed();

export function resetDb() {
  Object.assign(db, seed());
}

/** Simulasi latensi jaringan supaya komponen sudah terbiasa dengan state async. */
export function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

let counter = 1000;
export function uid(prefix: string): string {
  counter += 1;
  return `${prefix}${counter}`;
}

export const TODAY_ISO = '2026-09-28';
