import React from 'react';

/**
 * NavItem Component
 * Reusable navigation button for the sidebar with premium hover effects.
 */
const NavItem = ({ icon: Icon, label, isActive = false, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center gap-3 w-full px-4 py-3 rounded-xl
        transition-all duration-300 ease-out
        ${isActive 
          ? 'bg-white/[0.04] text-white translate-x-1 shadow-[0_0_25px_rgba(168,85,247,0.15),0_0_25px_rgba(34,211,238,0.05)] border border-white/5' 
          : 'text-gray-400 hover:text-white hover:bg-white/[0.02] hover:translate-x-1'
        }
        ${className}
      `}
    >
      {/* Icon with subtle hover glow */}
      <Icon className={`
        w-5 h-5 transition-colors duration-300
        ${isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-purple-400'}
      `} />
      
      {/* Label */}
      <span className="font-medium text-sm tracking-wide">
        {label}
      </span>
      
      {/* Active Indicator Dot */}
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_var(--color-accent-purple)]" />
      )}
    </button>
  );
};

export default NavItem;
