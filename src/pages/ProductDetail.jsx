import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../api/product';
import { cartApi } from '../api/cart';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productApi.getProductById(id);
        setProduct(data);
        if (data) {
          setActiveImg(data.imageUrl || '/racket_product_1.png');
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          }
        }
      } catch (err) {
        setError(err.message || 'Lỗi tải chi tiết sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Tự động chuyển đổi ảnh chính sang màu sắc được chọn khi người dùng bấm chọn biến thể
  useEffect(() => {
    if (product && selectedVariant && selectedVariant.color) {
      const colorLower = selectedVariant.color.toLowerCase();
      const colorImg = product.images?.find(
        img => img.color && img.color.toLowerCase() === colorLower
      );
      if (colorImg) {
        setActiveImg(colorImg.imageUrl);
      }
    }
  }, [selectedVariant, product]);

  const formatPrice = (price) => {
    if (!price) return '0₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    const token = localStorage.getItem('token');
    
    // Xây dựng chuỗi thông số chi tiết từ biến thể được chọn
    let details = '';
    if (selectedVariant) {
      if (selectedVariant.size) {
        details = `Size: ${selectedVariant.size}`;
      } else if (selectedVariant.weight) {
        details = `${selectedVariant.weight}/${selectedVariant.grip || 'G5'}`;
      } else if (selectedVariant.color) {
        details = `Màu: ${selectedVariant.color}`;
      }
    } else {
      details = isShoe ? 'Size: 42' : '3U/G5';
    }
    
    if (token) {
      try {
        await cartApi.addCartItem(product.id, qty, details);
        window.dispatchEvent(new Event('cartUpdated'));
        alert(`Đã thêm ${qty} sản phẩm "${product.name}" (${details}) vào giỏ hàng!`);
      } catch (err) {
        alert(err.message || 'Lỗi thêm sản phẩm vào giỏ hàng');
      }
    } else {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find(item => item.id === product.id && item.details === details);
      
      if (existing) {
        existing.quantity += qty;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: selectedVariant ? selectedVariant.price : product.price,
          thumbnail: product.imageUrl || '/racket_product_1.png',
          brand: brand,
          quantity: qty,
          details: details
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`Đã thêm ${qty} sản phẩm "${product.name}" (${details}) vào giỏ hàng tạm!`);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>Đang tải thông tin sản phẩm...</div>;
  }

  if (error || !product) {
    return <div className="container" style={{ padding: '40px 20px', textAlign: 'center', color: 'red' }}>{error || 'Sản phẩm không tồn tại'}</div>;
  }

  const name = product.name;
  const brand = product.brand || 'Unknown';
  const isShoe = product.category && product.category.name && product.category.name.toLowerCase().includes('giày');
  
  // Dữ liệu giá và tồn kho hiển thị động theo biến thể
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayStock = selectedVariant ? selectedVariant.stock : product.stock;

  // Xác định các loại thuộc tính biến thể hiện có
  const hasSizes = product.variants && product.variants.some(v => v.size);
  const hasWeights = product.variants && product.variants.some(v => v.weight);
  const hasColors = product.variants && product.variants.some(v => v.color);

  // Lọc bộ sưu tập ảnh theo màu sắc được chọn của biến thể
  const filteredImages = useMemo(() => {
    if (!product || !product.images) return [];
    if (selectedVariant && selectedVariant.color) {
      const colorLower = selectedVariant.color.toLowerCase();
      const hasColorImages = product.images.some(img => img.color && img.color.toLowerCase() === colorLower);
      if (hasColorImages) {
        return product.images.filter(img => !img.color || img.color.toLowerCase() === colorLower);
      }
    }
    return product.images;
  }, [product, selectedVariant]);

  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <Link to="/products">Sản phẩm</Link> / <span>{name}</span>
      </div>

      <div className="product-detail-wrapper" style={{ display: 'flex', gap: '50px', marginTop: '30px', backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        {/* Product Images */}
        <div className="product-images" style={{ flex: 1 }}>
          <div className="main-image" style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'center', backgroundColor: '#fcfcfc', minHeight: '350px', alignItems: 'center' }}>
            <img src={activeImg} alt={name} style={{ width: '100%', maxHeight: '350px', objectFit: 'contain' }} />
          </div>
          <div className="thumbnail-list" style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
            {filteredImages && filteredImages.length > 0 ? (
              filteredImages.map((imgObj, idx) => (
                <div 
                  key={imgObj.id || idx} 
                  className={`thumbnail ${activeImg === imgObj.imageUrl ? 'active' : ''}`}
                  onClick={() => setActiveImg(imgObj.imageUrl)}
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    border: activeImg === imgObj.imageUrl ? '2px solid var(--primary-color)' : '1px solid #eaeaea', 
                    borderRadius: '8px', 
                    padding: '5px', 
                    cursor: 'pointer', 
                    backgroundColor: '#fcfcfc',
                    transition: 'all 0.2s ease',
                    boxShadow: activeImg === imgObj.imageUrl ? '0 2px 8px rgba(244,121,32,0.2)' : 'none'
                  }}
                >
                  <img src={imgObj.imageUrl} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              ))
            ) : (
              <div 
                className="thumbnail active"
                style={{ width: '80px', height: '80px', border: '2px solid var(--primary-color)', borderRadius: '8px', padding: '5px', backgroundColor: '#fcfcfc' }}
              >
                <img src={activeImg} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info" style={{ flex: 1 }}>
          <div className="product-brand" style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '1rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{brand}</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px', lineHeight: 1.3 }}>{name}</h1>
          
          <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{ color: '#ffb800' }}>★★★★★</span>
            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>(5 đánh giá) | Đã bán 12</span>
          </div>

          <div className="product-price-stock" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
            <div className="product-price" style={{ fontSize: '2.2rem', fontWeight: 700, color: '#ff3b30' }}>
              {formatPrice(displayPrice)} 
            </div>
            <div className="stock-badge" style={{ fontSize: '0.9rem', color: displayStock > 0 ? '#34c759' : '#ff3b30', backgroundColor: displayStock > 0 ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.1)', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
              {displayStock > 0 ? `Còn hàng (${displayStock} sản phẩm)` : 'Hết hàng'}
            </div>
          </div>

          {/* Dynamic Variant Options Selection */}
          <div className="product-options" style={{ marginBottom: '35px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {hasSizes && (
              <div className="option-group">
                <h4 style={{ marginBottom: '12px', fontWeight: 700 }}>Chọn kích cỡ (Size):</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.variants.filter(v => v.size).map(v => (
                    <button 
                      key={v.id} 
                      onClick={() => setSelectedVariant(v)}
                      style={{ 
                        padding: '10px 20px', 
                        border: selectedVariant?.id === v.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', 
                        color: selectedVariant?.id === v.id ? 'var(--primary-color)' : 'var(--text-color)',
                        borderRadius: '6px', 
                        backgroundColor: selectedVariant?.id === v.id ? 'rgba(244,121,32,0.08)' : 'white', 
                        fontWeight: selectedVariant?.id === v.id ? '700' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        minWidth: '60px'
                      }}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasWeights && (
              <div className="option-group">
                <h4 style={{ marginBottom: '12px', fontWeight: 700 }}>Chọn thông số (Trọng lượng / Cán):</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.variants.filter(v => v.weight).map(v => (
                    <button 
                      key={v.id} 
                      onClick={() => setSelectedVariant(v)}
                      style={{ 
                        padding: '10px 20px', 
                        border: selectedVariant?.id === v.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', 
                        color: selectedVariant?.id === v.id ? 'var(--primary-color)' : 'var(--text-color)',
                        borderRadius: '6px', 
                        backgroundColor: selectedVariant?.id === v.id ? 'rgba(244,121,32,0.08)' : 'white', 
                        fontWeight: selectedVariant?.id === v.id ? '700' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {v.weight}/{v.grip || 'G5'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasColors && (
              <div className="option-group">
                <h4 style={{ marginBottom: '12px', fontWeight: 700 }}>Chọn màu sắc:</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.variants.filter(v => v.color).map(v => (
                    <button 
                      key={v.id} 
                      onClick={() => setSelectedVariant(v)}
                      style={{ 
                        padding: '10px 20px', 
                        border: selectedVariant?.id === v.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', 
                        color: selectedVariant?.id === v.id ? 'var(--primary-color)' : 'var(--text-color)',
                        borderRadius: '6px', 
                        backgroundColor: selectedVariant?.id === v.id ? 'rgba(244,121,32,0.08)' : 'white', 
                        fontWeight: selectedVariant?.id === v.id ? '700' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {v.color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="product-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '40px' }}>
            <div className="qty-selector" style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', height: '48px', alignItems: 'center' }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '0 15px', height: '100%', backgroundColor: '#f5f5f5', border: 'none', borderRight: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
              <input type="text" value={qty} readOnly style={{ width: '50px', textAlign: 'center', border: 'none', outline: 'none', fontWeight: 'bold', fontSize: '1.1rem', backgroundColor: 'transparent' }} />
              <button onClick={() => setQty(qty + 1)} style={{ padding: '0 15px', height: '100%', backgroundColor: '#f5f5f5', border: 'none', borderLeft: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
            </div>
            
            <button 
              onClick={handleAddToCart} 
              className="btn-primary" 
              disabled={displayStock <= 0}
              style={{ 
                flex: 1, 
                height: '48px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '10px', 
                fontSize: '1.1rem',
                opacity: displayStock <= 0 ? 0.6 : 1,
                cursor: displayStock <= 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <span>🛒</span> {displayStock > 0 ? 'THÊM VÀO GIỎ HÀNG' : 'HẾT HÀNG'}
            </button>
          </div>

          <div className="product-promises" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontWeight: 500 }}>✔️ Cam kết hàng chính hãng 100%</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontWeight: 500 }}>✔️ Bảo hành 3 tháng (Lỗi 1 đổi 1)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500 }}>✔️ Giao hàng toàn quốc cực nhanh</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="product-tabs" style={{ marginTop: '50px', backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px' }}>
        <div className="tab-headers" style={{ display: 'flex', gap: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '30px' }}>
          <h3 style={{ color: 'var(--primary-color)', borderBottom: '3px solid var(--primary-color)', paddingBottom: '15px', marginBottom: '-16px', cursor: 'pointer' }}>Mô Tả Sản Phẩm</h3>
          <h3 style={{ color: 'var(--text-light)', cursor: 'pointer' }}>Thông Số Kỹ Thuật</h3>
          <h3 style={{ color: 'var(--text-light)', cursor: 'pointer' }}>Đánh Giá (5)</h3>
        </div>
        <div className="tab-content" style={{ lineHeight: 1.8 }}>
          <p style={{ whiteSpace: 'pre-line' }}>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
