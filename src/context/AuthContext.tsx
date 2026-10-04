import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

const DEFAULT_USER_ID = 'u01';

interface AuthValue {
  currentUserId: string;
  isLoggedIn: boolean;
  /** Login mock — tidak ada form, langsung masuk sebagai user default. */
  login: () => void;
  logout: () => void;
  /** Ganti persona untuk mendemokan sisi pelamar maupun kapten. */
  switchPersona: (studentId: string) => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState(DEFAULT_USER_ID);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setCurrentUserId(DEFAULT_USER_ID);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => setIsLoggedIn(false), []);

  const switchPersona = useCallback((studentId: string) => {
    setCurrentUserId(studentId);
    setIsLoggedIn(true);
  }, []);

  const value = useMemo(
    () => ({ currentUserId, isLoggedIn, login, logout, switchPersona }),
    [currentUserId, isLoggedIn, login, logout, switchPersona],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}
