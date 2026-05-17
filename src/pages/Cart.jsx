import React from 'react';
import { Link } from 'react-router-dom';

function Cart() {
  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <span>Giỏ hàng</span>
      </div>

      <h1 style={{ fontSize: '1.8rem', marginTop: '20px', marginBottom: '30px' }}>Giỏ Hàng Của Bạn (2 sản phẩm)</h1>

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
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '15px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <img src="/racket_product_1.png" alt="Racket" style={{ width: '80px', height: '80px', objectFit: 'contain', backgroundColor: '#f5f5f5', borderRadius: '8px' }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '5px' }}>Vợt Cầu Lông Yonex Astrox 99 Pro</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Thông số: 3U/G5</p>
                    <button style={{ fontSize: '0.85rem', color: '#ff3b30', background: 'none', marginTop: '5px' }}>Xóa</button>
                  </div>
                </td>
                <td style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>3.450.000₫</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                    <button style={{ padding: '5px 10px', backgroundColor: '#f9f9f9' }}>-</button>
                    <input type="text" value="1" readOnly style={{ width: '40px', textAlign: 'center', border: 'none', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }} />
                    <button style={{ padding: '5px 10px', backgroundColor: '#f9f9f9' }}>+</button>
                  </div>
                </td>
                <td style={{ padding: '15px', textAlign: 'right', fontWeight: '700', color: '#ff3b30' }}>3.450.000₫</td>
              </tr>
              <tr>
                <td style={{ padding: '15px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <img src="/shoe_product_1.png" alt="Shoe" style={{ width: '80px', height: '80px', objectFit: 'contain', backgroundColor: '#f5f5f5', borderRadius: '8px' }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '5px' }}>Giày Cầu Lông Lining Halberd III</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Size: 42</p>
                    <button style={{ fontSize: '0.85rem', color: '#ff3b30', background: 'none', marginTop: '5px' }}>Xóa</button>
                  </div>
                </td>
                <td style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>1.250.000₫</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                    <button style={{ padding: '5px 10px', backgroundColor: '#f9f9f9' }}>-</button>
                    <input type="text" value="1" readOnly style={{ width: '40px', textAlign: 'center', border: 'none', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }} />
                    <button style={{ padding: '5px 10px', backgroundColor: '#f9f9f9' }}>+</button>
                  </div>
                </td>
                <td style={{ padding: '15px', textAlign: 'right', fontWeight: '700', color: '#ff3b30' }}>1.250.000₫</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: '20px' }}>
            <Link to="/products" className="btn-primary" style={{ backgroundColor: 'transparent', color: 'var(--primary-color)', border: '2px solid var(--primary-color)', boxShadow: 'none', padding: '10px 20px' }}>← Tiếp tục mua hàng</Link>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', alignSelf: 'flex-start' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '15px' }}>Cộng Giỏ Hàng</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span>Tạm tính</span>
            <span style={{ fontWeight: '600' }}>4.700.000₫</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span>Phí giao hàng</span>
            <span>Miễn phí</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginBottom: '25px' }}>
            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Tổng cộng</span>
            <span style={{ fontWeight: '700', fontSize: '1.4rem', color: '#ff3b30' }}>4.700.000₫</span>
          </div>
          <button className="btn-primary" style={{ width: '100%', textAlign: 'center', padding: '15px' }}>TIẾN HÀNH THANH TOÁN</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
