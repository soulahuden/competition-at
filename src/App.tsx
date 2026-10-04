import { Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from '@/context/AppProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import { Starfield } from '@/components/space/Starfield';
import { NebulaBackdrop } from '@/components/space/NebulaBackdrop';

import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';
import CompetitionsPage from '@/pages/CompetitionsPage';
import CompetitionDetailPage from '@/pages/CompetitionDetailPage';
import FindTeamPage from '@/pages/FindTeamPage';
import MyTeamsPage from '@/pages/MyTeamsPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import ProfilePage from '@/pages/ProfilePage';
import OrganizerPage from '@/pages/OrganizerPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <AppProvider>
      <NebulaBackdrop />
      <Starfield />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/lomba" element={<CompetitionsPage />} />
          <Route path="/lomba/:id" element={<CompetitionDetailPage />} />
          <Route path="/cari-tim" element={<FindTeamPage />} />
          <Route path="/tim" element={<MyTeamsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profil/:id" element={<ProfilePage />} />
          <Route path="/penyelenggara" element={<OrganizerPage />} />
          <Route path="/profil" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}
