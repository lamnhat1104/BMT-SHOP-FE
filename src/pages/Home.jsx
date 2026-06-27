import React from 'react';
import { Link } from 'react-router-dom';
import { cartApi } from '../api/cart';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

function Home() {
  const hotProducts = [
    {
      id: 1,
      name: "Vợt Cầu Lông Yonex Astrox 99 Pro (White Tiger)",
      price: 3450000,
      oldPrice: "4.000.000₫",
      thumbnail: "/racket_product_1.png",
      brand: "YONEX",
      tag: "-15%",
      details: "3U/G5"
    },
    {
      id: 2,
      name: "Giày Cầu Lông Lining Halberd III Lite Trắng Cam",
      price: 1250000,
      thumbnail: "/shoe_product_1.png",
      brand: "LINING",
      tag: null,
      details: "Size: 42"
    },
    {
      id: 3,
      name: "Vợt Cầu Lông Victor Thruster Ryuga II (Mã JP)",
      price: 3100000,
      thumbnail: "/racket_product_1.png",
      brand: "VICTOR",
      tag: "HOT",
      details: "3U/G5",
      style: { filter: 'hue-rotate(45deg)' }
    },
    {
      id: 4,
      name: "Giày Cầu Lông Yonex Power Cushion 65Z3 Men",
      price: 2850000,
      thumbnail: "/shoe_product_1.png",
      brand: "YONEX",
      tag: null,
      details: "Size: 42",
      style: { filter: 'hue-rotate(-45deg)' }
    }
  ];

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    const isShoe = product.name && product.name.toLowerCase().includes('giày');
    const details = product.details || (isShoe ? 'Size: 42' : '3U/G5');

    if (token) {
      try {
        await cartApi.addCartItem(product.id, 1, details);
        window.dispatchEvent(new Event('cartUpdated'));
        alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
      } catch (err) {
        alert(err.message || 'Lỗi thêm sản phẩm vào giỏ hàng');
      }
    } else {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find(item => item.id === product.id);
      
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          thumbnail: product.thumbnail,
          brand: product.brand,
          quantity: 1,
          details: details
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`Đã thêm "${product.name}" vào giỏ hàng tạm!`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

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
          {hotProducts.map(p => (
            <div className="product-card" key={p.id}>
              {p.tag && <div className="product-badge" style={{ backgroundColor: p.tag.includes('%') ? '#ff3b30' : '#ffb800' }}>{p.tag}</div>}
              <Link to={`/products/${p.id}`} className="product-card-link">
                <div className="product-image-wrapper">
                  <img src={optimizeCloudinaryUrl(p.thumbnail, 500)} alt={p.name} className="product-image" loading="lazy" style={p.style} />
                </div>
                <div className="product-brand">{p.brand}</div>
                <h3 className="product-title">{p.name}</h3>
                <div className="product-price">
                  <span className="price-current">{formatPrice(p.price)}</span>
                  {p.oldPrice && <span className="price-old">{p.oldPrice}</span>}
                </div>
              </Link>
              <button onClick={(e) => handleAddToCart(e, p)} className="btn-add-to-cart">Thêm vào giỏ</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
