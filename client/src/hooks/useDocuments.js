import { useState, useCallback } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/documents');
      setDocuments(res.data.documents);
    } catch (error) {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Document uploaded!');
      setDocuments(prev => [res.data.document, ...prev]);
      return res.data.document;
    } catch (error) {
      const msg = error.response?.data?.message || 'Upload failed';
      toast.error(msg);
      throw error;
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(prev => prev.filter(d => d._id !== id));
      toast.success('Document deleted');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  }, []);

  const getDocument = useCallback(async (id) => {
    try {
      const res = await api.get(`/documents/${id}`);
      return res.data.document;
    } catch (error) {
      toast.error('Failed to load document');
      throw error;
    }
  }, []);

  return { documents, loading, uploading, fetchDocuments, uploadDocument, deleteDocument, getDocument };
}
