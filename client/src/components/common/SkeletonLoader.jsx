export function Skeleton({ className = '', style = {} }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

export function CardSkeleton() {
  return (
    <div style={{
      padding: 24,
      borderRadius: 16,
      background: 'rgba(12, 18, 32, 0.8)',
      border: '1px solid rgba(120, 160, 255, 0.12)',
    }}>
      <div className="skeleton" style={{ height: 16, width: '75%', marginBottom: 16, borderRadius: 6 }} />
      <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 10, borderRadius: 6 }} />
      <div className="skeleton" style={{ height: 12, width: '83%', marginBottom: 10, borderRadius: 6 }} />
      <div className="skeleton" style={{ height: 12, width: '66%', borderRadius: 6 }} />
    </div>
  );
}

export function DocumentSkeleton() {
  return (
    <div style={{
      padding: 20,
      borderRadius: 16,
      background: 'rgba(12, 18, 32, 0.8)',
      border: '1px solid rgba(120, 160, 255, 0.12)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div className="skeleton" style={{ height: 40, width: 40, borderRadius: 12 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 16, width: '66%', marginBottom: 10, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 12, width: '33%', borderRadius: 6 }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 10, borderRadius: 6 }} />
      <div className="skeleton" style={{ height: 12, width: '80%', borderRadius: 6 }} />
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div style={{ display: 'flex', gap: 14, padding: 16 }}>
      <div className="skeleton" style={{ height: 32, width: 32, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 12, width: '100%', borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 12, width: '80%', borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 12, width: '60%', borderRadius: 6 }} />
      </div>
    </div>
  );
}
