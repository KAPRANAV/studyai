import { motion } from 'framer-motion';
import { FileText, Brain, Target, Clock } from 'lucide-react';
import GlowCard from '@/components/common/GlowCard';

const stats = [
  { key: 'totalDocuments', label: 'Documents', icon: FileText, color: '#7efff5', bg: 'rgba(126, 255, 245, 0.1)' },
  { key: 'totalSessions', label: 'Study Sessions', icon: Clock, color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)' },
  { key: 'quizzesTaken', label: 'Quizzes Taken', icon: Brain, color: '#fb7185', bg: 'rgba(251, 113, 133, 0.1)' },
  { key: 'avgScore', label: 'Avg Score', icon: Target, color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
];

export default function StatsOverview({ progress, documentCount }) {
  const quizScores = progress?.quizScores || [];
  const avgScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((a, b) => a + (b.score / b.total * 100), 0) / quizScores.length)
    : 0;

  const values = {
    totalDocuments: documentCount || progress?.totalDocuments || 0,
    totalSessions: progress?.totalSessions || 0,
    quizzesTaken: quizScores.length,
    avgScore: `${avgScore}%`,
  };

  return (
    <>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.key}
          data-animate
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
        >
          <GlowCard style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                padding: 12,
                borderRadius: 12,
                background: stat.bg,
              }}>
                <stat.icon style={{ width: 20, height: 20, color: stat.color }} />
              </div>
              <div>
                <p style={{
                  fontSize: 24,
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  color: 'var(--color-text)',
                  lineHeight: 1,
                }}>
                  {values[stat.key]}
                </p>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                  {stat.label}
                </p>
              </div>
            </div>
          </GlowCard>
        </motion.div>
      ))}
    </>
  );
}
