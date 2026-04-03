import { useRef } from 'react';
import { useParticles } from '../hooks/useParticles';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  useParticles(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};

export default ParticleBackground;
