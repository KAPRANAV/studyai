import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import StudyRoomPage from '@/pages/StudyRoomPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProtectedRoute from '@/components/common/ProtectedRoute';

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0c1220',
            color: '#e2e8f8',
            border: '1px solid rgba(120,160,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Outfit, sans-serif',
          },
          success: {
            iconTheme: { primary: '#7efff5', secondary: '#0c1220' },
          },
          error: {
            iconTheme: { primary: '#fb7185', secondary: '#0c1220' },
          },
        }}
      />
      <div className="film-grain">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/study/:documentId" element={<StudyRoomPage />} />
              </Route>
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </AuthProvider>
  );
}

export default App;
