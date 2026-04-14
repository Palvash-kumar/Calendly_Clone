'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    label: 'Event Types',
    href: '/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: 'Availability',
    href: '/availability',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
  },
  {
    label: 'Meetings',
    href: '/meetings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on public booking pages
  const isPublicPage = pathname.startsWith('/event/');
  if (isPublicPage) return null;

  return (
    <aside className="w-[260px] bg-white border-r border-[var(--border)] flex flex-col min-h-screen shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span className="text-lg font-bold text-[var(--text-primary)]">Calendly</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="list-none p-0 m-0 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium no-underline transition-all duration-200
                    ${isActive
                      ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  <span className={isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)] m-0">Admin User</p>
            <p className="text-xs text-[var(--text-muted)] m-0">admin@calendly-clone.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
