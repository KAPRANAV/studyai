import { motion } from 'framer-motion';

const sizes = {
  sm: { width: 20, height: 20 },
  md: { width: 32, height: 32 },
  lg: { width: 48, height: 48 },
};

export default function LoadingSpinner({ size = 'md', text }) {
  const dims = sizes[size];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <motion.div
        style={{
          ...dims,
          border: '2px solid rgba(120, 160, 255, 0.12)',
          borderRadius: '50%',
          borderTopColor: '#7efff5',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{text}</p>
      )}
    </div>
  );
}
