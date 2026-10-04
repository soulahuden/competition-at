import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import * as notificationService from '@/services/notificationService';
import { useAuth } from './AuthContext';
import { useStore } from './StoreContext';
import type { AppNotification } from '@/types';

interface NotificationValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { currentUserId } = useAuth();
  const { version } = useStore();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const load = useCallback(async () => {
    const list = await notificationService.getNotifications(currentUserId);
    setNotifications(list);
  }, [currentUserId]);

  // Muat ulang setiap kali data global berubah (mis. setelah melamar/menerima).
  useEffect(() => {
    void load();
  }, [load, version]);

  const value = useMemo<NotificationValue>(
    () => ({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      markAllRead: async () => {
        await notificationService.markAllRead(currentUserId);
        await load();
      },
      markRead: async (id) => {
        await notificationService.markRead(id);
        await load();
      },
    }),
    [notifications, currentUserId, load],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications(): NotificationValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications harus dipakai di dalam NotificationProvider');
  return ctx;
}
