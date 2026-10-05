import { useEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ChevronDown, LogOut, User, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { Avatar } from '@/components/ui';

export function AvatarMenu() {
  const { currentUserId, logout, switchPersona } = useAuth();
  const { students } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const personaSelectId = useId();

  const me = students.find((s) => s.id === currentUserId);

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

  if (!me) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5 pr-2 transition hover:border-cyan/40"
      >
        <Avatar name={me.name} size="sm" />
        <ChevronDown size={15} className="text-ink-muted" />
      </button>

      {open && (
        <div className="glass-strong absolute right-0 z-40 mt-2 w-72 overflow-hidden rounded-2xl">
          <div className="border-b border-white/10 p-4">
            <p className="font-display font-semibold text-white">{me.name}</p>
            <p className="text-xs text-ink-muted">
              {me.major} · Class of {me.cohort}
            </p>
          </div>

          <div className="p-1.5">
            <Link
              to={`/profil/${me.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink transition hover:bg-white/10 hover:text-white"
            >
              <User size={16} /> My profile
            </Link>
            <Link
              to="/penyelenggara"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink transition hover:bg-white/10 hover:text-white"
            >
              <Building2 size={16} /> Organizer portal
            </Link>
          </div>

          <div className="border-t border-white/10 p-3">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
              <Users size={12} /> Demo: switch persona
            </p>
            <label className="sr-only" htmlFor={personaSelectId}>
              Choose a persona
            </label>
            <select
              id={personaSelectId}
              value={currentUserId}
              onChange={(e) => {
                switchPersona(e.target.value);
                setOpen(false);
              }}
              className="w-full rounded-lg border border-white/15 bg-space-900 px-2.5 py-2 text-sm text-ink focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/30"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}, {s.major}
                </option>
              ))}
            </select>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
              Apply as someone else, then switch back and accept as the captain.
            </p>
          </div>

          <div className="border-t border-white/10 p-1.5">
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink-muted transition hover:bg-white/10 hover:text-white"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
