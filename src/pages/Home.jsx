import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      {/* HERO BANNER */}
      <section className="hero">
        <img src="/hero_banner.png" alt="Badminton Smash Banner" className="hero-img" />
        <div className="container">
          <div className="hero-content fade-in">
            <h1>CHINH PHỤC <br/><span>ĐAM MÊ CẦU LÔNG</span></h1>
            <p>Khám phá bộ sưu tập vợt, giày và phụ kiện cầu lông chính hãng mới nhất. Trang bị ngay để nâng tầm kỹ năng của bạn trên sân đấu!</p>
            <Link to="/products" className="btn-primary">Mua sắm ngay</Link>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="categories container fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="section-header">
          <h2 className="section-title">Danh Mục Nổi Bật</h2>
        </div>
        <div className="category-grid">
          <Link to="/products" className="category-card">
            <img src="/racket_product_1.png" alt="Vợt Cầu Lông" />
            <div className="category-overlay">
              <h3>Vợt Cầu Lông</h3>
            </div>
          </Link>
          <Link to="/products" className="category-card">
            <img src="/shoe_product_1.png" alt="Giày Cầu Lông" />
            <div className="category-overlay">
              <h3>Giày Cầu Lông</h3>
            </div>
          </Link>
          <Link to="/products" className="category-card">
            <img src="/racket_product_1.png" alt="Balo Cầu Lông" style={{ filter: 'hue-rotate(90deg)' }} />
            <div className="category-overlay">
              <h3>Balo - Túi Xách</h3>
            </div>
          </Link>
          <Link to="/products" className="category-card">
            <img src="/shoe_product_1.png" alt="Quần Áo Cầu Lông" style={{ filter: 'hue-rotate(180deg)' }} />
            <div className="category-overlay">
              <h3>Quần Áo Cầu Lông</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* HOT PRODUCTS */}
      <section className="products container fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="section-header">
          <h2 className="section-title">Sản Phẩm Bán Chạy</h2>
          <Link to="/products" className="view-all">Xem tất cả ›</Link>
        </div>
        <div className="product-grid">
          {/* Product 1 */}
          <Link to="/products/1" className="product-card" style={{ display: 'block', color: 'inherit' }}>
            <div className="product-badge">-15%</div>
            <img src="/racket_product_1.png" alt="Vợt Yonex" className="product-image" />
            <div className="product-brand">YONEX</div>
            <h3 className="product-title">Vợt Cầu Lông Yonex Astrox 99 Pro (White Tiger)</h3>
            <div className="product-price">
              <span className="price-current">3.450.000₫</span>
              <span className="price-old">4.000.000₫</span>
            </div>
            <button className="btn-add-to-cart">Thêm vào giỏ</button>
          </Link>
          
          {/* Product 2 */}
          <Link to="/products/2" className="product-card" style={{ display: 'block', color: 'inherit' }}>
            <img src="/shoe_product_1.png" alt="Giày Lining" className="product-image" />
            <div className="product-brand">LINING</div>
            <h3 className="product-title">Giày Cầu Lông Lining Halberd III Lite Trắng Cam</h3>
            <div className="product-price">
              <span className="price-current">1.250.000₫</span>
            </div>
            <button className="btn-add-to-cart">Thêm vào giỏ</button>
          </Link>

          {/* Product 3 */}
          <Link to="/products/3" className="product-card" style={{ display: 'block', color: 'inherit' }}>
            <div className="product-badge">HOT</div>
            <img src="/racket_product_1.png" alt="Vợt Victor" className="product-image" style={{ filter: 'hue-rotate(45deg)' }} />
            <div className="product-brand">VICTOR</div>
            <h3 className="product-title">Vợt Cầu Lông Victor Thruster Ryuga II (Mã JP)</h3>
            <div className="product-price">
              <span className="price-current">3.100.000₫</span>
            </div>
            <button className="btn-add-to-cart">Thêm vào giỏ</button>
          </Link>

          {/* Product 4 */}
          <Link to="/products/4" className="product-card" style={{ display: 'block', color: 'inherit' }}>
            <img src="/shoe_product_1.png" alt="Giày Yonex" className="product-image" style={{ filter: 'hue-rotate(-45deg)' }} />
            <div className="product-brand">YONEX</div>
            <h3 className="product-title">Giày Cầu Lông Yonex Power Cushion 65Z3 Men</h3>
            <div className="product-price">
              <span className="price-current">2.850.000₫</span>
            </div>
            <button className="btn-add-to-cart">Thêm vào giỏ</button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
