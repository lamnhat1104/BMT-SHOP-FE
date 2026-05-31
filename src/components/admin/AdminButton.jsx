import React from 'react';

/**
 * Reusable Admin Button component with styling variants
 */
export default function AdminButton({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none";
  
  const variants = {
    primary: "bg-[#f47920] hover:bg-[#d66415] text-white shadow-xs",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-xs",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs",
    outline: "border border-slate-200 hover:border-[#f47920] hover:text-[#f47920] text-slate-600 bg-white"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}
