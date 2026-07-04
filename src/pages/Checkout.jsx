import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi } from '../api/cart';
import { authApi } from '../api/auth';
import { orderApi } from '../api/order';
import { couponApi } from '../api/coupon';
import { CheckCircle2, QrCode, CreditCard, ShoppingBag, Truck, MapPin, User, Phone, FileText } from 'lucide-react';

function Checkout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [cartItems, setCartItems] = useState([]);
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    address: '',
    notes: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // 1. Guard check & load data
  useEffect(() => {
    if (!token) {
      alert('Vui lòng đăng nhập để tiến hành thanh toán!');
      navigate('/login?redirect=checkout');
      return;
    }

    const query = new URLSearchParams(window.location.search);
    const vnpayStatus = query.get('vnpay');
    const orderCode = query.get('orderCode');
    const phone = query.get('phone');

    if (vnpayStatus === 'success' && orderCode && phone) {
      setLoading(true);
      orderApi.trackOrder(orderCode, phone)
        .then(result => {
          setOrderSuccess(result);
          setLoading(false);
        })
        .catch(err => {
          console.error("Lỗi tải thông tin đơn hàng sau thanh toán:", err);
          setErrorMsg("Thanh toán thành công nhưng không thể lấy thông tin đơn hàng.");
          setLoading(false);
        });
      return;
    } else if (vnpayStatus === 'failed') {
      setErrorMsg("Thanh toán qua cổng VNPay thất bại hoặc đã bị hủy.");
    }

    const loadData = async () => {
      try {
        // Load cart items
        const cart = await cartApi.getCart();
        const items = Array.isArray(cart) ? cart : [];
        if (items.length === 0 && vnpayStatus !== 'failed') {
          navigate('/cart');
          return;
        }
        setCartItems(items);

        // Load profile to auto-fill
        try {
          const userProfile = await authApi.getProfile();
          setProfile(prev => ({
            ...prev,
            fullName: userProfile.fullName || '',
            phone: userProfile.phone || '',
            address: userProfile.address || ''
          }));
        } catch (err) {
          console.error('Lỗi tải profile để điền sẵn:', err);
        }

      } catch (err) {
        console.error('Lỗi chuẩn bị checkout:', err);
        setErrorMsg('Không thể chuẩn bị đơn hàng. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 0; // Miễn phí vận chuyển
  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    setCouponSuccess('');
    
    try {
      const res = await couponApi.applyCoupon({
        code: couponCode.trim(),
        cartTotal: subtotal
      });
      
      if (res.isValid) {
        console.log("Apply coupon success", res);
        setAppliedCoupon(res.coupon);
        setDiscountAmount(res.discountAmount);
        setCouponSuccess(res.message);
      } else {
        console.log("Apply coupon failed", res);
        setCouponError(res.message);
        setAppliedCoupon(null);
        setDiscountAmount(0);
      }
    } catch (err) {
      setCouponError(err.message || 'Lỗi áp dụng mã giảm giá');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponError('');
    setCouponSuccess('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!profile.fullName.trim()) {
      setErrorMsg('Vui lòng nhập họ tên người nhận hàng!');
      return;
    }
    if (!profile.phone.trim()) {
      setErrorMsg('Vui lòng nhập số điện thoại người nhận hàng!');
      return;
    }
    if (!profile.address.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ giao hàng!');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        fullName: profile.fullName.trim(),
        phone: profile.phone.trim(),
        address: profile.address.trim(),
        notes: profile.notes.trim(),
        paymentMethod: paymentMethod,
        couponCode: appliedCoupon ? appliedCoupon.code : null
      };

      const result = await orderApi.createOrder(orderPayload);
      
      if (paymentMethod === 'VNPAY' && result.paymentUrl) {
        window.dispatchEvent(new Event('cartUpdated'));
        window.location.href = result.paymentUrl;
        return;
      }

      setOrderSuccess(result);
      
      // Dispatch cart updated event so header changes to 0
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setErrorMsg(err.message || 'Đặt hàng thất bại. Vui lòng kiểm tra lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3>Đang chuẩn bị đơn hàng của bạn...</h3>
      </div>
    );
  }

  // 2. Render Order Success Screen
  if (orderSuccess) {
    return (
      <div className="container fade-in" style={{ padding: '60px 20px', maxWidth: '750px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '50%', color: '#2e7d32', marginBottom: '25px' }}>
          <CheckCircle2 size={64} />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#2e7d32', marginBottom: '15px' }}>Đặt Hàng Thành Công!</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.05rem', marginBottom: '35px', lineHeight: 1.6 }}>
          Cảm ơn bạn đã tin tưởng mua sắm tại <strong>BMT SHOP</strong>. Một email xác nhận đơn hàng chi tiết đã được gửi tới hòm thư của bạn.
        </p>

        <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', textAlign: 'left', marginBottom: '40px' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px', fontWeight: '700' }}>Chi tiết Đơn hàng: #{orderSuccess.orderCode}</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '25px' }}>
            <div>
              <p style={{ margin: '0 0 5px', color: 'var(--text-light)', fontSize: '0.85rem' }}>Người nhận hàng</p>
              <strong style={{ fontSize: '1rem' }}>{orderSuccess.fullName}</strong>
            </div>
            <div>
              <p style={{ margin: '0 0 5px', color: 'var(--text-light)', fontSize: '0.85rem' }}>Số điện thoại</p>
              <strong style={{ fontSize: '1rem' }}>{orderSuccess.phone}</strong>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <p style={{ margin: '0 0 5px', color: 'var(--text-light)', fontSize: '0.85rem' }}>Địa chỉ giao hàng</p>
              <strong style={{ fontSize: '0.95rem' }}>{orderSuccess.address}</strong>
            </div>
            <div>
              <p style={{ margin: '0 0 5px', color: 'var(--text-light)', fontSize: '0.85rem' }}>Phương thức thanh toán</p>
              <strong style={{ fontSize: '1rem', color: 'var(--primary-color)' }}>
                {orderSuccess.paymentMethod === 'COD' ? 'Thanh toán COD' : orderSuccess.paymentMethod === 'VNPAY' ? 'Cổng thanh toán VNPay' : 'Chuyển khoản Ngân hàng (VietQR)'}
              </strong>
            </div>
            <div>
              <p style={{ margin: '0 0 5px', color: 'var(--text-light)', fontSize: '0.85rem' }}>Tổng tiền thanh toán</p>
              <strong style={{ fontSize: '1.2rem', color: '#ff3b30' }}>{formatPrice(orderSuccess.totalAmount)}</strong>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <h4 style={{ fontWeight: '600', marginBottom: '10px' }}>Sản phẩm đã mua:</h4>
            {orderSuccess.items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-dark)' }}>
                  {item.name} <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>({item.details})</span> x <strong style={{ color: 'var(--primary-color)' }}>{item.quantity}</strong>
                </span>
                <span style={{ fontWeight: '600' }}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn-primary" style={{ padding: '12px 30px', fontWeight: '600', backgroundColor: 'transparent', border: '2px solid var(--primary-color)', color: 'var(--primary-color)', boxShadow: 'none' }}>
            TIẾP TỤC MUA SẮM
          </Link>
          <Link to="/order-tracking" className="btn-primary" style={{ padding: '12px 30px', fontWeight: '700' }}>
            THEO DÕI ĐƠN HÀNG
          </Link>
        </div>
      </div>
    );
  }

  // 3. Render Normal Checkout Form
  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <Link to="/cart">Giỏ hàng</Link> / <span>Thanh toán</span>
      </div>

      <h1 style={{ fontSize: '1.8rem', marginTop: '20px', marginBottom: '30px', fontWeight: '800' }}>
        Xác Nhận Đặt Hàng
      </h1>

      {errorMsg && (
        <div style={{ color: '#c62828', backgroundColor: '#ffebee', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* Left Side: Recipient Info & Payment Option */}
        <div style={{ flex: '1.3', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* Shipping Form */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck style={{ color: 'var(--primary-color)' }} size={22} /> Thông tin giao hàng
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', fontSize: '0.95rem' }}>
                  <User size={16} /> Họ tên người nhận <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="Nhập họ tên đầy đủ người nhận"
                  required
                  value={profile.fullName}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', fontSize: '0.95rem' }}>
                  <Phone size={16} /> Số điện thoại <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Nhập số điện thoại liên hệ"
                  required
                  value={profile.phone}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', fontSize: '0.95rem' }}>
                  <MapPin size={16} /> Địa chỉ giao hàng <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea 
                  name="address"
                  placeholder="Nhập địa chỉ giao hàng cụ thể (Số nhà, ngõ/hẻm, đường, phường/xã, quận/huyện, tỉnh/TP)..."
                  required
                  rows="3"
                  value={profile.address}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', fontSize: '0.95rem' }}>
                  <FileText size={16} /> Ghi chú đơn hàng
                </label>
                <textarea 
                  name="notes"
                  placeholder="Ghi chú thêm về đơn hàng (Ví dụ: giao giờ hành chính, gọi điện trước khi giao...)"
                  rows="2"
                  value={profile.notes}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard style={{ color: 'var(--primary-color)' }} size={22} /> Phương thức thanh toán
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* COD */}
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px', 
                padding: '15px 20px', 
                border: paymentMethod === 'COD' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', 
                borderRadius: '8px', 
                cursor: 'pointer',
                backgroundColor: paymentMethod === 'COD' ? 'rgba(244,121,32,0.03)' : 'transparent',
                transition: '0.3s'
              }}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="COD" 
                  checked={paymentMethod === 'COD'} 
                  onChange={() => setPaymentMethod('COD')}
                  style={{ accentColor: 'var(--primary-color)', width: '18px', height: '18px' }}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Thanh toán khi nhận hàng (COD)</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Bạn sẽ thanh toán bằng tiền mặt cho shipper khi nhận được hàng.</span>
                </div>
              </label>

              {/* VNPAY */}
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px', 
                padding: '15px 20px', 
                border: paymentMethod === 'VNPAY' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', 
                borderRadius: '8px', 
                cursor: 'pointer',
                backgroundColor: paymentMethod === 'VNPAY' ? 'rgba(244,121,32,0.03)' : 'transparent',
                transition: '0.3s'
              }}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="VNPAY" 
                  checked={paymentMethod === 'VNPAY'} 
                  onChange={() => setPaymentMethod('VNPAY')}
                  style={{ accentColor: 'var(--primary-color)', width: '18px', height: '18px' }}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Thanh toán qua cổng VNPay</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Thanh toán trực tuyến an toàn qua ứng dụng ngân hàng hoặc thẻ ATM/Quốc tế.</span>
                </div>
              </label>

              {/* Dynamic VNPay Details Container */}
              {paymentMethod === 'VNPAY' && (
                <div className="fade-in" style={{ 
                  marginTop: '10px', 
                  border: '1.5px dashed var(--primary-color)', 
                  borderRadius: '12px', 
                  padding: '20px', 
                  backgroundColor: '#fffdf9',
                  display: 'flex',
                  gap: '15px',
                  alignItems: 'center'
                }}>
                  <div style={{ color: 'var(--primary-color)' }}>
                    <CreditCard size={28} />
                  </div>
                  <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                    <strong>Thanh toán trực tuyến VNPay:</strong> Bạn sẽ được chuyển hướng tới cổng thanh toán bảo mật VNPay sau khi nhấn đặt hàng. Vui lòng chuẩn bị sẵn ứng dụng ngân hàng hỗ trợ quét mã VNPAY-QR hoặc thẻ thanh toán.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div style={{ flex: '1', minWidth: '320px', alignSelf: 'flex-start' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag style={{ color: 'var(--primary-color)' }} size={22} /> Tóm tắt đơn hàng
            </h3>

            {/* Item List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img 
                    src={item.thumbnail || '/racket_product_1.png'} 
                    alt={item.name} 
                    style={{ width: '50px', height: '50px', objectFit: 'contain', backgroundColor: '#f9f9f9', borderRadius: '6px', border: '1px solid #eee' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: '0 0 4px', fontSize: '0.9rem', fontWeight: '600', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h5>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      Số lượng: {item.quantity} | {item.details}
                    </p>
                  </div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>{formatPrice(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            {/* Coupon Input */}
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Mã giảm giá (nếu có)" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                  disabled={appliedCoupon != null}
                  style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                />
                {appliedCoupon ? (
                  <button 
                    type="button" 
                    onClick={handleRemoveCoupon}
                    style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    HỦY
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    style={{ padding: '10px 20px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', opacity: (isApplyingCoupon || !couponCode.trim()) ? 0.7 : 1 }}
                  >
                    {isApplyingCoupon ? '...' : 'ÁP DỤNG'}
                  </button>
                )}
              </div>
              {couponError && <p style={{ color: '#d32f2f', fontSize: '0.85rem', margin: '8px 0 0 0' }}>{couponError}</p>}
              {couponSuccess && <p style={{ color: '#2e7d32', fontSize: '0.85rem', margin: '8px 0 0 0' }}>{couponSuccess}</p>}
            </div>

            {/* Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-light)' }}>Tạm tính</span>
                <strong style={{ color: 'var(--text-dark)' }}>{formatPrice(subtotal)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-light)' }}>Phí vận chuyển</span>
                <strong style={{ color: '#4caf50' }}>Miễn phí</strong>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-light)' }}>Giảm giá {appliedCoupon && `(${appliedCoupon.code})`}</span>
                  <strong style={{ color: '#d32f2f' }}>-{formatPrice(discountAmount)}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '5px' }}>
                <span style={{ fontWeight: '700' }}>Tổng cộng</span>
                <strong style={{ fontWeight: '800', color: '#ff3b30', fontSize: '1.3rem' }}>{formatPrice(totalAmount)}</strong>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary" 
              style={{ width: '100%', padding: '15px', fontWeight: '700', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'ĐANG XỬ LÝ ĐẶT HÀNG...' : 'ĐẶT HÀNG NGAY'}
            </button>
            <p style={{ margin: '12px 0 0', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-light)' }}>
              Bằng việc nhấn Đặt hàng, bạn đồng ý với các chính sách mua sắm của BMT SHOP.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
