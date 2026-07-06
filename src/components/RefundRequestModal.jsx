import React, { useState } from 'react';
import { X, Loader2, AlertCircle, Banknote, HelpCircle } from 'lucide-react';
import { complaintApi } from '../api/complaintApi';

const METHODS = [
  { id: 'bank', name: 'Tài khoản ngân hàng' },
  { id: 'wallet', name: 'Ví điện tử Momo/ZaloPay' },
  { id: 'original', name: 'Thanh toán ban đầu (nếu có)' }
];

export default function RefundRequestModal({ complaintId, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(METHODS[0].id);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await complaintApi.createRefundRequest(complaintId, {
        amount: parseFloat(amount),
        method,
        reason
      });
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi gửi yêu cầu hoàn tiền');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .refund-modal-content {
            background: white;
            border-radius: 16px;
            width: 100%;
            max-width: 500px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.15);
            animation: slideUp 0.3s ease-out;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          .refund-input {
            width: 100%;
            padding: 14px 16px;
            border-radius: 10px;
            border: 1.5px solid #e2e8f0;
            font-size: 1rem;
            transition: all 0.2s;
            outline: none;
            background-color: #f8fafc;
            color: #0f172a;
          }
          .refund-input:focus {
            border-color: #3b82f6;
            background-color: #fff;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          }
          .refund-label {
            display: block;
            font-size: 0.95rem;
            font-weight: 600;
            color: #334155;
            margin-bottom: 8px;
          }
          .btn-cancel {
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 600;
            color: #475569;
            background: white;
            border: 1px solid #cbd5e1;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-cancel:hover {
            background: #f1f5f9;
            color: #0f172a;
          }
          .btn-submit {
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 600;
            color: white;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }
          .btn-submit:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
            filter: brightness(1.05);
          }
          .btn-submit:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        `}
      </style>

      <div className="refund-modal-content">
        {/* Header */}
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Banknote size={24} style={{ color: '#3b82f6' }} />
              Yêu cầu hoàn tiền
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Điền thông tin để chúng tôi xử lý hoàn tiền cho bạn.
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', maxHeight: '70vh' }}>
          {error && (
            <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div style={{ background: '#eff6ff', padding: '15px', borderRadius: '10px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <HelpCircle size={20} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e3a8a', lineHeight: '1.5' }}>
              Số tiền hoàn lại tối đa bằng giá trị đơn hàng hoặc sản phẩm bị lỗi. Chúng tôi sẽ đối chiếu trước khi chuyển khoản.
            </p>
          </div>

          <form id="refund-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label className="refund-label">Số tiền yêu cầu hoàn (VNĐ) <span style={{color: '#ef4444'}}>*</span></label>
              <input 
                type="number"
                className="refund-input"
                placeholder="Ví dụ: 250000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#b91c1c' }}
              />
            </div>

            <div>
              <label className="refund-label">Phương thức nhận tiền <span style={{color: '#ef4444'}}>*</span></label>
              <select 
                className="refund-input"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                required
              >
                {METHODS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="refund-label">Ghi chú & Số tài khoản <span style={{color: '#ef4444'}}>*</span></label>
              <textarea
                className="refund-input"
                style={{ height: '100px', resize: 'none' }}
                placeholder="Vui lòng cung cấp Số tài khoản, Ngân hàng và Tên người nhận. Ví dụ: 1903555xxxx Techcombank, Nguyen Van A..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '20px 24px', 
          borderTop: '1px solid #f1f5f9',
          backgroundColor: '#f8fafc',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
            Hủy bỏ
          </button>
          <button type="submit" form="refund-form" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="lucide-spin" style={{ animation: 'spin 1s linear infinite' }} />
                Đang xử lý...
              </>
            ) : (
              <>Xác nhận Gửi</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
