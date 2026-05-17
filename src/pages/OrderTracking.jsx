import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container fade-in" style={{ padding: '40px 20px', maxWidth: '800px' }}>
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <span>Kiểm tra đơn hàng</span>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginTop: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Kiểm Tra Đơn Hàng</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>Nhập mã đơn hàng và số điện thoại để kiểm tra trạng thái đơn hàng của bạn.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Mã đơn hàng</label>
            <input type="text" placeholder="VD: BMT123456" required value={orderId} onChange={(e) => setOrderId(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Số điện thoại</label>
            <input type="tel" placeholder="Nhập số điện thoại đặt hàng" required value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px' }}>KIỂM TRA NGAY</button>
        </form>

        {submitted && (
          <div className="fade-in" style={{ marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '30px', textAlign: 'left' }}>
            <h3 style={{ marginBottom: '20px' }}>Thông tin đơn hàng: #{orderId || 'BMT123456'}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '15px', left: '20px', right: '20px', height: '4px', backgroundColor: 'var(--border-color)', zIndex: 0 }}></div>
              <div style={{ position: 'absolute', top: '15px', left: '20px', width: '50%', height: '4px', backgroundColor: 'var(--primary-color)', zIndex: 1 }}></div>
              
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '80px' }}>
                <div style={{ width: '30px', height: '30px', backgroundColor: 'var(--primary-color)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', border: '4px solid white' }}>✓</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Đã đặt</div>
              </div>
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '80px' }}>
                <div style={{ width: '30px', height: '30px', backgroundColor: 'var(--primary-color)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', border: '4px solid white' }}>✓</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Xác nhận</div>
              </div>
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '80px' }}>
                <div style={{ width: '30px', height: '30px', backgroundColor: 'white', border: '2px solid var(--primary-color)', borderRadius: '50%', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 0 0 4px white' }}></div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-color)' }}>Đang giao</div>
              </div>
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '80px' }}>
                <div style={{ width: '30px', height: '30px', backgroundColor: 'var(--border-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', border: '4px solid white' }}></div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Đã giao</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Khách hàng:</span>
                <strong>Nguyễn Văn A</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Ngày đặt:</span>
                <strong>17/05/2026</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tổng tiền:</span>
                <strong style={{ color: '#ff3b30' }}>4.700.000₫</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderTracking;
