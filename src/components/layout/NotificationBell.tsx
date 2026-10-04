import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { relativeTime } from '@/lib/format';
import { EmptyState } from '@/components/ui';

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifikasi${unreadCount > 0 ? `, ${unreadCount} belum dibaca` : ''}`}
        aria-expanded={open}
        className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-ink-muted transition hover:border-cyan/40 hover:text-white"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan px-1 text-[11px] font-bold text-[#04222B]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="glass-strong absolute right-0 z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="font-display text-sm font-semibold text-white">Notifikasi</p>
            {unreadCount > 0 && (
              <button
                onClick={() => void markAllRead()}
                className="inline-flex items-center gap-1.5 text-xs text-cyan-soft transition hover:text-white"
              >
                <CheckCheck size={14} /> Tandai dibaca
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4">
                <EmptyState title="Belum ada notifikasi" />
              </div>
            ) : (
              notifications.slice(0, 8).map((n) => (
                <Link
                  key={n.id}
                  to={n.href ?? '/dashboard'}
                  onClick={() => setOpen(false)}
                  className="flex gap-3 border-b border-white/5 px-4 py-3 transition last:border-b-0 hover:bg-white/5"
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      n.read ? 'bg-white/20' : 'bg-cyan'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-white">{n.title}</span>
                    <span className="mt-0.5 block text-xs text-ink-muted">{n.body}</span>
                    <span className="mt-1 block text-[11px] text-ink-faint">
                      {relativeTime(n.createdAt)}
                    </span>
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
