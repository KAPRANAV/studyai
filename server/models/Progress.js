const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true,
    index: true,
  },
  totalSessions: {
    type: Number,
    default: 0,
  },
  totalDocuments: {
    type: Number,
    default: 0,
  },
  quizScores: [
    {
      documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
      },
      score: {
        type: Number,
      },
      total: {
        type: Number,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  studyStreak: {
    type: Number,
    default: 0,
  },
  weeklyStudyDays: [
    {
      type: Number,
    },
  ],
  topicsMastered: [
    {
      type: String,
    },
  ],
  lastActive: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
