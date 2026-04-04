import React, { useState, useRef } from 'react';

/**
 * VisionOcrUploader
 * A sophisticated multi-image uploader with a glassmorphic aesthetic.
 * Supports image previews, removal, and 'Add More' functionality.
 */
const VisionOcrUploader = () => {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      previewUrl: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
    // Reset input so the same file can be selected again if removed
    e.target.value = '';
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      // Revoke the object URL to avoid memory leaks
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Helper for the "Embedded" Dashed Border Trick
  const embeddedBorderStyle = {
    maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)',
    WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)',
  };

  return (
    <div className="w-full bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-6 min-h-[400px] flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelection}
        className="hidden"
        multiple
        accept="image/*"
      />

      {images.length === 0 ? (
        /* State 1: Empty (Large Dropzone) */
        <div
          onClick={triggerFileInput}
          className="flex-1 flex flex-col items-center justify-center cursor-pointer group relative transition-all duration-500"
        >
          {/* The Embedded Dashed Border */}
          <div 
            className="absolute inset-0 border-2 border-dashed border-white/10 rounded-xl group-hover:border-purple-500/60 transition-colors duration-500"
            style={embeddedBorderStyle}
          />
          
          {/* Hover Glow Background */}
          <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/[0.03] rounded-xl transition-all duration-500 flex items-center justify-center">
             <div className="w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-[inset_0_0_40px_rgba(168,85,247,0.1)] rounded-xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-text-muted group-hover:text-accent-purple group-hover:border-purple-500/30 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium tracking-wider text-text-primary uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                Drop image for Vision OCR
              </p>
              <p className="text-[0.65rem] font-mono text-text-muted uppercase tracking-widest opacity-40">
                or click to browse files
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* State 2: Populated (Grid) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/[0.03] group shadow-xl">
              <img
                src={img.previewUrl}
                alt="Preview"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              
              {/* Removal Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(img.id);
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-black/60 border border-white/10 text-white/50 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 hover:text-red-500 hover:border-red-500/50 hover:shadow-[0_0_10px_rgba(239,68,68,0.4)] transition-all duration-300 z-20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              
              {/* Subtle Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}

          {/* Add More Tile */}
          <div
            onClick={triggerFileInput}
            className="relative aspect-square rounded-xl cursor-pointer group flex items-center justify-center overflow-hidden transition-all duration-500"
          >
            {/* The Embedded Dashed Border */}
            <div 
              className="absolute inset-0 border-2 border-dashed border-white/10 rounded-xl group-hover:border-purple-500/60 transition-colors duration-500"
              style={embeddedBorderStyle}
            />

            {/* Hover Glow Background */}
            <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/[0.05] transition-all duration-500 flex items-center justify-center">
               <div className="w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-[inset_0_0_30px_rgba(168,85,247,0.15)] rounded-xl" />
            </div>

            {/* Neon Plus Icon */}
            <div className="relative z-10 w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-accent-purple group-hover:border-purple-500/40 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-500 transform group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            
            <p className="absolute bottom-4 text-[0.55rem] font-mono text-text-muted uppercase tracking-[0.2em] opacity-40 group-hover:opacity-80 transition-opacity">
              Add More
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionOcrUploader;
