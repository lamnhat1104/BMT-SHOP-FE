import React, { useEffect, useState } from 'react';
import { complaintApi } from '../api/complaintApi';
import RefundRequestModal from '../components/RefundRequestModal';
import { RefreshCw, FileText, CheckCircle, Clock, XCircle, AlertCircle, HelpCircle, ArrowRight, ExternalLink, ShieldAlert } from 'lucide-react';

const STATUS_MAP = {
  'pending': { label: 'Chờ xử lý', color: '#d97706', bg: '#fef3c7', icon: Clock },
  'processing': { label: 'Đang xử lý', color: '#2563eb', bg: '#dbeafe', icon: RefreshCw },
  'need_info': { label: 'Cần bổ sung', color: '#ea580c', bg: '#ffedd5', icon: HelpCircle },
  'approved': { label: 'Đã chấp thuận', color: '#16a34a', bg: '#dcfce3', icon: CheckCircle },
  'rejected': { label: 'Từ chối', color: '#dc2626', bg: '#fee2e2', icon: XCircle },
  'refunded': { label: 'Đã hoàn tiền', color: '#9333ea', bg: '#f3e8ff', icon: CheckCircle },
};

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await complaintApi.getMyComplaints();
      setComplaints(data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách khiếu nại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', animation: 'fadeIn 0.4s ease-out' }}>
      
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .complaint-card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 20px;
            border: 1px solid #f1f5f9;
            box-shadow: 0 4px 15px rgba(0,0,0,0.02);
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .complaint-card:hover {
            box-shadow: 0 10px 30px rgba(0,0,0,0.06);
            border-color: #e2e8f0;
            transform: translateY(-2px);
          }
          .refresh-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            color: #475569;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.02);
          }
          .refresh-btn:hover {
            background: #f8fafc;
            color: #0f172a;
            border-color: #cbd5e1;
          }
          .evidence-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: #f1f5f9;
            border-radius: 8px;
            color: #3b82f6;
            font-size: 0.85rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s;
          }
          .evidence-link:hover {
            background: #e0e7ff;
            color: #4f46e5;
          }
          .refund-btn {
            padding: 12px 24px;
            background: linear-gradient(135deg, #ff9800 0%, #f97316 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .refund-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
            filter: brightness(1.05);
          }
        `}
      </style>

      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Khiếu nại & Đổi trả</h1>
          <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '1rem' }}>Theo dõi tiến trình giải quyết yêu cầu hỗ trợ của bạn.</p>
        </div>
        <button onClick={fetchComplaints} className="refresh-btn">
          <RefreshCw size={18} className={loading ? 'lucide-spin' : ''} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> 
          Làm mới
        </button>
      </div>

      {error && (
        <div style={{ padding: '16px 20px', background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '500' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <RefreshCw size={32} className="lucide-spin mx-auto mb-4" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Đang tải dữ liệu...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <ShieldAlert size={64} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
          <h3 style={{ margin: '0 0 8px', fontSize: '1.3rem', color: '#334155', fontWeight: '700' }}>Không có khiếu nại nào</h3>
          <p style={{ margin: 0, color: '#94a3b8' }}>Hiện tại bạn không có yêu cầu khiếu nại hay đổi trả nào đang xử lý.</p>
        </div>
      ) : (
        <div>
          {complaints.map(complaint => {
            const statusInfo = STATUS_MAP[complaint.status] || { label: complaint.status, color: '#475569', bg: '#f1f5f9', icon: AlertCircle };
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={complaint.id} className="complaint-card">
                
                {/* Card Top: Status & Order Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: '6px', 
                      padding: '6px 14px', borderRadius: '30px', 
                      background: statusInfo.bg, color: statusInfo.color, 
                      fontWeight: '700', fontSize: '0.85rem' 
                    }}>
                      <StatusIcon size={16} />
                      {statusInfo.label}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      Đơn hàng: <span style={{ fontWeight: '700', color: '#0f172a' }}>#{complaint.orderCode}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} />
                    {formatDate(complaint.createdAt)}
                  </div>
                </div>

                {/* Card Body: Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: '#1e293b' }}>
                    {complaint.reason}
                  </h3>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {complaint.description}
                  </p>
                </div>

                {/* Card Bottom: Actions & Evidence */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    {complaint.evidenceUrl && (
                      <a href={complaint.evidenceUrl} target="_blank" rel="noopener noreferrer" className="evidence-link">
                        <ExternalLink size={14} /> Xem minh chứng đính kèm
                      </a>
                    )}
                  </div>
                  
                  {complaint.status === 'approved' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <button onClick={() => setSelectedComplaintId(complaint.id)} className="refund-btn">
                        Yêu cầu hoàn tiền <ArrowRight size={18} />
                      </button>
                      <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '500' }}>
                        ✓ Yêu cầu của bạn đã được duyệt.
                      </span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {selectedComplaintId && (
        <RefundRequestModal 
          complaintId={selectedComplaintId}
          onClose={() => setSelectedComplaintId(null)}
          onSuccess={fetchComplaints}
        />
      )}
    </div>
  );
}
