'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUser, logout } from '@/utils/auth';
import {
  LayoutDashboard, Calendar, Clock, Users, User,
  Shield, LogOut, Menu, X, Home
} from 'lucide-react';

const ADMIN_EMAIL = 'konda20006@gmail.com';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Event Types', href: '/event-types', icon: Calendar },
  { label: 'Availability', href: '/availability', icon: Clock },
  { label: 'Meetings', href: '/meetings', icon: Users },
  { label: 'Profile', href: '/profile', icon: User },
];

const adminNavItem = { label: 'Admin Panel', href: '/admin', icon: Shield };

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Hide sidebar on public booking pages, login page, and landing page
  const isPublicPage = pathname.startsWith('/event/');
  const isLoginPage = pathname === '/login';
  const isLandingPage = pathname === '/';

  useEffect(() => {
    setMounted(true);
    const currentUser = getUser();
    setUser(currentUser);
  }, [pathname]);
  
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  if (isPublicPage || isLoginPage || isLandingPage) return null;

  const handleLogout = () => { logout(); };

  const userEmail = user?.email || 'User';
  const userAvatar = user?.avatar || null;
  const userInitial = (user?.name || userEmail).charAt(0).toUpperCase();
  const userName = user?.name || userEmail.split('@')[0] || 'User';

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[var(--border)]">
        <Link href="/dashboard" className="flex items-center gap-2.5 no-underline" onClick={() => setMobileOpen(false)}>
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <Calendar size={18} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-[var(--text-primary)]">Calendly</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="list-none p-0 m-0 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname === item.href;
            const NavIcon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium no-underline transition-all duration-200
                    ${isActive
                      ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  <NavIcon size={20} className={isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'} />
                  {item.label}
                </Link>
              </li>
            );
          })}

          {/* Admin Panel */}
          {mounted && user?.email === ADMIN_EMAIL && (
            <>
              <li className="my-1 mx-4 border-t border-[var(--border)]" />
              <li>
                <Link
                  href={adminNavItem.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium no-underline transition-all duration-200
                    ${pathname === '/admin'
                      ? 'bg-[#F0FDFA] text-[#0F766E]'
                      : 'text-[#0F766E] hover:bg-[#F0FDFA]'
                    }
                  `}
                >
                  <Shield size={20} className="text-[#0D9488]" />
                  {adminNavItem.label}
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-[#0F172A] text-white font-bold">
                    ADM
                  </span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Footer — User info + Logout */}
      <div className="px-4 py-4 border-t border-[var(--border)]">
        <Link href="/profile" className="flex items-center gap-3 mb-3 px-2 no-underline hover:opacity-80 transition-opacity" onClick={() => setMobileOpen(false)}>
          {mounted && userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-9 h-9 rounded-full object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {mounted ? userInitial : 'U'}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] m-0 truncate">
              {mounted ? userName : 'Loading...'}
            </p>
            <p className="text-xs text-[var(--text-muted)] m-0 truncate">
              {mounted ? userEmail : ''}
            </p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          id="sidebar-logout-btn"
          className="w-full flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer bg-transparent border-none text-left"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Mobile: Hamburger Button (top bar) ── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center px-4 py-3"
        style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="btn btn-ghost p-2 rounded-lg"
          id="mobile-menu-toggle"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2 no-underline ml-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <Calendar size={14} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold text-[var(--text-primary)]">Calendly</span>
        </Link>
      </div>

      {/* ── Mobile: Slide-in Drawer ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="absolute top-0 left-0 bottom-0 w-[280px] flex flex-col shadow-lg"
            style={{
              animation: 'slideInLeft 0.25s ease-out forwards',
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRight: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="btn btn-ghost p-1.5 rounded-lg"
                id="mobile-menu-close"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* ── Desktop: Fixed Sidebar ── */}
      <aside
        className="hidden md:flex w-[260px] border-r flex-col min-h-screen shrink-0"
        style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: 'rgba(0, 0, 0, 0.06)',
        }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
