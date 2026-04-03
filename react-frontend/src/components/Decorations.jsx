/**
 * Static UI decoration components for the landing page.
 * Includes fixed scanlines, grid overlays, and corner ornaments.
 */
const Decorations = () => {
  return (
    <>
      {/* Dynamic Grid Background Overlay */}
      <div className="fixed inset-0 z-0 bg-grid pointer-events-none" />
      
      {/* Moving Scanline Visual Effect */}
      <div className="fixed top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-40 z-[100] animate-scanline pointer-events-none" />
      
      {/* Corner Brackets Decorations */}
      <div className="fixed w-[60px] h-[60px] z-10 pointer-events-none top-5 left-5 border-t-2 border-l-2 border-accent-purple opacity-40 transition-opacity hover:opacity-100" />
      <div className="fixed w-[60px] h-[60px] z-10 pointer-events-none top-5 right-5 border-t-2 border-r-2 border-accent-pink opacity-40 transition-opacity hover:opacity-100" />
      <div className="fixed w-[60px] h-[60px] z-10 pointer-events-none bottom-5 left-5 border-b-2 border-l-2 border-accent-cyan opacity-40 transition-opacity hover:opacity-100" />
      <div className="fixed w-[60px] h-[60px] z-10 pointer-events-none bottom-5 right-5 border-b-2 border-r-2 border-accent-emerald opacity-40 transition-opacity hover:opacity-100" />

      {/* Version and Build Information Tag */}
      <div className="fixed bottom-7 left-1/2 -translate-x-1/2 font-mono text-[0.65rem] tracking-[0.15em] text-text-muted opacity-50 z-10 select-none">
        v2.0.26 // DEMO BUILD
      </div>
    </>
  );
};

export default Decorations;
