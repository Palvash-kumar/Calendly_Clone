'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Calendar from '@/components/booking/Calendar';
import TimeSlots from '@/components/booking/TimeSlots';
import BookingForm from '@/components/booking/BookingForm';
import Toast from '@/components/layout/Toast';
import { publicAPI } from '@/services/api';

/**
 * Public booking page — Calendly-style two-column layout.
 * Flow: Select Date → Select Time → Enter Details → Redirect to Confirmation
 */
export default function PublicBookingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [eventType, setEventType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking flow state
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch event type details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await publicAPI.getEvent(slug);
        setEventType(res.data.data);
      } catch (err) {
        setError('Event type not found');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  // Fetch slots when date is selected
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSelectedSlot(null);
      setShowForm(false);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const res = await publicAPI.getSlots(slug, dateStr);
        setSlots(res.data.data);
      } catch (err) {
        setSlots([]);
        setToast({ message: 'Failed to load available slots', type: 'error' });
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate, slug]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowForm(true);
  };

  const handleBookingSubmit = async (formData) => {
    try {
      const res = await publicAPI.book({
        eventTypeId: eventType.id,
        name: formData.name,
        email: formData.email,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
      });

      // Navigate to confirmation page with booking data
      const booking = res.data.data;
      const confirmUrl = `/event/${slug}/confirmed?` + new URLSearchParams({
        name: booking.name,
        email: booking.email,
        startTime: booking.startTime,
        endTime: booking.endTime,
        eventName: eventType.name,
        duration: eventType.duration.toString(),
      }).toString();

      router.push(confirmUrl);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book. Please try again.';
      setToast({ message: msg, type: 'error' });
      throw err;
    }
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="card text-center py-16 px-12 max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
          <p className="text-[var(--text-secondary)] text-sm">
            The event type you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="card max-w-3xl w-full mx-4">
          <div className="flex gap-8">
            <div className="w-72 shrink-0">
              <div className="skeleton h-6 w-32 mb-3" />
              <div className="skeleton h-4 w-48 mb-2" />
              <div className="skeleton h-4 w-24" />
            </div>
            <div className="flex-1">
              <div className="skeleton h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] p-4">
      <div className="card max-w-4xl w-full overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Panel — Event Details */}
          <div className="w-full md:w-72 shrink-0 p-6 md:border-r border-b md:border-b-0 border-[var(--border)]">
            {/* Host info */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: eventType.color || '#006BFF' }}
              >
                {eventType.user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)] m-0">
                  {eventType.user?.name || 'Admin User'}
                </p>
              </div>
            </div>

            <h1 className="text-xl font-bold text-[var(--text-primary)] mb-3 m-0">
              {eventType.name}
            </h1>

            <div className="flex flex-col gap-3">
              {/* Duration */}
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                {eventType.duration} min
              </div>

              {/* Selected date/time */}
              {selectedSlot && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] animate-fade-in">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {format(new Date(selectedSlot.start), 'h:mm a, EEEE, MMMM d, yyyy')}
                </div>
              )}

              {/* Timezone */}
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                India Standard Time
              </div>
            </div>
          </div>

          {/* Right Panel — Calendar / Slots / Form */}
          <div className="flex-1 p-6">
            {showForm && selectedSlot ? (
              // Step 3: Booking Form
              <BookingForm
                selectedSlot={selectedSlot}
                eventType={eventType}
                onSubmit={handleBookingSubmit}
                onBack={() => setShowForm(false)}
              />
            ) : (
              // Step 1 & 2: Calendar + Slots
              <div className="flex flex-col md:flex-row gap-6">
                {/* Calendar */}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                    Select a Date
                  </h3>
                  <Calendar
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                  />
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div className="w-full md:w-52 animate-slide-in">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                      {format(selectedDate, 'EEEE, MMMM d')}
                    </h3>
                    <TimeSlots
                      slots={slots}
                      selectedSlot={selectedSlot}
                      onSelect={handleSlotSelect}
                      loading={slotsLoading}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
