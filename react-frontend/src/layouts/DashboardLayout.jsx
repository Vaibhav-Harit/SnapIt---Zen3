import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import DebugContextInput from '../components/dashboard/DebugContextInput';
import SnapItButton from '../components/dashboard/SnapItButton';
import ResultsPanel from '../components/dashboard/ResultsPanel';

/**
 * DashboardLayout
 * The master shell for the application after login.
 * Includes a premium glassmorphic sidebar and a main canvas area.
 */
const DashboardLayout = ({ children, onLogout }) => {
  return (
    <div className="flex min-h-screen w-full bg-[#0a0a0f] text-text-primary font-body overflow-x-hidden">
      
      {/* Premium Glass Sidebar */}
      <Sidebar onLogout={onLogout} />

      {/* Main Canvas - Scrollable container to the right of fixed sidebar */}
      <main className="flex-1 ml-72 relative h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
        
        {/* Subtle Background Glow for Dashboard Canvas */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-5%] w-[300px] h-[300px] bg-accent-cyan/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Padding Wrapper for Main Content Area */}
        <div className="p-4 md:p-6 lg:p-8 relative z-10 w-full min-h-full flex flex-col gap-6 pb-12">
          
          {/* 1. Core Network Status Banner (Rebuilt) */}
          <div className="w-full h-20 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)] flex items-center justify-between p-3 relative overflow-hidden">
            
            {/* Left Metadata */}
            <h2 className="text-text-primary font-medium tracking-[0.3em] uppercase text-xs z-10 shrink-0 select-none">
              Core Network Status
            </h2>

            {/* Middle Circuit Visuals */}
            <div className="flex-1 flex flex-col justify-center gap-3 px-12 z-10 opacity-60">
              <div className="h-[2px] w-full bg-accent-cyan shadow-[0_0_10px_#22d3ee]" />
              <div className="h-[2px] w-[80%] bg-accent-purple shadow-[0_0_10px_#a855f7] ml-auto" />
              <div className="h-[1px] w-[90%] bg-accent-cyan shadow-[0_0_8px_#22d3ee] mx-auto" />
            </div>

            {/* Right Asset Node Placeholder */}
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center z-10 shrink-0 backdrop-blur-xl">
              <span className="text-[0.55rem] font-mono text-text-muted uppercase tracking-widest opacity-40">
                Asset
              </span>
            </div>

            {/* Subtle inner glow for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
          </div>

          {/* 2. Workspace Grid (Restored) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* ── Left Input Column ── */}
            <div className="w-full flex flex-col gap-4">

              {/* Column Label */}
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[0.65rem] font-mono tracking-[0.3em] text-text-muted uppercase opacity-40 italic">
                  Input :: Neural Stream
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-accent-purple animate-pulse" />
                  <span className="text-[0.55rem] font-mono text-accent-purple tracking-widest opacity-60 uppercase">
                    Vision Active
                  </span>
                </div>
              </div>

              {/* 1. Compact Vision OCR Dropzone */}
              <div className="w-full h-28 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-4 flex flex-col items-center justify-center">
                <div
                  className="
                    w-full h-full
                    border-2 border-dashed border-white/10 rounded-xl
                    hover:border-purple-500/60 hover:bg-purple-500/5
                    transition-all cursor-pointer
                    flex flex-col items-center justify-center gap-1
                  "
                >
                  {/* Camera Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    className="text-gray-500"
                  >
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                  <span className="text-sm font-medium text-white select-none">Drop images here</span>
                </div>
              </div>

              {/* 2. Debug Context Input (Terminal Textarea) */}
              <DebugContextInput />

              {/* 3. Primary Action Button */}
              <SnapItButton />
            </div>

            {/* Output Panel (Results) */}
            <ResultsPanel />
            
          </div>

          {/* Legacy Children Rendering (If any) */}
          <div className="w-full">
            {children}
          </div>
        </div>

        {/* Floating Technical Trace Decor (Matching landing page aesthetic) */}
        <div className="fixed bottom-5 right-5 font-mono text-[0.6rem] tracking-[0.2em] text-text-muted opacity-30 select-none pointer-events-none">
          SYSTEM LAYER :: 0x0A // DEBUG READY
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
