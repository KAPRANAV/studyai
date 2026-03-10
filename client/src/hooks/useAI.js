import { useState, useCallback } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function useAI() {
  const [loading, setLoading] = useState(false);

  const generateNotes = useCallback(async (docId) => {
    setLoading(true);
    try {
      const res = await api.post(`/ai/notes/${docId}`);
      return res.data.smartNote || res.data.notes;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to generate notes';
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateQuiz = useCallback(async (docId, numQuestions = 10) => {
    setLoading(true);
    try {
      const res = await api.post(`/ai/quiz/${docId}`, { numQuestions });
      return res.data.quiz;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to generate quiz';
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const chat = useCallback(async (docId, message) => {
    try {
      const res = await api.post(`/ai/chat/${docId}`, { message });
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to get response';
      toast.error(msg);
      throw error;
    }
  }, []);

  const generateFlashcards = useCallback(async (docId) => {
    setLoading(true);
    try {
      const res = await api.post(`/ai/flashcards/${docId}`);
      return res.data.flashcards;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to generate flashcards';
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateSummary = useCallback(async (docId) => {
    setLoading(true);
    try {
      const res = await api.post(`/ai/summarize/${docId}`);
      return res.data.summary;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to generate summary';
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, generateNotes, generateQuiz, chat, generateFlashcards, generateSummary };
}
