import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDocuments } from '@/hooks/useDocuments';
import { useProgress } from '@/hooks/useProgress';
import PageTransition from '@/components/common/PageTransition';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import SmartNotesTab from '@/components/study/SmartNotesTab';
import FlashcardsTab from '@/components/study/FlashcardsTab';
import QuizTab from '@/components/study/QuizTab';
import AiTutorTab from '@/components/study/AiTutorTab';
import ProgressTab from '@/components/study/ProgressTab';
import {
  FileText, ArrowLeft, Hash, Type,
  BookOpen, Layers, Brain, MessageSquare, BarChart3,
} from 'lucide-react';
import { STUDY_TABS } from '@/lib/constants';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const tabs = [
  { id: STUDY_TABS.DOCUMENT, label: 'Document', icon: FileText, color: '#7efff5' },
  { id: STUDY_TABS.NOTES, label: 'Notes', icon: BookOpen, color: '#a78bfa' },
  { id: STUDY_TABS.FLASHCARDS, label: 'Cards', icon: Layers, color: '#fb7185' },
  { id: STUDY_TABS.QUIZ, label: 'Quiz', icon: Brain, color: '#7efff5' },
  { id: STUDY_TABS.TUTOR, label: 'Tutor', icon: MessageSquare, color: '#a78bfa' },
  { id: STUDY_TABS.PROGRESS, label: 'Stats', icon: BarChart3, color: '#34d399' },
];

export default function StudyRoomPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { getDocument } = useDocuments();
  const { recordSession } = useProgress();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(STUDY_TABS.DOCUMENT);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Lifted state — persists across tab switches
  const [notes, setNotes] = useState(null);
  const [flashcards, setFlashcards] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  // Fetch document + all existing study data on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const doc = await getDocument(documentId);
        setDocument(doc);
        recordSession(documentId);

        // Fetch all existing data in parallel (fail silently for each)
        const [notesRes, flashcardsRes, chatRes, quizRes] = await Promise.allSettled([
          api.get(`/ai/notes/${documentId}`),
          api.get(`/ai/flashcards/${documentId}`),
          api.get(`/ai/chat/${documentId}`),
          api.get(`/ai/quiz/${documentId}`),
        ]);

        if (notesRes.status === 'fulfilled' && notesRes.value.data.notes) {
          setNotes(notesRes.value.data.notes);
        }
        if (flashcardsRes.status === 'fulfilled' && flashcardsRes.value.data.flashcards) {
          setFlashcards(flashcardsRes.value.data.flashcards);
        }
        if (chatRes.status === 'fulfilled' && chatRes.value.data.messages?.length > 0) {
          setChatMessages(chatRes.value.data.messages);
        }
        if (quizRes.status === 'fulfilled' && quizRes.value.data.quiz) {
          setQuiz(quizRes.value.data.quiz);
        }
      } catch (err) {
        setError('Document not found');
        toast.error('Document not found');
      } finally {
        setLoading(false);
      }
    };

    if (documentId) fetchAll();
  }, [documentId]);

  // Fetch the raw PDF file as a blob URL for the viewer
  useEffect(() => {
    let blobUrl = null;
    const fetchPdf = async () => {
      try {
        const res = await api.get(`/documents/${documentId}/file`, { responseType: 'blob' });
        blobUrl = URL.createObjectURL(res.data);
        setPdfUrl(blobUrl);
      } catch {
        // Silently fail — text fallback will show
      }
    };
    if (documentId) fetchPdf();
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [documentId]);

  const handleNotesUpdate = useCallback((newNotes) => setNotes(newNotes), []);
  const handleFlashcardsUpdate = useCallback((newCards) => setFlashcards(newCards), []);
  const handleQuizUpdate = useCallback((newQuiz) => setQuiz(newQuiz), []);
  const handleChatMessagesUpdate = useCallback((newMessages) => setChatMessages(newMessages), []);

  const renderContent = () => {
    switch (activeTab) {
      case STUDY_TABS.DOCUMENT:
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="PDF Viewer"
                style={{
                  width: '100%',
                  maxWidth: 900,
                  height: '100%',
                  border: 'none',
                  background: '#2a2a2a',
                  borderRadius: 0,
                }}
              />
            ) : (
              <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px', width: '100%' }}>
                {document?.content ? (
                  document.content.split('\n\n').map((paragraph, i) => (
                    paragraph.trim() && (
                      <p key={i} style={{
                        fontSize: 15, color: 'var(--color-text-secondary)',
                        lineHeight: 1.8, marginBottom: 20,
                      }}>
                        {paragraph}
                      </p>
                    )
                  ))
                ) : (
                  <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 48 }}>
                    No content available
                  </p>
                )}
              </div>
            )}
          </div>
        );
      case STUDY_TABS.NOTES:
        return (
          <SmartNotesTab
            documentId={documentId}
            notes={notes}
            onNotesUpdate={handleNotesUpdate}
          />
        );
      case STUDY_TABS.FLASHCARDS:
        return (
          <FlashcardsTab
            documentId={documentId}
            cards={flashcards}
            onCardsUpdate={handleFlashcardsUpdate}
          />
        );
      case STUDY_TABS.QUIZ:
        return (
          <QuizTab
            documentId={documentId}
            quiz={quiz}
            onQuizUpdate={handleQuizUpdate}
          />
        );
      case STUDY_TABS.TUTOR:
        return (
          <AiTutorTab
            documentId={documentId}
            messages={chatMessages}
            onMessagesUpdate={handleChatMessagesUpdate}
          />
        );
      case STUDY_TABS.PROGRESS:
        return <ProgressTab documentId={documentId} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)' }}>
        <LoadingSpinner size="lg" text="Loading document..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)', gap: 20 }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '10px 20px',
            background: 'rgba(12, 18, 32, 0.8)',
            border: '1px solid rgba(120, 160, 255, 0.12)',
            borderRadius: 12,
            color: '#7efff5',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <PageTransition style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{
        height: 56,
        borderBottom: '1px solid rgba(120, 160, 255, 0.12)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 16,
        background: 'rgba(10, 15, 30, 0.5)',
        backdropFilter: 'blur(8px)',
        flexShrink: 0,
      }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          style={{ padding: 8, borderRadius: 12, background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer' }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <FileText style={{ width: 16, height: 16, color: '#7efff5', flexShrink: 0 }} />
          <h1 style={{
            fontSize: 14, fontWeight: 600, color: 'var(--color-text)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {document?.title || 'Untitled'}
          </h1>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--color-muted)' }}>
          {document?.pageCount && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Hash style={{ width: 12, height: 12 }} /> {document.pageCount} pages
            </span>
          )}
          {document?.content && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Type style={{ width: 12, height: 12 }} /> {Math.round(document.content.split(/\s+/).length / 1000)}k words
            </span>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(120, 160, 255, 0.12)',
        background: 'rgba(10, 15, 30, 0.3)',
        padding: '0 24px',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 20px',
                position: 'relative',
                transition: 'all 0.2s',
                background: 'transparent',
                border: 'none',
                color: isActive ? tab.color : 'var(--color-muted)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
              }}
            >
              <tab.icon style={{ width: 15, height: 15 }} />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="study-tab-indicator"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 8,
                    right: 8,
                    height: 2,
                    background: tab.color,
                    borderRadius: 2,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {renderContent()}
      </div>
    </PageTransition>
  );
}
