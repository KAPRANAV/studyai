const mongoose = require('mongoose');

/**
 * Parse AI-generated text to extract JSON content.
 * Tries JSON.parse first, then falls back to regex extraction.
 * @param {string} text - The raw AI response text.
 * @returns {Object|Array|null} Parsed JSON object/array, or null if parsing fails.
 */
const parseAIJson = (text) => {
  if (!text || typeof text !== 'string') {
    return null;
  }

  // Try direct JSON.parse first
  try {
    return JSON.parse(text);
  } catch (e) {
    // Direct parse failed, try regex extraction
  }

  // Try to extract a JSON object {...}
  try {
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }
  } catch (e) {
    // Object extraction failed
  }

  // Try to extract a JSON array [...]
  try {
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return JSON.parse(arrayMatch[0]);
    }
  } catch (e) {
    // Array extraction failed
  }

  return null;
};

/**
 * Truncate content to a maximum number of characters.
 * Adds an ellipsis indicator if content is truncated.
 * @param {string} content - The text to truncate.
 * @param {number} maxChars - Maximum character count (default: 6000).
 * @returns {string} Truncated text.
 */
const truncateContent = (content, maxChars = 6000) => {
  if (!content || typeof content !== 'string') {
    return '';
  }

  if (content.length <= maxChars) {
    return content;
  }

  return content.substring(0, maxChars) + '... [content truncated]';
};

/**
 * Validate that a string is a valid MongoDB ObjectId.
 * @param {string} id - The string to validate.
 * @returns {boolean} True if the string is a valid ObjectId.
 */
const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Clean raw text extracted from a PDF.
 * Removes page numbers, repeated headers/footers, fixes broken lines,
 * and normalizes whitespace.
 * @param {string} text - Raw extracted PDF text.
 * @returns {string} Cleaned text.
 */
const cleanExtractedText = (text) => {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text;

  // Normalize line endings
  cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Remove page number patterns (standalone numbers, "Page 1", "1 of 10", "- 1 -")
  cleaned = cleaned.replace(/^\s*[-–—]?\s*(?:page\s*)?\d+(?:\s*(?:of|\/)\s*\d+)?\s*[-–—]?\s*$/gim, '');

  // Remove repeated headers/footers (lines appearing 3+ times)
  const lines = cleaned.split('\n');
  const lineCounts = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 3 && trimmed.length < 100) {
      lineCounts[trimmed] = (lineCounts[trimmed] || 0) + 1;
    }
  }
  const repeatedLines = new Set(
    Object.entries(lineCounts)
      .filter(([, count]) => count >= 3)
      .map(([line]) => line)
  );
  cleaned = lines.filter(line => !repeatedLines.has(line.trim())).join('\n');

  // Fix broken hyphenated words across lines
  cleaned = cleaned.replace(/-\n(\S)/g, '$1');

  // Merge broken lines within a paragraph
  cleaned = cleaned.replace(/([^\n.!?:;])\n([a-z])/g, '$1 $2');

  // Collapse multiple blank lines into double newline (paragraph breaks)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Collapse multiple spaces/tabs into single space
  cleaned = cleaned.replace(/[ \t]+/g, ' ');

  // Trim each line
  cleaned = cleaned.split('\n').map(l => l.trim()).join('\n');

  return cleaned.trim();
};

module.exports = {
  parseAIJson,
  truncateContent,
  validateObjectId,
  cleanExtractedText,
};
