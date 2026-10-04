import { db, delay } from './client';
import type { AppNotification } from '@/types';

export async function getNotifications(userId: string): Promise<AppNotification[]> {
  return delay(db.notifications.filter((n) => n.forUserId === userId));
}

export async function markAllRead(userId: string): Promise<void> {
  for (const n of db.notifications) {
    if (n.forUserId === userId) n.read = true;
  }
  return delay(undefined);
}

export async function markRead(id: string): Promise<void> {
  const notification = db.notifications.find((n) => n.id === id);
  if (notification) notification.read = true;
  return delay(undefined);
}
