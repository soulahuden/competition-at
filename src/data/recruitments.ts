import type { Application, Recruitment } from '@/types';

export const recruitments: Recruitment[] = [
  {
    id: 'r01',
    teamId: 't01',
    slotId: 's01',
    title: 'Looking for a Cryptography Specialist for ASEAN Cyber Cup 2026',
    commitment: '6 weeks, practice twice a week',
    deadline: '2026-10-18',
    createdAt: '2026-09-12',
  },
  {
    id: 'r02',
    teamId: 't02',
    slotId: 's02',
    title: 'Looking for a Frontend Developer for GarudaHack 2026',
    commitment: '3 weeks',
    deadline: '2026-10-20',
    createdAt: '2026-09-06',
  },
  {
    id: 'r03',
    teamId: 't02',
    slotId: 's03',
    title: 'Looking for a UI/UX Designer for GarudaHack 2026',
    commitment: '3 weeks, busiest in the final week',
    deadline: '2026-10-20',
    createdAt: '2026-09-06',
  },
  {
    id: 'r04',
    teamId: 't04',
    slotId: 's04',
    title: 'Looking for a Market Researcher for Indonesia Business Challenge 2026',
    commitment: '5 weeks',
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
      'Hi, I\'m Bagas. I mostly do DevOps, but I solve beginner crypto challenges pretty often. I learn fast and can make every practice session.',
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
      'I\'m Kirana, with a background in machine learning and math. I did the crypto category in our internal CTF and want a shot at the ASEAN qualifier.',
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
      'Hi, I\'m Salsabila. I work in React and TypeScript every day and can build the demo dashboard in 3 weeks.',
    portfolioId: 'p11',
    status: 'terkirim',
    createdAt: '2026-09-24',
  },
];
