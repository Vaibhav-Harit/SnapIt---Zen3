import StatusIndicator from './ui/StatusIndicator';
import Logo from './ui/Logo';
import GitHubButton from './ui/GitHubButton';
import TerminalFooter from './ui/TerminalFooter';
import { useIntersection } from '../hooks/useIntersection';

/**
 * Premium glassmorphic login card.
 * Assembles various UI sub-components and handles entrance animations.
 */
const LoginCard = ({ onLogin }) => {
  // Hook for triggering entry animation when card enters viewport
  const [ref, isVisible] = useIntersection();

  return (
    <div
      ref={ref}
      className={`relative z-[2] w-full p-[48px_40px_36px] glass rounded-card flex flex-col items-center gap-6 transition-all duration-1000 ${isVisible ? 'animate-card-entrance opacity-100' : 'opacity-0 translate-y-10'} overflow-hidden`}
    >
      {/* ... decorative elements removed for brevity in this view ... */}
      
      <StatusIndicator />
      
      <Logo />

      {/* New Punchy Tagline */}
      <div className={`text-[1.1rem] font-normal text-text-secondary text-center leading-[1.6] tracking-tight transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        Snap the error, vault the fix, ship the code.
      </div>

      <GitHubButton onClick={onLogin} />

      <TerminalFooter />
    </div>
  );
};

export default LoginCard;
