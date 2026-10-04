import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import * as competitionService from '@/services/competitionService';
import * as teamService from '@/services/teamService';
import * as recruitmentService from '@/services/recruitmentService';
import * as userService from '@/services/userService';
import type { RecruitmentView } from '@/services/recruitmentService';
import type {
  Application,
  Competition,
  PeerReviewAnswer,
  Student,
  Team,
} from '@/types';

interface StoreState {
  students: Student[];
  competitions: Competition[];
  teams: Team[];
  recruitments: RecruitmentView[];
  applications: Application[];
  loading: boolean;
  /** Bertambah setiap kali data berubah — dipakai efek lain untuk memuat ulang. */
  version: number;
}

interface StoreValue extends StoreState {
  refresh: () => Promise<void>;
  studentById: (id: string) => Student | undefined;
  competitionById: (id: string) => Competition | undefined;
  teamById: (id: string) => Team | undefined;

  createTeam: (input: teamService.NewTeamInput) => Promise<Team>;
  confirmMember: (teamId: string, studentId: string) => Promise<void>;
  lockRoster: (teamId: string) => Promise<void>;
  payRegistration: (teamId: string, method: string) => Promise<void>;
  acceptApplication: (applicationId: string) => Promise<void>;
  rejectApplication: (applicationId: string) => Promise<void>;
  submitPeerReview: (
    teamId: string,
    reviewerId: string,
    answers: PeerReviewAnswer[],
  ) => Promise<void>;
  applyToTeam: (input: recruitmentService.ApplyInput) => Promise<void>;
  invitePerson: (teamId: string, studentId: string, role: string) => Promise<void>;
  createCompetition: (input: competitionService.NewCompetitionInput) => Promise<Competition>;
  submitResults: (
    competitionId: string,
    results: competitionService.ResultInput[],
  ) => Promise<void>;
  setFeatured: (competitionId: string, featured: boolean) => Promise<void>;
  toggleLookingForTeam: (studentId: string, value: boolean) => Promise<void>;
  claimProfile: (studentId: string) => Promise<void>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>({
    students: [],
    competitions: [],
    teams: [],
    recruitments: [],
    applications: [],
    loading: true,
    version: 0,
  });

  const refresh = useCallback(async () => {
    const [students, competitions, teams, recruitments, applications] = await Promise.all([
      userService.getStudents(),
      competitionService.getCompetitions(),
      teamService.getTeams(),
      recruitmentService.getOpenRecruitments(),
      recruitmentService.getApplications(),
    ]);

    setState((prev) => ({
      students,
      competitions,
      teams,
      recruitments,
      applications,
      loading: false,
      version: prev.version + 1,
    }));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<StoreValue>(() => {
    const after = async <T,>(promise: Promise<T>): Promise<T> => {
      const result = await promise;
      await refresh();
      return result;
    };

    return {
      ...state,
      refresh,
      studentById: (id) => state.students.find((s) => s.id === id),
      competitionById: (id) => state.competitions.find((c) => c.id === id),
      teamById: (id) => state.teams.find((t) => t.id === id),

      createTeam: (input) => after(teamService.createTeam(input)),
      confirmMember: async (teamId, studentId) => {
        await after(teamService.confirmMember(teamId, studentId));
      },
      lockRoster: async (teamId) => {
        await after(teamService.lockRoster(teamId));
      },
      payRegistration: async (teamId, method) => {
        await after(teamService.payRegistration(teamId, method));
      },
      acceptApplication: async (applicationId) => {
        await after(teamService.acceptApplication(applicationId));
      },
      rejectApplication: async (applicationId) => {
        await after(teamService.rejectApplication(applicationId));
      },
      submitPeerReview: async (teamId, reviewerId, answers) => {
        await after(teamService.submitPeerReview(teamId, reviewerId, answers));
      },
      applyToTeam: async (input) => {
        await after(recruitmentService.applyToTeam(input));
      },
      invitePerson: async (teamId, studentId, role) => {
        await after(recruitmentService.invitePerson(teamId, studentId, role));
      },
      createCompetition: (input) => after(competitionService.createCompetition(input)),
      submitResults: async (competitionId, results) => {
        await after(competitionService.submitResults(competitionId, results));
      },
      setFeatured: async (competitionId, featured) => {
        await after(competitionService.setFeatured(competitionId, featured));
      },
      toggleLookingForTeam: async (studentId, value) => {
        await after(userService.toggleLookingForTeam(studentId, value));
      },
      claimProfile: async (studentId) => {
        await after(userService.claimProfile(studentId));
      },
    };
  }, [state, refresh]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore harus dipakai di dalam StoreProvider');
  return ctx;
}

/** Shortcut yang sering dipakai: data lengkap user yang sedang login. */
export function useCurrentUser(currentUserId: string): Student | undefined {
  const { students } = useStore();
  return students.find((s) => s.id === currentUserId);
}
