import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../api/product';
import { cartApi } from '../api/cart';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productApi.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Lỗi tải chi tiết sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    if (!price) return '0₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    const token = localStorage.getItem('token');
    const details = isShoe ? 'Size: 42' : '3U/G5';
    
    if (token) {
      try {
        await cartApi.addCartItem(product.id, qty, details);
        window.dispatchEvent(new Event('cartUpdated'));
        alert(`Đã thêm ${qty} sản phẩm "${product.name}" vào giỏ hàng!`);
      } catch (err) {
        alert(err.message || 'Lỗi thêm sản phẩm vào giỏ hàng');
      }
    } else {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find(item => item.id === product.id);
      
      if (existing) {
        existing.quantity += qty;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          thumbnail: product.imageUrl || product.thumbnail || '/racket_product_1.png',
          brand: brand,
          quantity: qty,
          details: details
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`Đã thêm ${qty} sản phẩm "${product.name}" vào giỏ hàng tạm!`);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>Đang tải thông tin sản phẩm...</div>;
  }

  if (error || !product) {
    return <div className="container" style={{ padding: '40px 20px', textAlign: 'center', color: 'red' }}>{error || 'Sản phẩm không tồn tại'}</div>;
  }

  const name = product.name;
  const img = product.imageUrl || product.thumbnail || '/racket_product_1.png';
  const price = product.price;
  const brand = product.brand ? product.brand.name : 'Unknown';
  
  // Logic tạm thời để phân biệt giày / vợt dựa vào category (nếu có)
  const isShoe = product.category && product.category.name && product.category.name.toLowerCase().includes('giày');

  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <Link to="/products">Sản phẩm</Link> / <span>{name}</span>
      </div>

      <div className="product-detail-wrapper" style={{ display: 'flex', gap: '50px', marginTop: '30px', backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        {/* Product Images */}
        <div className="product-images" style={{ flex: 1 }}>
          <div className="main-image" style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'center', backgroundColor: '#fcfcfc' }}>
            <img src={img} alt={name} style={{ width: '100%', maxWidth: '400px', objectFit: 'contain' }} />
          </div>
          <div className="thumbnail-list" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="thumbnail" style={{ width: '80px', height: '80px', border: '1px solid #eaeaea', borderRadius: '8px', padding: '5px', cursor: 'pointer', backgroundColor: '#fcfcfc' }}>
                <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info" style={{ flex: 1 }}>
          <div className="product-brand" style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '1rem', marginBottom: '10px' }}>{brand}</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px', lineHeight: 1.3 }}>{name}</h1>
          
          <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{ color: '#ffb800' }}>★★★★★</span>
            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>(0 đánh giá) | Đã bán 0</span>
          </div>

          <div className="product-price" style={{ fontSize: '2rem', fontWeight: 700, color: '#ff3b30', marginBottom: '30px' }}>
            {formatPrice(price)} 
          </div>

          <div className="product-options" style={{ marginBottom: '30px' }}>
            {isShoe ? (
              <div className="option-group">
                <h4 style={{ marginBottom: '10px' }}>Kích cỡ (Size):</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['39', '40', '41', '42', '43'].map(size => (
                    <button key={size} style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }}>{size}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="option-group">
                <h4 style={{ marginBottom: '10px' }}>Thông số (Trọng lượng / Chu vi cán):</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ padding: '8px 16px', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', borderRadius: '4px', backgroundColor: 'rgba(244,121,32,0.1)', fontWeight: 'bold' }}>3U/G5</button>
                  <button style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }}>4U/G5</button>
                </div>
              </div>
            )}
          </div>

          <div className="product-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '40px' }}>
            <div className="qty-selector" style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '10px 15px', backgroundColor: '#f5f5f5', borderRight: '1px solid var(--border-color)' }}>-</button>
              <input type="text" value={qty} readOnly style={{ width: '50px', textAlign: 'center', border: 'none', outline: 'none' }} />
              <button onClick={() => setQty(qty + 1)} style={{ padding: '10px 15px', backgroundColor: '#f5f5f5', borderLeft: '1px solid var(--border-color)' }}>+</button>
            </div>
            
            <button onClick={handleAddToCart} className="btn-primary" style={{ flex: 1, padding: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
              <span>🛒</span> THÊM VÀO GIỎ HÀNG
            </button>
          </div>

          <div className="product-promises" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>✔️ Cam kết hàng chính hãng 100%</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>✔️ Bảo hành 3 tháng (Lỗi 1 đổi 1)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>✔️ Giao hàng toàn quốc cực nhanh</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="product-tabs" style={{ marginTop: '50px', backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px' }}>
        <div className="tab-headers" style={{ display: 'flex', gap: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '30px' }}>
          <h3 style={{ color: 'var(--primary-color)', borderBottom: '3px solid var(--primary-color)', paddingBottom: '15px', marginBottom: '-16px', cursor: 'pointer' }}>Mô Tả Sản Phẩm</h3>
          <h3 style={{ color: 'var(--text-light)', cursor: 'pointer' }}>Thông Số Kỹ Thuật</h3>
          <h3 style={{ color: 'var(--text-light)', cursor: 'pointer' }}>Đánh Giá (0)</h3>
        </div>
        <div className="tab-content" style={{ lineHeight: 1.8 }}>
          <p>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
