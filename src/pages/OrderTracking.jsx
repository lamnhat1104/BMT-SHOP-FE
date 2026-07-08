import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/order';
import { reviewApi } from '../api/review';
import { Search, MapPin, CreditCard, ShoppingBag, Clock, CheckCircle2, AlertCircle, ArrowLeft, Star } from 'lucide-react';
import ReviewFormModal from '../components/ReviewFormModal';
import ComplaintModal from '../components/ComplaintModal';
function OrderTracking() {
  const [orderCode, setOrderCode] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderData, setOrderData] = useState(null);
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  // New states for logged in users
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserOrders();
    }
  }, []);

  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await orderApi.getMyOrders();
      setUserOrders(data);
    } catch (err) {
      setErrorMsg('Lỗi tải danh sách đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderCode.trim() || !phone.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ mã đơn hàng và số điện thoại!');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setOrderData(null);

    try {
      const data = await orderApi.trackOrder(orderCode.trim(), phone.trim());
      setOrderData(data);
    } catch (err) {
      setErrorMsg(err.message || 'Không tìm thấy đơn hàng tương ứng. Vui lòng kiểm tra lại thông tin!');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  const handleReviewClick = (product) => {
    setReviewingProduct(product);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (data) => {
    try {
      setIsSubmittingReview(true);
      await reviewApi.createReview(orderData.id, reviewingProduct.productId, data.rating, data.comment, data.files);
      alert('Cảm ơn bạn đã đánh giá sản phẩm!');
      setIsReviewModalOpen(false);
      setReviewingProduct(null);
    } catch (err) {
      alert(err.message || 'Lỗi gửi đánh giá');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Helper to map status to step index (0-3)
  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 0;
      case 'Đang xử lý':
        return 1;
      case 'Đang giao hàng':
        return 2;
      case 'Hoàn thành':
      case 'completed':
        return 3;
      default:
        return -1; // Cancelled or unknown
    }
  };

  const stepIndex = orderData ? getStatusStepIndex(orderData.status) : -1;
  const isCancelled = orderData && (orderData.status === 'Đã hủy' || orderData.status === 'cancelled');

  return (
    <div className="container fade-in" style={{ padding: '40px 20px', maxWidth: '900px' }}>
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <span>{isLoggedIn ? 'Quản lý đơn hàng' : 'Kiểm tra đơn hàng'}</span>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginTop: '30px', textAlign: 'center' }}>
        
        {/* VIEW: ORDER DETAILS (Show if orderData is set) */}
        {orderData ? (
          <div className="fade-in" style={{ textAlign: 'left' }}>
            {isLoggedIn && (
              <button 
                onClick={() => setOrderData(null)}
                className="mb-6 flex items-center gap-2 text-[#f47920] font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                <ArrowLeft size={18} /> Quay lại danh sách
              </button>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>Mã đơn hàng: <span style={{ color: 'var(--primary-color)' }}>#{orderData.orderCode}</span></h2>
              <span style={{ 
                padding: '6px 15px', 
                borderRadius: '20px', 
                fontSize: '0.85rem', 
                fontWeight: '700',
                border: isCancelled ? '1px solid #ef9a9a' : '1px solid var(--primary-color)',
                backgroundColor: isCancelled ? '#ffebee' : 'rgba(244,121,32,0.05)',
                color: isCancelled ? '#c62828' : 'var(--primary-color)'
              }}>
                Trạng thái: <strong>{orderData.status}</strong>
              </span>
            </div>

            {/* Progress Visual Bar */}
            {isCancelled ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffebee', borderLeft: '5px solid #c62828', padding: '15px', borderRadius: '6px', marginBottom: '30px' }}>
                <AlertCircle size={24} style={{ color: '#c62828', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', color: '#c62828', fontSize: '0.95rem' }}>Đơn hàng đã bị hủy</strong>
                  <span style={{ fontSize: '0.85rem', color: '#555' }}>Đơn hàng này đã bị hủy bỏ. Vui lòng liên hệ hotline 0977508430 hoặc đặt đơn hàng mới.</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'space-between', marginBottom: '40px', position: 'relative', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ position: 'absolute', top: '15px', left: '30px', right: '30px', height: '4px', backgroundColor: 'var(--border-color)', zIndex: 0 }}></div>
                {stepIndex > 0 && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '15px', 
                    left: '30px', 
                    width: `${(stepIndex / 3) * 90}%`, 
                    height: '4px', 
                    backgroundColor: '#4caf50', 
                    zIndex: 1,
                    transition: 'width 0.5s ease-in-out'
                  }}></div>
                )}
                
                {[
                  { index: 0, label: 'Đã đặt' },
                  { index: 1, label: 'Xác nhận' },
                  { index: 2, label: 'Đang giao' },
                  { index: 3, label: 'Đã giao' }
                ].map(step => (
                  <div key={step.index} style={{ position: 'relative', zIndex: 2, textAlign: 'center', flex: 1, minWidth: '70px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: stepIndex >= step.index ? '#4caf50' : 'white', 
                      border: stepIndex >= step.index ? 'none' : '2px solid var(--border-color)',
                      borderRadius: '50%', 
                      color: stepIndex >= step.index ? 'white' : 'var(--text-light)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 10px', 
                      fontWeight: 'bold',
                      boxShadow: '0 0 0 4px white' 
                    }}>
                      {stepIndex >= step.index ? '✓' : (step.index + 1)}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: stepIndex >= step.index ? '700' : '500', color: stepIndex >= step.index ? '#4caf50' : 'var(--text-light)' }}>{step.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Recipient info details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', backgroundColor: '#f9f9f9', padding: '25px', borderRadius: '8px', marginBottom: '30px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Clock size={18} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Thời gian đặt hàng</span>
                  <strong>{formatDate(orderData.createdAt)}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={18} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Giao tới địa chỉ</span>
                  <strong style={{ fontSize: '0.9rem' }}>{orderData.fullName} - {orderData.phone}<br/>{orderData.address}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <CreditCard size={18} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Thanh toán</span>
                  <strong>{orderData.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : orderData.paymentMethod === 'VNPAY' ? 'Thanh toán qua cổng VNPay' : 'Chuyển khoản Ngân hàng'}</strong>
                </div>
              </div>
            </div>

            {/* Notes */}
            {orderData.notes && (
              <div style={{ borderLeft: '4px solid var(--primary-color)', paddingLeft: '15px', marginBottom: '30px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Ghi chú đơn hàng</span>
                <p style={{ margin: '4px 0 0', fontStyle: 'italic' }}>"{orderData.notes}"</p>
              </div>
            )}

            {/* Dynamic Product Item List Grid */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              <h4 style={{ margin: 0, padding: '15px', backgroundColor: '#f5f5f5', borderBottom: '1px solid var(--border-color)', fontWeight: '700' }}>
                Chi tiết sản phẩm đã chọn ({orderData.items?.reduce((sum, i) => sum + i.quantity, 0)} sản phẩm)
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafafa' }}>
                    <th style={{ padding: '10px 15px', textAlign: 'left' }}>Sản phẩm</th>
                    <th style={{ padding: '10px 15px', textAlign: 'center' }}>Số lượng</th>
                    <th style={{ padding: '10px 15px', textAlign: 'right' }}>Giá mua</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.items?.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 15px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <img 
                          src={item.thumbnail || '/racket_product_1.png'} 
                          alt={item.name} 
                          style={{ width: '45px', height: '45px', objectFit: 'contain', backgroundColor: '#f9f9f9', borderRadius: '4px' }}
                        />
                        <div>
                          <strong style={{ display: 'block' }}>{item.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                            {item.brand} {item.details ? `| ${item.details}` : ''}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 15px', textAlign: 'center', fontWeight: '700' }}>{item.quantity}</td>
                      <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: '600', color: '#ff3b30' }}>
                        {formatPrice(item.price * item.quantity)}
                        {(orderData.status === 'completed' || orderData.status === 'Hoàn thành') && (
                          <div style={{ marginTop: '10px' }}>
                            <button 
                              onClick={() => handleReviewClick(item)}
                              className="mt-3 px-5 py-2 bg-gradient-to-r from-orange-400 to-[#f47920] hover:from-[#f47920] hover:to-[#e06714] text-white text-xs font-bold rounded-lg shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 border-none flex items-center justify-center gap-1.5"
                            >
                              <Star size={14} className="fill-white" /> Viết Đánh Giá
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <td colSpan="2" style={{ padding: '12px 15px', fontWeight: '700', textAlign: 'right' }}>Tổng cộng thanh toán:</td>
                    <td style={{ padding: '12px 15px', fontWeight: '800', textAlign: 'right', color: '#ff3b30', fontSize: '1.1rem' }}>
                      {formatPrice(orderData.totalAmount)}
                    </td>
                  </tr>
                  {(orderData.status === 'completed' || orderData.status === 'Hoàn thành' || orderData.status === 'delivered' || orderData.status === 'Đã giao') && (
                    <tr style={{ backgroundColor: '#fff' }}>
                      <td colSpan="3" style={{ padding: '15px', textAlign: 'right' }}>
                        <button 
                          onClick={() => setIsComplaintModalOpen(true)}
                          style={{ padding: '8px 16px', fontSize: '0.9rem', backgroundColor: 'transparent', border: '1px solid #ff9800', color: '#ff9800', borderRadius: '6px', cursor: 'pointer', transition: '0.2s', fontWeight: '600' }}
                          className="hover:bg-orange-50"
                        >
                          Khiếu nại / Đổi trả
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        ) : (
          /* VIEW: ORDER LIST (Logged in) OR SEARCH FORM (Guest) */
          <>
            {isLoggedIn ? (
              <div className="text-left fade-in">
                <h1 style={{ fontSize: '2rem', marginBottom: '10px', fontWeight: '800', textAlign: 'center' }}>Đơn Hàng Của Bạn</h1>
                <p style={{ color: 'var(--text-light)', marginBottom: '30px', textAlign: 'center' }}>Quản lý và theo dõi trạng thái các đơn hàng bạn đã đặt.</p>
                
                {errorMsg && (
                  <div style={{ color: '#c62828', backgroundColor: '#ffebee', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' }}>
                    ⚠️ {errorMsg}
                  </div>
                )}

                {loadingOrders ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải danh sách đơn hàng...</div>
                ) : userOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <ShoppingBag size={48} style={{ color: '#ccc', margin: '0 auto 15px' }} />
                    <p style={{ color: '#666' }}>Bạn chưa có đơn hàng nào.</p>
                    <Link to="/products" className="btn-primary" style={{ display: 'inline-block', marginTop: '15px', padding: '10px 20px' }}>Mua sắm ngay</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {userOrders.map(order => (
                      <div key={order.id} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', transition: 'box-shadow 0.3s' }} className="hover:shadow-md">
                        <div style={{ backgroundColor: '#fafafa', padding: '15px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <span style={{ fontWeight: '700', marginRight: '15px' }}>Mã ĐH: #{order.orderCode}</span>
                            <span style={{ fontSize: '0.85rem', color: '#666' }}>{formatDate(order.createdAt)}</span>
                          </div>
                          <span style={{ 
                            padding: '4px 12px', 
                            borderRadius: '20px', 
                            fontSize: '0.8rem', 
                            fontWeight: '600',
                            backgroundColor: (order.status === 'Đã hủy' || order.status === 'cancelled') ? '#ffebee' : 'rgba(244,121,32,0.1)',
                            color: (order.status === 'Đã hủy' || order.status === 'cancelled') ? '#c62828' : 'var(--primary-color)'
                          }}>
                            {order.status}
                          </span>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                          <div style={{ display: 'flex', gap: '15px', flex: 1, minWidth: '250px' }}>
                            {order.items && order.items.length > 0 && (
                              <>
                                <img src={order.items[0].thumbnail || '/racket_product_1.png'} alt={order.items[0].name} style={{ width: '60px', height: '60px', objectFit: 'contain', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }} />
                                <div>
                                  <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '4px' }}>{order.items[0].name}</strong>
                                  <span style={{ fontSize: '0.85rem', color: '#666' }}>
                                    {order.items.length > 1 ? `và ${order.items.length - 1} sản phẩm khác` : (order.items[0].details || order.items[0].brand)}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ff3b30' }}>{formatPrice(order.totalAmount)}</div>
                            <button 
                              onClick={() => setOrderData(order)}
                              style={{ padding: '8px 20px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
                              className="hover:bg-orange-600"
                            >
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="fade-in">
                <h1 style={{ fontSize: '2rem', marginBottom: '10px', fontWeight: '800' }}>Kiểm Tra Đơn Hàng</h1>
                <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>Nhập mã đơn hàng và số điện thoại người nhận để theo dõi hành trình giao hàng.</p>
                
                <form onSubmit={handleTrack} style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Mã đơn hàng</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: BMT172839..." 
                      required 
                      value={orderCode} 
                      onChange={(e) => setOrderCode(e.target.value)} 
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Số điện thoại người nhận</label>
                    <input 
                      type="tel" 
                      placeholder="Nhập số điện thoại khi đặt hàng" 
                      required 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary" 
                    style={{ width: '100%', padding: '15px', fontWeight: '700', fontSize: '1.05rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'ĐANG TRA CỨU...' : 'KIỂM TRA NGAY'}
                  </button>
                </form>

                {errorMsg && (
                  <div style={{ color: '#c62828', backgroundColor: '#ffebee', padding: '15px', borderRadius: '8px', maxWidth: '500px', margin: '20px auto 0', fontWeight: '500', textAlign: 'left' }}>
                    ⚠️ {errorMsg}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <ReviewFormModal 
        isOpen={isReviewModalOpen}
        onClose={() => { setIsReviewModalOpen(false); setReviewingProduct(null); }}
        onSubmit={handleReviewSubmit}
        isSubmitting={isSubmittingReview}
      />

      {isComplaintModalOpen && orderData && (
        <ComplaintModal 
          orderId={orderData.id}
          onClose={() => setIsComplaintModalOpen(false)}
          onSuccess={() => {
            setIsComplaintModalOpen(false);
            alert("Đã gửi yêu cầu khiếu nại thành công! Vui lòng vào trang Khiếu nại của tôi để theo dõi.");
          }}
        />
      )}
    </div>
  );
}

export default OrderTracking;
