import { useEffect } from 'react';

/**
 * Custom hook to add a ripple click effect to any button ref.
 * Dynamically creates and removes ripple spans for interaction feedback.
 */
export const useRipple = (btnRef) => {
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const handleClick = (e) => {
      // Calculate position relative to button
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create ripple element
      const ripple = document.createElement('span');
      
      // Using arbitrary Tailwind values for ripple spread and animation
      ripple.className = 'absolute bg-white/30 rounded-full pointer-events-none animate-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.width = '0';
      ripple.style.height = '0';

      // Attach, then remove after animation completes
      btn.appendChild(ripple);
      setTimeout(() => {
        if (btn.contains(ripple)) {
          ripple.remove();
        }
      }, 600); // Matches animate-ripple duration
    };

    btn.addEventListener('click', handleClick);
    return () => btn.removeEventListener('click', handleClick);
  }, [btnRef]);
};
