import StatusIndicator from './ui/StatusIndicator';
import Logo from './ui/Logo';
import GitHubButton from './ui/GitHubButton';
import TerminalFooter from './ui/TerminalFooter';
import { useIntersection } from '../hooks/useIntersection';

/**
 * Premium glassmorphic login card.
 * Assembles various UI sub-components and handles entrance animations.
 */
const LoginCard = () => {
  // Hook for triggering entry animation when card enters viewport
  const [ref, isVisible] = useIntersection();

  return (
    <div
      ref={ref}
      className={`relative z-[2] w-full p-[48px_40px_36px] glass rounded-card flex flex-col items-center gap-6 transition-all duration-1000 ${isVisible ? 'animate-card-entrance opacity-100' : 'opacity-0 translate-y-10'} overflow-hidden`}
    >
      {/* Dynamic rotating border glow */}
      <div className="absolute inset-[-2px] rounded-[calc(var(--radius-card)+2px)] bg-[conic-gradient(from_var(--border-angle,0deg),transparent_0%,var(--color-accent-purple)_10%,var(--color-accent-pink)_20%,transparent_30%,transparent_100%)] z-[-1] opacity-60 animate-border-rotate" />
      
      {/* Background glass gradient overlay */}
      <div className="absolute inset-0 rounded-card bg-gradient-card pointer-events-none z-[-1]" />

      <StatusIndicator />
      
      <Logo />

      {/* 
        New Punchy Tagline 
        Adjusted size to 1.1rem for better horizontal balance and visual weight.
        Color is tied to --text-secondary (via Tailwind mapping) as requested.
      */}
      <div className={`text-[1.1rem] font-normal text-text-secondary text-center leading-[1.6] tracking-tight transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        Snap the error, vault the fix, ship the code.
      </div>

      <GitHubButton />

      <TerminalFooter />
    </div>
  );
};

export default LoginCard;
