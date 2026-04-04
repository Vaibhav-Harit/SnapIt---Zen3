import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import VisionOcrUploader from '../components/dashboard/VisionOcrUploader';

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

      {/* Main Canvas Placeholder - flexible container to the right */}
      <main className="flex-1 ml-72 relative min-h-screen">
        
        {/* Subtle Background Glow for Dashboard Canvas */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-5%] w-[300px] h-[300px] bg-accent-cyan/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Padding Wrapper for Main Content Area */}
        <div className="p-10 relative z-10 w-full min-h-screen flex flex-col gap-10">
          
          {/* 1. Core Network Status Banner (Rebuilt) */}
          <div className="w-full h-32 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)] flex items-center justify-between p-6 relative overflow-hidden">
            
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Input Panel (Vision OCR) */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[0.65rem] font-mono tracking-[0.3em] text-text-muted uppercase opacity-40 italic">Input :: Neural Stream</h3>
                <div className="flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-accent-purple animate-pulse" />
                   <span className="text-[0.55rem] font-mono text-accent-purple tracking-widest opacity-60 uppercase">Vision Active</span>
                </div>
              </div>
              <VisionOcrUploader />
            </div>

            {/* Output Console Placeholder */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[0.65rem] font-mono tracking-[0.3em] text-text-muted uppercase opacity-40 italic">Output :: Trace Result</h3>
                <div className="flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-accent-cyan animate-pulse" />
                   <span className="text-[0.55rem] font-mono text-accent-cyan tracking-widest opacity-60 uppercase">Sync Pending</span>
                </div>
              </div>
              <div className="border border-dashed border-white/10 rounded-2xl min-h-[500px] flex items-center justify-center bg-white/[0.01]">
                <span className="text-[0.65rem] font-mono text-text-muted opacity-20 uppercase tracking-[0.3em]">
                  Output Console Placeholder
                </span>
              </div>
            </div>
            
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
