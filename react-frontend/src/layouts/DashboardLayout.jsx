import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';

/**
 * DashboardLayout
 * The master shell for the application after login.
 * Includes a premium glassmorphic sidebar and a main canvas area.
 */
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-[#0a0a0f] text-text-primary font-body overflow-x-hidden">
      
      {/* Premium Glass Sidebar */}
      <Sidebar />

      {/* Main Canvas Placeholder - flexible container to the right */}
      <main className="flex-1 ml-72 relative min-h-screen">
        
        {/* Subtle Background Glow for Dashboard Canvas */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-5%] w-[300px] h-[300px] bg-accent-cyan/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Content Rendered Here */}
        <div className="relative z-10 w-full h-full">
          {children}
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
