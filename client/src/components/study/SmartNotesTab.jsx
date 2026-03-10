import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAI } from '@/hooks/useAI';
import { Sparkles, ChevronDown, ChevronRight, Copy, Loader2, BookOpen } from 'lucide-react';
import GlowCard from '@/components/common/GlowCard';
import toast from 'react-hot-toast';

export default function SmartNotesTab({ documentId, notes, onNotesUpdate }) {
  const { generateNotes, loading } = useAI();
  const [expandedSections, setExpandedSections] = useState({});

  const handleGenerate = async () => {
    try {
      const result = await generateNotes(documentId);
      onNotesUpdate(result);
    } catch {
      // handled in hook
    }
  };

  const toggleSection = (idx) => {
    setExpandedSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const copyAll = () => {
    if (!notes) return;
    let text = `TL;DR: ${notes.tldr || ''}\n\n`;
    (notes.sections || []).forEach(s => {
      text += `## ${s.heading}\n`;
      (s.bullets || []).forEach(b => { text += `- ${b}\n`; });
      text += '\n';
    });
    navigator.clipboard.writeText(text);
    toast.success('Notes copied!');
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#7efff5' }}>
          <Loader2 style={{ width: 20, height: 20 }} className="animate-spin" />
          <span style={{ fontSize: 14, fontWeight: 500 }}>Generating smart notes...</span>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="skeleton" style={{ height: 20, width: '33%', borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 12, width: '100%', borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 12, width: '83%', borderRadius: 6 }} />
          </div>
        ))}
      </div>
    );
  }

  if (!notes) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 400, padding: '48px 32px', textAlign: 'center',
      }}>
        <BookOpen style={{ width: 48, height: 48, color: '#a78bfa', marginBottom: 20 }} />
        <h3 style={{ fontSize: 18, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
          Smart Notes
        </h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
          AI will analyze your document and create structured study notes
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGenerate}
          style={{
            padding: '12px 24px',
            background: 'rgba(167, 139, 250, 0.1)',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            borderRadius: 12,
            color: '#a78bfa',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Sparkles style={{ width: 16, height: 16 }} /> Generate Notes
        </motion.button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 16, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)' }}>
          Smart Notes
        </h3>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={copyAll} title="Copy all"
            style={{ padding: 8, borderRadius: 12, color: 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Copy style={{ width: 16, height: 16 }} />
          </button>
          <button onClick={handleGenerate} title="Regenerate"
            style={{ padding: 8, borderRadius: 12, color: 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Sparkles style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {notes.tldr && (
        <GlowCard glowColor="mint" style={{ padding: 24 }}>
          <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#7efff5', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            TL;DR
          </p>
          <p style={{ fontSize: 15, color: 'var(--color-text)', lineHeight: 1.7 }}>{notes.tldr}</p>
        </GlowCard>
      )}

      {(notes.sections || []).map((section, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          style={{ border: '1px solid rgba(120, 160, 255, 0.12)', borderRadius: 12, overflow: 'hidden' }}
        >
          <button onClick={() => toggleSection(idx)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 16,
              textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)',
            }}>
            {expandedSections[idx]
              ? <ChevronDown style={{ width: 16, height: 16, color: '#7efff5', flexShrink: 0 }} />
              : <ChevronRight style={{ width: 16, height: 16, color: 'var(--color-muted)', flexShrink: 0 }} />
            }
            <span style={{ fontSize: 15, fontWeight: 600 }}>{section.heading}</span>
          </button>

          <AnimatePresence>
            {expandedSections[idx] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(section.bullets || []).map((bullet, bi) => (
                    <p key={bi} style={{ fontSize: 14, color: 'var(--color-text-secondary)', paddingLeft: 24, position: 'relative', lineHeight: 1.7 }}>
                      <span style={{ position: 'absolute', left: 0, color: '#7efff5' }}>&#x2022;</span>
                      {bullet}
                    </p>
                  ))}
                  {section.keyTerms && section.keyTerms.length > 0 && (
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16, paddingTop: 16,
                      borderTop: '1px solid rgba(120, 160, 255, 0.08)',
                    }}>
                      {section.keyTerms.map((term, ti) => (
                        <span key={ti} style={{
                          padding: '4px 10px', fontSize: 12, fontFamily: 'var(--font-mono)',
                          background: 'rgba(126, 255, 245, 0.1)', color: '#7efff5',
                          borderRadius: 8, border: '1px solid rgba(126, 255, 245, 0.15)',
                        }}>
                          {term}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
