import { db, delay, uid, TODAY_ISO } from './client';
import type { Application, OpenSlot, PeerReviewAnswer, Team } from '@/types';

export async function getTeams(): Promise<Team[]> {
  return delay(db.teams);
}

export async function getMyTeams(studentId: string): Promise<Team[]> {
  return delay(db.teams.filter((t) => t.members.some((m) => m.studentId === studentId)));
}

export async function getTeamById(id: string): Promise<Team | undefined> {
  return delay(db.teams.find((t) => t.id === id));
}

export async function getTeamsByCompetition(competitionId: string): Promise<Team[]> {
  return delay(db.teams.filter((t) => t.competitionId === competitionId));
}

export interface NewTeamInput {
  name: string;
  competitionId: string;
  captainId: string;
  captainRole: string;
  invitedIds: Array<{ studentId: string; role: string }>;
  openSlots: Array<Omit<OpenSlot, 'id' | 'filled'>>;
}

export async function createTeam(input: NewTeamInput): Promise<Team> {
  const competition = db.competitions.find((c) => c.id === input.competitionId);
  const teamId = uid('t');

  const team: Team = {
    id: teamId,
    name: input.name,
    competitionId: input.competitionId,
    captainId: input.captainId,
    members: [
      { studentId: input.captainId, role: input.captainRole, confirmed: true, isCaptain: true },
      ...input.invitedIds.map((i) => ({
        studentId: i.studentId,
        role: i.role,
        confirmed: false,
        isCaptain: false,
      })),
    ],
    openSlots: input.openSlots.map((slot) => ({ ...slot, id: uid('s'), filled: false })),
    status: input.invitedIds.length > 0 ? 'menunggu-konfirmasi' : 'terkonfirmasi',
    rosterLockDate: competition?.registrationDeadline ?? TODAY_ISO,
    createdAt: TODAY_ISO,
    paid: (competition?.fee ?? 0) === 0,
    peerReviewDone: false,
  };

  db.teams.unshift(team);
  competition?.participantTeamIds.push(teamId);

  // Slot terbuka otomatis jadi iklan open recruitment di halaman Cari Tim.
  for (const slot of team.openSlots) {
    db.recruitments.unshift({
      id: uid('r'),
      teamId: team.id,
      slotId: slot.id,
      title: `Looking for a ${slot.role} for ${competition?.name ?? 'a competition'}`,
      commitment: slot.note?.trim() || 'Follows the competition schedule',
      deadline: team.rosterLockDate,
      createdAt: TODAY_ISO,
    });
  }

  for (const invited of input.invitedIds) {
    db.notifications.unshift({
      id: uid('n'),
      kind: 'tim',
      title: `Invite from ${team.name}`,
      body: `You were invited as ${invited.role} for ${competition?.name ?? 'a competition'}.`,
      createdAt: TODAY_ISO,
      read: false,
      href: '/tim',
      forUserId: invited.studentId,
    });
  }

  return delay(team);
}

export async function confirmMember(teamId: string, studentId: string): Promise<Team | undefined> {
  const team = db.teams.find((t) => t.id === teamId);
  if (!team) return delay(undefined);

  const member = team.members.find((m) => m.studentId === studentId);
  if (member) member.confirmed = true;

  if (team.status === 'menunggu-konfirmasi' && team.members.every((m) => m.confirmed)) {
    team.status = 'terkonfirmasi';
    db.notifications.unshift({
      id: uid('n'),
      kind: 'tim',
      title: `${team.name} is confirmed`,
      body: 'Everyone confirmed. The team is officially registered.',
      createdAt: TODAY_ISO,
      read: false,
      href: '/tim',
      forUserId: team.captainId,
    });
  }

  return delay(team);
}

export async function lockRoster(teamId: string): Promise<Team | undefined> {
  const team = db.teams.find((t) => t.id === teamId);
  if (team && team.status === 'terkonfirmasi') team.status = 'roster-terkunci';
  return delay(team);
}

