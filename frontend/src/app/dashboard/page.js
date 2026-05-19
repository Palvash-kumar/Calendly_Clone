'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getUser, logout } from '@/utils/auth';
import { bookingAPI, eventTypeAPI } from '@/services/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  Calendar, Clock, Users, BarChart3, ArrowRight,
  LogOut, CalendarDays, Link2, ChevronRight, Video
} from 'lucide-react';

/* ── Skeleton Loader ── */
function Skeleton({ className = '', style = {} }) {
  return <div className={`skeleton ${className}`} style={{ height: 20, borderRadius: 8, ...style }} />;
}

function DashboardContent() {
  const [user, setUserState] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    setUserState(currentUser);
    setMounted(true);

    // Fetch dashboard data
    async function fetchData() {
      try {
        const [bookingsRes, eventTypesRes] = await Promise.allSettled([
          bookingAPI.getAll('upcoming'),
          eventTypeAPI.getAll(),
        ]);

        const upcomingBookings = bookingsRes.status === 'fulfilled' ? (bookingsRes.value.data?.data || []) : [];
        const eventTypes = eventTypesRes.status === 'fulfilled' ? (eventTypesRes.value.data?.data || []) : [];

        setUpcoming(upcomingBookings.slice(0, 5));
        setStats({
          totalEvents: eventTypes.length,
          upcomingMeetings: upcomingBookings.length,
          totalBookings: upcomingBookings.length,
        });
      } catch (e) {
        console.error('Dashboard data fetch error:', e);
        setStats({ totalEvents: 0, upcomingMeetings: 0, totalBookings: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleLogout = useCallback(() => { logout(); }, []);

  if (!mounted) return null;

  const statCards = [
    {
      label: 'Event Types',
      value: stats?.totalEvents ?? '—',
      icon: Calendar,
      color: '#006BFF',
      bg: '#E8F0FE',
    },
    {
      label: 'Upcoming',
      value: stats?.upcomingMeetings ?? '—',
      icon: CalendarDays,
      color: '#059669',
      bg: '#DCFCE7',
    },
    {
      label: 'Total Bookings',
      value: stats?.totalBookings ?? '—',
      icon: BarChart3,
      color: '#0D9488',
      bg: '#CCFBF1',
    },
  ];

  const quickLinks = [
    {
      title: 'Event Types',
      description: 'Create and manage your meeting types',
      href: '/event-types',
      icon: Calendar,
      color: '#006BFF',
      bg: 'var(--primary-light)',
    },
    {
      title: 'Availability',
      description: 'Set your weekly schedule',
      href: '/availability',
      icon: Clock,
      color: '#059669',
      bg: '#DCFCE7',
    },
    {
      title: 'Meetings',
      description: 'View upcoming and past meetings',
      href: '/meetings',
      icon: Users,
      color: '#0D9488',
      bg: '#CCFBF1',
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      {/* ── Welcome Header ── */}
      <div className="card mb-8 animate-fade-in" style={{
        background: 'linear-gradient(135deg, rgba(0, 107, 255, 0.9) 0%, rgba(13, 148, 136, 0.85) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: '0 8px 32px rgba(0, 107, 255, 0.2)',
      }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-2">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="w-14 h-14 rounded-full object-cover border-2 border-white/30 shadow-md"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold shadow-md backdrop-blur-sm">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white m-0">
                Welcome back, {user?.name || 'there'}! 👋
              </h1>
              <p className="text-white/80 text-sm mt-1 m-0">
                {user?.email || 'Signed in user'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            id="logout-btn"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/15 text-white border border-white/25 hover:bg-white/25 transition-all duration-200 cursor-pointer backdrop-blur-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, i) => {
          const StatIcon = stat.icon;
          return (
            <div key={stat.label} className={`card glass animate-fade-in stagger-${i + 1}`} style={{ animationFillMode: 'backwards' }}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                  <StatIcon size={20} color={stat.color} />
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--text-muted)] m-0 uppercase tracking-wide">{stat.label}</p>
                  {loading ? (
                    <Skeleton style={{ width: 40, height: 28, marginTop: 4 }} />
                  ) : (
                    <p className="text-2xl font-bold text-[var(--text-primary)] m-0 mt-0.5">{stat.value}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Quick Access ── */}
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {quickLinks.map((item, i) => {
          const ItemIcon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`card glass flex flex-col gap-3 no-underline hover:-translate-y-1 transition-all duration-300 animate-fade-in stagger-${i + 1}`}
              style={{ animationFillMode: 'backwards' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: item.bg }}>
                <ItemIcon size={22} color={item.color} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] m-0">{item.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 m-0">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Upcoming Meetings ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] m-0">Upcoming Meetings</h2>
        <Link href="/meetings" className="text-sm font-medium text-[var(--primary)] no-underline hover:underline flex items-center gap-1">
          View all <ChevronRight size={14} />
        </Link>
      </div>
      <div className="card glass mb-8">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-4 py-3">
                <Skeleton style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
                <div className="flex-1">
                  <Skeleton style={{ width: '60%', height: 16, marginBottom: 8 }} />
                  <Skeleton style={{ width: '40%', height: 14 }} />
                </div>
              </div>
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-4">
              <CalendarDays size={28} color="var(--text-muted)" />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">No upcoming meetings</p>
            <p className="text-xs text-[var(--text-muted)] mb-4">Share your booking link to get started</p>
            <Link href="/event-types" className="btn btn-primary btn-sm no-underline">
              Create Event Type
            </Link>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[var(--border)]">
            {upcoming.map((booking) => {
              const startDate = new Date(booking.startTime);
              const formattedDate = startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
              const formattedTime = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              return (
                <div key={booking.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--primary-light)' }}
                  >
                    <Video size={18} color="var(--primary)" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] m-0 truncate">
                      {booking.eventType?.name || 'Meeting'}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] m-0 mt-0.5">
                      {formattedDate} at {formattedTime} · {booking.name}
                    </p>
                  </div>
                  <span className="badge badge-green text-xs flex-shrink-0">Scheduled</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Admin Quick Access ── */}
      {user?.email === 'konda20006@gmail.com' && (
        <Link
          href="/admin"
          className="card flex items-center gap-4 no-underline hover:-translate-y-1 transition-all duration-300 animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 60%, rgba(51, 65, 85, 0.9) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            animationFillMode: 'backwards',
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #38BDF8, #0D9488)' }}
          >
            <Link2 size={22} color="white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold m-0" style={{ color: 'whitesmoke' }}>Admin Console</h3>
            <p className="text-xs text-slate-400 mt-1 m-0">Manage all users, meetings, and platform data</p>
          </div>
          <ChevronRight size={20} color="white" className="ml-auto" />
        </Link>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
