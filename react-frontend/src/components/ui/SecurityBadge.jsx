/**
 * Security badge indicating a secure connection.
 * Features a shield icon, pulsing border, and themed micro-text.
 */
const SecurityBadge = () => {
  return (
    <div className="flex items-center gap-2 relative py-2 px-4 rounded-[20px] bg-emerald-500/5 border border-emerald-500/15 group">
      {/* Badge Shield Icon with cyan-glow shadow */}
      <div className="text-accent-emerald flex drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
      
      {/* Secure Connection Text */}
      <span className="font-mono text-[0.7rem] font-medium tracking-[0.15em] uppercase text-accent-emerald">
        {">"} SECURE NEURAL CONNECTION
      </span>
      
      {/* Decorative Pulse Border Animation */}
      <div className="absolute inset-[-1px] rounded-[20px] border border-accent-emerald animate-badge-pulse pointer-events-none" />
    </div>
  );
};

export default SecurityBadge;
