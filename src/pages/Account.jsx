import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';

function Account() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    avatar: ''
  });
  
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setProfile({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          avatar: data.avatar || ''
        });
      } catch (err) {
        console.error('Lỗi tải thông tin cá nhân:', err);
        setMessage({
          text: err.message || 'Phiên làm việc hết hạn hoặc không tìm thấy người dùng. Vui lòng đăng nhập lại.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Hàm xử lý ảnh đại diện và chuyển sang Base64
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Dung lượng ảnh đại diện không được vượt quá 2MB!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);

    // Validation cơ bản
    if (!profile.fullName.trim()) {
      setMessage({ text: 'Họ và tên không được để trống!', type: 'error' });
      setUpdating(false);
      return;
    }

    if (passwords.newPassword || passwords.confirmPassword || passwords.currentPassword) {
      if (!passwords.currentPassword) {
        setMessage({ text: 'Vui lòng nhập mật khẩu hiện tại để thay đổi mật khẩu!', type: 'error' });
        setUpdating(false);
        return;
      }
      if (passwords.newPassword.length < 6) {
        setMessage({ text: 'Mật khẩu mới phải từ 6 ký tự trở lên!', type: 'error' });
        setUpdating(false);
        return;
      }
      if (passwords.newPassword !== passwords.confirmPassword) {
        setMessage({ text: 'Mật khẩu mới và nhập lại mật khẩu không khớp nhau!', type: 'error' });
        setUpdating(false);
        return;
      }
    }

    try {
      const updateData = {
        fullName: profile.fullName,
        phone: profile.phone,
        address: profile.address,
        avatar: profile.avatar,
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      };

      const updated = await authApi.updateProfile(updateData);
      
      // Đồng bộ tên hiển thị sang localStorage
      localStorage.setItem('fullName', updated.fullName);
      
      // Dispatch sự kiện để cập nhật Header ngay lập tức
      window.dispatchEvent(new Event('profileUpdated'));

      setMessage({ text: 'Cập nhật thông tin cá nhân thành công!', type: 'success' });
      
      // Reset mật khẩu sau khi đổi
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setMessage({ text: err.message || 'Lỗi khi cập nhật thông tin cá nhân.', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    localStorage.removeItem('emailOrPhone');
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('profileUpdated'));
    navigate('/');
  };

  const initial = profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U';

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3>Đang tải thông tin cá nhân...</h3>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <span>Tài khoản của tôi</span>
      </div>

      <div style={{ display: 'flex', gap: '30px', marginTop: '30px', flexWrap: 'wrap' }}>
        {/* Sidebar */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-color)' }} />
              ) : (
                <div style={{ width: '50px', height: '50px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {initial}
                </div>
              )}
              <div>
                <h4 style={{ margin: 0, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.fullName}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>Thành viên Vàng</p>
              </div>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/account" style={{ display: 'block', padding: '10px', backgroundColor: 'rgba(244,121,32,0.1)', color: 'var(--primary-color)', borderRadius: '8px', fontWeight: '600' }}>
                  Thông tin tài khoản
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}><Link to="/order-tracking" style={{ display: 'block', padding: '10px', color: 'var(--text-dark)', transition: '0.3s' }}>Quản lý đơn hàng</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="/wishlist" style={{ display: 'block', padding: '10px', color: 'var(--text-dark)', transition: '0.3s' }}>Sản phẩm yêu thích</Link></li>
              <li><a href="#" onClick={handleLogout} style={{ display: 'block', padding: '10px', color: '#ff3b30', transition: '0.3s' }}>Đăng xuất</a></li>
            </ul>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h2 style={{ marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>Thông Tin Tài Khoản</h2>
          
          {message && (
            <div style={{ 
              color: message.type === 'success' ? '#2e7d32' : '#c62828', 
              marginBottom: '20px', 
              padding: '12px 15px', 
              backgroundColor: message.type === 'success' ? '#e8f5e9' : '#ffebee', 
              borderRadius: '8px', 
              fontSize: '0.95rem',
              fontWeight: '500'
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
              
              {/* Ảnh đại diện */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-color)' }} />
                ) : (
                  <div style={{ width: '80px', height: '80px', backgroundColor: '#eaeaea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#aaa', fontWeight: 'bold' }}>
                    {initial}
                  </div>
                )}
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Ảnh đại diện</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                    style={{ fontSize: '0.9rem' }}
                  />
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-light)' }}>Hỗ trợ JPEG, PNG. Tối đa 2MB.</p>
                </div>
              </div>

              {/* Họ tên và Số điện thoại */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Họ và tên</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={profile.fullName} 
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} 
                  />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Số điện thoại</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={profile.phone} 
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} 
                  />
                </div>
              </div>
            </div>
            
            {/* Email (Chỉ đọc) */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email</label>
              <input 
                type="email" 
                value={profile.email} 
                readOnly
                disabled
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: '#f9f9f9', color: '#888', cursor: 'not-allowed' }} 
              />
            </div>

            {/* Địa chỉ nhận hàng */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Địa chỉ nhận hàng</label>
              <textarea 
                name="address"
                value={profile.address} 
                onChange={handleInputChange}
                rows="3"
                placeholder="Nhập địa chỉ giao hàng đầy đủ của bạn (Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} 
              />
            </div>

            {/* Đổi mật khẩu */}
            <h3 style={{ marginBottom: '20px', marginTop: '40px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Đổi Mật Khẩu</h3>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Mật khẩu hiện tại</label>
              <input 
                type="password" 
                name="currentPassword"
                placeholder="Nhập mật khẩu hiện tại để xác thực" 
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} 
              />
            </div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Mật khẩu mới</label>
                <input 
                  type="password" 
                  name="newPassword"
                  placeholder="Mật khẩu mới (tối thiểu 6 ký tự)" 
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} 
                />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nhập lại mật khẩu mới</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Xác nhận lại mật khẩu mới" 
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={updating}
              className="btn-primary" 
              style={{ padding: '12px 30px', opacity: updating ? 0.7 : 1 }}
            >
              {updating ? 'ĐANG CẬP NHẬT...' : 'Cập Nhật'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Account;
