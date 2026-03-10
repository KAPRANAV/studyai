import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import GlowCard from '@/components/common/GlowCard';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--color-card)',
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

export default function StudyChart({ progress }) {
  const quizScores = progress?.quizScores || [];

  const chartData = quizScores.slice(-10).map((qs, i) => ({
    name: `Q${i + 1}`,
    score: Math.round((qs.score / qs.total) * 100),
  }));

  if (chartData.length === 0) {
    return (
      <GlowCard glowColor="purple" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 14, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 20 }}>
          Quiz Performance
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Take your first quiz to see your performance chart
        </div>
      </GlowCard>
    );
  }

  return (
    <GlowCard glowColor="purple" style={{ padding: 28 }}>
      <h3 style={{ fontSize: 14, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 20 }}>
        Quiz Performance
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,160,255,0.06)" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: 'rgba(120,160,255,0.1)' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: 'rgba(120,160,255,0.1)' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(126,255,245,0.05)' }} />
          <Bar
            dataKey="score"
            fill="#7efff5"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </GlowCard>
  );
}
