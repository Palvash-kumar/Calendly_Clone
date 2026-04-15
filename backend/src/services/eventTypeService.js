const prisma = require('../config/db');
const { NotFoundError, BadRequestError } = require('../utils/errors');

/**
 * Service layer for EventType CRUD operations.
 * Business logic is isolated from HTTP concerns.
 */
const eventTypeService = {
  /**
   * Get all event types for the default user.
   */
  async getAll() {
    return prisma.eventType.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });
  },

  /**
   * Get a single event type by ID.
   */
  async getById(id) {
    const eventType = await prisma.eventType.findUnique({
      where: { id: parseInt(id) },
    });
    if (!eventType) throw new NotFoundError('Event type not found');
    return eventType;
  },

  /**
   * Create a new event type.
   * Auto-generates slug from name if not provided.
   */
  async create(data) {
    const { name, duration, slug, color } = data;

    if (!name || !duration) {
      throw new BadRequestError('Name and duration are required');
    }

    // Auto-generate slug from name if not provided
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Get or create default user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { name: 'Admin User', email: 'palvash2005@gmail.com' },
      });
    }

    return prisma.eventType.create({
      data: {
        name,
        duration: parseInt(duration),
        slug: finalSlug,
        color: color || '#006BFF',
        userId: user.id,
      },
    });
  },

  /**
   * Update an existing event type.
   */
  async update(id, data) {
    const existing = await prisma.eventType.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existing) throw new NotFoundError('Event type not found');

    const { name, duration, slug, color } = data;

    return prisma.eventType.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(duration && { duration: parseInt(duration) }),
        ...(slug && { slug }),
        ...(color && { color }),
      },
    });
  },

  /**
   * Delete an event type and all its bookings (cascade).
   */
  async delete(id) {
    const existing = await prisma.eventType.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existing) throw new NotFoundError('Event type not found');

    return prisma.eventType.delete({
      where: { id: parseInt(id) },
    });
  },
};

module.exports = eventTypeService;
