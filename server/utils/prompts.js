const { truncateContent } = require('./helpers');

/**
 * Generate prompt messages for creating structured study notes from document content.
 * @param {string} content - The raw document text.
 * @returns {Array} Messages array for Groq chat completions API.
 */
const generateNotesPrompt = (content) => {
  const trimmed = truncateContent(content, 6000);

  return [
    {
      role: 'system',
      content: `You are an expert study assistant. Your task is to generate well-structured study notes from the provided document content.

Create notes that include:
- A concise TL;DR summary (1-2 sentences)
- Multiple organized sections, each with a clear heading, bullet points explaining key concepts, and a list of key terms

You MUST return your response as valid JSON with this exact structure:
{
  "tldr": "string",
  "sections": [
    {
      "heading": "string",
      "bullets": ["string", "string"],
      "keyTerms": ["string", "string"]
    }
  ]
}

Do NOT include any text outside the JSON. Return ONLY the JSON object.`,
    },
    {
      role: 'user',
      content: `Generate structured study notes from the following document:\n\n${trimmed}`,
    },
  ];
};

/**
 * Generate prompt messages for creating MCQ quiz questions from document content.
 * @param {string} content - The raw document text.
 * @param {number} numQuestions - Number of questions to generate (default: 10).
 * @returns {Array} Messages array for Groq chat completions API.
 */
const generateQuizPrompt = (content, numQuestions = 10) => {
  const trimmed = truncateContent(content, 6000);

  return [
    {
      role: 'system',
      content: `You are a quiz creator specializing in educational assessments. Your task is to generate multiple-choice questions that test understanding of the provided document content.

Generate exactly ${numQuestions} questions. Each question must have exactly 4 options with only one correct answer. Include a brief explanation for why the correct answer is right.

You MUST return your response as a valid JSON array with this exact structure:
[
  {
    "question": "string",
    "options": ["option A", "option B", "option C", "option D"],
    "correctIndex": 0,
    "explanation": "string"
  }
]

Rules:
- correctIndex must be a number from 0 to 3
- Each question must have exactly 4 options
- Questions should cover different aspects of the content
- Include a mix of difficulty levels
- Do NOT include any text outside the JSON array. Return ONLY the JSON array.`,
    },
    {
      role: 'user',
      content: `Generate ${numQuestions} multiple-choice quiz questions from the following document:\n\n${trimmed}`,
    },
  ];
};

/**
 * Generate prompt messages for a chat conversation about a document.
 * @param {string} documentContent - The raw document text.
 * @param {Array} chatHistory - Array of previous messages [{role, content}].
 * @param {string} userMessage - The current user message.
 * @returns {Array} Messages array for Groq chat completions API.
 */
const generateChatPrompt = (documentContent, chatHistory, userMessage) => {
  const trimmed = truncateContent(documentContent, 6000);

  const messages = [
    {
      role: 'system',
      content: `You are a patient and knowledgeable tutor helping a student understand the following document. Answer questions based on the document content. If a question is not related to the document, politely redirect the student to ask about the document.

Be encouraging, clear, and provide examples when helpful. Break down complex concepts into simpler terms.

Document content:
${trimmed}`,
    },
  ];

  // Add previous chat history as context
  if (chatHistory && chatHistory.length > 0) {
    for (const msg of chatHistory) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }
  }

  // Add the current user message
  messages.push({
    role: 'user',
    content: userMessage,
  });

  return messages;
};

/**
 * Generate prompt messages for creating flashcards from document content.
 * @param {string} content - The raw document text.
 * @returns {Array} Messages array for Groq chat completions API.
 */
const generateFlashcardsPrompt = (content) => {
  const trimmed = truncateContent(content, 6000);

  return [
    {
      role: 'system',
      content: `You are a flashcard creator specializing in effective study materials. Your task is to create flashcards from the provided document content.

Create flashcards that cover the most important concepts, definitions, and key facts from the document. Each flashcard should have a clear question or prompt on the front and a concise, accurate answer on the back.

You MUST return your response as a valid JSON array with this exact structure:
[
  {
    "front": "Question or prompt text",
    "back": "Answer or explanation text"
  }
]

Rules:
- Create between 10 and 20 flashcards
- Cover the most important topics from the document
- Keep the front side concise (a question or key term)
- Keep the back side clear and informative but not too long
- Do NOT include any text outside the JSON array. Return ONLY the JSON array.`,
    },
    {
      role: 'user',
      content: `Create flashcards from the following document:\n\n${trimmed}`,
    },
  ];
};

/**
 * Generate prompt messages for creating a summary of document content.
 * @param {string} content - The raw document text.
 * @returns {Array} Messages array for Groq chat completions API.
 */
const generateSummaryPrompt = (content) => {
  const trimmed = truncateContent(content, 6000);

  return [
    {
      role: 'system',
      content: `You are a concise and accurate summarizer. Your task is to create a clear, well-organized summary of the provided document content.

The summary should:
- Capture the main ideas and key points
- Be organized in a logical flow
- Use clear and simple language
- Be significantly shorter than the original content
- Highlight the most important takeaways

Return the summary as plain text with clear paragraph breaks. Do NOT return JSON.`,
    },
    {
      role: 'user',
      content: `Summarize the following document:\n\n${trimmed}`,
    },
  ];
};

module.exports = {
  generateNotesPrompt,
  generateQuizPrompt,
  generateChatPrompt,
  generateFlashcardsPrompt,
  generateSummaryPrompt,
};
