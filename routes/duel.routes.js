const express = require('express');
const { listDuels, createDuel, resolveDuel } = require('../controllers/duelController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, listDuels);
router.post('/', protect, createDuel);
router.patch('/:id', protect, resolveDuel);

module.exports = router;
