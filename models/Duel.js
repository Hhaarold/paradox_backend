const mongoose = require('mongoose');

const duelSchema = new mongoose.Schema(
  {
    paradoxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Paradox',
      required: true,
    },
    challengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    opponentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Duel', duelSchema);
