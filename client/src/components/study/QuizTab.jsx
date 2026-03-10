import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAI } from '@/hooks/useAI';
import { useQuiz } from '@/hooks/useQuiz';
import { Sparkles, CheckCircle, XCircle, Trophy, RotateCcw, Loader2, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizTab({ documentId, quiz, onQuizUpdate }) {
  const { generateQuiz, loading: generating } = useAI();
  const { submitQuiz } = useQuiz();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    try {
      const q = await generateQuiz(documentId, 10);
      onQuizUpdate(q);
      setCurrentQ(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setResult(null);
    } catch {
      // handled in hook
    }
  };

  const handleAnswer = (answerIdx) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIdx);
    setShowFeedback(true);

    const newAnswers = [...answers, answerIdx];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQ < quiz.questions.length - 1) {
        setCurrentQ(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        finishQuiz(newAnswers);
      }
    }, 2000);
  };

  const finishQuiz = async (finalAnswers) => {
    try {
      const res = await submitQuiz(quiz._id, finalAnswers);
      setResult(res);
      if (res.percentage >= 70) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#7efff5', '#a78bfa', '#fb7185', '#34d399'] });
      }
    } catch {
      let score = 0;
      finalAnswers.forEach((a, i) => {
        if (a === quiz.questions[i].correctIndex) score++;
      });
      setResult({ score, total: quiz.questions.length, percentage: Math.round((score / quiz.questions.length) * 100) });
    }
  };

  if (generating) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#7efff5' }}>
          <Loader2 style={{ width: 20, height: 20 }} className="animate-spin" />
          <span style={{ fontSize: 14, fontWeight: 500 }}>Creating quiz questions...</span>
        </div>
        {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 56, width: '100%', borderRadius: 12 }} />)}
      </div>
    );
  }

  if (!quiz) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 400, padding: '48px 32px', textAlign: 'center',
      }}>
        <Brain style={{ width: 48, height: 48, color: '#7efff5', marginBottom: 20 }} />
        <h3 style={{ fontSize: 18, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>Quiz Mode</h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
          Test your knowledge with AI-generated questions
        </p>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleGenerate}
          style={{ padding: '12px 24px', background: 'rgba(126, 255, 245, 0.1)', border: '1px solid rgba(126, 255, 245, 0.2)',
            borderRadius: 12, color: '#7efff5', fontSize: 14, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sparkles style={{ width: 16, height: 16 }} /> Start Quiz
        </motion.button>
      </div>
    );
  }

  if (result) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 400, padding: '48px 32px', textAlign: 'center',
      }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
          <Trophy style={{ width: 64, height: 64, marginBottom: 20, color: result.percentage >= 70 ? '#34d399' : '#fb7185' }} />
        </motion.div>
        <h2 style={{ fontSize: 36, fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-text)', marginBottom: 8 }}>{result.percentage}%</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 6 }}>{result.score} out of {result.total} correct</p>
        <p style={{ fontSize: 14, color: 'var(--color-muted)', marginBottom: 36 }}>
          {result.percentage >= 90 ? 'Outstanding!' : result.percentage >= 70 ? 'Great job!' : result.percentage >= 50 ? 'Keep practicing!' : 'Review the material and try again'}
        </p>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleGenerate}
          style={{ padding: '12px 24px', background: 'rgba(167, 139, 250, 0.1)', border: '1px solid rgba(167, 139, 250, 0.2)',
            borderRadius: 12, color: '#a78bfa', fontSize: 14, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10 }}>
          <RotateCcw style={{ width: 16, height: 16 }} /> Try Again
        </motion.button>
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const isCorrect = selectedAnswer === question.correctIndex;

  const getOptionStyle = (idx) => {
    let bg = 'rgba(12, 18, 32, 0.5)';
    let border = '1px solid rgba(120, 160, 255, 0.12)';
    if (showFeedback) {
      if (idx === question.correctIndex) { bg = 'rgba(52, 211, 153, 0.05)'; border = '1px solid rgba(52, 211, 153, 0.4)'; }
      else if (idx === selectedAnswer && !isCorrect) { bg = 'rgba(251, 113, 133, 0.05)'; border = '1px solid rgba(251, 113, 133, 0.4)'; }
    } else if (selectedAnswer === idx) { bg = 'rgba(126, 255, 245, 0.05)'; border = '1px solid rgba(126, 255, 245, 0.4)'; }
    return { background: bg, border };
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
          Question {currentQ + 1} of {quiz.questions.length}
        </span>
        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: '#7efff5' }}>
          {answers.filter((a, i) => a === quiz.questions[i]?.correctIndex).length} correct
        </span>
      </div>
      <div style={{ height: 4, background: 'rgba(12, 18, 32, 0.8)', borderRadius: 4, marginBottom: 32, overflow: 'hidden' }}>
        <motion.div style={{ height: '100%', background: 'linear-gradient(to right, #7efff5, #a78bfa)', borderRadius: 4 }}
          animate={{ width: `${((currentQ + 1) / quiz.questions.length) * 100}%` }} />
      </div>

      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.7 }}>{question.question}</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {question.options.map((option, idx) => {
          const optStyle = getOptionStyle(idx);
          return (
            <motion.button key={idx}
              whileHover={!showFeedback ? { scale: 1.01 } : {}} whileTap={!showFeedback ? { scale: 0.99 } : {}}
              onClick={() => handleAnswer(idx)} disabled={showFeedback}
              style={{
                width: '100%', padding: 16, borderRadius: 12, background: optStyle.background, border: optStyle.border,
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
                cursor: showFeedback ? 'default' : 'pointer', transition: 'all 0.2s',
              }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8, background: 'rgba(10, 15, 30, 0.8)',
                border: '1px solid rgba(120, 160, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', flexShrink: 0,
              }}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span style={{ fontSize: 14, color: 'var(--color-text)', flex: 1 }}>{option}</span>
              {showFeedback && idx === question.correctIndex && <CheckCircle style={{ width: 20, height: 20, color: '#34d399', flexShrink: 0 }} />}
              {showFeedback && idx === selectedAnswer && !isCorrect && <XCircle style={{ width: 20, height: 20, color: '#fb7185', flexShrink: 0 }} />}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {showFeedback && question.explanation && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 24, padding: 20, borderRadius: 12, background: 'rgba(167, 139, 250, 0.05)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
            <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#a78bfa', marginBottom: 6 }}>Explanation</p>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
