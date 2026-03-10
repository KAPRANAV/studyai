import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 className="text-gradient" style={{
          fontSize: 26,
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          marginBottom: 8,
        }}>
          Welcome Back
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Sign in to continue your learning journey
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        <div style={{ position: 'relative' }}>
          <Mail className="form-icon" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div style={{ position: 'relative' }}>
          <Lock className="form-icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="form-input"
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="btn-primary"
      >
        {loading ? (
          <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" />
        ) : (
          <>
            Sign In <ArrowRight style={{ width: 16, height: 16 }} />
          </>
        )}
      </motion.button>

      <p style={{
        textAlign: 'center',
        fontSize: 14,
        color: 'var(--color-text-secondary)',
        marginTop: 24,
      }}>
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          style={{
            color: 'var(--color-mint)',
            fontWeight: 500,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 'inherit',
          }}
        >
          Sign up
        </button>
      </p>
    </motion.form>
  );
}
