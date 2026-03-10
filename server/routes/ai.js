const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');
const {
  generateNotes,
  getNotes,
  generateQuiz,
  getLatestQuiz,
  chat,
  getChatHistory,
  generateFlashcards,
  getFlashcards,
  generateSummary,
} = require('../controllers/aiController');

// GET endpoints (read-only, no rate limiter)
router.get('/notes/:docId', auth, getNotes);
router.get('/flashcards/:docId', auth, getFlashcards);
router.get('/chat/:docId', auth, getChatHistory);
router.get('/quiz/:docId', auth, getLatestQuiz);

// POST endpoints (rate limited)
router.post('/notes/:docId', auth, rateLimiter, generateNotes);
router.post('/quiz/:docId', auth, rateLimiter, generateQuiz);
router.post('/chat/:docId', auth, rateLimiter, chat);
router.post('/flashcards/:docId', auth, rateLimiter, generateFlashcards);
router.post('/summarize/:docId', auth, rateLimiter, generateSummary);

module.exports = router;
