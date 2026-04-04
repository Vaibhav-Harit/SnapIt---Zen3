import React from 'react';

/**
 * ResolutionModal
 * Triggers after marking an issue as resolved.
 * Asks the user to save the fix into their AI's Global Memory for future reference.
 */
const ResolutionModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Background Overlay with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="
        relative z-10 w-full max-w-md 
        bg-[#0a0a0f] rounded-2xl border border-purple-500/30 p-8 
        shadow-[0_0_50px_rgba(168,85,247,0.25)] 
        flex flex-col items-center text-center 
        overflow-hidden animate-in fade-in zoom-in duration-300
      ">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" />

        {/* Top Icon: Glowing Brain Layer */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="48" height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-purple-400 relative z-10"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <path d="M7.5 4.21l4.5 2.6 4.5-2.6"/>
            <path d="M7.5 19.79l4.5-2.6 4.5 2.6"/>
            <path d="M3.27 6.96L12 12.01l8.73-5.05"/>
            <path d="M12 22.08V12"/>
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white tracking-wide mb-2">
          Issue Resolved
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-400 leading-relaxed max-w-[320px] mb-8">
          Would you like to index this fix into your <span className="text-purple-400 font-semibold tracking-wide">Global Memory</span>? 
          Snap.it will use this to instantly solve similar issues across all your projects in the future.
        </p>

        {/* Action Buttons */}
        <div className="w-full flex gap-4">
          <button 
            onClick={onClose}
            className="
              flex-1 py-3.5 rounded-xl border border-white/10 
              text-gray-400 font-medium text-sm
              hover:bg-white/5 hover:text-white 
              transition-all duration-200 active:scale-95
            "
          >
            Just Close
          </button>
          
          <button 
            onClick={onSave}
            className="
              flex-1 py-3.5 rounded-xl 
              bg-gradient-to-r from-purple-600 to-cyan-500 
              text-white font-bold text-sm tracking-wide
              hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]
              hover:brightness-110
              transition-all duration-200 active:scale-95
            "
          >
            Save to Memory
          </button>
        </div>

        {/* Floating Technical Decor */}
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-cyan-500/5 blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};

export default ResolutionModal;
