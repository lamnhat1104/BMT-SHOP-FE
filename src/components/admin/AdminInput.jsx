import React from 'react';

/**
 * Reusable Admin Input & Select component with labels and error handling
 */
export default function AdminInput({ label, error, type = 'text', options = [], className = '', ...props }) {
  const isSelect = type === 'select';

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && <label className="text-xs font-bold text-slate-700">{label}</label>}
      
      {isSelect ? (
        <select
          className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#f47920] bg-white transition-colors cursor-pointer ${
            error ? 'border-red-500 focus:border-red-500' : ''
          }`}
          {...props}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input 
          type={type}
          className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#f47920] transition-colors ${
            error ? 'border-red-500 focus:border-red-500' : ''
          }`}
          {...props}
        />
      )}
      
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  );
}
