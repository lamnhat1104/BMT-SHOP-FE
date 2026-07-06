import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { orderApi } from '../api/order';
import { Eye, Search, Filter, AlertCircle, User, MapPin, Clock } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader';

function AdminOrders() {
  const { onMenuToggle } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('date'); // 'code', 'name', 'date', 'price'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc', 'desc'
  
  // Detail Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ text: '', type: '' });

  const loadAllOrders = async () => {
    try {
      const data = await orderApi.getAdminOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải toàn bộ đơn hàng:', err);
      setError(err.message || 'Bạn không có quyền truy cập trang này hoặc phiên đăng nhập hết hạn!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setIsUpdatingStatus(true);
    setUpdateMessage({ text: '', type: '' });
    try {
      const updated = await orderApi.updateOrderStatus(orderId, newStatus);
      
      // Update local state list
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      
      // If modal open, update selected order
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      
      setUpdateMessage({ text: `Cập nhật trạng thái đơn hàng sang "${newStatus}" thành công!`, type: 'success' });
      
      // Auto clear alert
      setTimeout(() => setUpdateMessage({ text: '', type: '' }), 4000);
    } catch (err) {
      setUpdateMessage({ text: err.message || 'Cập nhật trạng thái thất bại!', type: 'error' });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Đang xử lý':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Đang giao hàng':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'Hoàn thành':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Đã hủy':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('vi-VN');
    } catch (e) {
      return dateStr;
    }
  };

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesSearch = (order.orderCode || '').toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                          (order.fullName || '').toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                          (order.phone || '').includes(searchQuery.trim());
    return matchesStatus && matchesSearch;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return sortDirection === 'asc' 
      ? <span className="text-[var(--primary-color)] ml-1">▲</span> 
      : <span className="text-[var(--primary-color)] ml-1">▼</span>;
  };

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'date') {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      comparison = dateA - dateB;
    } else if (sortField === 'code') {
      comparison = (a.orderCode || '').localeCompare(b.orderCode || '');
    } else if (sortField === 'name') {
      comparison = (a.fullName || '').localeCompare(b.fullName || '');
    } else if (sortField === 'price') {
      comparison = (a.totalAmount || 0) - (b.totalAmount || 0);
    }
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#f8fafc] flex-1">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-semibold animate-pulse">Đang tải danh sách đơn hàng quản trị...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#f8fafc] flex-1 p-6">
        <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-xs border border-rose-100">
          <div className="text-rose-500 mb-4 flex justify-center"><AlertCircle size={48} /></div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Không Thể Truy Cập</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <Link to="/" className="inline-block bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">TRỞ VỀ TRANG CHỦ</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 md:p-10 space-y-8 overflow-x-hidden">
      {/* Header */}
      <AdminHeader 
        title="Quản Lý Đơn Hàng" 
        description="Xem, theo dõi và cập nhật trạng thái đơn hàng của khách hàng trên hệ thống." 
        onMenuToggle={onMenuToggle} 
      />

      {updateMessage.text && (
        <div className={`p-4 rounded-xl font-semibold shadow-xs transition-all ${
          updateMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-rose-50 text-rose-800 border border-rose-100'
        }`}>
          {updateMessage.text}
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        {/* Search */}
        <div className="flex-1 min-w-[280px] flex items-center border border-gray-200 rounded-xl px-3 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-[var(--primary-color)] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
          <Search size={18} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Tìm kiếm mã đơn hàng, tên khách hàng, số điện thoại..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-hidden text-sm text-slate-700 placeholder:text-gray-400"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái:</span>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-200 text-slate-700 text-sm font-semibold rounded-xl px-4 py-2.5 outline-hidden focus:border-[var(--primary-color)] cursor-pointer transition-colors"
            >
              <option value="ALL">Tất cả đơn hàng</option>
              <option value="Chờ xác nhận">Chờ xác nhận</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đang giao hàng">Đang giao hàng</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sắp xếp:</span>
            <select 
              value={`${sortField}-${sortDirection}`} 
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortField(field);
                setSortDirection(direction);
              }}
              className="bg-white border border-gray-200 text-slate-700 text-sm font-semibold rounded-xl px-4 py-2.5 outline-hidden focus:border-[var(--primary-color)] cursor-pointer transition-colors"
            >
              <option value="date-desc">Thời gian (Mới nhất)</option>
              <option value="date-asc">Thời gian (Cũ nhất)</option>
              <option value="code-asc">Mã đơn (A-Z)</option>
              <option value="code-desc">Mã đơn (Z-A)</option>
              <option value="name-asc">Khách hàng (A-Z)</option>
              <option value="name-desc">Khách hàng (Z-A)</option>
              <option value="price-desc">Tổng tiền (Cao → Thấp)</option>
              <option value="price-asc">Tổng tiền (Thấp → Cao)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-gray-100">
                <th className="py-4 px-6">Mã đơn hàng</th>
                <th className="py-4 px-6">Khách hàng</th>
                <th className="py-4 px-6">Thời gian</th>
                <th className="py-4 px-6 text-right">Tổng tiền</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 font-medium">
                    Không tìm thấy đơn hàng nào phù hợp.
                  </td>
                </tr>
              ) : (
                sortedOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 px-6 font-bold text-[var(--primary-color)]">{order.orderCode}</td>
                    <td className="py-4.5 px-6">
                      <div className="font-semibold text-slate-700">{order.fullName}</div>
                      <div className="text-xs text-gray-400">SĐT: {order.phone}</div>
                    </td>
                    <td className="py-4.5 px-6 text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
                    <td className="py-4.5 px-6 font-extrabold text-slate-800 text-right">{formatPrice(order.totalAmount)}</td>
                    <td className="py-4.5 px-6 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide inline-block ${getStatusBadgeStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex gap-3 justify-end items-center">
                        {/* View details */}
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 bg-white border border-gray-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Eye size={14} /> Xem
                        </button>

                        {/* Dropdown status update */}
                        <select 
                          value={order.status} 
                          disabled={isUpdatingStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-white border border-gray-200 text-slate-700 text-xs font-semibold rounded-lg px-2 py-1.5 outline-hidden focus:border-[var(--primary-color)] cursor-pointer transition-colors"
                        >
                          <option value="Chờ xác nhận">Chờ xác nhận</option>
                          <option value="Đang xử lý">Đang xử lý</option>
                          <option value="Đang giao hàng">Đang giao hàng</option>
                          <option value="Hoàn thành">Hoàn thành</option>
                          <option value="Đã hủy">Đã hủy</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-[750px] max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 animate-fade-in flex flex-col gap-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-800">
                Chi tiết đơn hàng #{selectedOrder.orderCode}
              </h3>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="text-gray-400 hover:text-slate-600 font-bold text-2xl transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Quick status selector */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-4 rounded-xl">
              <span className="text-sm font-bold text-slate-600">Cập nhật trạng thái đơn:</span>
              <select 
                value={selectedOrder.status} 
                disabled={isUpdatingStatus}
                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                className="bg-white border border-gray-200 text-slate-700 text-sm font-bold rounded-lg px-3 py-1.5 outline-hidden focus:border-[var(--primary-color)] cursor-pointer transition-colors"
              >
                <option value="Chờ xác nhận">Chờ xác nhận</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Đang giao hàng">Đang giao hàng</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
              {isUpdatingStatus && <span className="text-xs text-[var(--primary-color)] animate-pulse">Đang cập nhật...</span>}
            </div>

            {/* Recipient Details & Payment info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-2">
                <User className="text-[var(--primary-color)] shrink-0" size={20} />
                <div>
                  <strong className="text-sm text-slate-800 block mb-1">Khách hàng nhận</strong>
                  <span className="text-xs text-slate-600 block">Họ tên: {selectedOrder.fullName}</span>
                  <span className="text-xs text-slate-600 block">SĐT: {selectedOrder.phone}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <MapPin className="text-[var(--primary-color)] shrink-0" size={20} />
                <div>
                  <strong className="text-sm text-slate-800 block mb-1">Địa chỉ giao hàng</strong>
                  <span className="text-xs text-slate-600 block leading-relaxed">{selectedOrder.address}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Clock className="text-[var(--primary-color)] shrink-0" size={20} />
                <div>
                  <strong className="text-sm text-slate-800 block mb-1">Thông tin bổ sung</strong>
                  <span className="text-xs text-slate-600 block">Đặt lúc: {formatDate(selectedOrder.createdAt)}</span>
                  <span className="text-xs font-bold text-[var(--primary-color)] block mt-0.5">Thanh toán: {selectedOrder.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.notes && (
              <div className="bg-amber-50/50 border-l-4 border-amber-400 p-4 rounded-r-xl text-xs text-amber-800">
                <strong className="block mb-1">Ghi chú từ khách hàng:</strong>
                <span className="italic">"{selectedOrder.notes}"</span>
              </div>
            )}

            {/* Product list table */}
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-gray-100">
                    <th className="p-3">Sản phẩm</th>
                    <th className="p-3 text-center">Đơn giá</th>
                    <th className="p-3 text-center">SL</th>
                    <th className="p-3 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedOrder.items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/20">
                      <td className="p-3">
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="block text-[10px] text-gray-400 mt-0.5">
                          Thương hiệu: {item.brand} | Cấu hình: {item.details}
                        </span>
                      </td>
                      <td className="p-3 text-center text-slate-600">{formatPrice(item.price)}</td>
                      <td className="p-3 text-center font-bold text-slate-800">{item.quantity}</td>
                      <td className="p-3 text-right font-bold text-rose-600">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total calculations */}
            <div className="flex justify-end">
              <div className="w-[240px] text-xs space-y-2 border-t border-gray-100 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính:</span>
                  <strong className="text-slate-800">{formatPrice(selectedOrder.totalAmount)}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Vận chuyển:</span>
                  <strong className="text-emerald-600 font-bold">Miễn phí</strong>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2 text-sm">
                  <span className="font-bold text-slate-800">Tổng cộng:</span>
                  <strong className="text-rose-600 text-base font-extrabold">{formatPrice(selectedOrder.totalAmount)}</strong>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 pt-4 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminOrders;

