import React from 'react';
import { Link } from 'react-router-dom';

function Account() {
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
              <div style={{ width: '50px', height: '50px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>N</div>
              <div>
                <h4 style={{ margin: 0 }}>Nguyễn Văn A</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>Thành viên Vàng</p>
              </div>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}><Link to="/account" style={{ display: 'block', padding: '10px', backgroundColor: 'rgba(244,121,32,0.1)', color: 'var(--primary-color)', borderRadius: '8px', fontWeight: '600' }}>Thông tin tài khoản</Link></li>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ display: 'block', padding: '10px', color: 'var(--text-dark)', transition: '0.3s' }}>Quản lý đơn hàng</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ display: 'block', padding: '10px', color: 'var(--text-dark)', transition: '0.3s' }}>Địa chỉ giao hàng</a></li>
              <li style={{ marginBottom: '10px' }}><Link to="/wishlist" style={{ display: 'block', padding: '10px', color: 'var(--text-dark)', transition: '0.3s' }}>Sản phẩm yêu thích</Link></li>
              <li><Link to="/login" style={{ display: 'block', padding: '10px', color: '#ff3b30', transition: '0.3s' }}>Đăng xuất</Link></li>
            </ul>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h2 style={{ marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>Thông Tin Tài Khoản</h2>
          
          <form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Họ và tên</label>
                <input type="text" defaultValue="Nguyễn Văn A" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Số điện thoại</label>
                <input type="tel" defaultValue="0901234567" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email</label>
              <input type="email" defaultValue="nguyenvana@example.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Giới tính</label>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><input type="radio" name="gender" defaultChecked /> Nam</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><input type="radio" name="gender" /> Nữ</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><input type="radio" name="gender" /> Khác</label>
              </div>
            </div>

            <h3 style={{ marginBottom: '20px', marginTop: '40px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Đổi Mật Khẩu</h3>
            <div style={{ marginBottom: '20px' }}>
              <input type="password" placeholder="Mật khẩu hiện tại" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
              <input type="password" placeholder="Mật khẩu mới" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
              <input type="password" placeholder="Nhập lại mật khẩu mới" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '12px 30px' }}>Lưu Thay Đổi</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Account;
