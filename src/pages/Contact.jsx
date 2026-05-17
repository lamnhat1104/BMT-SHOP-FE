import React from 'react';
import { Link } from 'react-router-dom';

function Contact() {
  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <span>Liên hệ</span>
      </div>

      <div style={{ display: 'flex', gap: '40px', marginTop: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Liên Hệ Với Chúng Tôi</h1>
          <p style={{ color: 'var(--text-light)', marginBottom: '30px', lineHeight: '1.8' }}>
            Chúng tôi luôn sẵn lòng lắng nghe và hỗ trợ bạn. Hãy điền thông tin vào form bên cạnh hoặc liên hệ trực tiếp với BMTShop qua các kênh thông tin dưới đây.
          </p>

          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.5rem' }}>📍</div>
              <div>
                <h4 style={{ marginBottom: '5px' }}>Địa chỉ cửa hàng</h4>
                <p style={{ color: 'var(--text-light)' }}>123 Đường Cầu Lông, Quận Thể Thao, TP. Hồ Chí Minh</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.5rem' }}>📞</div>
              <div>
                <h4 style={{ marginBottom: '5px' }}>Hotline hỗ trợ (24/7)</h4>
                <p style={{ color: 'var(--text-light)' }}>090 123 4567 - 098 765 4321</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.5rem' }}>✉️</div>
              <div>
                <h4 style={{ marginBottom: '5px' }}>Email liên hệ</h4>
                <p style={{ color: 'var(--text-light)' }}>info@bmtshop.com</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h3 style={{ marginBottom: '20px' }}>Gửi tin nhắn cho BMTShop</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div style={{ marginBottom: '20px' }}>
              <input type="text" placeholder="Họ và tên của bạn" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
              <input type="email" placeholder="Email" required style={{ flex: '1', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
              <input type="tel" placeholder="Số điện thoại" required style={{ flex: '1', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <textarea placeholder="Nội dung tin nhắn..." rows="5" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '12px 30px' }}>Gửi Tin Nhắn</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
