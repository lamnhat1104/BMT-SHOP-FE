import React, { useState, useEffect } from 'react';
import { orderApi } from '../api/order';
import { Eye, Search, Filter, AlertCircle, ShoppingBag, User, MapPin, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
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
        return { backgroundColor: '#fff8e1', color: '#b78103', border: '1px solid #ffe082' };
      case 'Đang xử lý':
        return { backgroundColor: '#e3f2fd', color: '#0d47a1', border: '1px solid #90caf9' };
      case 'Đang giao hàng':
        return { backgroundColor: '#fff3e0', color: '#e65100', border: '1px solid #ffcc80' };
      case 'Hoàn thành':
        return { backgroundColor: '#e8f5e9', color: '#1b5e20', border: '1px solid #a5d6a7' };
      case 'Đã hủy':
        return { backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a' };
      default:
        return { backgroundColor: '#f5f5f5', color: '#616161', border: '1px solid #e0e0e0' };
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
    const matchesSearch = order.orderCode.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                          order.fullName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                          order.phone.includes(searchQuery.trim());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3>Đang tải danh sách đơn hàng quản trị...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container fade-in" style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '600px' }}>
        <div style={{ color: '#c62828', marginBottom: '20px' }}><AlertCircle size={64} style={{ margin: '0 auto' }} /></div>
        <h2 style={{ marginBottom: '15px' }}>Không Thể Truy Cập</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>{error}</p>
        <Link to="/" className="btn-primary" style={{ padding: '12px 30px' }}>TRỞ VỀ TRANG CHỦ</Link>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <span>Quản trị đơn hàng</span>
      </div>

      <h1 style={{ fontSize: '1.8rem', marginTop: '20px', marginBottom: '30px', fontWeight: '800' }}>
        Quản Trị Đơn Hàng (Admin)
      </h1>

      {updateMessage.text && (
        <div style={{ 
          color: updateMessage.type === 'success' ? '#1b5e20' : '#c62828', 
          backgroundColor: updateMessage.type === 'success' ? '#e8f5e9' : '#ffebee', 
          padding: '12px 20px', 
          borderRadius: '8px', 
          marginBottom: '20px', 
          fontWeight: '600',
          boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
        }}>
          {updateMessage.text}
        </div>
      )}

      {/* Filter and Search controls */}
      <div style={{ display: 'flex', gap: '20px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '25px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '260px', display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white' }}>
          <div style={{ padding: '12px', display: 'flex', alignItems: 'center', color: '#888' }}>
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Tìm kiếm mã đơn hàng, tên khách hàng, số điện thoại..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 0', border: 'none', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        {/* Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Filter size={16} /> <span>Trạng thái:</span>
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '12px 15px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontWeight: '600', cursor: 'pointer', backgroundColor: 'white' }}
          >
            <option value="ALL">Tất cả đơn hàng</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đang giao hàng">Đang giao hàng</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '15px', fontWeight: '700' }}>Mã đơn hàng</th>
              <th style={{ padding: '15px', fontWeight: '700' }}>Khách hàng</th>
              <th style={{ padding: '15px', fontWeight: '700' }}>Thời gian</th>
              <th style={{ padding: '15px', fontWeight: '700', textAlign: 'right' }}>Tổng tiền</th>
              <th style={{ padding: '15px', fontWeight: '700', textAlign: 'center' }}>Trạng thái</th>
              <th style={{ padding: '15px', fontWeight: '700', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
                  Không tìm thấy đơn hàng nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }} className="table-row-hover">
                  <td style={{ padding: '15px', fontWeight: '700', color: 'var(--primary-color)' }}>{order.orderCode}</td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ fontWeight: '600' }}>{order.fullName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>SĐT: {order.phone}</div>
                  </td>
                  <td style={{ padding: '15px', fontSize: '0.85rem' }}>{formatDate(order.createdAt)}</td>
                  <td style={{ padding: '15px', fontWeight: '700', color: '#ff3b30', textAlign: 'right' }}>{formatPrice(order.totalAmount)}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '5px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: '700',
                      display: 'inline-block',
                      ...getStatusBadgeStyle(order.status)
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                      {/* View details */}
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={16} /> Xem
                      </button>

                      {/* Dropdown status update */}
                      <select 
                        value={order.status} 
                        disabled={isUpdatingStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', backgroundColor: 'white' }}
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

      {/* 4. Details Modal Overlay */}
      {selectedOrder && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          zIndex: 9999, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '20px' 
        }}>
          <div className="fade-in" style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            width: '100%', 
            maxWidth: '750px', 
            maxHeight: '90vh', 
            overflowY: 'auto', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            padding: '30px'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800' }}>
                Chi tiết đơn hàng #{selectedOrder.orderCode}
              </h3>
              <button 
                onClick={() => setSelectedOrder(null)} 
                style={{ border: 'none', background: 'none', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', color: '#888' }}
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Quick status selector in Modal */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                <span style={{ fontWeight: '600' }}>Cập nhật trạng thái đơn:</span>
                <select 
                  value={selectedOrder.status} 
                  disabled={isUpdatingStatus}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  style={{ padding: '8px 15px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', backgroundColor: 'white' }}
                >
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đang giao hàng">Đang giao hàng</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
                {isUpdatingStatus && <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>Đang cập nhật...</span>}
              </div>

              {/* Recipient Details & Payment info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <User size={20} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>Khách hàng nhận</strong>
                    <span style={{ fontSize: '0.9rem', display: 'block' }}>Họ tên: {selectedOrder.fullName}</span>
                    <span style={{ fontSize: '0.9rem', display: 'block' }}>SĐT: {selectedOrder.phone}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <MapPin size={20} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>Địa chỉ giao hàng</strong>
                    <span style={{ fontSize: '0.85rem', lineHeight: 1.4, display: 'block' }}>{selectedOrder.address}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Clock size={20} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>Thông tin bổ sung</strong>
                    <span style={{ fontSize: '0.85rem', display: 'block' }}>Đặt lúc: {formatDate(selectedOrder.createdAt)}</span>
                    <span style={{ fontSize: '0.85rem', display: 'block', color: 'var(--primary-color)' }}>Thanh toán: {selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div style={{ backgroundColor: '#fffde7', borderLeft: '4px solid #fbc02d', padding: '12px 15px', borderRadius: '4px', fontSize: '0.9rem' }}>
                  <strong>Ghi chú từ khách hàng:</strong> "{selectedOrder.notes}"
                </div>
              )}

              {/* Product list table */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', marginTop: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid var(--border-color)' }}>
                    <tr>
                      <th style={{ padding: '10px 15px' }}>Sản phẩm</th>
                      <th style={{ padding: '10px 15px', textAlign: 'center' }}>Đơn giá</th>
                      <th style={{ padding: '10px 15px', textAlign: 'center' }}>SL</th>
                      <th style={{ padding: '10px 15px', textAlign: 'right' }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '10px 15px' }}>
                          <span style={{ fontWeight: '600' }}>{item.name}</span>
                          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                            Thương hiệu: {item.brand} | Cấu hình: {item.details}
                          </span>
                        </td>
                        <td style={{ padding: '10px 15px', textAlign: 'center' }}>{formatPrice(item.price)}</td>
                        <td style={{ padding: '10px 15px', textAlign: 'center', fontWeight: '700' }}>{item.quantity}</td>
                        <td style={{ padding: '10px 15px', textAlign: 'right', fontWeight: '600', color: '#ff3b30' }}>
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total calculations */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <div style={{ width: '220px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Tạm tính:</span>
                    <strong>{formatPrice(selectedOrder.totalAmount)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Vận chuyển:</span>
                    <strong style={{ color: '#4caf50' }}>Miễn phí</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc', paddingTop: '8px', fontSize: '1.05rem' }}>
                    <span style={{ fontWeight: '700' }}>Tổng cộng:</span>
                    <strong style={{ color: '#ff3b30', fontSize: '1.15rem' }}>{formatPrice(selectedOrder.totalAmount)}</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="btn-primary" 
                style={{ padding: '10px 20px', fontWeight: '600' }}
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
