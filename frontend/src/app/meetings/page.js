'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Toast from '@/components/layout/Toast';
import { bookingAPI } from '@/services/api';
import { formatDate, formatTime, formatTimeRange, getRelativeDateLabel } from '@/utils/dateUtils';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function MeetingsPageContent() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchBookings = async (type) => {
    try {
      setLoading(true);
      const res = await bookingAPI.getAll(type);
      setBookings(res.data.data);
    } catch (err) {
      setToast({ message: 'Failed to load bookings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(activeTab);
  }, [activeTab]);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      setToast({ message: 'Booking cancelled successfully', type: 'success' });
      fetchBookings(activeTab);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel booking';
      setToast({ message: msg, type: 'error' });
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <Header
        title="Meetings"
        subtitle="View and manage your scheduled meetings"
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--bg-tertiary)] rounded-xl p-1 mb-6 max-w-xs">
        {['upcoming', 'past'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab
                ? 'bg-white text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }
            `}
            id={`tab-${tab}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card">
              <div className="flex items-center gap-4">
                <div className="skeleton w-12 h-12 rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="skeleton h-5 w-3/4 mb-2" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && bookings.length === 0 && (
        <div className="card text-center py-12 sm:py-16">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-1">
            No {activeTab} meetings
          </h3>
          <p className="text-[var(--text-secondary)] text-sm">
            {activeTab === 'upcoming'
              ? 'You have no upcoming meetings scheduled.'
              : 'No past meetings to show.'}
          </p>
        </div>
      )}

      {/* Bookings List */}
      {!loading && bookings.length > 0 && (
        <div className="flex flex-col gap-4">
          {bookings.map((booking, i) => (
            <div
              key={booking.id}
              className="card animate-fade-in hover:shadow-md"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Left side */}
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  {/* Color accent */}
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-bold"
                    style={{ backgroundColor: booking.eventType?.color || '#006BFF' }}
                  >
                    {booking.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] m-0 mb-1 truncate">
                      {booking.name}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] m-0 mb-2 truncate">
                      {booking.email}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[var(--text-muted)]">
                      {/* Event type */}
                      <span className="badge badge-blue">
                        {booking.eventType?.name}
                      </span>

                      {/* Date */}
                      <div className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {getRelativeDateLabel(booking.startTime)}
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12,6 12,12 16,14" />
                        </svg>
                        {formatTimeRange(booking.startTime, booking.endTime)}
                      </div>

                      {/* Status badge */}
                      {booking.status === 'cancelled' && (
                        <span className="badge badge-red">Cancelled</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cancel button (only for upcoming & scheduled) */}
                {activeTab === 'upcoming' && booking.status === 'scheduled' && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="btn btn-danger btn-sm shrink-0 self-start sm:self-auto"
                    id={`cancel-booking-${booking.id}`}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

export default function MeetingsPage() {
  return (
    <ProtectedRoute>
      <MeetingsPageContent />
    </ProtectedRoute>
  );
}
