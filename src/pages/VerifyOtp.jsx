import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../api/auth';

function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Vui lòng nhập địa chỉ email!');
      return;
    }
    if (!otp || otp.length < 4) {
      setError('Vui lòng nhập đầy đủ mã OTP!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await authApi.verifyOtp(email, otp);
      setSuccess('Xác thực tài khoản thành công! Đang chuyển hướng đến trang đăng nhập...');
      setTimeout(() => {
        navigate('/login', { state: { email } });
      }, 2500);
    } catch (err) {
      setError(err.message || 'Mã OTP không chính xác hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', width: '100%', maxWidth: '450px' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '10px', textAlign: 'center' }}>Kích Hoạt Tài Khoản</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px', textAlign: 'center', fontSize: '0.95rem' }}>
          Nhập mã xác thực OTP đã được gửi đến email của bạn.
        </p>

        {error && <div style={{ color: '#ff3b30', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe5e5', borderRadius: '8px', textAlign: 'center', fontSize: '0.95rem' }}>{error}</div>}
        {success && <div style={{ color: '#28a745', marginBottom: '15px', padding: '10px', backgroundColor: '#e6f4ea', borderRadius: '8px', textAlign: 'center', fontSize: '0.95rem' }}>{success}</div>}

        <form onSubmit={handleVerify}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email đăng ký</label>
            <input 
              type="email" 
              placeholder="Nhập email của bạn" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!searchParams.get('email')}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: searchParams.get('email') ? 'var(--bg-light)' : 'transparent' }} 
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Mã xác thực OTP</label>
            <input 
              type="text" 
              maxLength="6"
              placeholder="Nhập 6 số OTP" 
              required 
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '8px' }} 
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '15px', marginBottom: '20px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'ĐANG XỬ LÝ...' : 'KÍCH HOẠT TÀI KHOẢN'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            Không nhận được mã? <Link to="/contact" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Liên hệ hỗ trợ</Link>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '5px' }}>
            <Link to="/login" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Quay lại Đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
