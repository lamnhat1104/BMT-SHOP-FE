import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="container fade-in" style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', width: '100%', maxWidth: '450px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px', textAlign: 'center' }}>Đăng Nhập</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px', textAlign: 'center' }}>Vui lòng đăng nhập để tiếp tục</p>
        
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email / Số điện thoại</label>
            <input type="text" placeholder="Nhập email hoặc số điện thoại" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Mật khẩu</label>
            <input type="password" placeholder="Nhập mật khẩu" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '0.9rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input type="checkbox" /> Nhớ mật khẩu
            </label>
            <a href="#" style={{ color: 'var(--primary-color)' }}>Quên mật khẩu?</a>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', marginBottom: '20px' }}>ĐĂNG NHẬP</button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.95rem' }}>
          Bạn chưa có tài khoản? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
