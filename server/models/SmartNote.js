const mongoose = require('mongoose');

const smartNoteSchema = new mongoose.Schema({
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
  tldr: {
    type: String,
  },
  sections: [
    {
      heading: {
        type: String,
      },
      bullets: [
        {
          type: String,
        },
      ],
      keyTerms: [
        {
          type: String,
        },
      ],
    },
  ],
  generatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('SmartNote', smartNoteSchema);
