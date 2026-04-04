import React from 'react';

/**
 * ProjectsHub
 * A premium, glassmorphic grid representing connected GitHub repositories.
 * Each card allows entry into a dedicated debugging environment.
 */
/**
 * ProjectsHub
 * A premium, glassmorphic grid representing connected GitHub repositories.
 * Now includes professional metadata and a selection callback.
 */
const ProjectsHub = ({ onSelectRepo }) => {
  const dummyRepos = [
    { 
      name: 'snap-it-core', 
      lastSync: '2 hours ago', 
      hasErrors: true, 
      language: 'TypeScript', 
      branch: 'main', 
      stars: '1.2k' 
    },
    { 
      name: 'auth-service', 
      lastSync: '5 hours ago', 
      hasErrors: false, 
      language: 'Go', 
      branch: 'develop', 
      stars: '840' 
    },
    { 
      name: 'payment-gateway', 
      lastSync: '1 day ago', 
      hasErrors: true, 
      language: 'Python', 
      branch: 'hotfix/api-v2', 
      stars: '3.4k' 
    }
  ];

  const getLanguageColor = (lang) => {
    switch (lang) {
      case 'TypeScript': return 'text-blue-400 border-blue-400/20 bg-blue-400/5';
      case 'Go': return 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5';
      case 'Python': return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5';
      default: return 'text-gray-400 border-gray-400/20 bg-gray-400/5';
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-10 overflow-y-auto scrollbar-hide animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-wide">
            Connected Projects
          </h2>
          <p className="text-gray-400 text-sm mt-3 font-medium opacity-80">
            Select a repository to enter its dedicated debugging environment and enable PR automation.
          </p>
        </div>
      </div>

      {/* Repository Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dummyRepos.map((repo) => (
          <div 
            key={repo.name}
            onClick={() => onSelectRepo && onSelectRepo(repo)}
            className="group relative bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/5 p-6 cursor-pointer transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(34,211,238,0.1)] hover:-translate-y-1.5 overflow-hidden active:scale-[0.98]"
          >
            {/* Hover Accent Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl z-0" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              {/* Top Row: Meta & GitHub Header */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 group-hover:text-white group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                    </svg>
                  </div>
                  
                  {/* Language Tag */}
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${getLanguageColor(repo.language)}`}>
                    {repo.language}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-mono font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                    {repo.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>
                    </svg>
                    <span>{repo.branch}</span>
                    <span className="opacity-20">•</span>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500/60">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <span>{repo.stars}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Sync Stats & Error Status */}
              <div className="flex justify-between items-center pt-5 border-t border-white/5">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.15em] opacity-60">
                   Synced {repo.lastSync}
                </span>

                <div className="flex items-center gap-2">
                  {repo.hasErrors ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse" />
                      <span className="text-[10px] uppercase font-heavy text-red-500 tracking-widest font-black">
                        Active Fixes
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 group-hover:bg-green-500/20 transition-all">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                      <span className="text-[10px] uppercase font-heavy text-green-500 tracking-widest font-black">
                         Stable
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Animated Bottom Line on Hover */}
            <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500 group-hover:w-full transition-all duration-700 ease-out" />
          </div>
        ))}
      </div>

      {/* Floating Technical Decor */}
      <div className="fixed bottom-8 right-10 flex gap-12 font-mono text-[10px] uppercase tracking-[0.3em] opacity-20 pointer-events-none text-text-muted">
        <div>Asset Layer :: 0x7F2</div>
        <div>Neural Map :: Synced</div>
      </div>
    </div>
  );
};

export default ProjectsHub;
