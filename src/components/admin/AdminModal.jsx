import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable modal component for admin dashboard operations
 */
export default function AdminModal({ isOpen, onClose, title, children, maxWidthClass = 'max-w-lg' }) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300" 
      />
      
      {/* Modal Container */}
      <div className={`bg-white rounded-2xl w-full ${maxWidthClass} shadow-xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
          <h3 className="font-bold text-slate-800 text-base">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
