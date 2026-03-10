import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import { MAX_FILE_SIZE } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function UploadTab({ onUpload, hasDocument }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleFile = async (file) => {
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File must be under 10MB');
      return;
    }
    setUploading(true);
    try {
      await onUpload(file);
    } catch {
      // handled in hook
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  if (hasDocument) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', padding: '48px 32px', textAlign: 'center',
      }}>
        <CheckCircle style={{ width: 48, height: 48, color: '#34d399', marginBottom: 20 }} />
        <h3 style={{ fontSize: 18, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
          Document Loaded
        </h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          Your document is ready. Use the other tabs to study!
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 28, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          width: '100%',
          border: `2px dashed ${dragActive ? 'rgba(126, 255, 245, 0.5)' : 'rgba(120, 160, 255, 0.15)'}`,
          borderRadius: 16,
          padding: 56,
          textAlign: 'center',
          transition: 'all 0.2s',
          background: dragActive ? 'rgba(126, 255, 245, 0.05)' : 'transparent',
        }}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
          disabled={uploading}
        />
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <Loader2 style={{ width: 48, height: 48, color: '#7efff5' }} className="animate-spin" />
            <div>
              <p style={{ color: 'var(--color-text)', fontWeight: 500 }}>Analyzing with AI...</p>
              <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 6 }}>Extracting text from your PDF</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Upload style={{ width: 48, height: 48, color: '#7efff5' }} />
            </motion.div>
            <div>
              <p style={{ color: 'var(--color-text)', fontWeight: 500 }}>Drop your PDF here</p>
              <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 6 }}>or click to browse (max 10MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
