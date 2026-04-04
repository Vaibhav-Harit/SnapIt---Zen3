import { useRef } from 'react';
import LoginCard from './LoginCard';
import { useTilt } from '../hooks/useTilt';

/**
 * Login section containing the 3D tilt card and background orbs.
 * Separates decorative elements and layout logic.
 */
const LoginSection = ({ onLogin }) => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  
  // Custom hook for premium card tilt interaction
  useTilt(cardRef, sectionRef);

  return (
    <section 
      ref={sectionRef} 
      id="login-section" 
      className="flex-1 flex items-center justify-center relative min-h-screen max-w-full lg:max-w-[45%] w-full"
    >
      {/* Background Floating Orbs */}
      <div className="absolute rounded-full blur-[80px] pointer-events-none z-0 w-[300px] h-[300px] bg-accent-purple/15 top-[10%] right-[10%] animate-orb-1" />
      <div className="absolute rounded-full blur-[80px] pointer-events-none z-0 w-[200px] h-[200px] bg-accent-pink/10 bottom-[20%] left-[5%] animate-orb-2" />
      <div className="absolute rounded-full blur-[80px] pointer-events-none z-0 w-[150px] h-[150px] bg-accent-cyan/8 top-[50%] right-[30%] animate-orb-3" />

      {/* Tilt-wrapped Login Card */}
      <div 
        ref={cardRef} 
        className="w-full max-w-[420px] px-5 sm:px-0 transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        <LoginCard onLogin={onLogin} />
      </div>

      {/* Decorative Technical Labels (Visible only on desktop) */}
      <div className="hidden lg:block absolute font-mono text-[0.6rem] tracking-[0.2em] text-text-muted opacity-35 pointer-events-none z-[1] top-[15%] right-[8%] animate-label">
        AI ENGINE v3.2
      </div>
      <div className="hidden lg:block absolute font-mono text-[0.6rem] tracking-[0.2em] text-text-muted opacity-35 pointer-events-none z-[1] bottom-[30%] right-[5%] animate-label reverse">
        NEURAL NET
      </div>
      <div className="hidden lg:block absolute font-mono text-[0.6rem] tracking-[0.2em] text-text-muted opacity-35 pointer-events-none z-[1] bottom-[15%] left-[10%] animate-label">
        QUANTUM LINK
      </div>
    </section>
  );
};

export default LoginSection;
