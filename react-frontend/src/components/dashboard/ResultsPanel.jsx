import React from 'react';

/**
 * CodeOutputEditor
 * Top block of the ResultsPanel. Displays the generated fix or analysis.
 */
const CodeOutputEditor = () => {
  const dummyCode = ``;

  return (
    <div className="w-full flex-1 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 flex flex-col overflow-hidden min-h-[350px] shadow-2xl">
      {/* Header Bar */}
      <div className="bg-black/40 px-4 py-3 border-b border-white/5 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
           <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase select-none">
             Generated Solution
           </span>
        </div>
        <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-all group active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span className="font-medium">Copy Code</span>
        </button>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-auto p-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <pre className="text-sm font-mono leading-relaxed text-gray-300">
          <code className="block whitespace-pre">
            {dummyCode.split('\n').map((line, i) => (
              <div key={i} className="flex gap-4">
                <span className="w-4 text-right text-gray-600 select-none">{i + 1}</span>
                <span className={line.startsWith('//') ? 'text-gray-500 italic' : line.includes('const') || line.includes('async') || line.includes('await') ? 'text-purple-400' : line.includes('try') || line.includes('catch') ? 'text-cyan-400' : 'text-gray-300'}>
                  {line}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

/**
 * RefinementChatBox
 * Middle block of the ResultsPanel. Allows user to refine the AI output.
 */
const RefinementChatBox = () => {
  return (
    <div className="w-full bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-4 shadow-xl">
      <div className="flex items-center gap-3 bg-black/40 rounded-xl p-2 border border-white/5 group focus-within:border-purple-500/30 transition-all duration-300">
        <div className="pl-2 text-purple-400/50 group-focus-within:text-purple-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <input 
          type="text" 
          placeholder='Modify this code (e.g., "Refactor to use async/await")...'
          className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none px-2 py-1.5"
        />
        <button className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white transition-all transform active:scale-90 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

/**
 * ResolutionActions
 * Bottom row of buttons for finalizing the solution.
 * Conditionally shows PR action only in project-linked mode.
 */
const ResolutionActions = ({ isProjectMode = false }) => {
  return (
    <div className="w-full flex sm:flex-row flex-col gap-4 pt-2">
      {/* Primary: GitHub PR - Only shown in dedicated Project environment */}
      {isProjectMode && (
        <button className="flex-1 py-3.5 rounded-xl font-medium text-sm text-white bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300 flex justify-center items-center gap-2.5 group shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
          </svg>
          <span>Create Branch & PR</span>
        </button>
      )}

      {/* Secondary: Resolve - Stretches to 100% if PR button is hidden */}
      <button className="flex-1 py-3.5 rounded-xl font-medium text-sm text-gray-400 bg-transparent border border-white/5 hover:border-green-500/50 hover:text-green-400 hover:bg-green-500/5 transition-all duration-300 flex justify-center items-center gap-2.5 group">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>Mark as Resolved</span>
      </button>
    </div>
  );
};

/**
 * ResultsPanel
 * The entire Right Column container stacking the Code Output, Chat Box, and Actions.
 */
const ResultsPanel = ({ isProjectMode = false }) => {
  return (
    <div className="flex flex-col gap-5 h-full">
      <CodeOutputEditor />
      <RefinementChatBox />
      <ResolutionActions isProjectMode={isProjectMode} />
    </div>
  );
};

export default ResultsPanel;
