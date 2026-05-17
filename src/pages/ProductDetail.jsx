import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const [qty, setQty] = useState(1);

  // Mock data based on ID, in reality you'd fetch this
  const isShoe = id === '2' || id === '4' || id === '6' || id === '8';
  const name = isShoe ? 'Giày Cầu Lông Cao Cấp' : 'Vợt Cầu Lông Chuyên Nghiệp';
  const img = isShoe ? '/shoe_product_1.png' : '/racket_product_1.png';
  const price = isShoe ? '1.250.000₫' : '3.450.000₫';
  const brand = isShoe ? 'LINING' : 'YONEX';

  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <Link to="/products">Sản phẩm</Link> / <span>{name}</span>
      </div>

      <div className="product-detail-wrapper" style={{ display: 'flex', gap: '50px', marginTop: '30px', backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        {/* Product Images */}
        <div className="product-images" style={{ flex: 1 }}>
          <div className="main-image" style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'center', backgroundColor: '#fcfcfc' }}>
            <img src={img} alt={name} style={{ width: '100%', maxWidth: '400px', objectFit: 'contain' }} />
          </div>
          <div className="thumbnail-list" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="thumbnail" style={{ width: '80px', height: '80px', border: '1px solid #eaeaea', borderRadius: '8px', padding: '5px', cursor: 'pointer', backgroundColor: '#fcfcfc' }}>
                <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info" style={{ flex: 1 }}>
          <div className="product-brand" style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '1rem', marginBottom: '10px' }}>{brand}</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px', lineHeight: 1.3 }}>{name} - Phiên Bản Giới Hạn</h1>
          
          <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{ color: '#ffb800' }}>★★★★★</span>
            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>(124 đánh giá) | Đã bán 450+</span>
          </div>

          <div className="product-price" style={{ fontSize: '2rem', fontWeight: 700, color: '#ff3b30', marginBottom: '30px' }}>
            {price} <span style={{ fontSize: '1.2rem', color: 'var(--text-light)', textDecoration: 'line-through', fontWeight: 400, marginLeft: '15px' }}>4.000.000₫</span>
          </div>

          <div className="product-options" style={{ marginBottom: '30px' }}>
            {isShoe ? (
              <div className="option-group">
                <h4 style={{ marginBottom: '10px' }}>Kích cỡ (Size):</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['39', '40', '41', '42', '43'].map(size => (
                    <button key={size} style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }}>{size}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="option-group">
                <h4 style={{ marginBottom: '10px' }}>Thông số (Trọng lượng / Chu vi cán):</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ padding: '8px 16px', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', borderRadius: '4px', backgroundColor: 'rgba(244,121,32,0.1)', fontWeight: 'bold' }}>3U/G5</button>
                  <button style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }}>4U/G5</button>
                </div>
              </div>
            )}
          </div>

          <div className="product-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '40px' }}>
            <div className="qty-selector" style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '10px 15px', backgroundColor: '#f5f5f5', borderRight: '1px solid var(--border-color)' }}>-</button>
              <input type="text" value={qty} readOnly style={{ width: '50px', textAlign: 'center', border: 'none', outline: 'none' }} />
              <button onClick={() => setQty(qty + 1)} style={{ padding: '10px 15px', backgroundColor: '#f5f5f5', borderLeft: '1px solid var(--border-color)' }}>+</button>
            </div>
            
            <button className="btn-primary" style={{ flex: 1, padding: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
              <span>🛒</span> THÊM VÀO GIỎ HÀNG
            </button>
          </div>

          <div className="product-promises" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>✔️ Cam kết hàng chính hãng 100%</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>✔️ Bảo hành 3 tháng (Lỗi 1 đổi 1)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>✔️ Giao hàng toàn quốc cực nhanh</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="product-tabs" style={{ marginTop: '50px', backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px' }}>
        <div className="tab-headers" style={{ display: 'flex', gap: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '30px' }}>
          <h3 style={{ color: 'var(--primary-color)', borderBottom: '3px solid var(--primary-color)', paddingBottom: '15px', marginBottom: '-16px', cursor: 'pointer' }}>Mô Tả Sản Phẩm</h3>
          <h3 style={{ color: 'var(--text-light)', cursor: 'pointer' }}>Thông Số Kỹ Thuật</h3>
          <h3 style={{ color: 'var(--text-light)', cursor: 'pointer' }}>Đánh Giá (124)</h3>
        </div>
        <div className="tab-content" style={{ lineHeight: 1.8 }}>
          <p>Sản phẩm này là một trong những siêu phẩm được mong đợi nhất trong năm nay. Với thiết kế tinh tế, kết hợp cùng công nghệ tiên tiến nhất, sản phẩm mang lại trải nghiệm tuyệt vời cho người sử dụng.</p>
          <p>Đặc biệt, với phối màu hiện đại và sang trọng, bạn không chỉ tỏa sáng trên sân mà còn khẳng định phong cách chuyên nghiệp của mình.</p>
          <img src={img} alt="Detail" style={{ width: '100%', maxWidth: '600px', display: 'block', margin: '30px auto', borderRadius: '12px' }} />
          <h4>Công Nghệ Nổi Bật:</h4>
          <ul>
            <li><strong>Công nghệ A:</strong> Giúp tăng cường sức mạnh và độ bền.</li>
            <li><strong>Chất liệu B:</strong> Siêu nhẹ, siêu đàn hồi.</li>
            <li><strong>Thiết kế C:</strong> Khí động học, giảm sức cản không khí.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
