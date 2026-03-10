import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass" style={{ height: 64 }}>
      <div style={{
        height: '100%',
        maxWidth: 1800,
        margin: '0 auto',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <motion.div
            whileHover={{ rotate: 12 }}
            style={{
              padding: 8,
              borderRadius: 12,
              background: 'rgba(126, 255, 245, 0.1)',
              border: '1px solid rgba(126, 255, 245, 0.2)',
            }}
          >
            <BookOpen style={{ width: 20, height: 20, color: '#7efff5' }} />
          </motion.div>
          <span className="text-gradient" style={{
            fontSize: 22,
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
          }}>
            StudyAI
          </span>
        </Link>

        {/* User section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 16px',
            borderRadius: 12,
            background: 'rgba(12, 18, 32, 0.6)',
            border: '1px solid rgba(120, 160, 255, 0.12)',
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(167, 139, 250, 0.15)',
              border: '1px solid rgba(167, 139, 250, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <User style={{ width: 16, height: 16, color: '#a78bfa' }} />
            </div>
            <span style={{
              fontSize: 14,
              color: 'var(--color-text)',
              fontWeight: 500,
              maxWidth: 120,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {user?.name || 'User'}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            title="Logout"
            style={{
              padding: 10,
              borderRadius: 12,
              background: 'rgba(12, 18, 32, 0.6)',
              border: '1px solid rgba(120, 160, 255, 0.12)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <LogOut style={{ width: 16, height: 16, color: 'var(--color-muted)' }} />
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
