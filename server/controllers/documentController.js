const pdfParse = require('pdf-parse');
const mongoose = require('mongoose');
const Document = require('../models/Document');
const SmartNote = require('../models/SmartNote');
const Quiz = require('../models/Quiz');
const ChatHistory = require('../models/ChatHistory');
const Progress = require('../models/Progress');
const { validateObjectId, cleanExtractedText } = require('../utils/helpers');
const FlashcardSet = require('../models/Flashcard');

/**
 * @desc    Upload and parse a PDF document
 * @route   POST /api/documents/upload
 * @access  Private
 */
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file.',
      });
    }

    // Parse PDF content
    let pdfData;
    try {
      pdfData = await pdfParse(req.file.buffer);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Failed to parse PDF. The file may be corrupted or password-protected.',
      });
    }

    const { text, numpages } = pdfData;
    const cleanedText = cleanExtractedText(text);

    if (!cleanedText || cleanedText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'The PDF appears to be empty or contains only images (no extractable text).',
      });
    }

    // Store the raw PDF as base64
    const rawPdf = req.file.buffer.toString('base64');

    // Create document record
    const document = await Document.create({
      userId: req.user.id,
      title: req.file.originalname.replace(/\.pdf$/i, ''),
      content: cleanedText,
      rawPdf,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      pageCount: numpages,
    });

    // Return the document without rawPdf and content for response efficiency
    const responseDoc = document.toObject();
    delete responseDoc.rawPdf;
    delete responseDoc.content;

    res.status(201).json({
      success: true,
      document: responseDoc,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during document upload.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Get all documents for the logged-in user
 * @route   GET /api/documents
 * @access  Private
 */
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user.id })
      .select('-content -rawPdf')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching documents.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Get a single document by ID
 * @route   GET /api/documents/:id
 * @access  Private
 */
const getDocument = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID.',
      });
    }

    const document = await Document.findOne({
      _id: id,
      userId: req.user.id,
    }).select('-rawPdf');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching document.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Get the raw PDF file for a document
 * @route   GET /api/documents/:id/file
 * @access  Private
 */
const getDocumentFile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID.',
      });
    }

    const document = await Document.findOne({
      _id: id,
      userId: req.user.id,
    }).select('rawPdf fileName');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    if (!document.rawPdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF file data not available for this document.',
      });
    }

    // Convert base64 back to buffer and send as PDF
    const pdfBuffer = Buffer.from(document.rawPdf, 'base64');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${document.fileName || 'document.pdf'}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching document file.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Delete a document and all associated data
 * @route   DELETE /api/documents/:id
 * @access  Private
 */
const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID.',
      });
    }

    const document = await Document.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    // Cascade delete all associated data
    await Promise.all([
      SmartNote.deleteMany({ documentId: id }),
      Quiz.deleteMany({ documentId: id }),
      ChatHistory.deleteMany({ documentId: id }),
      FlashcardSet.deleteMany({ documentId: id }),
      Progress.updateMany(
        { userId: req.user.id },
        { $pull: { quizScores: { documentId: new mongoose.Types.ObjectId(id) } } }
      ),
      document.deleteOne(),
    ]);

    res.status(200).json({
      success: true,
      message: 'Document and all associated data deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting document.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocument,
  getDocumentFile,
  deleteDocument,
};
