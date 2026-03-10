import { useState, useCallback } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function useProgress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/progress');
      setProgress(res.data.progress);
      return res.data.progress;
    } catch (error) {
      toast.error('Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, []);

  const recordSession = useCallback(async (documentId) => {
    try {
      const res = await api.put('/progress/session', { documentId });
      setProgress(res.data.progress);
    } catch (error) {
      // Silent fail for session tracking
    }
  }, []);

  return { progress, loading, fetchProgress, recordSession };
}
