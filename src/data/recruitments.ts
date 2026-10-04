import type { Application, Recruitment } from '@/types';

export const recruitments: Recruitment[] = [
  {
    id: 'r01',
    teamId: 't01',
    slotId: 's01',
    title: 'Butuh 1 Cryptography Specialist untuk ASEAN Cyber Cup 2026',
    commitment: 'Komitmen 6 minggu, latihan 2x seminggu',
    deadline: '2026-10-18',
    createdAt: '2026-09-12',
  },
  {
    id: 'r02',
    teamId: 't02',
    slotId: 's02',
    title: 'Butuh 1 Frontend Developer untuk GarudaHack 2026',
    commitment: 'Komitmen 3 minggu',
    deadline: '2026-10-20',
    createdAt: '2026-09-06',
  },
  {
    id: 'r03',
    teamId: 't02',
    slotId: 's03',
    title: 'Butuh 1 UI/UX Designer untuk GarudaHack 2026',
    commitment: 'Komitmen 3 minggu, intens di minggu terakhir',
    deadline: '2026-10-20',
    createdAt: '2026-09-06',
  },
  {
    id: 'r04',
    teamId: 't04',
    slotId: 's04',
    title: 'Butuh 1 Market Researcher untuk Indonesia Business Challenge 2026',
    commitment: 'Komitmen 5 minggu',
    deadline: '2026-10-31',
    createdAt: '2026-09-18',
  },
];

export const applications: Application[] = [
  {
    id: 'ap01',
    teamId: 't01',
    slotId: 's01',
    applicantId: 'u18',
    message:
      'Halo, saya Bagas. Fokus saya DevOps tapi cukup sering menyelesaikan soal crypto dasar. Siap belajar cepat dan hadir di semua sesi latihan.',
    portfolioId: 'p22',
    status: 'terkirim',
    createdAt: '2026-09-20',
  },
  {
    id: 'ap02',
    teamId: 't01',
    slotId: 's01',
    applicantId: 'u11',
    message:
      'Saya Kirana, background machine learning dan matematika. Pernah mengerjakan kategori crypto di CTF internal. Tertarik ikut kualifikasi ASEAN.',
    portfolioId: 'p16',
    status: 'terkirim',
    createdAt: '2026-09-23',
  },
  {
    id: 'ap03',
    teamId: 't02',
    slotId: 's02',
    applicantId: 'u06',
    message:
      'Halo kak, saya Salsabila. Terbiasa React + TypeScript dan bisa mengerjakan dashboard demo dalam 3 minggu.',
    portfolioId: 'p11',
    status: 'terkirim',
    createdAt: '2026-09-24',
  },
];
