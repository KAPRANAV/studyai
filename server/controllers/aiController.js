const groq = require('../config/groq');
const Document = require('../models/Document');
const SmartNote = require('../models/SmartNote');
const Quiz = require('../models/Quiz');
const ChatHistory = require('../models/ChatHistory');
const FlashcardSet = require('../models/Flashcard');
const { parseAIJson, validateObjectId } = require('../utils/helpers');
const {
  generateNotesPrompt,
  generateQuizPrompt,
  generateChatPrompt,
  generateFlashcardsPrompt,
  generateSummaryPrompt,
} = require('../utils/prompts');

/**
 * Fetch a document and verify ownership.
 * @param {string} docId - Document ID.
 * @param {string} userId - User ID.
 * @returns {Object|null} The document or null.
 */
const fetchDocument = async (docId, userId) => {
  if (!validateObjectId(docId)) {
    return null;
  }
  return await Document.findOne({ _id: docId, userId });
};

/**
 * @desc    Generate smart notes from a document using AI
 * @route   POST /api/ai/notes/:docId
 * @access  Private
 */
const generateNotes = async (req, res) => {
  try {
    const { docId } = req.params;

    const document = await fetchDocument(docId, req.user.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    const messages = generateNotesPrompt(document.content);

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 4096,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return res.status(502).json({
        success: false,
        message: 'AI did not return a valid response. Please try again.',
      });
    }

    const parsed = parseAIJson(responseText);
    if (!parsed || !parsed.tldr || !parsed.sections) {
      return res.status(502).json({
        success: false,
        message: 'Failed to parse AI response into structured notes. Please try again.',
      });
    }

    // Save or update the smart note
    const smartNote = await SmartNote.findOneAndUpdate(
      { documentId: docId, userId: req.user.id },
      {
        userId: req.user.id,
        documentId: docId,
        tldr: parsed.tldr,
        sections: parsed.sections,
        generatedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      smartNote,
    });
  } catch (error) {
    console.error('Generate notes error:', error.message || error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error generating notes.',
    });
  }
};

/**
 * @desc    Generate a quiz from a document using AI
 * @route   POST /api/ai/quiz/:docId
 * @access  Private
 */
const generateQuiz = async (req, res) => {
  try {
    const { docId } = req.params;
    const { numQuestions } = req.body;

    const document = await fetchDocument(docId, req.user.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    const questionCount = numQuestions && Number(numQuestions) > 0
      ? Math.min(Number(numQuestions), 20)
      : 10;

    const messages = generateQuizPrompt(document.content, questionCount);

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
      max_tokens: 4096,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return res.status(502).json({
        success: false,
        message: 'AI did not return a valid response. Please try again.',
      });
    }

    const parsed = parseAIJson(responseText);
    if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
      return res.status(502).json({
        success: false,
        message: 'Failed to parse AI response into quiz questions. Please try again.',
      });
    }

    // Validate and sanitize each question
    const questions = parsed
      .filter((q) => q.question && Array.isArray(q.options) && q.options.length === 4 && typeof q.correctIndex === 'number')
      .map((q) => ({
        question: q.question,
        options: q.options.slice(0, 4),
        correctIndex: Math.max(0, Math.min(3, q.correctIndex)),
        explanation: q.explanation || '',
      }));

    if (questions.length === 0) {
      return res.status(502).json({
        success: false,
        message: 'AI response did not contain valid quiz questions. Please try again.',
      });
    }

    // Save quiz
    const quiz = await Quiz.create({
      userId: req.user.id,
      documentId: docId,
      questions,
    });

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error generating quiz.',
    });
  }
};

/**
 * @desc    Chat with AI about a document
 * @route   POST /api/ai/chat/:docId
 * @access  Private
 */
const chat = async (req, res) => {
  try {
    const { docId } = req.params;
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message.',
      });
    }

    const document = await fetchDocument(docId, req.user.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    // Fetch or create chat history
    let chatHistory = await ChatHistory.findOne({
      documentId: docId,
      userId: req.user.id,
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: req.user.id,
        documentId: docId,
        messages: [],
      });
    }

    // Build prompt with chat history (keep last 20 messages for context window)
    const recentHistory = chatHistory.messages.slice(-20);
    const messages = generateChatPrompt(document.content, recentHistory, message.trim());

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 4096,
    });

    const assistantMessage = completion.choices[0]?.message?.content;
    if (!assistantMessage) {
      return res.status(502).json({
        success: false,
        message: 'AI did not return a valid response. Please try again.',
      });
    }

    // Save both user and assistant messages to history
    chatHistory.messages.push(
      { role: 'user', content: message.trim() },
      { role: 'assistant', content: assistantMessage }
    );
    await chatHistory.save();

    res.status(200).json({
      success: true,
      response: assistantMessage,
      chatHistory: {
        id: chatHistory._id,
        messageCount: chatHistory.messages.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during chat.',
    });
  }
};

