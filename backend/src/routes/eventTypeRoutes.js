const express = require('express');
const router = express.Router();
const eventTypeController = require('../controllers/eventTypeController');

router.get('/', eventTypeController.getAll);
router.get('/:id', eventTypeController.getById);
router.post('/', eventTypeController.create);
router.put('/:id', eventTypeController.update);
router.delete('/:id', eventTypeController.delete);

module.exports = router;
