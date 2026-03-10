import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Trash2, ArrowRight, Upload } from 'lucide-react';
import GlowCard from '@/components/common/GlowCard';
import TiltCard from '@/components/common/TiltCard';
import { DocumentSkeleton } from '@/components/common/SkeletonLoader';

export default function RecentDocuments({ documents, loading, onDelete, onUploadClick }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: 18, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 20 }}>
          Recent Documents
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {[1, 2, 3].map(i => <DocumentSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)' }}>
          Recent Documents
        </h2>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onUploadClick}
          className="btn-primary"
          style={{ width: 'auto', padding: '10px 20px' }}
        >
          <Upload style={{ width: 16, height: 16 }} /> Upload PDF
        </motion.button>
      </div>

      {documents.length === 0 ? (
        <GlowCard glowColor="purple" style={{ padding: '56px 32px', textAlign: 'center' }}>
          <FileText style={{ width: 48, height: 48, color: 'var(--color-muted)', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
            No documents yet
          </h3>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
            Upload your first PDF to get started
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-secondary"
            onClick={onUploadClick}
            style={{ width: 'auto', padding: '10px 24px', display: 'inline-flex' }}
          >
            Upload your first document
          </motion.button>
        </GlowCard>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {documents.map((doc, i) => (
            <motion.div
              key={doc._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <TiltCard intensity={5}>
                <GlowCard style={{ padding: 20, height: '100%', cursor: 'pointer' }}>
                  <div
                    onClick={() => navigate(`/study/${doc._id}`)}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}
                  >
                    <div style={{
                      padding: 10,
                      borderRadius: 12,
                      background: 'rgba(126, 255, 245, 0.1)',
                      border: '1px solid rgba(126, 255, 245, 0.15)',
                      flexShrink: 0,
                    }}>
                      <FileText style={{ width: 20, height: 20, color: '#7efff5' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {doc.title}
                      </h3>
                      <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 6 }}>
                        {doc.pageCount} pages &middot; {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <ArrowRight style={{ width: 16, height: 16, color: 'var(--color-muted)', flexShrink: 0, marginTop: 2 }} />
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: '1px solid rgba(120, 160, 255, 0.08)',
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(doc._id);
                      }}
                      style={{
                        padding: 6,
                        borderRadius: 8,
                        color: 'var(--color-muted)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Trash2 style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </GlowCard>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
