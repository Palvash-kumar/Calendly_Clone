const prisma = require('../config/db');
const { NotFoundError } = require('../utils/errors');
const { generateTimeSlots } = require('../utils/timeUtils');
const { getDay, startOfDay, endOfDay } = require('date-fns');
const { fromZonedTime } = require('date-fns-tz');

/**
 * Service layer for public-facing slot generation.
 * Handles generating available time slots for a given event type and date.
 */
const slotService = {
  /**
   * Get event type details by slug (public).
   */
  async getEventBySlug(slug) {
    const eventType = await prisma.eventType.findUnique({
      where: { slug },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!eventType) throw new NotFoundError('Event type not found');
    return eventType;
  },

  /**
   * Generate available time slots for a specific date and event type.
   *
   * Process:
   * 1. Find the event type by slug
   * 2. Determine the day-of-week for the requested date
   * 3. Look up availability for that day
   * 4. Fetch existing bookings for that date
   * 5. Generate slots, filtering out conflicts and past times
   *
   * @param {string} slug - Event type slug
   * @param {string} dateStr - "YYYY-MM-DD"
   * @returns {Array<{ start: string, end: string }>}
   */
  async getAvailableSlots(slug, dateStr) {
    // 1. Find the event type
    const eventType = await prisma.eventType.findUnique({
      where: { slug },
    });
    if (!eventType) throw new NotFoundError('Event type not found');

    // 2. Determine day of week (0 = Sunday, 6 = Saturday)
    const targetDate = new Date(dateStr + 'T12:00:00'); // noon to avoid timezone date shift
    const dayOfWeek = getDay(targetDate);

    // 3. Look up availability for that day
    const availability = await prisma.availability.findFirst({
      where: {
        userId: eventType.userId,
        dayOfWeek: dayOfWeek,
      },
    });

    if (!availability) return [];

    // 4. Fetch existing scheduled bookings for this event type on this date
    const timezone = availability.timezone || 'Asia/Kolkata';
    const dayStartLocal = new Date(dateStr + 'T00:00:00');
    const dayEndLocal = new Date(dateStr + 'T23:59:59');
    const dayStartUTC = fromZonedTime(dayStartLocal, timezone);
    const dayEndUTC = fromZonedTime(dayEndLocal, timezone);

    const existingBookings = await prisma.booking.findMany({
      where: {
        eventTypeId: eventType.id,
        status: 'scheduled',
        startTime: { gte: dayStartUTC },
        endTime: { lte: new Date(dayEndUTC.getTime() + 1000) }, // +1s buffer
      },
      select: { startTime: true, endTime: true },
    });

    // 5. Generate available slots
    return generateTimeSlots(dateStr, eventType.duration, availability, existingBookings);
  },
};

module.exports = slotService;
