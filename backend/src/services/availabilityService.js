const prisma = require('../config/db');
const { BadRequestError } = require('../utils/errors');

/**
 * Service layer for Availability management.
 * Handles bulk upsert of weekly schedule.
 */
const availabilityService = {
  /**
   * Get all availability entries for the default user.
   */
  async getAll() {
    const user = await prisma.user.findFirst();
    if (!user) return [];

    return prisma.availability.findMany({
      where: { userId: user.id },
      orderBy: { dayOfWeek: 'asc' },
    });
  },

  /**
   * Bulk set availability.
   * Accepts an array of { dayOfWeek, startTime, endTime, timezone } objects.
   * Upserts each entry (creates if not exists, updates if exists).
   *
   * @param {Array<{ dayOfWeek: number, startTime: string, endTime: string, timezone?: string }>} schedules
   */
  async setAvailability(schedules) {
    if (!Array.isArray(schedules)) {
      throw new BadRequestError('Schedules must be an array');
    }

    // Get or create default user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { name: 'Admin User', email: 'palvash2005@gmail.com' },
      });
    }

    // First, delete all existing availability for the user
    await prisma.availability.deleteMany({
      where: { userId: user.id },
    });

    // Then create new availability entries (only for enabled days)
    const creates = schedules
      .filter((s) => s.startTime && s.endTime) // skip disabled days
      .map((s) => ({
        dayOfWeek: parseInt(s.dayOfWeek),
        startTime: s.startTime,
        endTime: s.endTime,
        timezone: s.timezone || 'Asia/Kolkata',
        userId: user.id,
      }));

    if (creates.length > 0) {
      await prisma.availability.createMany({
        data: creates,
      });
    }

    // Return updated availability
    return prisma.availability.findMany({
      where: { userId: user.id },
      orderBy: { dayOfWeek: 'asc' },
    });
  },
};

module.exports = availabilityService;
