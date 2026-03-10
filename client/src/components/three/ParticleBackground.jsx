import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import FloatingParticles from './FloatingParticles';

export default function ParticleBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <Suspense fallback={null}>
          <FloatingParticles count={1500} />
        </Suspense>
      </Canvas>
    </div>
  );
}
