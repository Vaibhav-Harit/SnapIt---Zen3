import React from 'react';

/**
 * SnapItButton
 * Primary CTA for the left input column.
 * Triggers the debugging / analysis pipeline.
 */
const SnapItButton = () => {
  return (
    /* ── Primary Action Button ── */
    <button
      className="
        w-full h-14 rounded-xl
        flex items-center justify-center gap-2

        bg-gradient-to-r from-purple-600/90 to-cyan-600/90
        border border-white/10
        shadow-lg

        text-base font-bold text-white tracking-widest uppercase
        select-none cursor-pointer

        hover:from-purple-500 hover:to-cyan-500
        hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]
        hover:-translate-y-0.5

        active:translate-y-0 active:scale-[0.98]

        transition-all duration-300
      "
    >
      {/* Lightning Bolt Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>

      Snap it
    </button>
  );
};

export default SnapItButton;
