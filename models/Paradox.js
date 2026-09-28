const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['resolve', 'complicate'],
      default: 'resolve',
    },
    votes: {
      type: Map,
      of: String,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const layerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    responses: [responseSchema],
  },
  { _id: true }
);

const paradoxSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    statement: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Time', 'Space', 'Identity', 'Knowledge', 'Ethics', 'Reality'],
      default: 'Reality',
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved', 'Draft', 'Frozen'],
      default: 'Active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    layers: [layerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Paradox', paradoxSchema);
