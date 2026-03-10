const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProgress,
  recordSession,
  resetProgress,
} = require('../controllers/progressController');

// @route   GET /api/progress
// @desc    Get progress for logged-in user
// @access  Private
router.get('/', auth, getProgress);

// @route   PUT /api/progress/session
// @desc    Record a study session and update streak
// @access  Private
router.put('/session', auth, recordSession);

// @route   DELETE /api/progress/reset
// @desc    Reset progress for logged-in user
// @access  Private
router.delete('/reset', auth, resetProgress);

module.exports = router;
