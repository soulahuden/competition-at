import type { Organizer } from '@/types';

export const organizers: Organizer[] = [
  { id: 'o01', name: 'Garuda Developer Community', unit: 'Komunitas', contact: 'panitia@garudahack.id' },
  { id: 'o02', name: 'Forum Bisnis Mahasiswa Indonesia', unit: 'Organisasi Mahasiswa', contact: 'ibc@fbmi.or.id' },
  { id: 'o03', name: 'Asosiasi Desainer Digital Indonesia', unit: 'Asosiasi', contact: 'sprint@addi.id' },
  { id: 'o04', name: 'Pusat Kajian Kebijakan Universitas Andalas', unit: 'Kampus', contact: 'pkk@unand.ac.id' },
  { id: 'o05', name: 'Liga Debat Mahasiswa', unit: 'Komunitas', contact: 'halo@ligadebat.id' },
  { id: 'o06', name: 'Kementerian Riset Kampus Nusantara', unit: 'BEM', contact: 'lkti@kampusnusantara.id' },
  { id: 'o07', name: 'Pusat Prestasi Nasional', unit: 'Pemerintah', contact: 'info@puspresnas.go.id' },
  { id: 'o08', name: 'Indonesia Data Community', unit: 'Komunitas', contact: 'sprint@idc.or.id' },
  { id: 'o09', name: 'BINUS Student Tech Club', unit: 'UKM Kampus', contact: 'binushack@binus.ac.id' },
  { id: 'o10', name: 'ASEAN Cyber Security Council', unit: 'Internasional', contact: 'cup@aseancyber.org' },
  { id: 'o11', name: 'Laboratorium Keamanan Informasi', unit: 'Laboratorium Kampus', contact: 'labsec@kampus.ac.id' },
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
