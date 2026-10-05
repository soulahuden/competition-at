import type { Organizer } from '@/types';

export const organizers: Organizer[] = [
  { id: 'o01', name: 'Garuda Developer Community', unit: 'Community', contact: 'panitia@garudahack.id' },
  { id: 'o02', name: 'Indonesian Student Business Forum', unit: 'Student organization', contact: 'ibc@fbmi.or.id' },
  { id: 'o03', name: 'Indonesian Digital Designers Association', unit: 'Association', contact: 'sprint@addi.id' },
  { id: 'o04', name: 'Andalas University Policy Studies Center', unit: 'University', contact: 'pkk@unand.ac.id' },
  { id: 'o05', name: 'Student Debate League', unit: 'Community', contact: 'halo@ligadebat.id' },
  { id: 'o06', name: 'Nusantara Campus Research Ministry', unit: 'Student council', contact: 'lkti@kampusnusantara.id' },
  { id: 'o07', name: 'Pusat Prestasi Nasional', unit: 'Government', contact: 'info@puspresnas.go.id' },
  { id: 'o08', name: 'Indonesia Data Community', unit: 'Community', contact: 'sprint@idc.or.id' },
  { id: 'o09', name: 'BINUS Student Tech Club', unit: 'Campus club', contact: 'binushack@binus.ac.id' },
  { id: 'o10', name: 'ASEAN Cyber Security Council', unit: 'International', contact: 'cup@aseancyber.org' },
  { id: 'o11', name: 'Information Security Lab', unit: 'Campus lab', contact: 'labsec@kampus.ac.id' },
];

/** Penyelenggara yang "login" di Portal Penyelenggara pada prototipe ini. */
export const currentOrganizerId = 'o09';

/**
 * Lomba yang dikelola akun penyelenggara demo. Dibuat eksplisit (bukan turunan
 * `competition.organizerId`) supaya alur demo lengkap bisa dijalankan:
 * penyelenggara bisa menutup lomba yang diikuti user dan memicu peer review.
 */
export const managedCompetitionIds = ['c01', 'c10', 'c11', 'c12'];

/** Harga mock untuk upgrade Featured Listing. */
export const featuredListingPrice = 750000;

/** Potongan platform dari tiap pendaftaran tim. */
export const platformFeeRate = 0.05;
