import React from 'react';

function Footer() {
  return (
    <footer className="footer fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="logo" style={{ color: 'white', marginBottom: '20px', fontSize: '1.8rem', fontWeight: 800 }}>
              BMT<span style={{ color: 'var(--primary-color)' }}>SHOP</span>
            </div>
            <p>Hệ thống cửa hàng cầu lông uy tín hàng đầu Việt Nam. Chuyên cung cấp vợt, giày, quần áo và phụ kiện cầu lông chính hãng từ các thương hiệu nổi tiếng thế giới.</p>
            <div className="social-links">
              <div>FB</div>
              <div>YT</div>
              <div>IG</div>
              <div>TT</div>
            </div>
          </div>
          <div className="footer-col">
            <h4>Thông Tin</h4>
            <ul>
              <li><a href="#">Giới thiệu BMTShop</a></li>
              <li><a href="#">Hệ thống cửa hàng</a></li>
              <li><a href="#">Tin tức cầu lông</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Chính Sách</h4>
            <ul>
              <li><a href="#">Chính sách đổi trả</a></li>
              <li><a href="#">Chính sách bảo hành</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Phương thức thanh toán</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Hỗ Trợ</h4>
            <ul>
              <li><a href="#">Kiểm tra đơn hàng</a></li>
              <li><a href="#">Hướng dẫn mua hàng</a></li>
              <li><a href="#">Hướng dẫn chọn vợt</a></li>
              <li><a href="#">Hướng dẫn chọn giày</a></li>
              <li><a href="#">Góp ý - Khiếu nại</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} BMTShop. Hệ thống cửa hàng bán đồ cầu lông uy tín, chính hãng. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
