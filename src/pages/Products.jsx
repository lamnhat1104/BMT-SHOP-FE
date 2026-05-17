import React from 'react';
import { Link } from 'react-router-dom';

function Products() {
  const products = [
    { id: 1, name: 'Vợt Cầu Lông Yonex Astrox 99 Pro', price: '3.450.000₫', brand: 'YONEX', img: '/racket_product_1.png', tag: '-15%' },
    { id: 2, name: 'Giày Cầu Lông Lining Halberd III', price: '1.250.000₫', brand: 'LINING', img: '/shoe_product_1.png', tag: null },
    { id: 3, name: 'Vợt Cầu Lông Victor Thruster Ryuga II', price: '3.100.000₫', brand: 'VICTOR', img: '/racket_product_1.png', tag: 'HOT', hue: '45deg' },
    { id: 4, name: 'Giày Cầu Lông Yonex Power Cushion 65Z3', price: '2.850.000₫', brand: 'YONEX', img: '/shoe_product_1.png', tag: null, hue: '-45deg' },
    { id: 5, name: 'Vợt Cầu Lông Mizuno JPX 8 Force', price: '2.200.000₫', brand: 'MIZUNO', img: '/racket_product_1.png', tag: 'NEW', gray: true },
    { id: 6, name: 'Giày Cầu Lông Kawasaki K098', price: '650.000₫', brand: 'KAWASAKI', img: '/shoe_product_1.png', tag: null, saturate: true },
    { id: 7, name: 'Vợt Cầu Lông Lining Axforce 80', price: '3.650.000₫', brand: 'LINING', img: '/racket_product_1.png', tag: null, invert: true },
    { id: 8, name: 'Giày Cầu Lông Victor P9200TD', price: '1.450.000₫', brand: 'VICTOR', img: '/shoe_product_1.png', tag: null, hue: '200deg' },
  ];

  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <span>Tất cả sản phẩm</span>
      </div>
      
      <div className="products-layout" style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
        {/* Sidebar Filters */}
        <aside className="sidebar" style={{ width: '250px', flexShrink: 0 }}>
          <div className="filter-group">
            <h3>Danh Mục</h3>
            <ul>
              <li><label><input type="checkbox" /> Vợt Cầu Lông</label></li>
              <li><label><input type="checkbox" /> Giày Cầu Lông</label></li>
              <li><label><input type="checkbox" /> Áo Cầu Lông</label></li>
              <li><label><input type="checkbox" /> Balo / Túi Xách</label></li>
            </ul>
          </div>
          <div className="filter-group" style={{ marginTop: '30px' }}>
            <h3>Thương Hiệu</h3>
            <ul>
              <li><label><input type="checkbox" /> Yonex</label></li>
              <li><label><input type="checkbox" /> Lining</label></li>
              <li><label><input type="checkbox" /> Victor</label></li>
              <li><label><input type="checkbox" /> Mizuno</label></li>
            </ul>
          </div>
          <div className="filter-group" style={{ marginTop: '30px' }}>
            <h3>Mức Giá</h3>
            <ul>
              <li><label><input type="radio" name="price" /> Dưới 1 triệu</label></li>
              <li><label><input type="radio" name="price" /> 1 triệu - 3 triệu</label></li>
              <li><label><input type="radio" name="price" /> Trên 3 triệu</label></li>
            </ul>
          </div>
        </aside>

        {/* Product List */}
        <div className="products-main" style={{ flex: 1 }}>
          <div className="products-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.5rem' }}>Tất cả sản phẩm</h1>
            <select style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
              <option>Mới nhất</option>
              <option>Giá từ thấp tới cao</option>
              <option>Giá từ cao tới thấp</option>
            </select>
          </div>

          <div className="product-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {products.map(p => (
              <Link to={`/products/${p.id}`} key={p.id} className="product-card" style={{ display: 'block', color: 'inherit' }}>
                {p.tag && <div className="product-badge" style={{ backgroundColor: p.tag === 'NEW' ? '#4caf50' : '#ff3b30' }}>{p.tag}</div>}
                <img 
                  src={p.img} 
                  alt={p.name} 
                  className="product-image" 
                  style={{
                    filter: p.hue ? `hue-rotate(${p.hue})` : p.gray ? 'grayscale(0.5)' : p.saturate ? 'saturate(2)' : p.invert ? 'invert(0.1)' : 'none'
                  }}
                />
                <div className="product-brand">{p.brand}</div>
                <h3 className="product-title">{p.name}</h3>
                <div className="product-price">
                  <span className="price-current">{p.price}</span>
                </div>
                <button className="btn-add-to-cart">Thêm vào giỏ</button>
              </Link>
            ))}
          </div>

          <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '10px' }}>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
