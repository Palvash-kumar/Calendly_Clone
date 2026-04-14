const eventTypeService = require('../services/eventTypeService');

/**
 * Controller for EventType CRUD operations.
 * Thin layer that delegates to the service and formats HTTP responses.
 */
const eventTypeController = {
  async getAll(req, res, next) {
    try {
      const eventTypes = await eventTypeService.getAll();
      res.json({ success: true, data: eventTypes });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const eventType = await eventTypeService.getById(req.params.id);
      res.json({ success: true, data: eventType });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const eventType = await eventTypeService.create(req.body);
      res.status(201).json({ success: true, data: eventType });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const eventType = await eventTypeService.update(req.params.id, req.body);
      res.json({ success: true, data: eventType });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await eventTypeService.delete(req.params.id);
      res.json({ success: true, message: 'Event type deleted successfully' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = eventTypeController;
