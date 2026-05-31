import React from 'react';
import { Calendar, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

function AdminHeader({ title, description, onMenuToggle }) {
  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="p-1 hover:bg-slate-800 rounded">
            <Menu size={24} />
          </button>
          <span className="font-bold text-sm tracking-wide">VNB DASHBOARD</span>
        </div>
        <Link to="/" className="text-xs text-[var(--primary-color)] font-semibold">Về trang chủ</Link>
      </div>

      {/* Main Title Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">{title}</h1>
          {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto bg-white p-2.5 rounded-xl shadow-xs border border-gray-100">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-700">
            Hôm nay: {new Date().toLocaleDateString('vi-VN')}
          </span>
        </div>
      </div>
    </>
  );
}

export default AdminHeader;
