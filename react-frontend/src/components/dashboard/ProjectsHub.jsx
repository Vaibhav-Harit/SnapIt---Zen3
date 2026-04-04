import React from 'react';

/**
 * ProjectsHub
 * A premium, glassmorphic grid representing connected GitHub repositories.
 * Each card allows entry into a dedicated debugging environment.
 */
const ProjectsHub = () => {
  const dummyRepos = [
    { name: 'snap-it-core', lastSync: '2 hours ago', hasErrors: true },
    { name: 'auth-service', lastSync: '5 hours ago', hasErrors: false },
    { name: 'payment-gateway', lastSync: '1 day ago', hasErrors: true },
    { name: 'user-profile-api', lastSync: '3 hours ago', hasErrors: false },
    { name: 'analytics-dashboard', lastSync: '12 mins ago', hasErrors: false },
  ];

  return (
    <div className="w-full h-full flex flex-col p-10 overflow-y-auto scrollbar-hide">
      
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Connected Projects
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Select a repository to enter its dedicated debugging environment
          </p>
        </div>
        
        {/* Import Action Button */}
        <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Import New Repo
        </button>
      </div>

      {/* Repository Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        {dummyRepos.map((repo) => (
          <div 
            key={repo.name}
            className="group relative bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-6 cursor-pointer transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:-translate-y-1 overflow-hidden"
          >
            {/* Background Accent Glow (on hover) */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl z-0" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              {/* Top Row: GitHub Icon & Repo Name */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                </div>
                <h3 className="text-lg font-mono font-medium text-cyan-400 tracking-tight group-hover:text-cyan-300 transition-colors">
                  {repo.name}
                </h3>
              </div>

              {/* Bottom Row: Sync Stats & Error Status */}
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-xs text-gray-500 font-medium">
                  Last synced: {repo.lastSync}
                </span>

                <div className="flex items-center gap-2">
                  {repo.hasErrors ? (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
                      <span className="text-[10px] items-center uppercase font-bold text-red-500 tracking-wider">
                        Active Issues
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[10px] uppercase font-bold text-green-500 tracking-wider">
                         Stable
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsHub;
