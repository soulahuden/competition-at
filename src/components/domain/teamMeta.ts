import type { BadgeTone } from '@/components/ui';
import type { TeamStatus } from '@/types';

export const teamStatusLabel: Record<TeamStatus, string> = {
  'menunggu-konfirmasi': 'Menunggu konfirmasi anggota',
  terkonfirmasi: 'Terkonfirmasi',
  'roster-terkunci': 'Roster terkunci',
  selesai: 'Selesai',
};

export const teamStatusTone: Record<TeamStatus, BadgeTone> = {
  'menunggu-konfirmasi': 'amber',
  terkonfirmasi: 'success',
  'roster-terkunci': 'violet',
  selesai: 'neutral',
};

export const roleSuggestions = [
  'Backend Developer',
  'Frontend Developer',
  'Mobile Developer',
  'UI/UX Designer',
  'Data Analyst',
  'Machine Learning Engineer',
  'Business Analyst',
  'Financial Analyst',
  'Market Researcher',
  'Penulis Esai',
  'Public Speaker',
  'Cryptography Specialist',
  'Reverse Engineering',
  'Blue Team / Forensics',
  'DevOps',
];
