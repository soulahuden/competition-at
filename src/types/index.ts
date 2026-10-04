export type CompetitionCategory =
  | 'IT'
  | 'Bisnis'
  | 'Desain'
  | 'Esai'
  | 'Sains'
  | 'Robotika'
  | 'Debat';

export type CompetitionTier = 'Internal' | 'Regional' | 'Nasional' | 'Internasional';

export type CompetitionStatus = 'mendatang' | 'berjalan' | 'selesai' | 'moderasi';

export type CampusBenefit =
  | 'Bisa ajukan dana kampus'
  | 'Dispensasi kuliah'
  | 'Konversi SKS'
  | 'Poin SKKM';

export interface TimelineItem {
  label: string;
  date: string; // ISO
  done: boolean;
}

export interface Winner {
  rank: 1 | 2 | 3 | 0; // 0 = finalis
  teamId: string;
  teamName: string;
  memberIds: string[];
  note?: string;
}

export interface Competition {
  id: string;
  name: string;
  organizer: string;
  organizerId: string;
  category: CompetitionCategory;
  tier: CompetitionTier;
  status: CompetitionStatus;
  description: string;
  registrationDeadline: string; // ISO
  startDate: string;
  endDate: string;
  teamSizeMin: number;
  teamSizeMax: number;
  fee: number; // 0 = gratis
  benefits: CampusBenefit[];
  featured: boolean;
  location: string;
  poster: string; // gradient token untuk cover
  timeline: TimelineItem[];
  winners?: Winner[];
  participantTeamIds: string[];
}

export type SkillTag = string;

export interface AchievementRecord {
  id: string;
  title: string;
  competitionName: string;
  year: number;
  verification: 'penyelenggara' | 'tim' | 'menunggu';
}

export interface HistoryRecord {
  id: string;
  competitionId: string;
  competitionName: string;
  tier: CompetitionTier;
  teamName: string;
  year: number;
  outcome: 'Juara 1' | 'Juara 2' | 'Juara 3' | 'Finalis' | 'Tidak lolos' | 'Mundur';
  points: number;
}

export interface PortfolioItem {
  id: string;
  type: 'repo' | 'desain' | 'esai' | 'lainnya';
  label: string;
  url: string;
}

export interface Student {
  id: string;
  name: string;
  major: string;
  cohort: number; // angkatan
  avatarSeed: string;
  bio: string;
  skills: SkillTag[];
  interests: CompetitionCategory[];
  lookingForTeam: boolean;
  reliability: number; // 0-100
  competitionsJoined: number;
  activityPoints: number;
  winPoints: number;
  achievements: AchievementRecord[];
  history: HistoryRecord[];
  portfolio: PortfolioItem[];
  claimed: boolean; // false = profil hasil data publik
  pastTeammateIds: string[];
}

export type TeamStatus =
  | 'menunggu-konfirmasi'
  | 'terkonfirmasi'
  | 'roster-terkunci'
  | 'selesai';

export interface TeamMember {
  studentId: string;
  role: string;
  confirmed: boolean;
  isCaptain: boolean;
}

export interface OpenSlot {
  id: string;
  role: string;
  skills: SkillTag[];
  note?: string;
  filled: boolean;
}

export interface Team {
  id: string;
  name: string;
  competitionId: string;
  captainId: string;
  members: TeamMember[];
  openSlots: OpenSlot[];
  status: TeamStatus;
  rosterLockDate: string; // ISO
  createdAt: string;
  paid: boolean;
  peerReviewDone: boolean;
  result?: 'Juara 1' | 'Juara 2' | 'Juara 3' | 'Finalis' | 'Tidak lolos';
}

export interface Recruitment {
  id: string;
  teamId: string;
  slotId: string;
  title: string;
  commitment: string;
  deadline: string; // ISO
  createdAt: string;
}

export type ApplicationStatus = 'terkirim' | 'diterima' | 'ditolak';

export interface Application {
  id: string;
  teamId: string;
  slotId: string;
  applicantId: string;
  message: string;
  portfolioId?: string;
  status: ApplicationStatus;
  createdAt: string;
}

export type NotificationKind =
  | 'lamaran'
  | 'tim'
  | 'lomba'
  | 'poin'
  | 'review'
  | 'pembayaran';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
  forUserId: string;
}

export interface PeerReviewAnswer {
  revieweeId: string;
  contribution: number; // 1-5
  responsiveness: number;
  persistence: number;
}

export interface PeerReview {
  id: string;
  teamId: string;
  reviewerId: string;
  answers: PeerReviewAnswer[];
  createdAt: string;
}

export interface Organizer {
  id: string;
  name: string;
  unit: string;
  contact: string;
}

export interface LeaderboardEntry {
  rank: number;
  student: Student;
  activityPoints: number;
  winPoints: number;
  totalPoints: number;
  competitions: number;
}

export type LeaderboardPeriod = 'semester' | 'tahun';
