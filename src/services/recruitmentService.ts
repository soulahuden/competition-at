import { db, delay, uid, TODAY_ISO } from './client';
import type { Application, Recruitment, Student } from '@/types';

export interface RecruitmentView extends Recruitment {
  teamName: string;
  competitionId: string;
  competitionName: string;
  competitionCategory: string;
  role: string;
  skills: string[];
  captainId: string;
  captainName: string;
  memberCount: number;
  teamSizeMax: number;
}

export async function getOpenRecruitments(): Promise<RecruitmentView[]> {
  const views = db.recruitments
    .map((r) => {
      const team = db.teams.find((t) => t.id === r.teamId);
      const slot = team?.openSlots.find((s) => s.id === r.slotId);
      const competition = db.competitions.find((c) => c.id === team?.competitionId);
      const captain = db.students.find((s) => s.id === team?.captainId);
      if (!team || !slot || !competition || slot.filled) return null;

      return {
        ...r,
        teamName: team.name,
        competitionId: competition.id,
        competitionName: competition.name,
        competitionCategory: competition.category,
        role: slot.role,
        skills: slot.skills,
        captainId: team.captainId,
        captainName: captain?.name ?? 'Captain',
        memberCount: team.members.length,
        teamSizeMax: competition.teamSizeMax,
      } as RecruitmentView;
    })
    .filter((v): v is RecruitmentView => v !== null);

  return delay(views);
}

export async function getMyApplications(studentId: string): Promise<Application[]> {
  return delay(db.applications.filter((a) => a.applicantId === studentId));
}

export interface ApplyInput {
  teamId: string;
  slotId: string;
  applicantId: string;
  message: string;
  portfolioId?: string;
}

export async function applyToTeam(input: ApplyInput): Promise<Application> {
  const application: Application = {
    id: uid('ap'),
    ...input,
    status: 'terkirim',
    createdAt: TODAY_ISO,
  };
  db.applications.unshift(application);

  const team = db.teams.find((t) => t.id === input.teamId);
  const applicant = db.students.find((s) => s.id === input.applicantId);

  if (team) {
    db.notifications.unshift({
      id: uid('n'),
      kind: 'lamaran',
      title: `New application for ${team.name}`,
      body: `${applicant?.name ?? 'Someone'} applied for ${
        team.openSlots.find((s) => s.id === input.slotId)?.role ?? 'an open slot'
      }.`,
      createdAt: TODAY_ISO,
      read: false,
      href: '/tim',
      forUserId: team.captainId,
    });
  }

  return delay(application);
}

export interface PersonRecommendation {
  student: Student;
  mutualCount: number;
  matchedSkills: string[];
  connectionNote?: string;
}

/**
 * Rekomendasi orang: cocokkan kebutuhan slot tim user dengan skill mahasiswa,
 * lalu hitung koneksi lewat rekan setim bersama.
 */
export async function getRecommendedPeople(studentId: string): Promise<PersonRecommendation[]> {
  const me = db.students.find((s) => s.id === studentId);
  if (!me) return delay([]);

  const myTeams = db.teams.filter((t) => t.captainId === studentId);
  const neededSkills = new Set(
    myTeams.flatMap((t) => t.openSlots.filter((s) => !s.filled).flatMap((s) => s.skills)),
  );
  const myTeammateIds = new Set(me.pastTeammateIds);

  const recommendations = db.students
    .filter((s) => s.id !== studentId && s.claimed)
    .map((s) => {
      const mutual = s.pastTeammateIds.filter((id) => myTeammateIds.has(id)).length;
      const matchedSkills = s.skills.filter((skill) => neededSkills.has(skill));
      const interestOverlap = s.interests.filter((i) => me.interests.includes(i)).length;

      let connectionNote: string | undefined;
      if (mutual > 0) {
        connectionNote = `Has teamed up with ${mutual} of your past teammates`;
      } else if (myTeammateIds.has(s.id)) {
        connectionNote = 'You have been on a team together';
      } else if (interestOverlap > 0) {
        connectionNote = `Same interests (${s.interests.filter((i) => me.interests.includes(i)).join(', ')})`;
      }

      const score =
        matchedSkills.length * 5 +
        mutual * 3 +
        interestOverlap * 2 +
        (s.lookingForTeam ? 4 : 0) +
        s.reliability / 40;

      return { student: s, mutualCount: mutual, matchedSkills, connectionNote, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ score: _score, ...rest }) => rest);

  return delay(recommendations);
}

export async function invitePerson(
  teamId: string,
  studentId: string,
  role: string,
): Promise<void> {
  const team = db.teams.find((t) => t.id === teamId);
  if (!team) return delay(undefined);

  if (!team.members.some((m) => m.studentId === studentId)) {
    team.members.push({ studentId, role, confirmed: false, isCaptain: false });
    if (team.status === 'terkonfirmasi') team.status = 'menunggu-konfirmasi';
  }

  db.notifications.unshift({
    id: uid('n'),
    kind: 'tim',
    title: `Invite from ${team.name}`,
    body: `You were invited to join as ${role}.`,
    createdAt: TODAY_ISO,
    read: false,
    href: '/tim',
    forUserId: studentId,
  });

  return delay(undefined);
}

export async function getApplications(): Promise<Application[]> {
  return delay(db.applications);
}
