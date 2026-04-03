import { useTerminal } from '../../hooks/useTerminal';

/**
 * Terminal UI Footer with typing effect.
 * Cycles through various system initialization messages.
 */
const TerminalFooter = () => {
  // Terminal Status Messages
  const messages = [
    'initializing neural debugger...',
    'connecting to AI engine...',
    'scanning repositories...',
    'compiling intelligence matrix...',
    'ready for deployment.',
    'snap.it v2.0 loaded.',
    'awaiting developer authentication...',
  ];

  // Custom hook for realistic terminal typing interaction
  const displayText = useTerminal(messages);

  return (
    <div className="flex items-center gap-[6px] font-mono text-[0.7rem] text-text-muted mt-1">
      {/* Dynamic Terminal Prompt */}
      <span className="text-accent-purple">~$</span>
      
      {/* Render typed text with purple blinking cursor */}
      <span className="text-text-secondary">{displayText}</span>
      <span className="text-accent-purple animate-cursor">▌</span>
    </div>
  );
};

export default TerminalFooter;
