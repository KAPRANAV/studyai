import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
];

export default function Sidebar() {
  return (
    <aside className="glass" style={{
      position: 'fixed',
      left: 0,
      top: 64,
      bottom: 0,
      width: 72,
      borderRight: '1px solid rgba(120, 160, 255, 0.1)',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 32,
      paddingBottom: 24,
      gap: 12,
    }}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          style={{ textDecoration: 'none' }}
        >
          {({ isActive }) => (
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: isActive ? 'rgba(126, 255, 245, 0.1)' : 'transparent',
              border: isActive ? '1px solid rgba(126, 255, 245, 0.2)' : '1px solid transparent',
              color: isActive ? '#7efff5' : 'var(--color-muted)',
              boxShadow: isActive ? '0 0 12px rgba(126, 255, 245, 0.08)' : 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}>
              <item.icon style={{ width: 18, height: 18 }} />
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  style={{
                    position: 'absolute',
                    left: -1,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: 20,
                    background: '#7efff5',
                    borderRadius: '0 4px 4px 0',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </div>
          )}
        </NavLink>
      ))}

      <div style={{ marginTop: 'auto' }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Sparkles className="animate-pulse-glow" style={{ width: 18, height: 18, color: 'rgba(167, 139, 250, 0.6)' }} />
        </div>
      </div>
    </aside>
  );
}
