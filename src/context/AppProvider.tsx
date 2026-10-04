import type { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { StoreProvider } from './StoreContext';
import { NotificationProvider } from './NotificationContext';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
