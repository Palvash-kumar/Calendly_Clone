const prisma = require('../config/db');
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/errors');

/**
 * Service layer for Booking management.
 * Handles booking creation with double-booking prevention,
 * as well as listing and cancellation.
 */
const bookingService = {
  /**
   * Create a new booking with transactional double-booking prevention.
   *
   * Uses Prisma's interactive transaction to:
   * 1. Check for overlapping bookings
   * 2. Create the booking only if no conflicts exist
   *
   * This prevents race conditions where two requests try to book the same slot.
   */
  async create(data) {
    const { eventTypeId, name, email, startTime, endTime } = data;

    if (!eventTypeId || !name || !email || !startTime || !endTime) {
      throw new BadRequestError('All fields are required: eventTypeId, name, email, startTime, endTime');
    }

    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);

    if (newStart >= newEnd) {
      throw new BadRequestError('Start time must be before end time');
    }

    // Verify event type exists
    const eventType = await prisma.eventType.findUnique({
      where: { id: parseInt(eventTypeId) },
    });
    if (!eventType) throw new NotFoundError('Event type not found');

    // Use transaction for atomic check-and-create
    return prisma.$transaction(async (tx) => {
      // Check for overlapping bookings
      // Overlap condition: existing.start < new.end AND existing.end > new.start
      const overlap = await tx.booking.findFirst({
        where: {
          eventTypeId: parseInt(eventTypeId),
          status: 'scheduled',
          startTime: { lt: newEnd },
          endTime: { gt: newStart },
        },
      });

      if (overlap) {
        throw new ConflictError(
          'This time slot is already booked. Please choose another time.'
        );
      }

      // Create the booking
      return tx.booking.create({
        data: {
          eventTypeId: parseInt(eventTypeId),
          name,
          email,
          startTime: newStart,
          endTime: newEnd,
          status: 'scheduled',
        },
        include: {
          eventType: true,
        },
      });
    });
  },

  /**
   * Get bookings filtered by type (upcoming or past).
   */
  async getAll(type = 'upcoming') {
    const now = new Date();

    const where = {
      ...(type === 'upcoming'
        ? { startTime: { gte: now }, status: 'scheduled' }
        : { OR: [{ startTime: { lt: now } }, { status: 'cancelled' }] }),
    };

    return prisma.booking.findMany({
      where,
      include: {
        eventType: {
          select: { name: true, duration: true, color: true, slug: true },
        },
      },
      orderBy: { startTime: type === 'upcoming' ? 'asc' : 'desc' },
    });
  },

  /**
   * Cancel a booking by ID.
   * Sets status to 'cancelled' rather than deleting the record.
   */
  async cancel(id) {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
    });
    if (!booking) throw new NotFoundError('Booking not found');

    if (booking.status === 'cancelled') {
      throw new BadRequestError('Booking is already cancelled');
    }

    return prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: 'cancelled' },
      include: {
        eventType: {
          select: { name: true, duration: true },
        },
      },
    });
  },
};

module.exports = bookingService;
