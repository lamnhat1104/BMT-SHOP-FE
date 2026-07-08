import React from 'react';
import { Link } from 'react-router-dom';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import { cartApi } from '../api/cart';

function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('token');
    const isShoe = product.name && product.name.toLowerCase().includes('giày');
    // Default size/details if adding directly from product card
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
      
      const currentPrice = product.price - (product.price * (product.discountPercent || 0) / 100);
      const stock = product.stock !== undefined ? product.stock : 999;

      if (existing) {
        if (existing.quantity + 1 > stock) {
          alert('Số lượng trong giỏ hàng và số lượng yêu cầu vượt quá sản phẩm có sẵn trong kho!');
          return;
        }
        existing.quantity += 1;
        existing.stock = stock;
      } else {
        if (1 > stock) {
          alert('Sản phẩm đã hết hàng!');
          return;
        }
        cart.push({
          id: product.id,
          name: product.name,
          price: currentPrice,
          thumbnail: product.imageUrl,
          brand: product.brand,
          quantity: 1,
          details: details,
          stock: stock
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`Đã thêm "${product.name}" vào giỏ hàng tạm!`);
    }
  };

  const currentPrice = product.price - (product.price * (product.discountPercent || 0) / 100);
  const rating = product.rating || 5;
  const reviewCount = product.reviewCount || Math.floor(Math.random() * 50) + 1; // mock if 0 for UI demo purposes

  return (
    <div className="product-card">
      {product.discountPercent > 0 && <div className="product-badge">-{product.discountPercent}%</div>}
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-image-wrapper">
          <img src={optimizeCloudinaryUrl(product.imageUrl, 500)} alt={product.name} className="product-image" loading="lazy" />
        </div>
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-title">{product.name}</h3>
        <div className="product-rating" style={{ color: '#ffb800', fontSize: '14px', marginBottom: '8px' }}>
          <span>{'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}</span>
          <span className="review-count" style={{ color: '#888', marginLeft: '5px', fontSize: '12px' }}>({reviewCount})</span>
        </div>
        <div className="product-price">
          <span className="price-current">{formatPrice(currentPrice)}</span>
          {product.discountPercent > 0 && (
            <span className="price-old">{formatPrice(product.price)}</span>
          )}
        </div>
      </Link>
      <button onClick={(e) => handleAddToCart(e, product)} className="btn-add-to-cart">
        Thêm vào giỏ
      </button>
    </div>
  );
}

export default ProductCard;
