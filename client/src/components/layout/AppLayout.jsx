import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function AppLayout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh' }}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
