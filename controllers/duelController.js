const Duel = require('../models/Duel');
const Paradox = require('../models/Paradox');

const listDuels = async (req, res) => {
  try {
    const duels = await Duel.find()
      .populate('challengerId', 'username school paradoxScore')
      .populate('opponentId', 'username school paradoxScore')
      .populate('paradoxId', 'title status');

    return res.status(200).json({ duels });
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar duelos', error: error.message });
  }
};

const createDuel = async (req, res) => {
  const { paradoxId, opponentId } = req.body;

  if (!paradoxId || !opponentId) {
    return res.status(400).json({ message: 'paradoxId y opponentId son obligatorios' });
  }

  try {
    const paradox = await Paradox.findById(paradoxId);
    if (!paradox) {
      return res.status(404).json({ message: 'Paradoja no encontrada' });
    }

    const duel = await Duel.create({
      paradoxId,
      challengerId: req.user._id,
      opponentId,
      status: 'active',
    });

    return res.status(201).json({ duel });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear duelo', error: error.message });
  }
};

const resolveDuel = async (req, res) => {
  const { winnerId, status } = req.body;

  try {
    const duel = await Duel.findById(req.params.id);
    if (!duel) {
      return res.status(404).json({ message: 'Duel no encontrado' });
    }

    duel.status = status || 'completed';
    duel.winnerId = winnerId || duel.challengerId;
    await duel.save();

    return res.status(200).json({ duel });
  } catch (error) {
    return res.status(500).json({ message: 'Error al resolver duelo', error: error.message });
  }
};

module.exports = { listDuels, createDuel, resolveDuel };
