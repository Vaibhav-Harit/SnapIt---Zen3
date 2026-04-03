/**
 * Status indicator for system online state.
 * Includes a pulsing dot and micro-text.
 */
const StatusIndicator = () => {
  return (
    <div className="flex items-center gap-2 self-start mb-[-8px]">
      {/* Emerald dot with pulsing shadow effect */}
      <span className="w-[6px] h-[6px] rounded-full bg-accent-emerald shadow-[0_0_8px_var(--color-accent-emerald)] animate-status-pulse" />
      <span className="font-mono text-[0.6rem] tracking-[0.2em] text-accent-emerald uppercase">SYSTEM ONLINE</span>
    </div>
  );
};

export default StatusIndicator;
