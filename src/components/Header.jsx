import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Headphones, MapPin, Search, Binoculars, User, ShoppingCart, ChevronDown } from 'lucide-react';
import { cartApi } from '../api/cart';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({ token: null, fullName: '' });
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // 1. Xử lý các tham số query do Backend redirect về sau khi login OAuth2 (Social) thành công
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const fullNameParam = params.get('fullName');
    const roleParam = params.get('role');

    if (tokenParam) {
      localStorage.setItem('token', tokenParam);
      if (fullNameParam) {
        localStorage.setItem('fullName', decodeURIComponent(fullNameParam));
      }
      if (roleParam) {
        localStorage.setItem('role', roleParam);
      }
      
      // Đồng bộ giỏ hàng localStorage lên Database sau khi đăng nhập Social thành công
      const syncLocalCart = async () => {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (localCart.length > 0) {
          try {
            for (const item of localCart) {
              await cartApi.addCartItem(item.id, item.quantity, item.details || '');
            }
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('cartUpdated'));
          } catch (err) {
            console.error('Lỗi đồng bộ giỏ hàng Social:', err);
          }
        }
      };
      syncLocalCart();
      
      // Xóa các tham số query khỏi URL để URL sạch đẹp mà không cần reload trang
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. Đọc thông tin đăng nhập từ localStorage để đồng bộ UI
    const token = localStorage.getItem('token');
    const fullName = localStorage.getItem('fullName') || '';
    setUser({ token, fullName });

    // 3. Đọc và đồng bộ số lượng giỏ hàng
    const updateCartCount = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const cart = await cartApi.getCart();
          const items = Array.isArray(cart) ? cart : [];
          const total = items.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(total);
        } catch (err) {
          console.error('Lỗi lấy số lượng giỏ hàng:', err);
          setCartCount(0);
        }
      } else {
        try {
          const localCart = localStorage.getItem('cart');
          const cart = localCart ? JSON.parse(localCart) : [];
          const items = Array.isArray(cart) ? cart : [];
          const total = items.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(total);
        } catch (err) {
          console.error('Lỗi phân tích giỏ hàng local:', err);
          setCartCount(0);
        }
      }
    };

    const updateUserInfo = () => {
      const token = localStorage.getItem('token');
      const fullName = localStorage.getItem('fullName') || '';
      setUser({ token, fullName });
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('profileUpdated', updateUserInfo);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('profileUpdated', updateUserInfo);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    localStorage.removeItem('emailOrPhone');
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
    setUser({ token: null, fullName: '' });
    navigate('/');
  };

  return (
    <>
      <header className="header">
        {/* TOP HEADER */}
        <div className="top-header">
          <div className="container">
            <div className="top-header-left">
              Chào mừng bạn đến với VNB Badminton Shop!
            </div>
            <div className="top-header-right">
              {user.token ? (
                <>
                  <span>Xin chào, <strong style={{ color: 'var(--primary-color)' }}>{user.fullName || 'Khách hàng'}</strong></span>
                  <span className="separator">|</span>
                  <Link to="/account">Tài khoản</Link>
                  <span className="separator">|</span>
                  <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
                </>
              ) : (
                <>
                  <Link to="/login">Đăng nhập</Link>
                  <span className="separator">|</span>
                  <Link to="/register">Đăng ký</Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="main-header">
          <div className="container">
            {/* Left section: Logo & Info */}
            <div className="logo-section">
              <Link to="/" className="logo">
                <div className="logo-icon">VNB</div>
              </Link>
              
              <div className="header-info">
                <div className="info-item">
                  <Headphones size={20} className="info-icon" />
                  <span>HOTLINE: <span className="info-highlight">0977508430</span></span>
                </div>
                <div className="info-item">
                  <MapPin size={20} className="info-icon" />
                  <span>HỆ THỐNG CỬA HÀNG</span>
                </div>
              </div>
            </div>

            {/* Middle section: Search */}
            <div className="search-bar">
              <input type="text" placeholder="Tìm sản phẩm..." />
              <button>
                <Search size={18} />
              </button>
            </div>

            {/* Right section: Actions */}
            <div className="header-actions">
              <Link to="/order-tracking" className="action-item">
                <div className="action-icon-wrapper">
                  <Binoculars size={20} />
                </div>
                <span>TRA CỨU</span>
              </Link>
              
              {/* Dynamic User Menu & Dropdown */}
              <div className="action-item user-action-container">
                <Link to="/account" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="action-icon-wrapper">
                    <User size={20} />
                  </div>
                  <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.token ? (user.fullName ? user.fullName.split(' ').pop().toUpperCase() : 'TÀI KHOẢN') : 'TÀI KHOẢN'}
                  </span>
                </Link>
                
                {/* Dropdown Menu */}
                <div className="user-dropdown">
                  {user.token ? (
                    <>
                      <Link to="/account">Thông tin tài khoản</Link>
                      <Link to="/order-tracking">Tra cứu đơn hàng</Link>
                      <Link to="/wishlist">Sản phẩm yêu thích</Link>
                      <button onClick={handleLogout} className="dropdown-logout-btn">Đăng xuất</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login">Đăng nhập</Link>
                      <Link to="/register">Đăng ký</Link>
                      <Link to="/order-tracking">Tra cứu đơn hàng</Link>
                    </>
                  )}
                </div>
              </div>

              <Link to="/cart" className="action-item">
                <div className="action-icon-wrapper">
                  <ShoppingCart size={20} />
                  <div className="badge">{cartCount}</div>
                </div>
                <span>GIỎ HÀNG</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="navigation">
        <div className="container">
          <ul className="nav-list">
            <li><NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>TRANG CHỦ</NavLink></li>
            <li><NavLink to="/products" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>SẢN PHẨM <ChevronDown size={14} /></NavLink></li>
            <li><NavLink to="/products?category=sale" className="nav-item">SALE OFF</NavLink></li>
            <li><NavLink to="/news" className="nav-item">TIN TỨC</NavLink></li>
            <li><NavLink to="/franchise" className="nav-item">CHÍNH SÁCH NHƯỢNG QUYỀN</NavLink></li>
            <li><NavLink to="/guides" className="nav-item">HƯỚNG DẪN <ChevronDown size={14} /></NavLink></li>
            <li><NavLink to="/about" className="nav-item">GIỚI THIỆU</NavLink></li>
            <li><NavLink to="/contact" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>LIÊN HỆ</NavLink></li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Header;
