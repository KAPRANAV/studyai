import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterForm({ onSwitch }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
    } catch {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
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
          Create Account
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Start your AI-powered learning journey
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        <div style={{ position: 'relative' }}>
          <User className="form-icon" />
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
        </div>

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
            placeholder="Password (min 6 characters)"
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
        className="btn-secondary"
      >
        {loading ? (
          <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" />
        ) : (
          <>
            Create Account <ArrowRight style={{ width: 16, height: 16 }} />
          </>
        )}
      </motion.button>

      <p style={{
        textAlign: 'center',
        fontSize: 14,
        color: 'var(--color-text-secondary)',
        marginTop: 24,
      }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          style={{
            color: 'var(--color-purple)',
            fontWeight: 500,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 'inherit',
          }}
        >
          Sign in
        </button>
      </p>
    </motion.form>
  );
}
