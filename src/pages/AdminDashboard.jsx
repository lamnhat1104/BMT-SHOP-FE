import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../api/admin';
import { productApi } from '../api/product';
import { orderApi } from '../api/order';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, FileText, 
  TrendingUp, Plus, Edit, Trash2, Search, Filter, AlertTriangle, 
  CheckCircle, XCircle, Eye, RefreshCw, DollarSign, UserCheck, UserMinus 
} from 'lucide-react';

function AdminDashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateMessage, setUpdateMessage] = useState({ text: '', type: '' });

  // Data states
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  // Search & Filters
  const [prodSearch, setProdSearch] = useState('');
  const [prodCategory, setProdCategory] = useState('ALL');
  
  const [userSearch, setUserSearch] = useState('');
  
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('ALL');

  // Modals & Sub-states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [showProductModal, setShowProductModal] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [modalProduct, setModalProduct] = useState({
    id: null,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    brand: '',
    categoryId: 1,
    categoryName: 'Vợt Cầu Lông'
  });

  const [inlineStockId, setInlineStockId] = useState(null);
  const [inlineStockVal, setInlineStockVal] = useState(0);

  // Category mapping
  const categoryMap = {
    1: 'Vợt Cầu Lông',
    2: 'Giày Cầu Lông',
    3: 'Áo Cầu Lông',
    4: 'Túi Cầu Lông',
    5: 'Cầu Lông',
    6: 'Phụ kiện Cầu Lông'
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'admin') {
      setError('Bạn không có quyền truy cập trang quản trị này!');
      setLoading(false);
    } else {
      setIsAdmin(true);
      loadAllData();
    }
  }, []);

  const showToast = (text, type = 'success') => {
    setUpdateMessage({ text, type });
    setTimeout(() => setUpdateMessage({ text: '', type: '' }), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsData, productsData, usersData, ordersData] = await Promise.all([
        adminApi.getDashboardStats(),
        productApi.getAllProducts(),
        adminApi.getUsers(),
        orderApi.getAdminOrders()
      ]);

      setStats(statsData);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setError('');
    } catch (err) {
      console.error('Lỗi tải dữ liệu quản trị:', err);
      setError(err.message || 'Lỗi kết nối đến máy chủ hoặc phiên làm việc hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  // User Actions
  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    if (!window.confirm(`Bạn có chắc muốn đổi quyền của người dùng này sang ${newRole.toUpperCase()}?`)) return;
    
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.userId === userId ? { ...u, role: newRole } : u));
      showToast('Cập nhật quyền hạn thành viên thành công!');
      // Reload stats in case admin count changed
      const statsData = await adminApi.getDashboardStats();
      setStats(statsData);
    } catch (err) {
      showToast(err.message || 'Thay đổi quyền hạn thất bại!', 'error');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const actionText = newStatus ? 'kích hoạt' : 'khóa';
    if (!window.confirm(`Bạn có chắc muốn ${actionText} tài khoản này?`)) return;

    try {
      await adminApi.updateUserStatus(userId, newStatus);
      setUsers(prev => prev.map(u => u.userId === userId ? { ...u, isActive: newStatus } : u));
      showToast(`Đã ${actionText} tài khoản người dùng thành công!`);
    } catch (err) {
      showToast(err.message || 'Cập nhật trạng thái thất bại!', 'error');
    }
  };

  // Product CRUD
  const handleOpenAddProduct = () => {
    setModalProduct({
      id: null,
      name: '',
      description: '',
      price: 0,
      stock: 0,
      imageUrl: '/racket_product_1.png',
      brand: 'Yonex',
      categoryId: 1,
      categoryName: 'Vợt Cầu Lông'
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod) => {
    setModalProduct({
      id: prod.id,
      name: prod.name,
      description: prod.description || '',
      price: prod.price,
      stock: prod.stock,
      imageUrl: prod.imageUrl || '/racket_product_1.png',
      brand: prod.brand?.name || prod.brand || 'Yonex',
      categoryId: prod.category?.id || prod.categoryId || 1,
      categoryName: prod.category?.name || prod.categoryName || 'Vợt Cầu Lông'
    });
    setShowProductModal(true);
  };

  const handleCategoryChange = (catId) => {
    const id = parseInt(catId);
    setModalProduct(prev => ({
      ...prev,
      categoryId: id,
      categoryName: categoryMap[id] || ''
    }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSubmittingProduct(true);
    
    // Structure standard payload
    const payload = {
      name: modalProduct.name,
      description: modalProduct.description,
      price: parseFloat(modalProduct.price),
      stock: parseInt(modalProduct.stock),
      imageUrl: modalProduct.imageUrl,
      brand: modalProduct.brand,
      categoryId: modalProduct.categoryId,
      categoryName: modalProduct.categoryName
    };

    try {
      if (modalProduct.id) {
        // Edit mode
        const updated = await adminApi.updateProduct(modalProduct.id, payload);
        showToast('Cập nhật sản phẩm thành công!');
      } else {
        // Create mode
        await adminApi.createProduct(payload);
        showToast('Thêm sản phẩm mới thành công!');
      }
      setShowProductModal(false);
      // Reload products and stats
      const productsData = await productApi.getAllProducts();
      setProducts(Array.isArray(productsData) ? productsData : []);
      const statsData = await adminApi.getDashboardStats();
      setStats(statsData);
    } catch (err) {
      showToast(err.message || 'Thao tác sản phẩm thất bại!', 'error');
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này? Thao tác này không thể hoàn tác.')) return;
    try {
      await adminApi.deleteProduct(prodId);
      setProducts(prev => prev.filter(p => p.id !== prodId));
      showToast('Đã xóa sản phẩm thành công!');
      const statsData = await adminApi.getDashboardStats();
      setStats(statsData);
    } catch (err) {
      showToast(err.message || 'Xóa sản phẩm thất bại!', 'error');
    }
  };

  // Stock update
  const handleOpenInlineStock = (prod) => {
    setInlineStockId(prod.id);
    setInlineStockVal(prod.stock);
  };

  const handleSaveInlineStock = async (prodId) => {
    if (inlineStockVal < 0) {
      showToast('Số lượng tồn kho không được âm!', 'error');
      return;
    }
    try {
      await adminApi.updateProductStock(prodId, parseInt(inlineStockVal));
      setProducts(prev => prev.map(p => p.id === prodId ? { ...p, stock: parseInt(inlineStockVal) } : p));
      setInlineStockId(null);
      showToast('Cập nhật tồn kho sản phẩm thành công!');
      const statsData = await adminApi.getDashboardStats();
      setStats(statsData);
    } catch (err) {
      showToast(err.message || 'Cập nhật kho hàng thất bại!', 'error');
    }
  };

  // Order status
  const handleOrderStatusChange = async (orderId, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const updated = await orderApi.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      showToast(`Đã chuyển trạng thái đơn sang "${newStatus}"!`);
      // Reload stats in case revenue changed
      const statsData = await adminApi.getDashboardStats();
      setStats(statsData);
    } catch (err) {
      showToast(err.message || 'Cập nhật trạng thái thất bại!', 'error', 'error');
    } finally {
      setIsUpdatingStatus(false);
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

  // Filtering logics
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(prodSearch.toLowerCase().trim()) || 
                          (p.brand?.name || p.brand || '').toLowerCase().includes(prodSearch.toLowerCase().trim());
    const matchesCat = prodCategory === 'ALL' || (p.category?.id || p.categoryId) === parseInt(prodCategory);
    return matchesSearch && matchesCat;
  });

  const filteredUsers = users.filter(u => {
    return u.fullName.toLowerCase().includes(userSearch.toLowerCase().trim()) ||
           u.email.toLowerCase().includes(userSearch.toLowerCase().trim()) ||
           (u.phone || '').includes(userSearch.trim());
  });

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderCode.toLowerCase().includes(orderSearch.toLowerCase().trim()) ||
                          o.fullName.toLowerCase().includes(orderSearch.toLowerCase().trim()) ||
                          o.phone.includes(orderSearch.trim());
    const matchesStatus = orderStatus === 'ALL' || o.status === orderStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate maximum monthly revenue for chart scaling
  const maxMonthlyRevenue = stats && stats.monthlyRevenue && stats.monthlyRevenue.length > 0
    ? Math.max(...stats.monthlyRevenue.map(m => m.revenue), 1)
    : 1;

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <RefreshCw className="spin" size={48} style={{ margin: '0 auto 20px auto', color: 'var(--primary-color)', animation: 'spin 1.5s linear infinite' }} />
        <h3 style={{ fontWeight: 600 }}>Đang khởi tạo dữ liệu hệ thống quản trị...</h3>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container fade-in" style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '600px' }}>
        <div style={{ color: '#c62828', marginBottom: '20px' }}><XCircle size={64} style={{ margin: '0 auto' }} /></div>
        <h2 style={{ marginBottom: '15px', fontWeight: '800' }}>Từ Chối Truy Cập</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px', fontWeight: '500' }}>{error}</p>
        <Link to="/" className="btn-primary" style={{ padding: '12px 30px', display: 'inline-block', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '6px', fontWeight: '700' }}>TRỞ VỀ TRANG CHỦ</Link>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '30px 20px', maxWidth: '1280px' }}>
      
      {/* Toast Alert */}
      {updateMessage.text && (
        <div style={{ 
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 10000,
          color: updateMessage.type === 'success' ? '#1b5e20' : '#c62828', 
          backgroundColor: updateMessage.type === 'success' ? '#e8f5e9' : '#ffebee', 
          padding: '15px 25px', 
          borderRadius: '8px', 
          fontWeight: '600',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          borderLeft: `5px solid ${updateMessage.type === 'success' ? '#4caf50' : '#f44336'}`,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {updateMessage.text}
        </div>
      )}

      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '5px' }}>
            <Link to="/">Trang chủ</Link> / <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Quản trị viên</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--secondary-color)', letterSpacing: '-0.5px' }}>
            Hệ Thống Quản Trị Shop <span style={{ color: 'var(--primary-color)' }}>BMT</span>
          </h1>
        </div>
        <button 
          onClick={loadAllData} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: '600', color: 'var(--text-dark)', cursor: 'pointer', transition: '0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9f9f9'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
        >
          <RefreshCw size={16} /> Đồng bộ dữ liệu
        </button>
      </div>

      {/* Admin Layout Grid */}
      <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
        
        {/* Navigation Tabs Bar */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px', borderBottom: '2px solid var(--border-color)' }}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '0.95rem', fontWeight: '700', borderRadius: '8px 8px 0 0', cursor: 'pointer', transition: '0.2s',
              backgroundColor: activeTab === 'dashboard' ? 'var(--secondary-color)' : 'transparent',
              color: activeTab === 'dashboard' ? 'white' : 'var(--text-light)',
              border: 'none',
              borderBottom: activeTab === 'dashboard' ? '3px solid var(--primary-color)' : 'none'
            }}
          >
            <LayoutDashboard size={18} /> Tổng quan
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '0.95rem', fontWeight: '700', borderRadius: '8px 8px 0 0', cursor: 'pointer', transition: '0.2s',
              backgroundColor: activeTab === 'products' ? 'var(--secondary-color)' : 'transparent',
              color: activeTab === 'products' ? 'white' : 'var(--text-light)',
              border: 'none',
              borderBottom: activeTab === 'products' ? '3px solid var(--primary-color)' : 'none'
            }}
          >
            <ShoppingBag size={18} /> Sản phẩm
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '0.95rem', fontWeight: '700', borderRadius: '8px 8px 0 0', cursor: 'pointer', transition: '0.2s',
              backgroundColor: activeTab === 'inventory' ? 'var(--secondary-color)' : 'transparent',
              color: activeTab === 'inventory' ? 'white' : 'var(--text-light)',
              border: 'none',
              borderBottom: activeTab === 'inventory' ? '3px solid var(--primary-color)' : 'none'
            }}
          >
            <Package size={18} /> Tồn kho
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '0.95rem', fontWeight: '700', borderRadius: '8px 8px 0 0', cursor: 'pointer', transition: '0.2s',
              backgroundColor: activeTab === 'orders' ? 'var(--secondary-color)' : 'transparent',
              color: activeTab === 'orders' ? 'white' : 'var(--text-light)',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '3px solid var(--primary-color)' : 'none'
            }}
          >
            <FileText size={18} /> Đơn hàng
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '0.95rem', fontWeight: '700', borderRadius: '8px 8px 0 0', cursor: 'pointer', transition: '0.2s',
              backgroundColor: activeTab === 'users' ? 'var(--secondary-color)' : 'transparent',
              color: activeTab === 'users' ? 'white' : 'var(--text-light)',
              border: 'none',
              borderBottom: activeTab === 'users' ? '3px solid var(--primary-color)' : 'none'
            }}
          >
            <Users size={18} /> Người dùng
          </button>
        </div>

        {/* Tab Content Panel */}
        <div style={{ minHeight: '500px' }}>
          
          {/* TAB 1: DASHBOARD / GENERAL */}
          {activeTab === 'dashboard' && stats && (
            <div className="fade-in">
              {/* 4 Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid var(--border-color)' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                    <TrendingUp size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: '600', display: 'block', textTransform: 'uppercase' }}>Tổng Doanh Thu</span>
                    <strong style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--secondary-color)' }}>{formatPrice(stats.totalRevenue)}</strong>
                  </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid var(--border-color)' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e88e5' }}>
                    <FileText size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: '600', display: 'block', textTransform: 'uppercase' }}>Tổng Đơn Hàng</span>
                    <strong style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--secondary-color)' }}>{stats.totalOrders} đơn</strong>
                  </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid var(--border-color)' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4caf50' }}>
                    <ShoppingBag size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: '600', display: 'block', textTransform: 'uppercase' }}>Tổng Sản Phẩm</span>
                    <strong style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--secondary-color)' }}>{stats.totalProducts} mẫu</strong>
                  </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid var(--border-color)' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: '#ede7f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#673ab7' }}>
                    <Users size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: '600', display: 'block', textTransform: 'uppercase' }}>Khách Hàng</span>
                    <strong style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--secondary-color)' }}>{stats.totalUsers} tài khoản</strong>
                  </div>
                </div>
              </div>

              {/* Chart & Stock Alert Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', marginBottom: '30px', flexWrap: 'wrap' }} className="responsive-grid-dashboard">
                
                {/* Visual Chart Panel */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp style={{ color: 'var(--primary-color)' }} /> Doanh Thu Bán Hàng 6 Tháng Gần Nhất
                  </h3>
                  
                  {/* CSS-based Bar Chart */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '240px', padding: '0 15px 15px 15px', position: 'relative', borderLeft: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
                    
                    {stats.monthlyRevenue.map((item, idx) => {
                      const percentage = (item.revenue / maxMonthlyRevenue) * 100;
                      return (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', margin: '0 8px' }} className="chart-bar-group">
                          {/* Tooltip on hover */}
                          <div style={{ 
                            position: 'absolute', top: `calc(${(100 - percentage).toFixed(0)}% - 40px)`, 
                            backgroundColor: 'var(--secondary-color)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', 
                            display: 'none', zIndex: 10, pointerEvents: 'none', whiteSpace: 'nowrap'
                          }} className="bar-tooltip">
                            {formatPrice(item.revenue)}
                          </div>
                          
                          {/* Colored bar */}
                          <div style={{ 
                            width: '100%', 
                            height: `${percentage < 3 && item.revenue > 0 ? 3 : percentage.toFixed(0)}%`, 
                            background: 'linear-gradient(to top, var(--primary-color), var(--primary-hover))', 
                            borderRadius: '6px 6px 0 0',
                            transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer'
                          }} 
                          onMouseEnter={e => {
                            e.currentTarget.style.filter = 'brightness(1.1)';
                            e.currentTarget.parentElement.querySelector('.bar-tooltip').style.display = 'block';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.filter = 'none';
                            e.currentTarget.parentElement.querySelector('.bar-tooltip').style.display = 'none';
                          }}
                          />
                          
                          {/* Month tag */}
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '600', marginTop: '10px' }}>{item.month}</span>
                        </div>
                      );
                    })}
                  </div>
                  <style>{`
                    .chart-bar-group:hover .bar-tooltip { display: block !important; }
                  `}</style>
                </div>

                {/* Stock Warning Box */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#e65100' }}>
                    <AlertTriangle /> Cảnh Báo Hết Hàng ({stats.lowStockProducts.length})
                  </h3>

                  <div style={{ flex: 1, overflowY: 'auto', maxHeight: '230px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {stats.lowStockProducts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '30px 10px', color: '#4caf50', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={36} />
                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Kho hàng an toàn! Không có sản phẩm tồn kho thấp.</span>
                      </div>
                    ) : (
                      stats.lowStockProducts.map(prod => (
                        <div key={prod.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 12px', backgroundColor: '#fff3e0', borderRadius: '8px', borderLeft: '4px solid #ff9800' }}>
                          <img src={prod.imageUrl || '/racket_product_1.png'} alt={prod.name} style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: 'white', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong style={{ fontSize: '0.85rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Hãng: {prod.brand?.name || prod.brand}</span>
                          </div>
                          <span style={{ padding: '3px 8px', backgroundColor: '#f57c00', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '12px' }}>
                            Còn: {prod.stock}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px' }}>
                  Đơn Hàng Gần Đây
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#f9f9f9' }}>
                        <th style={{ padding: '12px 15px', fontWeight: '700' }}>Mã đơn</th>
                        <th style={{ padding: '12px 15px', fontWeight: '700' }}>Khách hàng</th>
                        <th style={{ padding: '12px 15px', fontWeight: '700' }}>Thời gian</th>
                        <th style={{ padding: '12px 15px', fontWeight: '700', textAlign: 'right' }}>Tổng tiền</th>
                        <th style={{ padding: '12px 15px', fontWeight: '700', textAlign: 'center' }}>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map(o => (
                        <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '12px 15px', fontWeight: '700', color: 'var(--primary-color)' }}>{o.orderCode}</td>
                          <td style={{ padding: '12px 15px', fontWeight: '600' }}>{o.fullName}</td>
                          <td style={{ padding: '12px 15px', fontSize: '0.8rem', color: 'var(--text-light)' }}>{formatDate(o.createdAt)}</td>
                          <td style={{ padding: '12px 15px', fontWeight: '700', color: '#ff3b30', textAlign: 'right' }}>{formatPrice(o.totalAmount)}</td>
                          <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                            <span style={{ 
                              padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                              backgroundColor: o.status === 'Hoàn thành' ? '#e8f5e9' : o.status === 'Đã hủy' ? '#ffebee' : '#fff8e1',
                              color: o.status === 'Hoàn thành' ? '#1b5e20' : o.status === 'Đã hủy' ? '#c62828' : '#b78103',
                            }}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="fade-in">
              {/* Product toolbar */}
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', flex: 1, minWidth: '300px' }}>
                  {/* Search box */}
                  <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', flex: 1, backgroundColor: 'white', overflow: 'hidden' }}>
                    <div style={{ padding: '10px', display: 'flex', alignItems: 'center', color: '#888' }}><Search size={16} /></div>
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm sản phẩm theo tên, hãng..." 
                      value={prodSearch}
                      onChange={e => setProdSearch(e.target.value)}
                      style={{ border: 'none', outline: 'none', width: '100%', paddingRight: '10px', fontSize: '0.9rem' }}
                    />
                  </div>
                  {/* Category Filter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={16} style={{ color: 'var(--text-light)' }} />
                    <select 
                      value={prodCategory}
                      onChange={e => setProdCategory(e.target.value)}
                      style={{ padding: '10px', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: '600', backgroundColor: 'white', cursor: 'pointer' }}
                    >
                      <option value="ALL">Tất cả phân loại</option>
                      {Object.entries(categoryMap).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleOpenAddProduct}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 10px rgba(244,121,32,0.2)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
                >
                  <Plus size={18} /> Thêm Sản Phẩm
                </button>
              </div>

              {/* Products Table */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '15px', fontWeight: '700', width: '80px' }}>Hình ảnh</th>
                      <th style={{ padding: '15px', fontWeight: '700' }}>Tên sản phẩm</th>
                      <th style={{ padding: '15px', fontWeight: '700' }}>Thương hiệu</th>
                      <th style={{ padding: '15px', fontWeight: '700' }}>Danh mục</th>
                      <th style={{ padding: '15px', fontWeight: '700', textAlign: 'right' }}>Giá bán</th>
                      <th style={{ padding: '15px', fontWeight: '700', textAlign: 'center' }}>Tồn kho</th>
                      <th style={{ padding: '15px', fontWeight: '700', textAlign: 'center' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-light)' }}>Không tìm thấy sản phẩm nào!</td>
                      </tr>
                    ) : (
                      filteredProducts.map(prod => (
                        <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '10px 15px' }}>
                            <img src={prod.imageUrl || '/racket_product_1.png'} alt={prod.name} style={{ width: '50px', height: '50px', objectFit: 'contain', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px' }} />
                          </td>
                          <td style={{ padding: '15px', fontWeight: '600', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.name}</td>
                          <td style={{ padding: '15px', fontWeight: '500' }}>{prod.brand?.name || prod.brand}</td>
                          <td style={{ padding: '15px' }}>
                            <span style={{ padding: '3px 8px', backgroundColor: '#f1f1f1', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '500' }}>
                              {prod.category?.name || prod.categoryName}
                            </span>
                          </td>
                          <td style={{ padding: '15px', fontWeight: '700', color: '#ff3b30', textAlign: 'right' }}>{formatPrice(prod.price)}</td>
                          <td style={{ padding: '15px', textAlign: 'center' }}>
                            <span style={{ 
                              padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700',
                              backgroundColor: prod.stock <= 10 ? '#ffebee' : '#e8f5e9',
                              color: prod.stock <= 10 ? '#c62828' : '#1b5e20'
                            }}>
                              {prod.stock}
                            </span>
                          </td>
                          <td style={{ padding: '15px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button 
                                onClick={() => handleOpenEditProduct(prod)}
                                style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '6px', cursor: 'pointer', color: '#1976d2' }}
                                title="Sửa sản phẩm"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(prod.id)}
                                style={{ padding: '8px', backgroundColor: '#ffebee', borderRadius: '6px', cursor: 'pointer', color: '#c62828' }}
                                title="Xóa sản phẩm"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="fade-in">
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                {/* Search */}
                <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', width: '320px', backgroundColor: 'white', overflow: 'hidden' }}>
                  <div style={{ padding: '10px', display: 'flex', alignItems: 'center', color: '#888' }}><Search size={16} /></div>
                  <input 
                    type="text" 
                    placeholder="Tìm theo tên sản phẩm, hãng..." 
                    value={prodSearch}
                    onChange={e => setProdSearch(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', paddingRight: '10px', fontSize: '0.9rem' }}
                  />
                </div>
                
                <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                  Sản phẩm có kho hàng thấp (tồn kho &le; 10) được hiển thị màu đỏ để thủ kho dễ kiểm tra.
                </span>
              </div>

              {/* Inventory Table */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '15px', fontWeight: '700', width: '80px' }}>Hình ảnh</th>
                      <th style={{ padding: '15px', fontWeight: '700' }}>Tên sản phẩm</th>
                      <th style={{ padding: '15px', fontWeight: '700' }}>Danh mục</th>
                      <th style={{ padding: '15px', fontWeight: '700', textAlign: 'center', width: '220px' }}>Số lượng tồn kho hiện tại</th>
                      <th style={{ padding: '15px', fontWeight: '700', textAlign: 'center' }}>Trạng thái kho</th>
                      <th style={{ padding: '15px', fontWeight: '700', textAlign: 'center', width: '150px' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(prod => (
                      <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '10px 15px' }}>
                          <img src={prod.imageUrl || '/racket_product_1.png'} alt={prod.name} style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
                        </td>
                        <td style={{ padding: '15px', fontWeight: '600' }}>{prod.name}</td>
                        <td style={{ padding: '15px' }}>{prod.category?.name || prod.categoryName}</td>
                        
                        {/* Interactive stock input cell */}
                        <td style={{ padding: '15px', textAlign: 'center' }}>
                          {inlineStockId === prod.id ? (
                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
                              <button 
                                onClick={() => setInlineStockVal(prev => Math.max(0, prev - 1))}
                                style={{ padding: '5px 10px', backgroundColor: '#e0e0e0', borderRadius: '4px', fontWeight: 'bold' }}
                              >-</button>
                              <input 
                                type="number" 
                                value={inlineStockVal}
                                onChange={e => setInlineStockVal(parseInt(e.target.value) || 0)}
                                style={{ width: '60px', padding: '6px', border: '1px solid var(--border-color)', borderRadius: '4px', textAlign: 'center', fontWeight: '700' }}
                              />
                              <button 
                                onClick={() => setInlineStockVal(prev => prev + 1)}
                                style={{ padding: '5px 10px', backgroundColor: '#e0e0e0', borderRadius: '4px', fontWeight: 'bold' }}
                              >+</button>
                            </div>
                          ) : (
                            <strong style={{ fontSize: '1.05rem', color: prod.stock <= 10 ? '#d32f2f' : 'inherit' }}>{prod.stock}</strong>
                          )}
                        </td>
                        
                        {/* Status tag */}
                        <td style={{ padding: '15px', textAlign: 'center' }}>
                          <span style={{ 
                            padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800',
                            backgroundColor: prod.stock === 0 ? '#ffebee' : prod.stock <= 10 ? '#fff3e0' : '#e8f5e9',
                            color: prod.stock === 0 ? '#c62828' : prod.stock <= 10 ? '#e65100' : '#2e7d32'
                          }}>
                            {prod.stock === 0 ? 'Hết hàng' : prod.stock <= 10 ? 'Tồn kho thấp' : 'Đầy đủ'}
                          </span>
                        </td>

                        {/* Stock Actions */}
                        <td style={{ padding: '15px', textAlign: 'center' }}>
                          {inlineStockId === prod.id ? (
                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                              <button 
                                onClick={() => handleSaveInlineStock(prod.id)}
                                style={{ padding: '6px 12px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                              >Lưu</button>
                              <button 
                                onClick={() => setInlineStockId(null)}
                                style={{ padding: '6px 12px', backgroundColor: '#e0e0e0', color: 'var(--text-dark)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                              >Hủy</button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleOpenInlineStock(prod)}
                              style={{ padding: '6px 12px', backgroundColor: '#f5f5f5', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: '0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                            >
                              Điều chỉnh kho
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS MANAGEMENT (INTEGRATED) */}
          {activeTab === 'orders' && (
            <div className="fade-in">
              <div style={{ display: 'flex', gap: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Search */}
                <div style={{ flex: 1, minWidth: '260px', display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white' }}>
                  <div style={{ padding: '10px', display: 'flex', alignItems: 'center', color: '#888' }}><Search size={16} /></div>
                  <input 
                    type="text" 
                    placeholder="Tìm mã đơn hàng, tên khách hàng, số điện thoại..." 
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    style={{ width: '100%', padding: '10px 10px 10px 0', border: 'none', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>

                {/* Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', fontWeight: '600' }}>
                    <Filter size={16} /> Trạng thái:
                  </span>
                  <select 
                    value={orderStatus} 
                    onChange={e => setOrderStatus(e.target.value)}
                    style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontWeight: '600', cursor: 'pointer', backgroundColor: 'white' }}
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

              {/* Table */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid var(--border-color)' }}>
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
                        <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>Không có đơn hàng nào phù hợp!</td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '15px', fontWeight: '700', color: 'var(--primary-color)' }}>{order.orderCode}</td>
                          <td style={{ padding: '15px' }}>
                            <div style={{ fontWeight: '600' }}>{order.fullName}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>SĐT: {order.phone}</div>
                          </td>
                          <td style={{ padding: '15px', fontSize: '0.85rem' }}>{formatDate(order.createdAt)}</td>
                          <td style={{ padding: '15px', fontWeight: '700', color: '#ff3b30', textAlign: 'right' }}>{formatPrice(order.totalAmount)}</td>
                          <td style={{ padding: '15px', textAlign: 'center' }}>
                            <span style={{ 
                              padding: '5px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', display: 'inline-block',
                              backgroundColor: order.status === 'Chờ xác nhận' ? '#fff8e1' : order.status === 'Đang xử lý' ? '#e3f2fd' : order.status === 'Đang giao hàng' ? '#fff3e0' : order.status === 'Hoàn thành' ? '#e8f5e9' : '#ffebee',
                              color: order.status === 'Chờ xác nhận' ? '#b78103' : order.status === 'Đang xử lý' ? '#0d47a1' : order.status === 'Đang giao hàng' ? '#e65100' : order.status === 'Hoàn thành' ? '#1b5e20' : '#c62828',
                              border: `1px solid ${order.status === 'Chờ xác nhận' ? '#ffe082' : order.status === 'Đang xử lý' ? '#90caf9' : order.status === 'Đang giao hàng' ? '#ffcc80' : order.status === 'Hoàn thành' ? '#a5d6a7' : '#ef9a9a'}`
                            }}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ padding: '15px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                              <button 
                                onClick={() => setSelectedOrder(order)}
                                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}
                              >
                                <Eye size={15} /> Xem
                              </button>

                              <select 
                                value={order.status} 
                                disabled={isUpdatingStatus}
                                onChange={e => handleOrderStatusChange(order.id, e.target.value)}
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
            </div>
          )}

          {/* TAB 5: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="fade-in">
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                {/* Search */}
                <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', width: '320px', backgroundColor: 'white', overflow: 'hidden' }}>
                  <div style={{ padding: '10px', display: 'flex', alignItems: 'center', color: '#888' }}><Search size={16} /></div>
                  <input 
                    type="text" 
                    placeholder="Tìm theo họ tên, email, số điện thoại..." 
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', paddingRight: '10px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Users Table */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '15px', fontWeight: '700' }}>ID</th>
                      <th style={{ padding: '15px', fontWeight: '700' }}>Họ và tên</th>
                      <th style={{ padding: '15px', fontWeight: '700' }}>Email</th>
                      <th style={{ padding: '15px', fontWeight: '700' }}>Số điện thoại</th>
                      <th style={{ padding: '15px', fontWeight: '700', textAlign: 'center' }}>Quyền hạn</th>
                      <th style={{ padding: '15px', fontWeight: '700', textAlign: 'center' }}>Trạng thái</th>
                      <th style={{ padding: '15px', fontWeight: '700', textAlign: 'center', width: '260px' }}>Thao tác quản lý</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-light)' }}>Không tìm thấy người dùng nào!</td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => {
                        const isSelf = user.email === localStorage.getItem('emailOrPhone') || user.fullName === localStorage.getItem('fullName');
                        return (
                          <tr key={user.userId} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: isSelf ? '#f9f9f9' : 'transparent' }}>
                            <td style={{ padding: '15px', fontWeight: '700' }}>{user.userId}</td>
                            <td style={{ padding: '15px', fontWeight: '600' }}>
                              {user.fullName} {isSelf && <span style={{ fontSize: '0.75rem', padding: '2px 6px', backgroundColor: '#e3f2fd', color: '#0d47a1', borderRadius: '4px', marginLeft: '5px' }}>Bạn</span>}
                            </td>
                            <td style={{ padding: '15px' }}>{user.email}</td>
                            <td style={{ padding: '15px' }}>{user.phone || 'N/A'}</td>
                            <td style={{ padding: '15px', textAlign: 'center' }}>
                              <span style={{ 
                                padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800',
                                backgroundColor: user.role === 'admin' ? '#ede7f6' : '#f5f5f5',
                                color: user.role === 'admin' ? '#673ab7' : 'var(--text-dark)'
                              }}>
                                {user.role === 'admin' ? 'ADMIN' : 'Thành viên'}
                              </span>
                            </td>
                            <td style={{ padding: '15px', textAlign: 'center' }}>
                              <span style={{ 
                                padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800',
                                backgroundColor: user.isActive ? '#e8f5e9' : '#ffebee',
                                color: user.isActive ? '#2e7d32' : '#c62828'
                              }}>
                                {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                              </span>
                            </td>
                            <td style={{ padding: '15px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                {/* Change Role Button */}
                                <button 
                                  onClick={() => handleToggleUserRole(user.userId, user.role)}
                                  disabled={isSelf}
                                  style={{ 
                                    display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: isSelf ? 'not-allowed' : 'pointer',
                                    backgroundColor: user.role === 'admin' ? '#fff3e0' : '#ede7f6',
                                    color: user.role === 'admin' ? '#e65100' : '#673ab7',
                                    border: 'none',
                                    opacity: isSelf ? 0.5 : 1
                                  }}
                                  title={isSelf ? 'Không thể tự hạ quyền của mình' : `Chuyển thành ${user.role === 'admin' ? 'Member' : 'Admin'}`}
                                >
                                  {user.role === 'admin' ? <UserMinus size={14} /> : <UserCheck size={14} />} 
                                  {user.role === 'admin' ? 'Hạ quyền' : 'Lên Admin'}
                                </button>

                                {/* Block/Unblock Button */}
                                <button 
                                  onClick={() => handleToggleUserStatus(user.userId, user.isActive)}
                                  disabled={isSelf}
                                  style={{ 
                                    display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: isSelf ? 'not-allowed' : 'pointer',
                                    backgroundColor: user.isActive ? '#ffebee' : '#e8f5e9',
                                    color: user.isActive ? '#c62828' : '#2e7d32',
                                    border: 'none',
                                    opacity: isSelf ? 0.5 : 1
                                  }}
                                  title={isSelf ? 'Không thể tự khóa mình' : user.isActive ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}
                                >
                                  {user.isActive ? 'Khóa' : 'Mở khóa'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 1. PRODUCT ADD/EDIT MODAL OVERLAY */}
      {showProductModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
        }}>
          <div className="fade-in" style={{ 
            backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '650px', maxHeight: '90vh', 
            overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', padding: '25px'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>
                {modalProduct.id ? 'Cập Nhật Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h3>
              <button 
                onClick={() => setShowProductModal(false)} 
                style={{ border: 'none', background: 'none', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', color: '#888' }}
              >&times;</button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-dark)' }}>Tên sản phẩm *</label>
                <input 
                  type="text" 
                  required
                  value={modalProduct.name}
                  onChange={e => setModalProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên sản phẩm đầy đủ..."
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-dark)' }}>Giá bán (VND) *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={modalProduct.price}
                    onChange={e => setModalProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-dark)' }}>Số lượng nhập kho *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={modalProduct.stock}
                    onChange={e => setModalProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-dark)' }}>Thương hiệu *</label>
                  <select 
                    value={modalProduct.brand}
                    onChange={e => setModalProduct(prev => ({ ...prev, brand: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', backgroundColor: 'white' }}
                  >
                    <option value="Yonex">Yonex</option>
                    <option value="Lining">Lining</option>
                    <option value="Victor">Victor</option>
                    <option value="Kawasaki">Kawasaki</option>
                    <option value="Mizuno">Mizuno</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-dark)' }}>Danh mục phân loại *</label>
                  <select 
                    value={modalProduct.categoryId}
                    onChange={e => handleCategoryChange(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', backgroundColor: 'white' }}
                  >
                    {Object.entries(categoryMap).map(([id, name]) => (
                      <option key={id} value={id}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-dark)' }}>Đường dẫn hình ảnh *</label>
                <input 
                  type="text" 
                  required
                  value={modalProduct.imageUrl}
                  onChange={e => setModalProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="Ví dụ: /racket_product_1.png hoặc đường dẫn URL ảnh..."
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-dark)' }}>Mô tả sản phẩm</label>
                <textarea 
                  value={modalProduct.description}
                  onChange={e => setModalProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Nhập mô tả sản phẩm chi tiết..."
                  rows="4"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', resize: 'vertical' }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowProductModal(false)}
                  style={{ padding: '10px 20px', backgroundColor: '#e0e0e0', color: 'var(--text-dark)', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  disabled={submittingProduct}
                  style={{ padding: '10px 25px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', opacity: submittingProduct ? 0.7 : 1 }}
                >
                  {submittingProduct ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. DETAILS MODAL OVERLAY (FOR ORDERS) */}
      {selectedOrder && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
        }}>
          <div className="fade-in" style={{ 
            backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '750px', maxHeight: '90vh', 
            overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', padding: '30px'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800' }}>
                Chi tiết đơn hàng #{selectedOrder.orderCode}
              </h3>
              <button 
                onClick={() => setSelectedOrder(null)} 
                style={{ border: 'none', background: 'none', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', color: '#888' }}
              >&times;</button>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Quick Status Control */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                <span style={{ fontWeight: '600' }}>Trạng thái đơn:</span>
                <select 
                  value={selectedOrder.status} 
                  disabled={isUpdatingStatus}
                  onChange={e => handleOrderStatusChange(selectedOrder.id, e.target.value)}
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

              {/* Recipient details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div>
                  <strong style={{ display: 'block', marginBottom: '6px' }}>Khách hàng nhận</strong>
                  <span style={{ fontSize: '0.9rem', display: 'block' }}>Họ tên: {selectedOrder.fullName}</span>
                  <span style={{ fontSize: '0.9rem', display: 'block' }}>SĐT: {selectedOrder.phone}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', marginBottom: '6px' }}>Địa chỉ giao hàng</strong>
                  <span style={{ fontSize: '0.85rem', lineHeight: 1.4, display: 'block' }}>{selectedOrder.address}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', marginBottom: '6px' }}>Thông tin thanh toán</strong>
                  <span style={{ fontSize: '0.85rem', display: 'block' }}>Đặt lúc: {formatDate(selectedOrder.createdAt)}</span>
                  <span style={{ fontSize: '0.85rem', display: 'block', color: 'var(--primary-color)', fontWeight: '600' }}>Phương thức: {selectedOrder.paymentMethod}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div style={{ backgroundColor: '#fffde7', borderLeft: '4px solid #fbc02d', padding: '12px 15px', borderRadius: '4px', fontSize: '0.9rem' }}>
                  <strong>Ghi chú:</strong> "{selectedOrder.notes}"
                </div>
              )}

              {/* Product items table */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
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
                            Cấu hình: {item.details || 'Tiêu chuẩn'}
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
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                style={{ padding: '10px 20px', fontWeight: '600', backgroundColor: 'var(--secondary-color)', color: 'white', borderRadius: '6px' }}
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

export default AdminDashboard;
