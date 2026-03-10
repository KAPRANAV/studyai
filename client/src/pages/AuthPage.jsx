import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import ParticleBackground from '@/components/three/ParticleBackground';
import PageTransition from '@/components/common/PageTransition';
import { BookOpen } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ padding: '48px 24px' }}
      >
        <ParticleBackground />

        <div className="relative z-10 w-full" style={{ maxWidth: 440 }}>
          {/* Logo */}
          <div className="flex items-center justify-center" style={{ gap: 16, marginBottom: 40 }}>
            <div style={{
              padding: 14,
              borderRadius: 16,
              background: 'rgba(126, 255, 245, 0.08)',
              border: '1px solid rgba(126, 255, 245, 0.15)',
            }}>
              <BookOpen style={{ width: 32, height: 32, color: '#7efff5' }} />
            </div>
            <h1 className="text-gradient" style={{
              fontSize: 40,
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
            }}>
              StudyAI
            </h1>
          </div>

          {/* Form Card */}
          <div className="glass-strong" style={{ borderRadius: 20, padding: '40px 36px' }}>
            <AnimatePresence mode="wait">
              {isLogin ? (
                <LoginForm key="login" onSwitch={() => setIsLogin(false)} />
              ) : (
                <RegisterForm key="register" onSwitch={() => setIsLogin(true)} />
              )}
            </AnimatePresence>
          </div>

          <p style={{
            textAlign: 'center',
            fontSize: 12,
            color: 'var(--color-muted)',
            marginTop: 32,
            letterSpacing: '0.05em',
          }}>
            Powered by AI &middot; Learn smarter, not harder
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
