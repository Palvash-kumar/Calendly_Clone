const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

router.get('/', availabilityController.getAll);
router.post('/', availabilityController.setAvailability);

module.exports = router;
