import React, { useState } from 'react';
import { X, Upload, Loader2, AlertCircle, Image as ImageIcon, Video } from 'lucide-react';
import { complaintApi } from '../api/complaintApi';

const REASONS = [
  "Sản phẩm bị lỗi hoặc hư hỏng",
  "Giao sai sản phẩm hoặc sai số lượng",
  "Thiếu sản phẩm trong đơn hàng",
  "Chưa nhận được hàng",
  "Sản phẩm không đúng mô tả",
  "Khác"
];

export default function ComplaintModal({ orderId, onClose, onSuccess }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await complaintApi.createComplaint(orderId, reason, description, file);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi gửi khiếu nại');
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
          .complaint-modal-content {
            background: white;
            border-radius: 16px;
            width: 100%;
            max-width: 550px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.15);
            animation: slideUp 0.3s ease-out;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          .complaint-input {
            width: 100%;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1.5px solid #e2e8f0;
            font-size: 0.95rem;
            transition: all 0.2s;
            outline: none;
            background-color: #f8fafc;
          }
          .complaint-input:focus {
            border-color: var(--primary-color, #ff9800);
            background-color: #fff;
            box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.1);
          }
          .complaint-label {
            display: block;
            font-size: 0.9rem;
            font-weight: 600;
            color: #334155;
            margin-bottom: 8px;
          }
          .btn-cancel {
            padding: 12px 24px;
            border-radius: 8px;
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
            border-radius: 8px;
            font-weight: 600;
            color: white;
            background: var(--primary-color, #ff9800);
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(255, 152, 0, 0.2);
          }
          .btn-submit:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(255, 152, 0, 0.3);
            filter: brightness(1.05);
          }
          .btn-submit:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        `}
      </style>

      <div className="complaint-modal-content">
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
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#0f172a' }}>
              Yêu cầu Hỗ trợ / Đổi trả
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Đơn hàng #{orderId}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              background: '#f1f5f9', 
              border: 'none', 
              borderRadius: '50%', 
              width: '36px', 
              height: '36px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'all 0.2s'
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
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#fef2f2', 
              borderLeft: '4px solid #ef4444',
              color: '#991b1b', 
              borderRadius: '6px', 
              fontSize: '0.9rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form id="complaint-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Reason */}
            <div>
              <label className="complaint-label">Lý do khiếu nại <span style={{color: '#ef4444'}}>*</span></label>
              <select 
                className="complaint-input"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              >
                {REASONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="complaint-label">Mô tả chi tiết <span style={{color: '#ef4444'}}>*</span></label>
              <textarea
                className="complaint-input"
                style={{ height: '120px', resize: 'none' }}
                placeholder="Vui lòng cung cấp chi tiết về tình trạng sản phẩm hoặc vấn đề bạn gặp phải để chúng tôi hỗ trợ tốt nhất..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="complaint-label">Hình ảnh / Video minh chứng</label>
              <div 
                style={{
                  border: `2px dashed ${isHovering ? 'var(--primary-color, #ff9800)' : '#cbd5e1'}`,
                  backgroundColor: isHovering ? 'rgba(255, 152, 0, 0.02)' : '#f8fafc',
                  borderRadius: '12px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}
                onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                onDragLeave={() => setIsHovering(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsHovering(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setFile(e.dataTransfer.files[0]);
                  }
                }}
              >
                <input 
                  type="file" 
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    opacity: 0,
                    cursor: 'pointer',
                    width: '100%',
                    height: '100%'
                  }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  accept="image/*,video/*"
                />
                
                {file ? (
                  <>
                    <div style={{ 
                      width: '48px', height: '48px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(255, 152, 0, 0.1)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--primary-color, #ff9800)'
                    }}>
                      <CheckCircleIcon />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#0f172a', fontSize: '0.95rem' }}>{file.name}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • Nhấn để thay đổi
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ 
                        width: '50px', height: '50px', 
                        borderRadius: '12px', 
                        backgroundColor: '#fff', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                        color: '#3b82f6'
                      }}>
                        <ImageIcon size={24} />
                      </div>
                      <div style={{ 
                        width: '50px', height: '50px', 
                        borderRadius: '12px', 
                        backgroundColor: '#fff', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                        color: '#10b981'
                      }}>
                        <Video size={24} />
                      </div>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 6px', fontWeight: '600', color: 'var(--primary-color, #ff9800)', fontSize: '1rem' }}>
                        Tải lên minh chứng
                      </p>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                        Kéo thả file vào đây hoặc nhấn để chọn.<br/>
                        Hỗ trợ PNG, JPG, MP4 (Tối đa 10MB)
                      </p>
                    </div>
                  </>
                )}
              </div>
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
          <button type="submit" form="complaint-form" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="lucide-spin" style={{ animation: 'spin 1s linear infinite' }} />
                Đang gửi...
              </>
            ) : (
              <>Gửi Yêu Cầu</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
