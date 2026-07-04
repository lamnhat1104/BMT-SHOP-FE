import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { homeApi } from '../api/home';
import ProductCard from '../components/ProductCard';

function Home() {
  const [homeData, setHomeData] = useState({
    categories: [],
    featuredProducts: [],
    newArrivals: [],
    saleProducts: [],
    bestSellers: [],
    topBrands: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const data = await homeApi.getHomeData();
      setHomeData(data);
    } catch (error) {
      console.error('Lỗi khi tải trang chủ:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải trang chủ...</div>;
  }

  // Fallback images if category image is null
  const defaultCategoryImages = [
    '/racket_product_1.png',
    '/shoe_product_1.png',
    '/racket_product_1.png',
    '/shoe_product_1.png'
  ];

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
      {homeData.categories && homeData.categories.length > 0 && (
        <section className="categories container fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="section-header">
            <h2 className="section-title">Danh Mục Sản Phẩm</h2>
          </div>
          <div className="category-grid">
            {homeData.categories.map((category, index) => (
              <Link to={`/products?categoryId=${category.id}`} className="category-card" key={category.id}>
                <img 
                  src={category.image || defaultCategoryImages[index % defaultCategoryImages.length]} 
                  alt={category.name} 
                  style={{ filter: index > 1 ? `hue-rotate(${index * 45}deg)` : 'none' }}
                />
                <div className="category-overlay">
                  <h3>{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      {homeData.featuredProducts && homeData.featuredProducts.length > 0 && (
        <section className="products container fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="section-header">
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
            <Link to="/products" className="view-all">Xem tất cả ›</Link>
          </div>
          <div className="product-grid">
            {homeData.featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* NEW ARRIVALS */}
      {homeData.newArrivals && homeData.newArrivals.length > 0 && (
        <section className="products container fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="section-header">
            <h2 className="section-title">Sản Phẩm Mới (New Arrivals)</h2>
            <Link to="/products" className="view-all">Xem tất cả ›</Link>
          </div>
          <div className="product-grid">
            {homeData.newArrivals.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* BEST SELLERS */}
      {homeData.bestSellers && homeData.bestSellers.length > 0 && (
        <section className="products container fade-in" style={{ animationDelay: '0.6s', background: '#fafafa', padding: '40px' }}>
          <div className="section-header">
            <h2 className="section-title">Sản Phẩm Bán Chạy (Best Sellers)</h2>
            <Link to="/products" className="view-all">Xem tất cả ›</Link>
          </div>
          <div className="product-grid">
            {homeData.bestSellers.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* SALE PRODUCTS */}
      {homeData.saleProducts && homeData.saleProducts.length > 0 && (
        <section className="products container fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="section-header">
            <h2 className="section-title" style={{ color: '#ff3b30' }}>Khuyến Mãi Lớn (Sale)</h2>
            <Link to="/products" className="view-all">Xem tất cả ›</Link>
          </div>
          <div className="product-grid">
            {homeData.saleProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* TOP BRANDS */}
      {homeData.topBrands && homeData.topBrands.length > 0 && (
        <section className="brands container fade-in" style={{ animationDelay: '0.8s', marginBottom: '60px' }}>
          <div className="section-header">
            <h2 className="section-title">Thương Hiệu Nổi Bật</h2>
          </div>
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {homeData.topBrands.map(brand => (
              <Link to={`/products?brand=${brand}`} key={brand} style={{
                padding: '20px 40px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#333',
                textDecoration: 'none',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }} className="brand-card">
                {brand}
              </Link>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .brand-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
          border-color: #ffb800 !important;
          color: #ffb800 !important;
        }
      `}</style>
    </>
  );
}

export default Home;
