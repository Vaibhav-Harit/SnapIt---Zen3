import { useRef } from 'react';
import { useRipple } from '../../hooks/useRipple';

/**
 * Premium GitHub Login Button
 * Includes a shimmer effect, ripple on click, and hover glow.
 */
const GitHubButton = () => {
  const btnRef = useRef(null);
  
  // Custom hook for button ripple interaction
  useRipple(btnRef);

  return (
    <button
      ref={btnRef}
      type="button"
      className="relative w-full flex items-center justify-center gap-3 py-4 px-8 bg-gradient-btn text-white font-body text-[0.95rem] font-semibold tracking-wide border-none rounded-btn cursor-pointer overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:bg-gradient-btn-hover hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(139,92,246,0.4),0_0_0_3px_rgba(139,92,246,0.15)] active:scale-98 active:translate-y-0 group"
    >
      {/* Background Hover Glow */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* GitHub Icon with drop-shadow glow */}
      <svg className="flex-shrink-0 drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
      
      {/* Button Text */}
      <span className="relative z-[1]">Login with GitHub</span>
      
      {/* Animated Shimmer Effect */}
      <div className="absolute top-0 left-[-100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
    </button>
  );
};

export default GitHubButton;
