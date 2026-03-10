import { useState, useCallback } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function useQuiz() {
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState(null);

  const submitQuiz = useCallback(async (quizId, answers) => {
    setSubmitting(true);
    try {
      const res = await api.post('/quiz/submit', { quizId, answers });
      toast.success(`Score: ${res.data.result.percentage}%`);
      return res.data.result;
    } catch (error) {
      toast.error('Failed to submit quiz');
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const getHistory = useCallback(async (docId) => {
    try {
      const res = await api.get(`/quiz/history/${docId}`);
      setHistory(res.data.quiz);
      return res.data.quiz;
    } catch (error) {
      return null;
    }
  }, []);

  return { submitting, history, submitQuiz, getHistory };
}
