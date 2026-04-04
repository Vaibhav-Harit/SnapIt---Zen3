import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import DebugContextInput from '../components/dashboard/DebugContextInput';
import SnapItButton from '../components/dashboard/SnapItButton';
import ResultsPanel from '../components/dashboard/ResultsPanel';
import VisionOcrUploader from '../components/dashboard/VisionOcrUploader';
import ProjectsHub from '../components/dashboard/ProjectsHub';

/**
 * DashboardLayout
 * The master shell for the application after login.
 * Includes a premium glassmorphic sidebar and a main canvas area.
 */
const DashboardLayout = ({ children, onLogout }) => {
  const [currentView, setCurrentView] = useState('workbench'); // 'workbench' | 'projects' | 'memory'
  const [activeRepo, setActiveRepo] = useState(null);

  const handleSelectRepo = (repo) => {
    setActiveRepo(repo);
    setCurrentView('workbench');
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0a0a0f] text-text-primary font-body overflow-x-hidden">
      
      {/* Premium Glass Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          if (view === 'workbench') setActiveRepo(null);
          setCurrentView(view);
        }} 
        onLogout={onLogout} 
      />

      {/* Main Canvas - Scrollable container to the right of fixed sidebar */}
      <main className="flex-1 ml-72 relative h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
        
        {/* Subtle Background Glow for Dashboard Canvas */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-5%] w-[300px] h-[300px] bg-accent-cyan/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Padding Wrapper for Main Content Area */}
        <div className="p-4 md:p-6 lg:p-8 relative z-10 w-full min-h-full flex flex-col gap-6 pb-12">
          
          {/* Header Banner - Common across views */}
          <div className="w-full h-20 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)] flex items-center justify-between p-3 relative overflow-hidden">
            <div className="flex flex-col ml-4">
              <h2 className="text-text-primary font-medium tracking-[0.3em] uppercase text-[10px] z-10 select-none opacity-60">
                Core Network Status
              </h2>
              <div className="text-white font-mono text-xs mt-1 z-10">
                {activeRepo ? (
                  <span className="text-cyan-400">ACTIVE PROJECT :: {activeRepo.name.toUpperCase()}</span>
                ) : (
                  <span className="text-gray-500 italic">LOCAL WORKSPACE :: scratching...</span>
                )}
              </div>
            </div>

            {/* Middle Circuit Visuals */}
            <div className="flex-1 flex flex-col justify-center gap-3 px-12 z-10 opacity-60">
              <div className="h-[2px] w-full bg-accent-cyan shadow-[0_0_10px_#22d3ee]" />
              <div className="h-[2px] w-[80%] bg-accent-purple shadow-[0_0_10px_#a855f7] ml-auto" />
            </div>

            {/* Right Asset Node Placeholder */}
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center z-10 shrink-0 backdrop-blur-xl">
              <span className="text-[10px] font-mono text-accent-purple uppercase tracking-widest font-bold">
                {activeRepo ? 'SYNC' : 'LOCAL'}
              </span>
            </div>
          </div>

          {/* View Conditional Rendering */}
          {currentView === 'workbench' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500">
              {/* ── Left Input Column ── */}
              <div className="w-full flex flex-col gap-4">
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

                <VisionOcrUploader compact={true} />
                <DebugContextInput />
                <SnapItButton />
              </div>

              {/* Output Panel (Results) - Receives isProjectMode */}
              <ResultsPanel isProjectMode={!!activeRepo} />
            </div>
          ) : currentView === 'projects' ? (
            <ProjectsHub onSelectRepo={handleSelectRepo} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 font-mono italic">
              View coming soon...
            </div>
          )}

          {/* Legacy Children Rendering (If any) */}
          <div className="w-full">
            {children}
          </div>
        </div>

        {/* Floating Technical Trace Decor */}
        <div className="fixed bottom-5 right-5 font-mono text-[0.6rem] tracking-[0.2em] text-text-muted opacity-30 select-none pointer-events-none">
          SYSTEM LAYER :: 0x0A // {activeRepo ? activeRepo.name.toUpperCase() : 'LOCAL'} :: READY
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
