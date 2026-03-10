import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAI } from '@/hooks/useAI';
import { Sparkles, ChevronLeft, ChevronRight, Shuffle, RotateCcw, Loader2, Layers } from 'lucide-react';

export default function FlashcardsTab({ documentId, cards, onCardsUpdate }) {
  const { generateFlashcards, loading } = useAI();
  const actualCards = cards || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset position when cards change
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards]);

  const handleGenerate = async () => {
    try {
      const result = await generateFlashcards(documentId);
      onCardsUpdate(result);
    } catch {
      // handled in hook
    }
  };

  const nextCard = useCallback(() => {
    if (currentIndex < actualCards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  }, [currentIndex, actualCards.length]);

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  }, [currentIndex]);

  const shuffleCards = () => {
    const shuffled = [...actualCards].sort(() => Math.random() - 0.5);
    onCardsUpdate(shuffled);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') nextCard();
      else if (e.key === 'ArrowLeft') prevCard();
      else if (e.key === ' ') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextCard, prevCard]);

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#7efff5' }}>
          <Loader2 style={{ width: 20, height: 20 }} className="animate-spin" />
          <span style={{ fontSize: 14, fontWeight: 500 }}>Creating flashcards...</span>
        </div>
        <div className="skeleton" style={{ height: 240, width: '100%', borderRadius: 16 }} />
      </div>
    );
  }

  if (actualCards.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 400, padding: '48px 32px', textAlign: 'center',
      }}>
        <Layers style={{ width: 48, height: 48, color: '#fb7185', marginBottom: 20 }} />
        <h3 style={{ fontSize: 18, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
          Flashcards
        </h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
          AI will create flashcards from your document
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGenerate}
          style={{
            padding: '12px 24px', background: 'rgba(251, 113, 133, 0.1)',
            border: '1px solid rgba(251, 113, 133, 0.2)', borderRadius: 12,
            color: '#fb7185', fontSize: 14, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          <Sparkles style={{ width: 16, height: 16 }} /> Generate Flashcards
        </motion.button>
      </div>
    );
  }

  const card = actualCards[currentIndex];

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', minHeight: 500 }}>
      {/* Progress header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
          {currentIndex + 1} / {actualCards.length}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={shuffleCards} title="Shuffle"
            style={{ padding: 8, borderRadius: 12, color: 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Shuffle style={{ width: 16, height: 16 }} />
          </button>
          <button onClick={handleGenerate} title="Regenerate"
            style={{ padding: 8, borderRadius: 12, color: 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <RotateCcw style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'rgba(12, 18, 32, 0.8)', borderRadius: 4, marginBottom: 32, overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(to right, #7efff5, #a78bfa)', borderRadius: 4 }}
          animate={{ width: `${((currentIndex + 1) / actualCards.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{ width: '100%', maxWidth: 500, cursor: 'pointer', perspective: 1000 }}
          onClick={() => setIsFlipped(prev => !prev)}
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
            style={{ transformStyle: 'preserve-3d', position: 'relative', height: 260 }}
          >
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 32, borderRadius: 16, background: 'rgba(12, 18, 32, 0.8)',
              border: '1px solid rgba(120, 160, 255, 0.12)', textAlign: 'center', backfaceVisibility: 'hidden',
            }}>
              <div>
                <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#7efff5', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Question</p>
                <p style={{ fontSize: 16, color: 'var(--color-text)', lineHeight: 1.7 }}>{card.front}</p>
              </div>
            </div>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 32, borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(126, 255, 245, 0.05), rgba(167, 139, 250, 0.05))',
              border: '1px solid rgba(126, 255, 245, 0.2)', textAlign: 'center',
              backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
            }}>
              <div>
                <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#a78bfa', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Answer</p>
                <p style={{ fontSize: 16, color: 'var(--color-text)', lineHeight: 1.7 }}>{card.back}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 32 }}>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={prevCard} disabled={currentIndex === 0}
          style={{ padding: 12, borderRadius: 12, background: 'rgba(12, 18, 32, 0.8)', border: '1px solid rgba(120, 160, 255, 0.12)',
            color: 'var(--color-text)', cursor: currentIndex === 0 ? 'default' : 'pointer', opacity: currentIndex === 0 ? 0.3 : 1 }}>
          <ChevronLeft style={{ width: 20, height: 20 }} />
        </motion.button>
        <span style={{ fontSize: 12, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
          Space to flip &middot; Arrows to navigate
        </span>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={nextCard} disabled={currentIndex === actualCards.length - 1}
          style={{ padding: 12, borderRadius: 12, background: 'rgba(12, 18, 32, 0.8)', border: '1px solid rgba(120, 160, 255, 0.12)',
            color: 'var(--color-text)', cursor: currentIndex === actualCards.length - 1 ? 'default' : 'pointer', opacity: currentIndex === actualCards.length - 1 ? 0.3 : 1 }}>
          <ChevronRight style={{ width: 20, height: 20 }} />
        </motion.button>
      </div>
    </div>
  );
}