export async function payRegistration(teamId: string, method: string): Promise<Team | undefined> {
  const team = db.teams.find((t) => t.id === teamId);
  if (!team) return delay(undefined);
  team.paid = true;

  db.notifications.unshift({
    id: uid('n'),
    kind: 'pembayaran',
    title: 'Payment received',
    body: `${team.name}\'s registration fee was paid via ${method}.`,
    createdAt: TODAY_ISO,
    read: false,
    href: '/tim',
    forUserId: team.captainId,
  });

  return delay(team);
}

export async function getIncomingApplications(captainId: string): Promise<Application[]> {
  const myTeamIds = db.teams.filter((t) => t.captainId === captainId).map((t) => t.id);
  return delay(
    db.applications.filter((a) => myTeamIds.includes(a.teamId) && a.status === 'terkirim'),
  );
}

export async function acceptApplication(applicationId: string): Promise<Team | undefined> {
  const application = db.applications.find((a) => a.id === applicationId);
  if (!application) return delay(undefined);

  const team = db.teams.find((t) => t.id === application.teamId);
  if (!team) return delay(undefined);

  application.status = 'diterima';

  const slot = team.openSlots.find((s) => s.id === application.slotId);
  if (slot) slot.filled = true;

  if (!team.members.some((m) => m.studentId === application.applicantId)) {
    team.members.push({
      studentId: application.applicantId,
      role: slot?.role ?? 'Member',
      confirmed: true,
      isCaptain: false,
    });
  }

  // Iklan open recruitment untuk slot ini ditutup.
  db.recruitments = db.recruitments.filter((r) => r.slotId !== application.slotId);

  // Lamaran lain untuk slot yang sama otomatis ditolak.
  for (const other of db.applications) {
    if (other.id !== application.id && other.slotId === application.slotId && other.status === 'terkirim') {
      other.status = 'ditolak';
      db.notifications.unshift({
        id: uid('n'),
        kind: 'lamaran',
        title: 'Slot filled',
        body: `The ${slot?.role ?? 'open'} slot on ${team.name} went to another candidate.`,
        createdAt: TODAY_ISO,
        read: false,
        href: '/cari-tim',
        forUserId: other.applicantId,
      });
    }
  }

  db.notifications.unshift({
    id: uid('n'),
    kind: 'lamaran',
    title: 'Application accepted',
    body: `You\'re now on ${team.name}.`,
    createdAt: TODAY_ISO,
    read: false,
    href: '/tim',
    forUserId: application.applicantId,
  });

  return delay(team);
}

export async function rejectApplication(applicationId: string): Promise<void> {
  const application = db.applications.find((a) => a.id === applicationId);
  if (!application) return delay(undefined);
  application.status = 'ditolak';

  const team = db.teams.find((t) => t.id === application.teamId);
  db.notifications.unshift({
    id: uid('n'),
    kind: 'lamaran',
    title: 'Application not accepted',
    body: `The ${team?.name ?? ''} captain passed on your application this time.`,
    createdAt: TODAY_ISO,
    read: false,
    href: '/cari-tim',
    forUserId: application.applicantId,
  });

  return delay(undefined);
}

export async function submitPeerReview(
  teamId: string,
  reviewerId: string,
  answers: PeerReviewAnswer[],
): Promise<void> {
  db.peerReviews.unshift({
    id: uid('pr'),
    teamId,
    reviewerId,
    answers,
    createdAt: TODAY_ISO,
  });

  const team = db.teams.find((t) => t.id === teamId);
  if (team) team.peerReviewDone = true;

  // Peer review menggerakkan skor reliabilitas rekan tim.
  for (const answer of answers) {
    const student = db.students.find((s) => s.id === answer.revieweeId);
    if (!student) continue;
    const average = (answer.contribution + answer.responsiveness + answer.persistence) / 3;
    const contribution = Math.round((average / 5) * 100);
    student.reliability =
      student.reliability === 0
        ? contribution
        : Math.round(student.reliability * 0.8 + contribution * 0.2);
  }

  return delay(undefined);
}
