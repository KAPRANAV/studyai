import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAI } from '@/hooks/useAI';
import { Send, Bot, User, Loader2, MessageSquare, Sparkles } from 'lucide-react';

const suggestedQuestions = [
  'Summarize the key concepts',
  'What are the main takeaways?',
  'Explain the most important topic',
];

export default function AiTutorTab({ documentId, messages, onMessagesUpdate }) {
  const { chat } = useAI();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg = { role: 'user', content: msg };
    const updated = [...messages, userMsg];
    onMessagesUpdate(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await chat(documentId, msg);
      const assistantMsg = { role: 'assistant', content: res.message || res.response };
      onMessagesUpdate([...updated, assistantMsg]);
    } catch {
      onMessagesUpdate([...updated, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const inputStyle = {
    flex: 1,
    padding: '12px 16px',
    background: 'rgba(4, 6, 15, 0.6)',
    border: '1px solid rgba(120, 160, 255, 0.15)',
    borderRadius: 12,
    fontSize: 14,
    color: 'var(--color-text)',
    outline: 'none',
    fontFamily: 'var(--font-body)',
  };

  const sendBtnStyle = {
    padding: 12,
    background: 'rgba(126, 255, 245, 0.1)',
    border: '1px solid rgba(126, 255, 245, 0.2)',
    borderRadius: 12,
    color: '#7efff5',
    cursor: 'pointer',
  };

  if (messages.length === 0 && !loading) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '48px 32px', textAlign: 'center',
        }}>
          <MessageSquare style={{ width: 48, height: 48, color: '#7efff5', marginBottom: 20 }} />
          <h3 style={{ fontSize: 18, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
            AI Tutor
          </h3>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
            Ask questions about your document
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {suggestedQuestions.map((q, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => sendMessage(q)}
                style={{
                  padding: '10px 16px',
                  fontSize: 12,
                  background: 'rgba(12, 18, 32, 0.8)',
                  border: '1px solid rgba(120, 160, 255, 0.12)',
                  borderRadius: 12,
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <Sparkles style={{ width: 12, height: 12, display: 'inline', marginRight: 6 }} />{q}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div style={{ padding: 20, borderTop: '1px solid rgba(120, 160, 255, 0.12)' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your document..."
              style={inputStyle}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              style={{ ...sendBtnStyle, opacity: !input.trim() ? 0.3 : 1 }}
            >
              <Send style={{ width: 16, height: 16 }} />
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Badge */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid rgba(120, 160, 255, 0.12)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <Bot style={{ width: 16, height: 16, color: '#7efff5' }} />
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Answers based on your document</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              gap: 12,
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              background: msg.role === 'user' ? 'rgba(167, 139, 250, 0.15)' : 'rgba(126, 255, 245, 0.15)',
            }}>
              {msg.role === 'user'
                ? <User style={{ width: 14, height: 14, color: '#a78bfa' }} />
                : <Bot style={{ width: 14, height: 14, color: '#7efff5' }} />
              }
            </div>
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: 16,
              fontSize: 14,
              lineHeight: 1.6,
              ...(msg.role === 'user'
                ? {
                    background: 'rgba(167, 139, 250, 0.1)',
                    border: '1px solid rgba(167, 139, 250, 0.15)',
                    color: 'var(--color-text)',
                    borderBottomRightRadius: 6,
                  }
                : {
                    background: 'rgba(12, 18, 32, 0.8)',
                    border: '1px solid rgba(120, 160, 255, 0.12)',
                    color: 'var(--color-text-secondary)',
                    borderBottomLeftRadius: 6,
                  }
              ),
            }}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 12, padding: 16 }}>
            <div className="skeleton" style={{ height: 32, width: 32, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="skeleton" style={{ height: 12, width: '100%', borderRadius: 6 }} />
              <div className="skeleton" style={{ height: 12, width: '80%', borderRadius: 6 }} />
              <div className="skeleton" style={{ height: 12, width: '60%', borderRadius: 6 }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length > 0 && messages.length < 6 && !loading && (
        <div style={{ padding: '0 20px 10px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {suggestedQuestions.slice(0, 2).map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              style={{
                padding: '8px 14px',
                fontSize: 12,
                background: 'rgba(12, 18, 32, 0.8)',
                border: '1px solid rgba(120, 160, 255, 0.12)',
                borderRadius: 12,
                color: 'var(--color-muted)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: 20, borderTop: '1px solid rgba(120, 160, 255, 0.12)' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your document..."
            disabled={loading}
            style={{ ...inputStyle, opacity: loading ? 0.5 : 1 }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{ ...sendBtnStyle, opacity: (!input.trim() || loading) ? 0.3 : 1 }}
          >
            {loading ? <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> : <Send style={{ width: 16, height: 16 }} />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
