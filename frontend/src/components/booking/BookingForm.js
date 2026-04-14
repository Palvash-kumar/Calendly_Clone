'use client';

import { useState } from 'react';
import { formatDate, formatTime } from '@/utils/dateUtils';

/**
 * Booking form — collects invitee name and email.
 */
export default function BookingForm({ selectedSlot, eventType, onSubmit, onBack }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Booking summary */}
      <div className="bg-[var(--bg-secondary)] rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: eventType.color || '#006BFF' }}
          />
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {eventType.name}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {formatDate(selectedSlot.start)}, {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label" htmlFor="invitee-name">Your Name *</label>
          <input
            id="invitee-name"
            type="text"
            className="input"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="label" htmlFor="invitee-email">Email Address *</label>
          <input
            id="invitee-email"
            type="email"
            className="input"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary flex-1"
            id="booking-back"
          >
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={loading || !formData.name || !formData.email}
            id="confirm-booking"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Scheduling...
              </span>
            ) : (
              'Schedule Event'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
