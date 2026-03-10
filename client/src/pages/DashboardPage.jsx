import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDocuments } from '@/hooks/useDocuments';
import { useProgress } from '@/hooks/useProgress';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import StatsOverview from '@/components/dashboard/StatsOverview';
import RecentDocuments from '@/components/dashboard/RecentDocuments';
import StudyChart from '@/components/dashboard/StudyChart';
import UploadModal from '@/components/dashboard/UploadModal';
import ParticleBackground from '@/components/three/ParticleBackground';
import PageTransition from '@/components/common/PageTransition';
import gsap from 'gsap';

export default function DashboardPage() {
  const { user } = useAuth();
  const { documents, loading, fetchDocuments, uploadDocument, deleteDocument } = useDocuments();
  const { progress, fetchProgress } = useProgress();
  const [showUpload, setShowUpload] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
    fetchProgress();
  }, [fetchDocuments, fetchProgress]);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('[data-animate]');
    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
    );
  }, [documents, progress]);

  const handleUploadClose = (doc) => {
    setShowUpload(false);
    if (doc?._id) {
      navigate(`/study/${doc._id}`);
    }
  };

  return (
    <PageTransition>
      <ParticleBackground />
      <div ref={containerRef} className="relative z-10" style={{
        padding: '32px 32px',
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>
        <div data-animate>
          <WelcomeCard user={user} progress={progress} />
        </div>

        <div data-animate style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
        }}>
          <StatsOverview progress={progress} documentCount={documents.length} />
        </div>

        <div data-animate>
          <StudyChart progress={progress} />
        </div>

        <div data-animate>
          <RecentDocuments
            documents={documents}
            loading={loading}
            onDelete={deleteDocument}
            onUploadClick={() => setShowUpload(true)}
          />
        </div>
      </div>

      <UploadModal
        isOpen={showUpload}
        onClose={handleUploadClose}
        onUpload={uploadDocument}
      />
    </PageTransition>
  );
}
