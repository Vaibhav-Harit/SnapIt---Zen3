import React from 'react';

/**
 * DebugContextInput
 * A terminal-styled textarea for pasting stack traces, code snippets,
 * or bug descriptions. Sits beneath the VisionOcrUploader in the
 * left input column.
 */
const DebugContextInput = () => {
  return (
    <div
      className="
        w-full
        bg-white/[0.02] backdrop-blur-md
        rounded-2xl border border-white/5
        p-5
        flex flex-col gap-3
      "
    >

      {/* ── Header ── */}
      <div className="flex items-center justify-between">

        {/* Title cluster */}
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs text-accent-purple opacity-80 select-none">
            &gt;_
          </span>
          <h4 className="text-xs font-semibold text-gray-300 tracking-wider uppercase select-none">
            Context Input
          </h4>
        </div>

        {/* Decorative window-control dots */}
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/40 opacity-70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40 opacity-70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/40 opacity-70" />
        </div>
      </div>

      {/* ── Text Area ── */}
      <textarea
        className="
          w-full min-h-[140px] flex-1
          bg-black/50 rounded-xl border border-white/10
          p-4 shadow-inner

          font-mono text-sm text-gray-200 leading-relaxed
          placeholder:text-gray-600

          resize-y
          focus:outline-none focus:border-cyan-500/50
          focus:ring-1 focus:ring-cyan-500/50
          transition-all duration-300
        "
        placeholder="Describe the bug, paste code, or drop terminal logs here..."
      />
    </div>
  );
};

export default DebugContextInput;
