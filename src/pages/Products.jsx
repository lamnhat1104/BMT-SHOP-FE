import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../api/product';
import { cartApi } from '../api/cart';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryId, setCategoryId] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    fetchProducts();
  }, [categoryId, selectedBrand, selectedSort, selectedPriceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await productApi.getAllProducts({
        categoryId,
        brand: selectedBrand,
        sort: selectedSort,
        minPrice: selectedPriceRange?.min,
        maxPrice: selectedPriceRange?.max
      });

      setProducts(data);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Format tiền VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  // Add to cart
  const handleAddToCart = async (e, product) => {
    e.preventDefault();

    try {
      await cartApi.addCartItem(product.id, 1);
      alert('Đã thêm vào giỏ hàng');
    } catch (error) {
      console.error(error);
    }
  };

  // Pagination logic
  const indexOfLastProduct =
    currentPage * productsPerPage;

  const indexOfFirstProduct =
    indexOfLastProduct - productsPerPage;

  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(
    products.length / productsPerPage
  );

  return (
    <div
      style={{
        padding: '20px 40px',
        background: '#fff'
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          marginBottom: '20px',
          fontSize: '14px'
        }}
      >
        <Link to="/">Trang chủ</Link> {'>'}
        <span> Vợt Cầu Lông </span> {'>'}
        <span> Vợt cầu lông Yonex</span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '20px'
        }}
      >
        {/* SIDEBAR */}
        <aside
          style={{
            width: '250px',
            border: '1px solid #eee',
            padding: '20px',
            borderRadius: '6px'
          }}
        >
          {/* Giá */}
          <div style={{ marginBottom: '30px' }}>
            <h3
              style={{
                fontSize: '18px',
                marginBottom: '15px',
                textTransform: 'uppercase'
              }}
            >
              Chọn mức giá
            </h3>

            {[
              { label: 'Giá dưới 500.000đ', min: null, max: 500000 },
              { label: '500.000đ - 1 triệu', min: 500000, max: 1000000 },
              { label: '1 - 2 triệu', min: 1000000, max: 2000000 },
              { label: '2 - 3 triệu', min: 2000000, max: 3000000 },
              { label: 'Giá trên 3 triệu', min: 3000000, max: null }
            ].map((price, index) => (
              <label
                key={index}
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '12px',
                  cursor: 'pointer'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={selectedPriceRange?.label === price.label}
                  onChange={() => setSelectedPriceRange(selectedPriceRange?.label === price.label ? null : price)}
                />
                {price.label}
              </label>
            ))}
          </div>

          {/* Thương hiệu */}
          <div style={{ marginBottom: '30px' }}>
            <h3
              style={{
                fontSize: '18px',
                marginBottom: '15px',
                textTransform: 'uppercase'
              }}
            >
              Thương hiệu
            </h3>

            {[
              'Yonex',
              'Lining',
              'Victor',
              'Mizuno'
            ].map((brand) => (
              <label
                key={brand}
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '12px',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedBrand === brand}
                  onChange={() =>
                    setSelectedBrand(selectedBrand === brand ? null : brand)
                  }
                />
                {brand}
              </label>
            ))}
          </div>

          {/* Loại sản phẩm */}
          <div>
            <h3
              style={{
                fontSize: '18px',
                marginBottom: '15px',
                textTransform: 'uppercase'
              }}
            >
              Loại sản phẩm
            </h3>

            {[
              {
                id: 1,
                name: 'Vợt cầu lông'
              },
              {
                id: 2,
                name: 'Giày cầu lông'
              },
              {
                id: 3,
                name: 'Áo cầu lông'
              },
              {
                id: 4,
                name: 'Phụ kiện'
              }
            ].map((cat) => (
              <label
                key={cat.id}
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '12px',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={categoryId === cat.id}
                  onChange={() =>
                    setCategoryId(categoryId === cat.id ? null : cat.id)
                  }
                />
                {cat.name}
              </label>
            ))}
          </div>
        </aside>

        {/* PRODUCTS */}
        <div style={{ flex: 1 }}>
          {/* Brand Banner */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(3, 1fr)',
              gap: '15px',
              marginBottom: '25px'
            }}
          >
            {[
              'ARCSABER',
              'NANORAY',
              'ASTROX',
              'NANOFLARE',
              'DUORA',
              'VOLTRIC'
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  border: '2px solid #ddd',
                  padding: '18px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '24px',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                textTransform: 'uppercase'
              }}
            >
              Vợt cầu lông Yonex
            </h2>

            <div
              style={{
                display: 'flex',
                gap: '10px'
              }}
            >
              {/* Xóa bộ lọc */}
              <button
                onClick={() => {
                  setCategoryId(null);
                  setSelectedBrand(null);
                  setSelectedPriceRange(null);
                  setSelectedSort(
                    'newest'
                  );
                }}
                style={{
                  padding: '8px 14px',
                  border: 'none',
                  background: '#ff4d4f',
                  color: '#fff',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Xóa bộ lọc
              </button>

              {/* Sort */}
              <select
                value={selectedSort}
                onChange={(e) =>
                  setSelectedSort(
                    e.target.value
                  )
                }
                style={{
                  padding: '8px 12px',
                  border:
                    '1px solid #ddd'
                }}
              >
                <option value="newest">
                  Mới nhất
                </option>

                <option value="price_asc">
                  Giá thấp đến cao
                </option>

                <option value="price_desc">
                  Giá cao đến thấp
                </option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(4, 1fr)',
                  gap: '20px'
                }}
              >
                {currentProducts.map((p) => (
                  <div className="product-card" key={p.id}>
                    {/* Badge */}
                    <div className="product-badge">
                      CHÍNH HÃNG
                    </div>

                    <Link to={`/products/${p.id}`} className="product-card-link">
                      <div className="product-image-wrapper">
                        <img
                          src={optimizeCloudinaryUrl(p.imageUrl || '/racket_product_1.png', 500)}
                          alt={p.name}
                          className="product-image"
                          loading="lazy"
                        />
                      </div>
                      <div className="product-brand">{p.brand || 'CHÍNH HÃNG'}</div>
                      <h3 className="product-title">{p.name}</h3>
                      <div className="product-price">
                        <span className="price-current">{formatPrice(p.price)}</span>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(e, p);
                      }}
                      className="btn-add-to-cart"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'center',
                  marginTop: '40px',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}
              >
                {/* Prev */}
                <button
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      currentPage - 1
                    )
                  }
                  style={{
                    padding: '10px 15px',
                    border:
                      '1px solid #ddd',
                    background:
                      currentPage === 1
                        ? '#f5f5f5'
                        : '#fff',
                    cursor:
                      currentPage === 1
                        ? 'not-allowed'
                        : 'pointer'
                  }}
                >
                  ‹
                </button>

                {[...Array(totalPages)].map(
                  (_, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setCurrentPage(
                          index + 1
                        )
                      }
                      style={{
                        padding:
                          '10px 15px',
                        border:
                          '1px solid #ddd',
                        background:
                          currentPage ===
                          index + 1
                            ? '#ff4d4f'
                            : '#fff',
                        color:
                          currentPage ===
                          index + 1
                            ? '#fff'
                            : '#000',
                        cursor: 'pointer',
                        fontWeight:
                          currentPage ===
                          index + 1
                            ? 'bold'
                            : 'normal'
                      }}
                    >
                      {index + 1}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      currentPage + 1
                    )
                  }
                  style={{
                    padding: '10px 15px',
                    border:
                      '1px solid #ddd',
                    background:
                      currentPage ===
                      totalPages
                        ? '#f5f5f5'
                        : '#fff',
                    cursor:
                      currentPage ===
                      totalPages
                        ? 'not-allowed'
                        : 'pointer'
                  }}
                >
                  ›
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;