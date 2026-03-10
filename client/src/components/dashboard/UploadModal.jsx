import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader2, CheckCircle } from 'lucide-react';
import { MAX_FILE_SIZE } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (f) => {
    if (f.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted');
      return false;
    }
    if (f.size > MAX_FILE_SIZE) {
      toast.error('File must be under 10MB');
      return false;
    }
    return true;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f && validateFile(f)) setFile(f);
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && validateFile(f)) setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const doc = await onUpload(file);
      setFile(null);
      onClose(doc);
    } catch {
      // Error handled in hook
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !uploading && onClose()}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          padding: 16,
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-strong"
          style={{ width: '100%', maxWidth: 520, borderRadius: 20, padding: 32 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <h2 style={{ fontSize: 20, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)' }}>
              Upload Document
            </h2>
            <button
              onClick={() => !uploading && onClose()}
              style={{
                padding: 8,
                borderRadius: 12,
                background: 'none',
                border: 'none',
                color: 'var(--color-muted)',
                cursor: 'pointer',
              }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              position: 'relative',
              border: `2px dashed ${dragActive ? 'rgba(126, 255, 245, 0.5)' : 'rgba(120, 160, 255, 0.15)'}`,
              borderRadius: 16,
              padding: 48,
              textAlign: 'center',
              transition: 'all 0.2s',
              background: dragActive ? 'rgba(126, 255, 245, 0.05)' : 'transparent',
            }}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
            {file ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <CheckCircle style={{ width: 44, height: 44, color: '#34d399' }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>{file.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 6 }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <Upload style={{ width: 44, height: 44, color: dragActive ? '#7efff5' : 'var(--color-muted)' }} />
                <div>
                  <p style={{ fontSize: 14, color: 'var(--color-text)' }}>Drag & drop your PDF here</p>
                  <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 6 }}>or click to browse (max 10MB)</p>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
            <button
              onClick={() => !uploading && onClose()}
              disabled={uploading}
              style={{
                padding: '10px 20px',
                fontSize: 14,
                color: 'var(--color-text-secondary)',
                background: 'none',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              disabled={!file || uploading}
              className="btn-primary"
              style={{ width: 'auto', padding: '10px 24px' }}
            >
              {uploading ? (
                <>
                  <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Upload style={{ width: 16, height: 16 }} /> Upload & Analyze
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
