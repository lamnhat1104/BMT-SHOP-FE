import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Headphones, MapPin, Search, Binoculars, User, ShoppingCart, ChevronDown } from 'lucide-react';

function Header() {
  return (
    <>
      <header className="header">
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
              <Link to="/account" className="action-item">
                <div className="action-icon-wrapper">
                  <User size={20} />
                </div>
                <span>TÀI KHOẢN</span>
              </Link>
              <Link to="/cart" className="action-item">
                <div className="action-icon-wrapper">
                  <ShoppingCart size={20} />
                  <div className="badge">0</div>
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
