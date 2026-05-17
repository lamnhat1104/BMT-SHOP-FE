import React from 'react';
import { Link } from 'react-router-dom';

function Register() {
  return (
    <div className="container fade-in" style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', width: '100%', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px', textAlign: 'center' }}>Đăng Ký Tài Khoản</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px', textAlign: 'center' }}>Tạo tài khoản để nhận nhiều ưu đãi hấp dẫn</p>
        
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Họ và tên</label>
            <input type="text" placeholder="Nhập họ và tên của bạn" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Số điện thoại</label>
            <input type="tel" placeholder="Nhập số điện thoại" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email (không bắt buộc)</label>
            <input type="email" placeholder="Nhập địa chỉ email" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Mật khẩu</label>
            <input type="password" placeholder="Nhập mật khẩu" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nhập lại mật khẩu</label>
            <input type="password" placeholder="Xác nhận mật khẩu" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', marginBottom: '20px' }}>ĐĂNG KÝ</button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.95rem' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
