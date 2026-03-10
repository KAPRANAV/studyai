const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  submitQuiz,
  getQuizHistory,
} = require('../controllers/quizController');

// @route   POST /api/quiz/submit
// @desc    Submit quiz answers and get score
// @access  Private
router.post('/submit', auth, submitQuiz);

// @route   GET /api/quiz/history/:docId
// @desc    Get quiz history for a document
// @access  Private
router.get('/history/:docId', auth, getQuizHistory);

module.exports = router;
