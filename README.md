# StudyAI - AI-Powered Study Platform

Upload PDFs, generate smart notes, take AI quizzes, flip through flashcards, and chat with an AI tutor - all powered by Groq's llama3-8b model.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS v4, Framer Motion, GSAP, Three.js, Recharts, shadcn/ui
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT Auth
- **AI:** Groq API (llama3-8b-8192)

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone & Install

```bash
# Server
cd studyai/server
npm install

# Client
cd ../client
npm install
```

### 2. Configure Environment

Copy `server/.env.example` to `server/.env` and fill in:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studyai
JWT_SECRET=your_secret_here
GROQ_API_KEY=gsk_your_key_here
```

### 3. Run

```bash
# Terminal 1 - Server
cd server && npm run dev

# Terminal 2 - Client
cd client && npm run dev
```

Open http://localhost:5173

## Features

- **PDF Upload** - Drag & drop, text extraction, 10MB limit
- **Smart Notes** - AI-generated structured notes with TL;DR, sections, key terms
- **Flashcards** - 3D flip cards with keyboard navigation
- **Quiz Mode** - MCQs with instant feedback, explanations, and confetti
- **AI Tutor** - Chat interface for document Q&A
- **Progress Tracking** - Quiz scores, study streaks, charts
- **Design** - Dark neon theme, Three.js particles, glassmorphism, smooth animations
