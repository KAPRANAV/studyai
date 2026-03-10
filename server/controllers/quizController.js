const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const { validateObjectId } = require('../utils/helpers');

/**
 * @desc    Submit quiz answers and calculate score
 * @route   POST /api/quiz/submit
 * @access  Private
 */
const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    // Validate inputs
    if (!quizId || !validateObjectId(quizId)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid quiz ID.',
      });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an answers array.',
      });
    }

    // Find the quiz
    const quiz = await Quiz.findOne({
      _id: quizId,
      userId: req.user.id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.',
      });
    }

    // Calculate score by comparing submitted answers to correct indices
    const total = quiz.questions.length;
    let score = 0;

    for (let i = 0; i < total; i++) {
      if (i < answers.length && answers[i] === quiz.questions[i].correctIndex) {
        score++;
      }
    }

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    // Push attempt to quiz
    quiz.attempts.push({
      score,
      total,
      percentage,
      answers,
      takenAt: new Date(),
    });
    await quiz.save();

    // Update progress
    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user.id });
    }

    progress.quizScores.push({
      documentId: quiz.documentId,
      score,
      total,
      date: new Date(),
    });
    await progress.save();

    res.status(200).json({
      success: true,
      result: {
        score,
        total,
        percentage,
        answers,
        questions: quiz.questions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error submitting quiz.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Get quiz history for a document
 * @route   GET /api/quiz/history/:docId
 * @access  Private
 */
const getQuizHistory = async (req, res) => {
  try {
    const { docId } = req.params;

    if (!validateObjectId(docId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID.',
      });
    }

    const quizzes = await Quiz.find({
      documentId: docId,
      userId: req.user.id,
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching quiz history.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

module.exports = {
  submitQuiz,
  getQuizHistory,
};
