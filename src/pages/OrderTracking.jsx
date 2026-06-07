import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/order';
import { Search, MapPin, CreditCard, ShoppingBag, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

function OrderTracking() {
  const [orderCode, setOrderCode] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderData, setOrderData] = useState(null);

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
        return 3;
      default:
        return -1; // Cancelled or unknown
    }
  };

  const stepIndex = orderData ? getStatusStepIndex(orderData.status) : -1;
  const isCancelled = orderData && orderData.status === 'Đã hủy';

  return (
    <div className="container fade-in" style={{ padding: '40px 20px', maxWidth: '900px' }}>
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <span>Kiểm tra đơn hàng</span>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginTop: '30px', textAlign: 'center' }}>
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

        {/* Realtime Tracking Results */}
        {orderData && (
          <div className="fade-in" style={{ marginTop: '45px', borderTop: '2px solid var(--border-color)', paddingTop: '35px', textAlign: 'left' }}>
            
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative', flexWrap: 'wrap', gap: '20px' }}>
                {/* Horizontal progress background line */}
                <div style={{ position: 'absolute', top: '15px', left: '30px', right: '30px', height: '4px', backgroundColor: 'var(--border-color)', zIndex: 0 }}></div>
                {/* Filled green line */}
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
                
                {/* Step 1: Placed */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', flex: 1, minWidth: '70px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    backgroundColor: stepIndex >= 0 ? '#4caf50' : 'white', 
                    border: stepIndex >= 0 ? 'none' : '2px solid var(--border-color)',
                    borderRadius: '50%', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 10px', 
                    fontWeight: 'bold',
                    boxShadow: '0 0 0 4px white' 
                  }}>
                    {stepIndex >= 0 ? '✓' : '1'}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: stepIndex >= 0 ? '700' : '500', color: stepIndex >= 0 ? '#4caf50' : 'var(--text-light)' }}>Đã đặt</div>
                </div>

                {/* Step 2: Confirmed / Processing */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', flex: 1, minWidth: '70px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    backgroundColor: stepIndex >= 1 ? '#4caf50' : 'white', 
                    border: stepIndex >= 1 ? 'none' : '2px solid var(--border-color)',
                    borderRadius: '50%', 
                    color: stepIndex >= 1 ? 'white' : 'var(--text-light)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 10px', 
                    fontWeight: 'bold',
                    boxShadow: '0 0 0 4px white' 
                  }}>
                    {stepIndex >= 1 ? '✓' : '2'}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: stepIndex >= 1 ? '700' : '500', color: stepIndex >= 1 ? '#4caf50' : 'var(--text-light)' }}>Xác nhận</div>
                </div>

                {/* Step 3: Shipping */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', flex: 1, minWidth: '70px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    backgroundColor: stepIndex >= 2 ? '#4caf50' : 'white', 
                    border: stepIndex >= 2 ? 'none' : '2px solid var(--border-color)',
                    borderRadius: '50%', 
                    color: stepIndex >= 2 ? 'white' : 'var(--text-light)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 10px', 
                    fontWeight: 'bold',
                    boxShadow: '0 0 0 4px white' 
                  }}>
                    {stepIndex >= 2 ? '✓' : '3'}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: stepIndex >= 2 ? '700' : '500', color: stepIndex >= 2 ? '#4caf50' : 'var(--text-light)' }}>Đang giao</div>
                </div>

                {/* Step 4: Completed */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', flex: 1, minWidth: '70px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    backgroundColor: stepIndex >= 3 ? '#4caf50' : 'white', 
                    border: stepIndex >= 3 ? 'none' : '2px solid var(--border-color)',
                    borderRadius: '50%', 
                    color: stepIndex >= 3 ? 'white' : 'var(--text-light)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 10px', 
                    fontWeight: 'bold',
                    boxShadow: '0 0 0 4px white' 
                  }}>
                    {stepIndex >= 3 ? '✓' : '4'}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: stepIndex >= 3 ? '700' : '500', color: stepIndex >= 3 ? '#4caf50' : 'var(--text-light)' }}>Đã giao</div>
                </div>
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
                Chi tiết sản phẩm đã chọn ({orderData.items.reduce((sum, i) => sum + i.quantity, 0)} sản phẩm)
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
                  {orderData.items.map(item => (
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
                            {item.brand} | {item.details}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 15px', textAlign: 'center', fontWeight: '700' }}>{item.quantity}</td>
                      <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: '600', color: '#ff3b30' }}>
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <td colSpan="2" style={{ padding: '12px 15px', fontWeight: '700', textAlign: 'right' }}>Tổng cộng thanh toán:</td>
                    <td style={{ padding: '12px 15px', fontWeight: '800', textAlign: 'right', color: '#ff3b30', fontSize: '1.1rem' }}>
                      {formatPrice(orderData.totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default OrderTracking;
