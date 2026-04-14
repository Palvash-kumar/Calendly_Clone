const bookingService = require('../services/bookingService');

/**
 * Controller for Booking management (admin-facing).
 */
const bookingController = {
  async getAll(req, res, next) {
    try {
      const type = req.query.type || 'upcoming';
      const bookings = await bookingService.getAll(type);
      res.json({ success: true, data: bookings });
    } catch (error) {
      next(error);
    }
  },

  async cancel(req, res, next) {
    try {
      const booking = await bookingService.cancel(req.params.id);
      res.json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = bookingController;
