import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../api/product';
import { cartApi } from '../api/cart';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryId, setCategoryId] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedSort, setSelectedSort] = useState('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    fetchProducts();
  }, [categoryId, selectedBrand, selectedSort]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await productApi.getAllProducts({
        categoryId,
        brand: selectedBrand,
        sort: selectedSort
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
              'Giá dưới 500.000đ',
              '500.000đ - 1 triệu',
              '1 - 2 triệu',
              '2 - 3 triệu',
              'Giá trên 3 triệu'
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
                <input type="checkbox" />
                {price}
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
                  type="radio"
                  checked={selectedBrand === brand}
                  onChange={() =>
                    setSelectedBrand(brand)
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
                  type="radio"
                  checked={categoryId === cat.id}
                  onChange={() =>
                    setCategoryId(cat.id)
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
                  <Link
                    to={`/products/${p.id}`}
                    key={p.id}
                    style={{
                      textDecoration:
                        'none',
                      color: '#000',
                      position: 'relative'
                    }}
                  >
                    {/* Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'red',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        zIndex: 10
                      }}
                    >
                      Liên hệ
                    </div>

                    {/* Card */}
                    <div
                      style={{
                        border:
                          '1px solid #eee',
                        padding: '15px',
                        borderRadius: '6px',
                        transition: '0.3s',
                        height: '100%'
                      }}
                    >
                      <img
                        src={
                          p.imageUrl ||
                          '/racket_product_1.png'
                        }
                        alt={p.name}
                        style={{
                          width: '100%',
                          height: '220px',
                          objectFit:
                            'contain'
                        }}
                      />

                      <h3
                        style={{
                          fontSize: '15px',
                          marginTop: '15px',
                          minHeight: '40px'
                        }}
                      >
                        {p.name}
                      </h3>

                      <div
                        style={{
                          color: 'red',
                          fontWeight:
                            'bold',
                          fontSize: '20px',
                          marginTop: '10px'
                        }}
                      >
                        {formatPrice(
                          p.price
                        )}
                      </div>

                      <button
                        onClick={(e) =>
                          handleAddToCart(
                            e,
                            p
                          )
                        }
                        style={{
                          width: '100%',
                          marginTop: '15px',
                          padding: '10px',
                          border: 'none',
                          background:
                            '#ff4d4f',
                          color: '#fff',
                          fontWeight:
                            'bold',
                          cursor: 'pointer',
                          borderRadius:
                            '5px'
                        }}
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  </Link>
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