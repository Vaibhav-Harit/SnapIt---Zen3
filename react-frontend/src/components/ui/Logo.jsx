import { useState } from 'react';

/**
 * Logo component for snap.it
 * Includes a glitch effect on hover and a pulsing underline.
 */
const Logo = () => {
  const [isGlitching, setIsGlitching] = useState(false);

  const handleMouseEnter = () => {
    setIsGlitching(true);
    // Glitch effect duration matches CSS animation
    setTimeout(() => setIsGlitching(false), 300);
  };

  return (
    <div
      className={`text-center relative cursor-pointer group ${isGlitching ? 'animate-glitch' : ''}`}
      onMouseEnter={handleMouseEnter}
    >
      <h1 className="font-display text-[2.4rem] md:text-[3rem] font-black tracking-widest leading-none relative">
        <span className="bg-gradient-to-br from-text-primary to-accent-violet bg-clip-text text-transparent">snap</span>
        <span className="text-accent-pink shadow-[0_0_20px_rgba(236,72,153,0.6)] animate-dot-pulse">.</span>
        <span className="bg-gradient-to-br from-accent-violet to-accent-cyan bg-clip-text text-transparent">it</span>
      </h1>
      
      {/* Animated underline expanding from left */}
      <div className="h-[3px] mt-2 rounded-full bg-gradient-main scale-x-0 origin-left animate-underline" />
    </div>
  );
};

export default Logo;
