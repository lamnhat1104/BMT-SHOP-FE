import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  User, 
  X, 
  Tag, 
  Gift, 
  PieChart, 
  Star,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';

function AdminSidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const renderSidebarContent = (isDesktop) => {
    const collapsed = isDesktop && isCollapsed;

    const getLinkClass = (isActive) => {
      if (collapsed) {
        return isActive
          ? "group relative flex items-center justify-center p-3.5 rounded-xl bg-white text-[#f47920] shadow-sm transition-all duration-300"
          : "group relative flex items-center justify-center p-3.5 rounded-xl text-white/85 hover:text-white hover:bg-white/10 transition-all duration-300";
      } else {
        return isActive
          ? "group relative flex items-center gap-4 px-5 py-3.5 rounded-xl bg-white text-[#f47920] font-bold text-sm shadow-sm translate-x-1 transition-all duration-300"
          : "group relative flex items-center gap-4 px-5 py-3.5 rounded-xl text-white/85 hover:text-white hover:bg-white/10 hover:translate-x-0.5 font-medium text-sm transition-all duration-300";
      }
    };

    return (
      <div className={`flex flex-col h-full ${collapsed ? 'p-4' : 'p-6'} relative transition-all duration-300`}>
        {/* Brand logo & header */}
        <div className={`flex items-center justify-between py-5 mb-8 border-b border-white/20 pb-5 shrink-0 ${collapsed ? 'justify-center' : ''}`}>
          {collapsed ? (
            <div className="w-10 h-10 bg-white text-[#f47920] rounded-xl flex items-center justify-center font-black text-lg tracking-tighter shrink-0 shadow-sm animate-fade-in">
              VNB
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-[#f47920] rounded-xl flex items-center justify-center font-black text-lg tracking-tighter shrink-0">
                VNB
              </div>
              <div className="animate-fade-in">
                <h2 className="font-extrabold text-sm tracking-wider text-white">VNB SHOP</h2>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-0.5">Hệ thống quản trị</p>
              </div>
            </div>
          )}
          {onClose && !collapsed && (
            <button onClick={onClose} className="md:hidden p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Nav Links - Scrollable */}
        <nav className="flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => getLinkClass(isActive)}
            onClick={onClose}
            title={collapsed ? "Trang tổng quan" : undefined}
          >
            <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform duration-300 shrink-0" />
            {!collapsed && <span className="animate-fade-in whitespace-nowrap">Trang tổng quan</span>}
          </NavLink>
          
          <NavLink 
            to="/admin/orders" 
            className={({ isActive }) => getLinkClass(isActive)}
            onClick={onClose}
            title={collapsed ? "Quản lý đơn hàng" : undefined}
          >
            <ShoppingCart size={18} className="group-hover:scale-110 transition-transform duration-300 shrink-0" />
            {!collapsed && <span className="animate-fade-in whitespace-nowrap">Quản lý đơn hàng</span>}
          </NavLink>

          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => getLinkClass(isActive)}
            onClick={onClose}
            title={collapsed ? "Quản lý sản phẩm" : undefined}
          >
            <Package size={18} className="group-hover:scale-110 transition-transform duration-300 shrink-0" />
            {!collapsed && <span className="animate-fade-in whitespace-nowrap">Quản lý sản phẩm</span>}
          </NavLink>

          <NavLink 
            to="/admin/categories" 
            className={({ isActive }) => getLinkClass(isActive)}
            onClick={onClose}
            title={collapsed ? "Quản lý danh mục" : undefined}
          >
            <Tag size={18} className="group-hover:scale-110 transition-transform duration-300 shrink-0" />
            {!collapsed && <span className="animate-fade-in whitespace-nowrap">Quản lý danh mục</span>}
          </NavLink>

          <NavLink 
            to="/admin/coupons" 
            className={({ isActive }) => getLinkClass(isActive)}
            onClick={onClose}
            title={collapsed ? "Quản lý khuyến mãi" : undefined}
          >
            <Gift size={18} className="group-hover:scale-110 transition-transform duration-300 shrink-0" />
            {!collapsed && <span className="animate-fade-in whitespace-nowrap">Quản lý khuyến mãi</span>}
          </NavLink>

          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => getLinkClass(isActive)}
            onClick={onClose}
            title={collapsed ? "Quản lý tài khoản" : undefined}
          >
            <User size={18} className="group-hover:scale-110 transition-transform duration-300 shrink-0" />
            {!collapsed && <span className="animate-fade-in whitespace-nowrap">Quản lý tài khoản</span>}
          </NavLink>

          <NavLink 
            to="/admin/reviews" 
            className={({ isActive }) => getLinkClass(isActive)}
            onClick={onClose}
            title={collapsed ? "Quản lý đánh giá" : undefined}
          >
            <Star size={18} className="group-hover:scale-110 transition-transform duration-300 shrink-0" />
            {!collapsed && <span className="animate-fade-in whitespace-nowrap">Quản lý đánh giá</span>}
          </NavLink>

          <NavLink 
            to="/#" 
            className={({ isActive }) => getLinkClass(isActive)}
            onClick={onClose}
            title={collapsed ? "Báo cáo doanh thu" : undefined}
          >
            <PieChart size={18} className="group-hover:scale-110 transition-transform duration-300 shrink-0" />
            {!collapsed && <span className="animate-fade-in whitespace-nowrap">Báo cáo doanh thu</span>}
          </NavLink>
        </nav>

        {/* Back to Home - Sticky at bottom */}
        <div className="pt-6 mt-auto shrink-0 flex justify-center">
          <Link 
            to="/" 
            title={collapsed ? "Về trang chủ" : undefined}
            className={`flex items-center justify-center rounded-xl border border-white/30 hover:border-white hover:bg-white/10 text-white transition-all duration-300 group ${
              collapsed ? 'p-3.5' : 'gap-2 w-full py-3.5 text-xs font-bold uppercase tracking-wider'
            }`}
          >
            {collapsed ? <Home size={18} className="group-hover:scale-110 transition-transform duration-300" /> : <span>Về trang chủ</span>}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className={`hidden md:flex flex-col ${isCollapsed ? 'w-20' : 'w-64'} bg-[#f47920] text-white h-screen sticky top-0 border-r border-[#d66415]/30 shrink-0 transition-all duration-300 ease-in-out relative z-40`}>
        {renderSidebarContent(true)}
        
        {/* Toggle Collapse Button */}
        <button
          onClick={onToggleCollapse}
          className="absolute top-10 -right-3.5 w-7 h-7 bg-white text-[#f47920] hover:bg-[#f47920] hover:text-white border border-[#d66415]/30 rounded-full flex items-center justify-center shadow-md z-50 cursor-pointer transition-all duration-300 hover:scale-110"
          title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Sidebar Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
          {/* Overlay backdrop */}
          <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity duration-300" />
          
          {/* Drawer body */}
          <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[#f47920] text-white flex flex-col z-50 border-r border-[#d66415]/30 animate-slide-in h-screen">
            {renderSidebarContent(false)}
          </aside>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;
