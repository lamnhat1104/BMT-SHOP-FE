import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { cartApi } from '../api/cart';

function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const syncLocalCart = async () => {
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (localCart.length > 0) {
      try {
        for (const item of localCart) {
          await cartApi.addCartItem(item.id, item.quantity, item.details || '');
        }
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (err) {
        console.error('Lỗi đồng bộ giỏ hàng:', err);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(emailOrPhone, password);
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        if (response.fullName) localStorage.setItem('fullName', response.fullName);
        if (response.role) localStorage.setItem('role', response.role);
        localStorage.setItem('emailOrPhone', emailOrPhone);
        
        // Đồng bộ giỏ hàng localStorage lên Database
        await syncLocalCart();
        
        navigate('/');
      } else {
        // Backend trả về string jwt khi login thành công, nếu cần thì parse
        if (typeof response === 'string') {
           localStorage.setItem('token', response);
           localStorage.setItem('fullName', 'Khách hàng');
           localStorage.setItem('emailOrPhone', emailOrPhone);
           
           // Đồng bộ giỏ hàng localStorage lên Database
           await syncLocalCart();
           
           navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/facebook';
  };

  return (
    <div className="container fade-in" style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', width: '100%', maxWidth: '450px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px', textAlign: 'center' }}>Đăng Nhập</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px', textAlign: 'center' }}>Vui lòng đăng nhập để tiếp tục</p>
        
        {error && (
          <div style={{ color: '#ff3b30', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe5e5', borderRadius: '8px', textAlign: 'center', fontSize: '0.95rem' }}>
            {error}
            {error.includes('chưa được kích hoạt') && (
              <div style={{ marginTop: '8px' }}>
                <Link to={`/verify-otp?email=${encodeURIComponent(emailOrPhone)}`} style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'underline' }}>
                  Kích hoạt tài khoản ngay
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email / Số điện thoại</label>
            <input 
              type="text" 
              placeholder="Nhập email hoặc số điện thoại" 
              required 
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} 
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Mật khẩu</label>
            <input 
              type="password" 
              placeholder="Nhập mật khẩu" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} 
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '0.9rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input type="checkbox" /> Nhớ mật khẩu
            </label>
            <Link to="/forgot-password" style={{ color: 'var(--primary-color)' }}>Quên mật khẩu?</Link>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '15px', marginBottom: '20px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        {/* Social Login Section */}
        <div className="social-login-divider">
          Hoặc đăng nhập bằng
        </div>
        
        <div className="social-login-buttons" style={{ marginBottom: '25px' }}>
          <button onClick={handleGoogleLogin} className="social-btn google-btn">
            <svg className="social-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button onClick={handleFacebookLogin} className="social-btn facebook-btn">
            <svg className="social-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.95rem' }}>
          Bạn chưa có tài khoản? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
