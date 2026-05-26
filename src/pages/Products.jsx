import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../api/product';
import { cartApi } from '../api/cart';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getAllProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Lỗi tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Hàm format tiền tệ VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    const brand = product.brand ? (typeof product.brand === 'object' ? product.brand.name : product.brand) : 'Unknown Brand';
    const isShoe = product.category && product.category.name && product.category.name.toLowerCase().includes('giày');
    const details = isShoe ? 'Size: 42' : '3U/G5';
    
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
          thumbnail: product.imageUrl || product.thumbnail || '/racket_product_1.png',
          brand: brand,
          quantity: 1,
          details: details
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`Đã thêm "${product.name}" vào giỏ hàng tạm!`);
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <span>Tất cả sản phẩm</span>
      </div>
      
      <div className="products-layout" style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
        {/* Sidebar Filters */}
        <aside className="sidebar" style={{ width: '250px', flexShrink: 0 }}>
          <div className="filter-group">
            <h3>Danh Mục</h3>
            <ul>
              <li><label><input type="checkbox" /> Vợt Cầu Lông</label></li>
              <li><label><input type="checkbox" /> Giày Cầu Lông</label></li>
              <li><label><input type="checkbox" /> Áo Cầu Lông</label></li>
              <li><label><input type="checkbox" /> Balo / Túi Xách</label></li>
            </ul>
          </div>
          <div className="filter-group" style={{ marginTop: '30px' }}>
            <h3>Thương Hiệu</h3>
            <ul>
              <li><label><input type="checkbox" /> Yonex</label></li>
              <li><label><input type="checkbox" /> Lining</label></li>
              <li><label><input type="checkbox" /> Victor</label></li>
              <li><label><input type="checkbox" /> Mizuno</label></li>
            </ul>
          </div>
          <div className="filter-group" style={{ marginTop: '30px' }}>
            <h3>Mức Giá</h3>
            <ul>
              <li><label><input type="radio" name="price" /> Dưới 1 triệu</label></li>
              <li><label><input type="radio" name="price" /> 1 triệu - 3 triệu</label></li>
              <li><label><input type="radio" name="price" /> Trên 3 triệu</label></li>
            </ul>
          </div>
        </aside>

        {/* Product List */}
        <div className="products-main" style={{ flex: 1 }}>
          <div className="products-header" style={{ display: 'flex', justifycontent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.5rem' }}>Tất cả sản phẩm</h1>
            <select style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
              <option>Mới nhất</option>
              <option>Giá từ thấp tới cao</option>
              <option>Giá từ cao tới thấp</option>
            </select>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải sản phẩm...</div>
          ) : error ? (
            <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy sản phẩm nào.</div>
          ) : (
            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {products.map(p => (
                <Link to={`/products/${p.id}`} key={p.id} className="product-card" style={{ display: 'block', color: 'inherit' }}>
                  {p.tag && <div className="product-badge" style={{ backgroundColor: p.tag === 'NEW' ? '#4caf50' : '#ff3b30' }}>{p.tag}</div>}
                  <img 
                    src={p.imageUrl || p.thumbnail || '/racket_product_1.png'} 
                    alt={p.name} 
                    className="product-image" 
                    style={{ objectFit: 'contain' }}
                  />
                  <div className="product-brand">{p.brand ? p.brand.name : 'Unknown Brand'}</div>
                  <h3 className="product-title">{p.name}</h3>
                  <div className="product-price">
                    <span className="price-current">{formatPrice(p.price)}</span>
                  </div>
                  <button onClick={(e) => handleAddToCart(e, p)} className="btn-add-to-cart">Thêm vào giỏ</button>
                </Link>
              ))}
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '10px' }}>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">›</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
