import React, { useState, useRef } from 'react';

/**
 * VisionOcrUploader
 * A sophisticated multi-image uploader with a glassmorphic aesthetic.
 * Supports image previews, removal, and 'Add More' functionality.
 */
const VisionOcrUploader = ({ compact = false }) => {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // ... (rest of logic same) ...
  const processFiles = (files) => {
    if (files.length === 0) return;

    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      previewUrl: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    processFiles(files);
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const embeddedBorderStyle = {
    maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)',
    WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)',
  };

  return (
    <div className={`
      w-full bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 flex flex-col transition-all duration-300
      ${compact ? 'h-28 p-2' : 'min-h-[400px] p-6'}
      ${isDragging ? 'border-purple-500/50 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : ''}
    `}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelection}
        className="hidden"
        multiple
        accept="image/*"
      />

      {images.length === 0 ? (
        /* State 1: Empty (Dropzone) */
        <div
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="flex-1 flex flex-col items-center justify-center cursor-pointer group relative transition-all duration-500"
        >
          {/* The Embedded Dashed Border */}
          <div 
            className={`absolute inset-0 border-2 border-dashed rounded-xl transition-colors duration-500 ${isDragging ? 'border-purple-500' : 'border-white/10 group-hover:border-purple-500/60'}`}
            style={embeddedBorderStyle}
          />
          
          {/* Hover Glow Background */}
          <div className={`absolute inset-0 transition-all duration-500 flex items-center justify-center rounded-xl ${isDragging ? 'bg-purple-500/10' : 'bg-purple-500/0 group-hover:bg-purple-500/[0.03]'}`}>
             <div className={`w-full h-full transition-opacity duration-700 shadow-[inset_0_0_40px_rgba(168,85,247,0.1)] rounded-xl ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
          </div>

          {/* Content */}
          <div className={`relative z-10 flex ${compact ? 'flex-row gap-3' : 'flex-col gap-4'} items-center text-center`}>
            <div className={`
              rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.2)]
              ${compact ? 'w-10 h-10' : 'w-16 h-16'}
              ${isDragging ? 'text-purple-400 border-purple-500/50 scale-110' : 'text-text-muted group-hover:text-accent-purple group-hover:border-purple-500/30'}
            `}>
              <svg xmlns="http://www.w3.org/2000/svg" width={compact ? "20" : "32"} height={compact ? "20" : "32"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>
              </svg>
            </div>
            <div className={`space-y-1 ${compact ? 'text-left' : 'text-center'}`}>
              <p className={`font-medium tracking-wider uppercase transition-opacity ${compact ? 'text-xs' : 'text-sm'} ${isDragging ? 'text-purple-400' : 'text-text-primary opacity-80 group-hover:opacity-100'}`}>
                {isDragging ? 'Release to upload' : 'Drop images here'}
              </p>
              {!isDragging && (
                <p className={`${compact ? 'text-[0.55rem]' : 'text-[0.65rem]'} font-mono text-text-muted uppercase tracking-widest opacity-40`}>
                  {compact ? 'Click to browse' : 'or click to browse files'}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* State 2: Populated (Horizontal Scroll in Compact, Grid in Normal) */
        <div 
          className={`flex-1 overflow-auto scrollbar-hide py-1 ${compact ? 'flex items-center gap-2' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {images.map((img) => (
            <div 
              key={img.id} 
              className={`relative rounded-xl overflow-hidden border border-white/10 bg-white/[0.03] group shadow-xl shrink-0 ${compact ? 'h-full aspect-square' : 'aspect-square w-full'}`}
            >
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
                className="absolute top-1 right-1 w-5 h-5 rounded-lg bg-black/60 border border-white/10 text-white/50 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 hover:text-red-500 hover:border-red-500/50 hover:shadow-[0_0_10px_rgba(239,68,68,0.4)] transition-all duration-300 z-20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          ))}

          {/* Add More Tile */}
          <div
            onClick={triggerFileInput}
            className={`
              relative rounded-xl cursor-pointer group flex items-center justify-center overflow-hidden transition-all duration-500 shrink-0
              ${compact ? 'h-full aspect-square' : 'aspect-square w-full'}
            `}
          >
            <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-xl group-hover:border-purple-500/60 transition-colors duration-500" style={embeddedBorderStyle} />
            <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/[0.05] transition-all duration-500 flex items-center justify-center" />
            <div className="relative z-10 w-8 h-8 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-accent-purple group-hover:border-purple-500/40 transition-all duration-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionOcrUploader;
