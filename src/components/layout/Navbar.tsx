import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Building2, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { NotificationBell } from './NotificationBell';
import { AvatarMenu } from './AvatarMenu';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/cn';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/lomba', label: 'Competitions' },
  { to: '/cari-tim', label: 'Find a Team' },
  { to: '/tim', label: 'My Teams' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUserId } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-lg px-3 py-2 text-sm font-medium transition',
      isActive ? 'bg-white/10 text-white' : 'text-ink-muted hover:bg-white/5 hover:text-white',
    );

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-space-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Logo to="/dashboard" />
          <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
            <NavLink to={`/profil/${currentUserId}`} className={linkClass}>
              Profile
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <div className="hidden lg:block">
            <AvatarMenu />
          </div>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-ink-muted transition hover:text-white lg:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-space-950/95 px-4 pb-4 pt-2 lg:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
            <NavLink to={`/profil/${currentUserId}`} className={linkClass}>
              Profile
            </NavLink>
            <NavLink to="/penyelenggara" className={linkClass}>
              <span className="inline-flex items-center gap-2">
                <Building2 size={15} /> Organizer portal
              </span>
            </NavLink>
          </nav>
          <div className="mt-3 border-t border-white/10 pt-3">
            <AvatarMenu />
          </div>
        </div>
      )}
    </header>
  );
}
