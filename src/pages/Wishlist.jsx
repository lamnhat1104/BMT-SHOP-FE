import React from 'react';
import { Link } from 'react-router-dom';

function Wishlist() {
  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <span>Sản phẩm yêu thích</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Sản Phẩm Yêu Thích (2)</h1>
      </div>

      <div className="product-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {/* Wishlist Product 1 */}
        <div className="product-card">
          <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: '10', cursor: 'pointer', color: '#ff3b30', fontSize: '1.2rem', backgroundColor: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>✕</div>
          <Link to="/products/3" style={{ display: 'block', color: 'inherit' }}>
            <div className="product-badge">HOT</div>
            <img src="/racket_product_1.png" alt="Vợt Victor" className="product-image" style={{ filter: 'hue-rotate(45deg)' }} />
            <div className="product-brand">VICTOR</div>
            <h3 className="product-title">Vợt Cầu Lông Victor Thruster Ryuga II (Mã JP)</h3>
            <div className="product-price">
              <span className="price-current">3.100.000₫</span>
            </div>
          </Link>
          <button className="btn-add-to-cart">Thêm vào giỏ</button>
        </div>

        {/* Wishlist Product 2 */}
        <div className="product-card">
          <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: '10', cursor: 'pointer', color: '#ff3b30', fontSize: '1.2rem', backgroundColor: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>✕</div>
          <Link to="/products/4" style={{ display: 'block', color: 'inherit' }}>
            <img src="/shoe_product_1.png" alt="Giày Yonex" className="product-image" style={{ filter: 'hue-rotate(-45deg)' }} />
            <div className="product-brand">YONEX</div>
            <h3 className="product-title">Giày Cầu Lông Yonex Power Cushion 65Z3 Men</h3>
            <div className="product-price">
              <span className="price-current">2.850.000₫</span>
            </div>
          </Link>
          <button className="btn-add-to-cart">Thêm vào giỏ</button>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
