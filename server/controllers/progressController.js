const Progress = require('../models/Progress');

/**
 * @desc    Get progress for the logged-in user
 * @route   GET /api/progress
 * @access  Private
 */
const getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user.id });

    // Create default progress if none exists
    if (!progress) {
      progress = await Progress.create({ userId: req.user.id });
    }

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching progress.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Record a study session and update streak
 * @route   PUT /api/progress/session
 * @access  Private
 */
const recordSession = async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user.id });

    if (!progress) {
      progress = await Progress.create({ userId: req.user.id });
    }

    // Increment total sessions
    progress.totalSessions += 1;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Update streak logic
    if (progress.lastActive) {
      const lastActiveDate = new Date(progress.lastActive);
      const lastActiveDay = new Date(
        lastActiveDate.getFullYear(),
        lastActiveDate.getMonth(),
        lastActiveDate.getDate()
      );

      const diffMs = today.getTime() - lastActiveDay.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day - increment streak
        progress.studyStreak += 1;
      } else if (diffDays > 1) {
        // Streak broken - reset to 1 for today
        progress.studyStreak = 1;
      }
      // diffDays === 0 means same day, streak stays the same
    } else {
      // First ever session
      progress.studyStreak = 1;
    }

    // Update lastActive
    progress.lastActive = now;

    // Track weekly study days (0 = Sunday, 6 = Saturday)
    const dayOfWeek = now.getDay();
    if (!progress.weeklyStudyDays.includes(dayOfWeek)) {
      progress.weeklyStudyDays.push(dayOfWeek);
    }

    await progress.save();

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error recording session.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Reset progress for the logged-in user
 * @route   DELETE /api/progress/reset
 * @access  Private
 */
const resetProgress = async (req, res) => {
  try {
    await Progress.findOneAndDelete({ userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Progress has been reset successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error resetting progress.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

module.exports = {
  getProgress,
  recordSession,
  resetProgress,
};