/**
 * @desc    Generate flashcards from a document using AI
 * @route   POST /api/ai/flashcards/:docId
 * @access  Private
 */
const generateFlashcards = async (req, res) => {
  try {
    const { docId } = req.params;

    const document = await fetchDocument(docId, req.user.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    const messages = generateFlashcardsPrompt(document.content);

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.6,
      max_tokens: 4096,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return res.status(502).json({
        success: false,
        message: 'AI did not return a valid response. Please try again.',
      });
    }

    const parsed = parseAIJson(responseText);
    if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
      return res.status(502).json({
        success: false,
        message: 'Failed to parse AI response into flashcards. Please try again.',
      });
    }

    // Validate and sanitize flashcards
    const flashcards = parsed
      .filter((card) => card.front && card.back)
      .map((card) => ({
        front: card.front,
        back: card.back,
      }));

    if (flashcards.length === 0) {
      return res.status(502).json({
        success: false,
        message: 'AI response did not contain valid flashcards. Please try again.',
      });
    }

    // Save flashcards to DB (upsert)
    const flashcardSet = await FlashcardSet.findOneAndUpdate(
      { documentId: docId, userId: req.user.id },
      {
        userId: req.user.id,
        documentId: docId,
        cards: flashcards,
        generatedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      flashcards: flashcardSet.cards,
      documentId: docId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error generating flashcards.',
    });
  }
};

/**
 * @desc    Generate a summary of a document using AI
 * @route   POST /api/ai/summarize/:docId
 * @access  Private
 */
const generateSummary = async (req, res) => {
  try {
    const { docId } = req.params;

    const document = await fetchDocument(docId, req.user.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    const messages = generateSummaryPrompt(document.content);

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 1024,
    });

    const summary = completion.choices[0]?.message?.content;
    if (!summary) {
      return res.status(502).json({
        success: false,
        message: 'AI did not return a valid response. Please try again.',
      });
    }

    // Optionally save summary to the document
    document.summary = summary;
    await document.save();

    res.status(200).json({
      success: true,
      summary,
      documentId: docId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error generating summary.',
    });
  }
};

/**
 * @desc    Get existing notes for a document
 * @route   GET /api/ai/notes/:docId
 * @access  Private
 */
const getNotes = async (req, res) => {
  try {
    const { docId } = req.params;
    const note = await SmartNote.findOne({ documentId: docId, userId: req.user.id });
    res.json({ success: true, notes: note || null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notes.' });
  }
};

/**
 * @desc    Get existing flashcards for a document
 * @route   GET /api/ai/flashcards/:docId
 * @access  Private
 */
const getFlashcards = async (req, res) => {
  try {
    const { docId } = req.params;
    const flashcardSet = await FlashcardSet.findOne({
      documentId: docId,
      userId: req.user.id,
    });
    res.json({
      success: true,
      flashcards: flashcardSet ? flashcardSet.cards : null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch flashcards.' });
  }
};

/**
 * @desc    Get existing chat history for a document
 * @route   GET /api/ai/chat/:docId
 * @access  Private
 */
const getChatHistory = async (req, res) => {
  try {
    const { docId } = req.params;
    const chatHistory = await ChatHistory.findOne({
      documentId: docId,
      userId: req.user.id,
    });
    res.json({
      success: true,
      messages: chatHistory ? chatHistory.messages : [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch chat history.' });
  }
};

/**
 * @desc    Get latest quiz for a document
 * @route   GET /api/ai/quiz/:docId
 * @access  Private
 */
const getLatestQuiz = async (req, res) => {
  try {
    const { docId } = req.params;
    const quiz = await Quiz.findOne({
      documentId: docId,
      userId: req.user.id,
    }).sort('-createdAt');
    res.json({
      success: true,
      quiz: quiz || null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch quiz.' });
  }
};

module.exports = {
  generateNotes,
  getNotes,
  generateQuiz,
  getLatestQuiz,
  chat,
  getChatHistory,
  generateFlashcards,
  getFlashcards,
  generateSummary,
};
