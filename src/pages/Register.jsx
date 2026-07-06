import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';

function Register() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Real-time validations
  const handleFullNameChange = (val) => {
    setFullName(val);
    let errMsg = null;
    if (!val.trim()) {
      errMsg = 'Họ và tên không được để trống';
    } else if (val.trim().length < 2) {
      errMsg = 'Họ và tên phải dài từ 2 ký tự trở lên';
    }
    setFormErrors(prev => ({ ...prev, fullName: errMsg }));
  };

  const handlePhoneChange = async (val) => {
    // Only allow digits and limit to 11 chars
    const cleaned = val.replace(/\D/g, '').slice(0, 11);
    setPhoneNumber(cleaned);

    let errMsg = null;
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;

    if (!cleaned.trim()) {
      errMsg = 'Số điện thoại không được để trống';
    } else if (cleaned.length < 10) {
      errMsg = 'Số điện thoại không đủ 10 số';
    } else if (!phoneRegex.test(cleaned)) {
      errMsg = 'Số điện thoại không hợp lệ (phải bắt đầu bằng 03, 05, 07, 08, 09)';
    }

    setFormErrors(prev => ({ ...prev, phoneNumber: errMsg }));

    // If it's structurally valid, check duplication on the backend
    if (cleaned.length === 10 && phoneRegex.test(cleaned)) {
      try {
        const exists = await authApi.checkPhoneExists(cleaned);
        if (exists) {
          setFormErrors(prev => ({ ...prev, phoneNumber: 'Số điện thoại này đã được đăng ký' }));
        }
      } catch (err) {
        console.error('Lỗi check trùng sđt:', err);
      }
    }
  };

  const handleEmailChange = async (val) => {
    setEmail(val);
    let errMsg = null;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (val.trim()) {
      if (!val.includes('@')) {
        errMsg = 'Email phải chứa ký tự @';
      } else {
        const parts = val.split('@');
        const domainPart = parts[1];
        if (!domainPart || !domainPart.trim()) {
          errMsg = 'Bắt buộc nhập phần tên miền sau dấu @';
        } else if (!domainPart.includes('.')) {
          errMsg = 'Tên miền sau dấu @ phải chứa dấu chấm (.) (ví dụ: gmail.com)';
        } else if (!emailRegex.test(val.trim())) {
          errMsg = 'Email không đúng định dạng';
        }
      }
    }

    setFormErrors(prev => ({ ...prev, email: errMsg }));

    // If it's a structurally valid email, check duplication on backend
    if (val.trim() && !errMsg && emailRegex.test(val.trim())) {
      try {
        const exists = await authApi.checkEmailExists(val.trim());
        if (exists) {
          setFormErrors(prev => ({ ...prev, email: 'Email này đã tồn tại trên hệ thống' }));
        }
      } catch (err) {
        console.error('Lỗi check trùng email:', err);
      }
    }
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    let errMsg = null;
    if (!val) {
      errMsg = 'Mật khẩu không được để trống';
    } else if (val.length < 8) {
      errMsg = 'Mật khẩu phải chứa ít nhất 8 ký tự';
    }
    setFormErrors(prev => ({ ...prev, password: errMsg }));

    // Also check if confirm password matches if it has value
    if (confirmPassword) {
      const matchErr = val !== confirmPassword ? 'Mật khẩu xác nhận không trùng khớp' : null;
      setFormErrors(prev => ({ ...prev, confirmPassword: matchErr }));
    }
  };

  const handleConfirmPasswordChange = (val) => {
    setConfirmPassword(val);
    let errMsg = null;
    if (!val) {
      errMsg = 'Vui lòng xác nhận lại mật khẩu';
    } else if (password !== val) {
      errMsg = 'Mật khẩu xác nhận không trùng khớp';
    }
    setFormErrors(prev => ({ ...prev, confirmPassword: errMsg }));
  };

  const validateForm = () => {
    // Run all validations once before submit
    const errors = {};
    
    if (!fullName.trim()) {
      errors.fullName = 'Họ và tên không được để trống';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Họ và tên phải dài từ 2 ký tự trở lên';
    }

    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (phoneNumber.length < 10) {
      errors.phoneNumber = 'Số điện thoại không đủ 10 số';
    } else if (!phoneRegex.test(phoneNumber.trim())) {
      errors.phoneNumber = 'Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 03, 05, 07, 08, 09)';
    }

    if (email.trim()) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email.includes('@')) {
        errors.email = 'Email phải chứa ký tự @';
      } else {
        const domainPart = email.split('@')[1];
        if (!domainPart || !domainPart.trim()) {
          errors.email = 'Bắt buộc nhập phần tên miền sau dấu @';
        } else if (!domainPart.includes('.')) {
          errors.email = 'Tên miền sau dấu @ phải chứa dấu chấm (.)';
        } else if (!emailRegex.test(email.trim())) {
          errors.email = 'Email không đúng định dạng';
        }
      }
    }

    if (!password) {
      errors.password = 'Mật khẩu không được để trống';
    } else if (password.length < 8) {
      errors.password = 'Mật khẩu phải chứa ít nhất 8 ký tự';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận lại mật khẩu';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp';
    }

    // Keep any existing async error messages (like duplicates) if the value hasn't changed
    const finalErrors = { ...formErrors, ...errors };
    // Filter out resolved errors
    Object.keys(finalErrors).forEach(key => {
      if (!finalErrors[key]) delete finalErrors[key];
    });

    setFormErrors(finalErrors);
    return Object.keys(finalErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError(null);
    setSuccess(null);

    try {
      await authApi.register(fullName, phoneNumber, email, password);
      setSuccess('Đăng ký thành công! Đang chuyển hướng đến trang xác thực OTP...');
      setTimeout(() => {
        navigate(`/verify-otp?email=${encodeURIComponent(email || phoneNumber + '@bmtshop.com')}`);
      }, 2000);
    } catch (err) {
      setServerError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
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
    <div className="container fade-in" style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center', minHeight: '85vh', alignItems: 'center' }}>
      <div style={{ 
        backgroundColor: 'var(--bg-card, #ffffff)', 
        padding: '40px 35px', 
        borderRadius: '20px', 
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)', 
        width: '100%', 
        maxWidth: '480px',
        border: '1px solid var(--border-color, #e2e8f0)',
        transition: 'all 0.3s ease'
      }}>
        <h1 style={{ 
          fontSize: '2.25rem', 
          marginBottom: '10px', 
          textAlign: 'center', 
          fontWeight: '800', 
          background: 'linear-gradient(to right, #f47920, #e06810)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Đăng Ký Tài Khoản</h1>
        <p style={{ color: 'var(--text-light, #64748b)', marginBottom: '30px', textAlign: 'center', fontSize: '0.95rem' }}>
          Tạo tài khoản để nhận nhiều ưu đãi hấp dẫn
        </p>
        
        {serverError && (
          <div style={{ 
            color: '#ef4444', 
            marginBottom: '20px', 
            padding: '12px 15px', 
            backgroundColor: '#fee2e2', 
            border: '1px solid #fca5a5',
            borderRadius: '12px', 
            textAlign: 'center',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {serverError}
          </div>
        )}
        
        {success && (
          <div style={{ 
            color: '#10b981', 
            marginBottom: '20px', 
            padding: '12px 15px', 
            backgroundColor: '#d1fae5', 
            border: '1px solid #6ee7b7',
            borderRadius: '12px', 
            textAlign: 'center',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem', color: '#475569', textTransform: 'uppercase', tracking: '0.05em' }}>Họ và tên</label>
            <input 
              type="text" 
              placeholder="Nhập họ và tên của bạn" 
              value={fullName}
              onChange={(e) => handleFullNameChange(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '13px 16px', 
                borderRadius: '10px', 
                border: formErrors.fullName ? '1.5px solid #ef4444' : '1px solid var(--border-color, #cbd5e1)', 
                outline: 'none',
                fontSize: '0.95rem',
                transition: 'border-color 0.2s ease',
                backgroundColor: '#f8fafc'
              }} 
            />
            {formErrors.fullName && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '5px', fontWeight: '500' }}>{formErrors.fullName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem', color: '#475569', textTransform: 'uppercase', tracking: '0.05em' }}>Số điện thoại</label>
            <input 
              type="tel" 
              placeholder="Nhập số điện thoại (ví dụ: 0912345678)" 
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '13px 16px', 
                borderRadius: '10px', 
                border: formErrors.phoneNumber ? '1.5px solid #ef4444' : '1px solid var(--border-color, #cbd5e1)', 
                outline: 'none',
                fontSize: '0.95rem',
                transition: 'border-color 0.2s ease',
                backgroundColor: '#f8fafc'
              }} 
            />
            {formErrors.phoneNumber && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '5px', fontWeight: '500' }}>{formErrors.phoneNumber}</p>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem', color: '#475569', textTransform: 'uppercase', tracking: '0.05em' }}>Email</label>
            <input 
              type="text" 
              placeholder="Nhập địa chỉ email (ví dụ: example@gmail.com)" 
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '13px 16px', 
                borderRadius: '10px', 
                border: formErrors.email ? '1.5px solid #ef4444' : '1px solid var(--border-color, #cbd5e1)', 
                outline: 'none',
                fontSize: '0.95rem',
                transition: 'border-color 0.2s ease',
                backgroundColor: '#f8fafc'
              }} 
            />
            {formErrors.email && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '5px', fontWeight: '500' }}>{formErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem', color: '#475569', textTransform: 'uppercase', tracking: '0.05em' }}>Mật khẩu</label>
            <input 
              type="password" 
              placeholder="Tối thiểu 8 ký tự" 
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '13px 16px', 
                borderRadius: '10px', 
                border: formErrors.password ? '1.5px solid #ef4444' : '1px solid var(--border-color, #cbd5e1)', 
                outline: 'none',
                fontSize: '0.95rem',
                transition: 'border-color 0.2s ease',
                backgroundColor: '#f8fafc'
              }} 
            />
            {formErrors.password && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '5px', fontWeight: '500' }}>{formErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '26px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem', color: '#475569', textTransform: 'uppercase', tracking: '0.05em' }}>Nhập lại mật khẩu</label>
            <input 
              type="password" 
              placeholder="Xác nhận mật khẩu trùng khớp" 
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '13px 16px', 
                borderRadius: '10px', 
                border: formErrors.confirmPassword ? '1.5px solid #ef4444' : '1px solid var(--border-color, #cbd5e1)', 
                outline: 'none',
                fontSize: '0.95rem',
                transition: 'border-color 0.2s ease',
                backgroundColor: '#f8fafc'
              }} 
            />
            {formErrors.confirmPassword && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '5px', fontWeight: '500' }}>{formErrors.confirmPassword}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary" 
            style={{ 
              width: '100%', 
              padding: '14px', 
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '20px', 
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(244, 121, 32, 0.2)'
            }}
          >
            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ NGAY'}
          </button>
        </form>

        {/* Social Register Section */}
        <div className="social-login-divider" style={{ margin: '20px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
          Hoặc đăng ký bằng
        </div>
        
        <div className="social-login-buttons" style={{ marginBottom: '25px', display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleGoogleLogin} 
            className="social-btn google-btn"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#334155',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            <svg className="social-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button 
            onClick={handleFacebookLogin} 
            className="social-btn facebook-btn"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              border: '1px solid #1877f2',
              borderRadius: '10px',
              backgroundColor: '#1877f2',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            <svg className="social-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.95rem', color: '#64748b' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: '#f47920', fontWeight: '700', textDecoration: 'none' }}>Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
