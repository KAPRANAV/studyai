import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function GlowCard({ children, className = '', glowColor = 'mint', style = {}, ...props }) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const glowColors = {
    mint: 'rgba(126, 255, 245, 0.12)',
    purple: 'rgba(167, 139, 250, 0.12)',
    coral: 'rgba(251, 113, 133, 0.12)',
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
        background: isHovered
          ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColors[glowColor]}, transparent 40%)`
          : 'rgba(12, 18, 32, 0.8)',
        border: isHovered
          ? '1px solid rgba(126, 255, 245, 0.25)'
          : '1px solid rgba(120, 160, 255, 0.12)',
        backdropFilter: 'blur(8px)',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: isHovered ? '0 0 20px rgba(126, 255, 245, 0.04)' : 'none',
        ...style,
      }}
      {...props}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </motion.div>
  );
}
