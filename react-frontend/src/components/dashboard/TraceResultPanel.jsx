import React from 'react';

/**
 * TraceResultPanel
 * The right column of the dashboard that displays analysis, trace results, 
 * and generated fixes derived from Input components.
 */
const TraceResultPanel = () => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Panel Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <h3 className="text-[0.65rem] font-mono tracking-[0.3em] text-text-muted uppercase opacity-40 italic">
            Output :: Trace Result
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <span className="text-[0.55rem] font-mono text-accent-cyan tracking-widest opacity-60 uppercase">
            Sync Pending
          </span>
        </div>
      </div>

      {/* 2. Main Terminal Content Area */}
      <div className="relative group overflow-hidden">
        {/* Deep Glassmorphic Backdrop */}
        <div className="w-full min-h-[560px] bg-white/[0.01] backdrop-blur-xl rounded-2xl border border-white/5 p-6 flex flex-col gap-6 shadow-2xl relative">
          
          {/* Subtle Scanning Line Animation */}
          <div className="absolute inset-x-0 h-[1px] bg-cyan-500/10 top-0 animate-scan pointer-events-none" />

          {/* Terminal Controls Bar */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/20 border border-cyan-500/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/20 border border-cyan-500/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/20 border border-cyan-500/10" />
              </div>
              <span className="text-[0.55rem] font-mono text-accent-cyan opacity-40 tracking-widest uppercase">
                Diagnostic Node :: 7392-FX
              </span>
            </div>
            <button className="text-[0.55rem] font-mono text-text-muted hover:text-accent-cyan transition-colors uppercase tracking-[0.2em] opacity-40 hover:opacity-100 flex items-center gap-1.5">
              <span>Copy Trace</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>

          {/* Simulated Code/Log Content (Empty State) */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            
            {/* Background Circuit Decoration (Matching the top status bar) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none overflow-hidden">
               <div className="w-[120%] h-[120%] border border-accent-cyan rounded-full animate-spin-slow blur-[1px]" />
               <div className="absolute w-[80%] h-[80%] border border-accent-cyan rounded-full animate-reverse-spin-slow blur-[1px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-5 text-center px-8">
              <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-accent-cyan/20 group-hover:text-accent-cyan/50 transition-all duration-700 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
                </svg>
              </div>
              
              <div className="space-y-1">
                <p className="text-[0.65rem] font-mono text-text-muted opacity-20 uppercase tracking-[0.4em] select-none">
                  Awaiting Input Payload
                </p>
                <div className="flex items-center justify-center gap-1.5">
                   <div className="h-0.5 w-8 bg-cyan-500/10" />
                   <div className="h-1 w-1 rounded-full bg-cyan-500/20" />
                   <div className="h-0.5 w-8 bg-cyan-500/10" />
                </div>
              </div>
            </div>
          </div>

          {/* Console Footer Metadata */}
          <div className="flex items-center justify-between text-[0.55rem] font-mono text-text-muted opacity-30 select-none">
            <div className="flex gap-4">
              <span>LATENCY: ---MS</span>
              <span>MEM: 0.00MB</span>
            </div>
            <span className="animate-pulse">SYS_WAITING_FOR_DATA</span>
          </div>
        </div>

        {/* Glow Effects for premium feel */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-cyan/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-accent-cyan/10 transition-all duration-700" />
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent-purple/5 blur-[60px] rounded-full pointer-events-none opacity-40" />
      </div>
    </div>
  );
};

export default TraceResultPanel;
