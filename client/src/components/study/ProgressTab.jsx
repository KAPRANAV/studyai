import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useProgress } from '@/hooks/useProgress';
import { useQuiz } from '@/hooks/useQuiz';
import { Target, Clock, Brain, Trophy } from 'lucide-react';
import GlowCard from '@/components/common/GlowCard';

const colorMap = {
  mint: { text: '#7efff5', bg: 'rgba(126, 255, 245, 0.1)' },
  purple: { text: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)' },
  coral: { text: '#fb7185', bg: 'rgba(251, 113, 133, 0.1)' },
  emerald: { text: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(12, 18, 32, 0.95)',
        border: '1px solid rgba(120, 160, 255, 0.12)',
        borderRadius: 12,
        padding: '10px 16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#7efff5' }}>{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function ProgressTab({ documentId }) {
  const { progress, loading, fetchProgress } = useProgress();
  const { history, getHistory } = useQuiz();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchProgress();
    if (documentId) getHistory(documentId);
  }, [documentId, fetchProgress, getHistory]);

  useEffect(() => {
    if (history?.attempts) {
      setChartData(
        history.attempts.map((a, i) => ({
          name: `Attempt ${i + 1}`,
          score: a.percentage || Math.round((a.score / a.total) * 100),
        }))
      );
    }
  }, [history]);

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skeleton" style={{ height: 80, width: '100%', borderRadius: 12 }} />
        ))}
      </div>
    );
  }

  const quizScores = progress?.quizScores || [];
  const avgScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((a, b) => a + (b.score / b.total * 100), 0) / quizScores.length)
    : 0;

  const stats = [
    { label: 'Study Sessions', value: progress?.totalSessions || 0, icon: Clock, color: 'mint' },
    { label: 'Quizzes Taken', value: quizScores.length, icon: Brain, color: 'purple' },
    { label: 'Avg Score', value: `${avgScore}%`, icon: Target, color: 'coral' },
    { label: 'Study Streak', value: `${progress?.studyStreak || 0} days`, icon: Trophy, color: 'emerald' },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h3 style={{ fontSize: 16, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)' }}>
        Progress
      </h3>

      {/* Stats grid — 4 columns for full-width layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {stats.map((stat, i) => {
          const colors = colorMap[stat.color] || colorMap.mint;
          return (
            <GlowCard key={i} glowColor={stat.color === 'emerald' ? 'mint' : stat.color} style={{ padding: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
                <div style={{ padding: 10, borderRadius: 12, background: colors.bg }}>
                  <stat.icon style={{ width: 18, height: 18, color: colors.text }} />
                </div>
                <div>
                  <p style={{ fontSize: 20, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4 }}>{stat.label}</p>
                </div>
              </div>
            </GlowCard>
          );
        })}
      </div>

      {/* Quiz history chart */}
      {chartData.length > 0 && (
        <GlowCard glowColor="purple" style={{ padding: 20 }}>
          <h4 style={{ fontSize: 13, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>
            Quiz Score History
          </h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,160,255,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" fill="#a78bfa" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </GlowCard>
      )}

      {/* Topics mastered */}
      {progress?.topicsMastered?.length > 0 && (
        <GlowCard glowColor="mint" style={{ padding: 20 }}>
          <h4 style={{ fontSize: 13, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>
            Topics Mastered
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {progress.topicsMastered.map((topic, i) => (
              <span key={i} style={{
                padding: '4px 10px', fontSize: 12, fontFamily: 'var(--font-mono)',
                background: 'rgba(126, 255, 245, 0.1)', color: '#7efff5',
                borderRadius: 8, border: '1px solid rgba(126, 255, 245, 0.15)',
              }}>
                {topic}
              </span>
            ))}
          </div>
        </GlowCard>
      )}
    </div>
  );
}
