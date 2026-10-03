const mongoose = require('mongoose');
const Duel = require('../models/Duel');
const Paradox = require('../models/Paradox');
const User = require('../models/User');

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
    if (!mongoose.Types.ObjectId.isValid(paradoxId)) {
      return res.status(400).json({ message: 'paradoxId inválido' });
    }

    if (!mongoose.Types.ObjectId.isValid(opponentId)) {
      return res.status(400).json({ message: 'opponentId inválido' });
    }

    if (opponentId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'No puedes retarte a ti mismo' });
    }

    const paradox = await Paradox.findById(paradoxId);
    if (!paradox) {
      return res.status(404).json({ message: 'Paradoja no encontrada' });
    }

    const opponent = await User.findById(opponentId);
    if (!opponent) {
      return res.status(404).json({ message: 'Usuario oponente no encontrado' });
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de duelo inválido' });
    }

    const duel = await Duel.findById(req.params.id);
    if (!duel) {
      return res.status(404).json({ message: 'Duel no encontrado' });
    }

    const isParticipant = [duel.challengerId.toString(), duel.opponentId.toString()].includes(req.user._id.toString());
    if (!isParticipant) {
      return res.status(403).json({ message: 'No tienes permiso para resolver este duelo' });
    }

    if (duel.status !== 'active') {
      return res.status(400).json({ message: 'Este duelo ya no está activo' });
    }

    const allowedStatus = ['active', 'completed', 'cancelled'];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'status inválido' });
    }

    const nextStatus = status || 'completed';
    const validWinner = [duel.challengerId.toString(), duel.opponentId.toString()];

    if (winnerId && !validWinner.includes(winnerId.toString())) {
      return res.status(400).json({ message: 'winnerId debe corresponder a un participante del duelo' });
    }

    duel.status = nextStatus;
    duel.winnerId = winnerId || duel.challengerId;
    await duel.save();

    return res.status(200).json({ duel });
  } catch (error) {
    return res.status(500).json({ message: 'Error al resolver duelo', error: error.message });
  }
};

module.exports = { listDuels, createDuel, resolveDuel };
