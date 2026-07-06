import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi } from '../api/cart';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const loadCart = async () => {
    if (token) {
      setLoading(true);
      try {
        const data = await cartApi.getCart();
        setCartItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Lỗi tải giỏ hàng:', err);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const localCart = localStorage.getItem('cart');
        const cart = localCart ? JSON.parse(localCart) : [];
        setCartItems(Array.isArray(cart) ? cart : []);
      } catch (err) {
        console.error('Lỗi đọc local giỏ hàng:', err);
        setCartItems([]);
      }
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (id, delta, details) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    
    // Nếu có stock từ backend thì giới hạn, nếu không (localStorage cũ không có) thì thôi
    const maxQty = item.stock !== undefined ? item.stock : 999;
    const newQty = Math.max(1, Math.min(maxQty, item.quantity + delta));
    
    if (newQty === item.quantity) {
      if (item.quantity >= maxQty && delta > 0) {
        alert('Số lượng yêu cầu vượt quá sản phẩm có sẵn trong kho!');
      }
      return;
    }
    
    if (token) {
      try {
        const updatedCart = await cartApi.updateQty(id, newQty, details || '');
        setCartItems(updatedCart);
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (err) {
        alert(err.message || 'Lỗi cập nhật số lượng');
      }
    } else {
      const updated = cartItems.map(i => {
        if (i.id === id) {
          return { ...i, quantity: newQty };
        }
        return i;
      });
      setCartItems(updated);
      localStorage.setItem('cart', JSON.stringify(updated));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const removeItem = async (id, details) => {
    if (token) {
      try {
        const updatedCart = await cartApi.removeItem(id, details || '');
        setCartItems(updatedCart);
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (err) {
        alert(err.message || 'Lỗi xóa sản phẩm');
      }
    } else {
      const updated = cartItems.filter(i => i.id !== id);
      setCartItems(updated);
      localStorage.setItem('cart', JSON.stringify(updated));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const items = Array.isArray(cartItems) ? cartItems : [];

  // Tính tổng phụ và tổng cộng
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 0; // Miễn phí giao hàng
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="container fade-in" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛒</div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Giỏ Hàng Của Bạn Đang Trống</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>Hãy quay lại cửa hàng để chọn cho mình những sản phẩm ưng ý nhất.</p>
        <Link to="/products" className="btn-primary" style={{ padding: '12px 30px' }}>QUAY LẠI MUA SẮM</Link>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <span>Giỏ hàng</span>
      </div>

      <h1 style={{ fontSize: '1.8rem', marginTop: '20px', marginBottom: '30px' }}>
        Giỏ Hàng Của Bạn ({items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)
      </h1>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* Cart Items */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '15px', textAlign: 'left' }}>Sản phẩm</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Đơn giá</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Số lượng</th>
                <th style={{ padding: '15px', textAlign: 'right' }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '15px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <img 
                      src={item.thumbnail || '/racket_product_1.png'} 
                      alt={item.name} 
                      style={{ width: '80px', height: '80px', objectFit: 'contain', backgroundColor: '#f5f5f5', borderRadius: '8px' }} 
                    />
                    <div>
                      <h4 style={{ fontSize: '1.05rem', marginBottom: '5px', fontWeight: '600' }}>{item.name}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                        Thương hiệu: {item.brand} | {item.details}
                      </p>
                      <button 
                        onClick={() => removeItem(item.id, item.details)} 
                        style={{ fontSize: '0.85rem', color: '#ff3b30', background: 'none', marginTop: '5px', fontWeight: '600' }}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>{formatPrice(item.price)}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                      <button 
                        onClick={() => updateQty(item.id, -1, item.details)} 
                        style={{ padding: '5px 12px', backgroundColor: '#f9f9f9', border: 'none', fontWeight: 'bold' }}
                      >
                        -
                      </button>
                      <input 
                        type="text" 
                        value={item.quantity} 
                        readOnly 
                        style={{ width: '40px', textAlign: 'center', border: 'none', outline: 'none', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', fontWeight: '600' }} 
                      />
                      <button 
                        onClick={() => updateQty(item.id, 1, item.details)} 
                        style={{ padding: '5px 12px', backgroundColor: '#f9f9f9', border: 'none', fontWeight: 'bold' }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'right', fontWeight: '700', color: '#ff3b30' }}>
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '20px' }}>
            <Link to="/products" className="btn-primary" style={{ backgroundColor: 'transparent', color: 'var(--primary-color)', border: '2px solid var(--primary-color)', boxShadow: 'none', padding: '10px 20px', fontWeight: '600' }}>
              ← Tiếp tục mua hàng
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', alignSelf: 'flex-start' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '15px', fontWeight: '700' }}>Cộng Giỏ Hàng</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span>Tạm tính</span>
            <span style={{ fontWeight: '600' }}>{formatPrice(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span>Phí giao hàng</span>
            <span style={{ color: '#4caf50', fontWeight: '600' }}>Miễn phí</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginBottom: '25px' }}>
            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Tổng cộng</span>
            <span style={{ fontWeight: '700', fontSize: '1.4rem', color: '#ff3b30' }}>{formatPrice(total)}</span>
          </div>
          <button 
            onClick={() => {
              if (token) {
                navigate('/checkout');
              } else {
                alert('Vui lòng đăng nhập để tiến hành thanh toán đơn hàng!');
                navigate('/login?redirect=checkout');
              }
            }} 
            className="btn-primary" 
            style={{ width: '100%', textAlign: 'center', padding: '15px', fontWeight: '700' }}
          >
            TIẾN HÀNH THANH TOÁN
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
