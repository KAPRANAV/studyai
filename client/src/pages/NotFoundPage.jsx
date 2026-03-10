import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/common/PageTransition';

export default function NotFoundPage() {
  return (
    <PageTransition className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="text-center">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[120px] font-heading font-extrabold text-gradient leading-none mb-5"
        >
          404
        </motion.h1>
        <p className="text-xl text-text-secondary mb-10">
          This page got lost in the study session
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-mint/10 border border-mint/20 rounded-xl text-mint text-sm font-medium hover:bg-mint/15 hover:border-mint/30 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </PageTransition>
  );
}
