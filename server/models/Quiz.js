const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: [true, 'Document ID is required'],
  },
  questions: [
    {
      question: {
        type: String,
      },
      options: {
        type: [String],
        validate: {
          validator: function (v) {
            return v.length === 4;
          },
          message: 'Each question must have exactly 4 options',
        },
      },
      correctIndex: {
        type: Number,
      },
      explanation: {
        type: String,
      },
    },
  ],
  attempts: [
    {
      score: {
        type: Number,
      },
      total: {
        type: Number,
      },
      percentage: {
        type: Number,
      },
      answers: [
        {
          type: Number,
        },
      ],
      takenAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
