import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authApi.forgotPassword(email);
      setSuccess(response || 'Yêu cầu đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra email của bạn.');
    } catch (err) {
      setError(err.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', width: '100%', maxWidth: '450px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px', textAlign: 'center' }}>Quên Mật Khẩu</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px', textAlign: 'center' }}>Nhập email của bạn để nhận liên kết khôi phục mật khẩu</p>

        {error && (
          <div style={{ color: '#ff3b30', marginBottom: '20px', padding: '12px', backgroundColor: '#ffe5e5', borderRadius: '8px', textAlign: 'center', fontSize: '0.95rem', fontWeight: '500' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ color: '#28a745', marginBottom: '20px', padding: '12px', backgroundColor: '#e6f4ea', borderRadius: '8px', textAlign: 'center', fontSize: '0.95rem', fontWeight: '500' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Địa chỉ Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '15px', marginBottom: '25px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU KHÔI PHỤC'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.95rem' }}>
          Quay lại trang <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
