import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi } from '../api/auth';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Liên kết khôi phục mật khẩu không hợp lệ hoặc thiếu mã xác thực (token).');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Thiếu mã xác thực (token). Không thể đặt lại mật khẩu.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authApi.resetPassword(token, newPassword);
      setSuccess(response || 'Đặt lại mật khẩu thành công! Đang chuyển hướng về trang đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', width: '100%', maxWidth: '450px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px', textAlign: 'center' }}>Đặt Lại Mật Khẩu</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px', textAlign: 'center' }}>Nhập mật khẩu mới cho tài khoản của bạn</p>

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
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Mật khẩu mới</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              required
              disabled={!token || loading}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Xác nhận mật khẩu mới</label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              required
              disabled={!token || loading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
            />
          </div>

          <button type="submit" disabled={!token || loading} className="btn-primary" style={{ width: '100%', padding: '15px', marginBottom: '20px', opacity: (!token || loading) ? 0.7 : 1 }}>
            {loading ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT MẬT KHẨU'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.95rem' }}>
          Quay lại trang <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
