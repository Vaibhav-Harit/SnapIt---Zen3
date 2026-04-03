import React from 'react';
import NavItem from './NavItem';

/**
 * Sidebar Navigation
 * Premium glassmorphic effect with User Profile widget and interactive states.
 */
const Sidebar = ({ currentPath = '/home', onLogout }) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 flex flex-col p-6 bg-white/[0.02] backdrop-blur-xl border-r border-white/10 z-50">
      
      {/* Snap.it Logo Section */}
      <div className="flex items-center mb-12 px-2">
        <h1 className="font-display text-2xl font-bold tracking-widest text-white leading-none">
          snap
          <span className="text-pink-500 drop-shadow-[0_0_12px_rgba(236,72,153,0.8)] animate-dot-pulse">.</span>
          <span className="bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">it</span>
        </h1>
      </div>

      {/* Navigation Middle Section */}
      <nav className="flex flex-col gap-2">
        <NavItem
          label="Home"
          isActive={currentPath === '/home'}
          icon={(props) => (
            <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
          )}
        />
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        {/* 
          Ultra-minimalist Profile Button
          Single-line navigation with no subtext, following high-fidelity design standards.
        */}
        <div className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out cursor-pointer text-gray-400 hover:text-white hover:bg-purple-500/10 hover:translate-x-1">
          {/* Left: Minimal User Outline Icon with purple hover color */}
          <svg className="w-5 h-5 transition-colors duration-300 text-gray-500 group-hover:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          
          {/* Middle: Profile Text */}
          <span className="text-sm font-medium tracking-wide">Profile</span>
          
          {/* Right: Minimal Chevron Icon with transition */}
          <svg className="ml-auto w-4 h-4 text-gray-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Bottom Logout Section */}
        <div className="pt-4 border-t border-white/5">
          <NavItem
            label="Logout"
            className="text-gray-500 hover:text-red-400 hover:bg-red-500/10"
            onClick={onLogout}
            icon={(props) => (
              <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            )}
          />
        </div>
      </div>

      {/* Subtle Sidebar Decoration Layer */}
      <div className="absolute inset-0 pointer-events-none z-[-1] opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--color-accent-purple),transparent_70%)]" />
      </div>
    </aside>
  );
};

export default Sidebar;
