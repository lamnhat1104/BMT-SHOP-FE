import React, { useEffect, useState } from 'react';
import { complaintApi } from '../../api/complaintApi';
import { Search, Filter, CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react';

const STATUS_MAP = {
  'pending': { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
  'processing': { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
  'need_info': { label: 'Cần bổ sung', color: 'bg-orange-100 text-orange-800' },
  'approved': { label: 'Đã chấp thuận', color: 'bg-green-100 text-green-800' },
  'rejected': { label: 'Từ chối', color: 'bg-red-100 text-red-800' },
  'refunded': { label: 'Đã hoàn tiền', color: 'bg-purple-100 text-purple-800' },
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await complaintApi.getAllComplaints();
      setComplaints(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await complaintApi.updateComplaintStatus(id, status);
      fetchComplaints();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredComplaints = statusFilter === 'ALL' 
    ? complaints 
    : complaints.filter(c => c.status === statusFilter);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý khiếu nại</h1>
        <div className="flex gap-2">
          <select 
            className="border rounded-md px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            {Object.keys(STATUS_MAP).map(key => (
              <option key={key} value={key}>{STATUS_MAP[key].label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Mã ĐH</th>
                <th className="px-4 py-3 font-medium">Khách hàng</th>
                <th className="px-4 py-3 font-medium">Lý do</th>
                <th className="px-4 py-3 font-medium">Mô tả</th>
                <th className="px-4 py-3 font-medium">Minh chứng</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">Đang tải...</td>
                </tr>
              ) : filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">Không có dữ liệu</td>
                </tr>
              ) : (
                filteredComplaints.map(complaint => (
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">#{complaint.orderCode}</td>
                    <td className="px-4 py-3">{complaint.userName}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate" title={complaint.reason}>
                      {complaint.reason}
                    </td>
                    <td className="px-4 py-3 max-w-[250px] truncate text-gray-500" title={complaint.description}>
                      {complaint.description}
                    </td>
                    <td className="px-4 py-3">
                      {complaint.evidenceUrl ? (
                        <a href={complaint.evidenceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                          <FileText size={14} /> Xem
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_MAP[complaint.status]?.color}`}>
                        {STATUS_MAP[complaint.status]?.label || complaint.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {complaint.status === 'pending' || complaint.status === 'processing' ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleUpdateStatus(complaint.id, 'approved')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Chấp thuận"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(complaint.id, 'rejected')}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Từ chối"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
