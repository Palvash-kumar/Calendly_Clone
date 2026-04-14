const availabilityService = require('../services/availabilityService');

/**
 * Controller for Availability management.
 */
const availabilityController = {
  async getAll(req, res, next) {
    try {
      const availability = await availabilityService.getAll();
      res.json({ success: true, data: availability });
    } catch (error) {
      next(error);
    }
  },

  async setAvailability(req, res, next) {
    try {
      const { schedules } = req.body;
      const availability = await availabilityService.setAvailability(schedules);
      res.json({ success: true, data: availability });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = availabilityController;
