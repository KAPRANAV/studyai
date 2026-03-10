import { motion } from 'framer-motion';
import { Flame, Sparkles } from 'lucide-react';
import GlowCard from '@/components/common/GlowCard';

export default function WelcomeCard({ user, progress }) {
  const streak = progress?.studyStreak || user?.streak || 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <GlowCard glowColor="mint" style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: 28,
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              color: 'var(--color-text)',
              marginBottom: 8,
            }}
          >
            {greeting},{' '}
            <span className="text-gradient">{user?.name?.split(' ')[0] || 'Student'}</span>
          </motion.h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles style={{ width: 16, height: 16, color: '#a78bfa' }} />
            Ready to learn something new today?
          </p>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(251, 113, 133, 0.1), rgba(251, 113, 133, 0.05))',
            border: '1px solid rgba(251, 113, 133, 0.2)',
            flexShrink: 0,
          }}
        >
          <Flame style={{ width: 24, height: 24, color: '#fb7185' }} />
          <div>
            <p style={{ fontSize: 24, fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#fb7185', lineHeight: 1 }}>
              {streak}
            </p>
            <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>Day Streak</p>
          </div>
        </motion.div>
      </div>
    </GlowCard>
  );
}
