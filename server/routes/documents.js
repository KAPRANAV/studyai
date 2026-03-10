const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  uploadDocument,
  getDocuments,
  getDocument,
  getDocumentFile,
  deleteDocument,
} = require('../controllers/documentController');

// @route   POST /api/documents/upload
// @desc    Upload a PDF document
// @access  Private
router.post('/upload', auth, upload, uploadDocument);

// @route   GET /api/documents
// @desc    Get all documents for logged-in user
// @access  Private
router.get('/', auth, getDocuments);

// @route   GET /api/documents/:id
// @desc    Get a single document by ID
// @access  Private
router.get('/:id', auth, getDocument);

// @route   GET /api/documents/:id/file
// @desc    Get the raw PDF file for a document
// @access  Private
router.get('/:id/file', auth, getDocumentFile);

// @route   DELETE /api/documents/:id
// @desc    Delete a document and associated data
// @access  Private
router.delete('/:id', auth, deleteDocument);

module.exports = router;
