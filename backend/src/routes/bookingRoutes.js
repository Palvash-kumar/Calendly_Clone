const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/', bookingController.getAll);
router.patch('/:id/cancel', bookingController.cancel);

module.exports = router;
