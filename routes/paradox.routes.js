const express = require('express');
const {
  listParadoxes,
  getById,
  createParadox,
  addLayer,
  addResponse,
  voteResponse,
} = require('../controllers/paradoxController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/', listParadoxes);
router.get('/:id', getById);
router.post('/', protect, createParadox);
router.post('/:id/layers', protect, addLayer);
router.post('/:id/layers/:layerIndex/responses', protect, addResponse);
router.post('/:id/responses/:responseId/vote', protect, voteResponse);

module.exports = router;
