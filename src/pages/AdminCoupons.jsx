import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, Edit2, Gift, Calendar, Percent, Eye, EyeOff } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader';
import AdminTable from '../components/admin/AdminTable';
import AdminButton from '../components/admin/AdminButton';
import AdminInput from '../components/admin/AdminInput';
import AdminModal from '../components/admin/AdminModal';
import { couponApi } from '../api/coupon';

function AdminCoupons() {
  const { onMenuToggle } = useOutletContext();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'EXPIRED' | 'INACTIVE'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' | 'edit'
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: '',
    expiredAt: '',
    isActive: 'true'
  });
  const [formErrors, setFormErrors] = useState({});
  const [actionFeedback, setActionFeedback] = useState({ text: '', type: '' });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [couponToToggle, setCouponToToggle] = useState(null);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await couponApi.getAllCoupons({ showHidden: true });
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải danh sách khuyến mãi:', err);
      setError(err.message || 'Không thể lấy dữ liệu khuyến mãi từ hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // Helper to format dates from backend to local datetime input string (yyyy-MM-ddTHH:mm)
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const pad = (num) => String(num).padStart(2, '0');
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  };

  // Helper to format dates to Vietnamese display (dd/MM/yyyy HH:mm)
  const formatDisplayDateTime = (dateString) => {
    if (!dateString) return 'Chưa có';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) {
      errors.code = 'Mã khuyến mãi không được để trống';
    } else if (/\s/.test(formData.code)) {
      errors.code = 'Mã khuyến mãi không được chứa khoảng trắng';
    }

    const discount = parseInt(formData.discountPercent, 10);
    if (isNaN(discount)) {
      errors.discountPercent = 'Mức giảm giá không được để trống';
    } else if (discount < 1 || discount > 100) {
      errors.discountPercent = 'Mức giảm giá phải từ 1% đến 100%';
    }

    if (!formData.expiredAt) {
      errors.expiredAt = 'Ngày hết hạn không được để trống';
    } else {
      const expDate = new Date(formData.expiredAt);
      if (expDate <= new Date() && modalType === 'create') {
        errors.expiredAt = 'Ngày hết hạn phải lớn hơn thời gian hiện tại';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreateModal = () => {
    setModalType('create');
    setSelectedCoupon(null);
    setFormData({
      code: '',
      discountPercent: '',
      expiredAt: '',
      isActive: 'true'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon) => {
    setModalType('edit');
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountPercent: String(coupon.discountPercent),
      expiredAt: formatDateTimeLocal(coupon.expiredAt),
      isActive: String(coupon.isActive)
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const requestData = {
      code: formData.code.trim().toUpperCase(),
      discountPercent: parseInt(formData.discountPercent, 10),
      expiredAt: new Date(formData.expiredAt).toISOString(),
      isActive: formData.isActive === 'true'
    };

    try {
      if (modalType === 'create') {
        const newCoupon = await couponApi.createCoupon(requestData);
        setCoupons(prev => [...prev, newCoupon]);
        showFeedback('Thêm khuyến mãi mới thành công!', 'success');
      } else {
        const updated = await couponApi.updateCoupon(selectedCoupon.id, requestData);
        setCoupons(prev => prev.map(c => c.id === selectedCoupon.id ? updated : c));
        showFeedback('Cập nhật khuyến mãi thành công!', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showFeedback(err.message || 'Thao tác thất bại!', 'error');
    }
  };

  const handleDeleteCoupon = (coupon) => {
    setCouponToToggle(coupon);
    setIsConfirmOpen(true);
  };

  const executeToggleCoupon = async () => {
    if (!couponToToggle) return;
    try {
      await couponApi.deleteCoupon(couponToToggle.id);
      setCoupons(prev => prev.map(c => c.id === couponToToggle.id ? { ...c, isActive: !c.isActive } : c));
      showFeedback(`${couponToToggle.isActive ? 'Ẩn' : 'Hiện'} khuyến mãi thành công!`, 'success');
    } catch (err) {
      showFeedback(err.message || 'Thao tác thất bại!', 'error');
    } finally {
      setIsConfirmOpen(false);
      setCouponToToggle(null);
    }
  };

  const showFeedback = (text, type) => {
    setActionFeedback({ text, type });
    setTimeout(() => setActionFeedback({ text: '', type: '' }), 4000);
  };

  // Filter logic
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase().trim());
    
    const isExpired = new Date(coupon.expiredAt) < new Date();
    
    let matchesStatus = true;
    if (statusFilter === 'ACTIVE') {
      matchesStatus = coupon.isActive && !isExpired;
    } else if (statusFilter === 'EXPIRED') {
      matchesStatus = isExpired;
    } else if (statusFilter === 'INACTIVE') {
      matchesStatus = !coupon.isActive;
    }

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'ID',
      render: (row) => <span className="font-bold text-slate-500">#{row.id}</span>
    },
    {
      header: 'Mã khuyến mãi',
      render: (row) => (
        <div className="font-extrabold text-orange-600 bg-orange-50 border border-orange-100 rounded-lg px-3 py-1.5 flex items-center gap-2 w-fit select-all font-mono tracking-wider">
          <Gift size={15} className="text-orange-500" />
          {row.code}
        </div>
      )
    },
    {
      header: 'Mức giảm giá',
      render: (row) => (
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <Percent size={15} className="text-emerald-500" />
          <span>{row.discountPercent}%</span>
        </div>
      )
    },
    {
      header: 'Hết hạn vào lúc',
      render: (row) => (
        <div className="text-slate-600 flex items-center gap-1.5 text-xs">
          <Calendar size={14} className="text-slate-400" />
          <span>{formatDisplayDateTime(row.expiredAt)}</span>
        </div>
      )
    },
    {
      header: 'Trạng thái',
      render: (row) => {
        const isExpired = new Date(row.expiredAt) < new Date();
        if (!row.isActive) {
          return (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
              Tạm ngưng
            </span>
          );
        }
        if (isExpired) {
          return (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
              Đã hết hạn
            </span>
          );
        }
        return (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
            Hoạt động
          </span>
        );
      }
    },
    {
      header: 'Thao tác',
      className: 'text-right',
      render: (row) => (
        <div className="flex gap-2 justify-end items-center">
          <AdminButton 
            variant="outline" 
            onClick={() => handleOpenEditModal(row)}
            title="Sửa khuyến mãi"
          >
            <Edit2 size={13} /> Sửa
          </AdminButton>
          
          <AdminButton 
            variant={row.isActive ? "secondary" : "success"} 
            onClick={() => handleDeleteCoupon(row)}
            title={row.isActive ? "Ẩn khuyến mãi" : "Hiện khuyến mãi"}
          >
            {row.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
            {row.isActive ? 'Ẩn' : 'Hiện'}
          </AdminButton>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#f8fafc] flex-1">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#f47920] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-semibold animate-pulse">Đang tải danh sách khuyến mãi...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 md:p-10 space-y-8 overflow-x-hidden">
      <AdminHeader 
        title="Quản Lý Khuyến Mãi" 
        description="Quản lý các chiến dịch giảm giá, mã coupon giảm giá (đơn vị phần trăm %) và thiết lập hạn sử dụng." 
        onMenuToggle={onMenuToggle} 
      />

      {/* Error status alert */}
      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-2xl border border-red-100 font-medium">
          {error}
        </div>
      )}

      {/* Action feedback (Floating bottom-right toast) */}
      {actionFeedback.text && (
        <div className={`fixed bottom-6 right-6 z-9999 p-4 rounded-xl font-bold shadow-lg border flex items-center gap-2 max-w-xs transition-all duration-300 transform scale-100 ${
          actionFeedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {actionFeedback.type === 'success' ? '✓' : '✗'} {actionFeedback.text}
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        {/* Search */}
        <div className="flex-1 min-w-[280px] flex items-center border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-[#f47920] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Tìm theo mã khuyến mãi..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-hidden text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap gap-4 items-center">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-750 text-sm font-semibold rounded-xl px-4 py-2.5 outline-hidden focus:border-[#f47920] cursor-pointer transition-colors"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="EXPIRED">Đã hết hạn</option>
            <option value="INACTIVE">Tạm ngưng</option>
          </select>

          <AdminButton onClick={handleOpenCreateModal}>
            <Plus size={15} /> Thêm khuyến mãi
          </AdminButton>
        </div>
      </div>

      {/* Main Table */}
      <AdminTable 
        columns={columns} 
        data={filteredCoupons} 
        emptyMessage="Không tìm thấy mã khuyến mãi nào khớp với bộ lọc tìm kiếm."
      />

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'create' ? 'Thêm mã khuyến mãi mới' : 'Cập nhật thông tin khuyến mãi'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminInput 
            label="Mã khuyến mãi (Viết liền không dấu)" 
            placeholder="Ví dụ: SUMMER2026, VNB10..."
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase().replace(/\s/g, '') }))}
            error={formErrors.code}
            required
            disabled={modalType === 'edit'}
          />

          <AdminInput 
            label="Mức giảm giá (%)" 
            type="number"
            placeholder="Ví dụ: 10, 20, 50..."
            min="1"
            max="100"
            value={formData.discountPercent}
            onChange={(e) => setFormData(prev => ({ ...prev, discountPercent: e.target.value }))}
            error={formErrors.discountPercent}
            required
          />

          <AdminInput 
            label="Ngày hết hạn" 
            type="datetime-local"
            value={formData.expiredAt}
            onChange={(e) => setFormData(prev => ({ ...prev, expiredAt: e.target.value }))}
            error={formErrors.expiredAt}
            required
          />

          <AdminInput 
            label="Trạng thái kích hoạt" 
            type="select"
            value={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value }))}
            options={[
              { value: 'true', label: 'Cho phép sử dụng (Hoạt động)' },
              { value: 'false', label: 'Tạm ngưng sử dụng' }
            ]}
          />

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <AdminButton 
              type="button" 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
            >
              Hủy
            </AdminButton>
            <AdminButton type="submit">
              {modalType === 'create' ? 'Tạo mã' : 'Lưu thay đổi'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      {/* Toggle Visibility Confirmation Modal */}
      <AdminModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setCouponToToggle(null);
        }}
        title={couponToToggle?.isActive ? "Xác nhận ẩn khuyến mãi" : "Xác nhận hiện khuyến mãi"}
        maxWidthClass="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Bạn có chắc chắn muốn {couponToToggle?.isActive ? 'ẩn' : 'hiện'} mã khuyến mãi <span className="font-bold text-slate-800">{couponToToggle?.code}</span> không?
          </p>
          <div className={`p-4 rounded-xl text-xs ${couponToToggle?.isActive ? 'bg-amber-50 border border-amber-100 text-amber-800' : 'bg-emerald-50 border border-emerald-100 text-emerald-800'}`}>
            <strong>Lưu ý:</strong> {couponToToggle?.isActive 
              ? 'Khuyến mãi bị ẩn sẽ không thể áp dụng bởi khách hàng khi thanh toán đơn hàng.' 
              : 'Khuyến mãi sau khi hiện sẽ có hiệu lực sử dụng bình thường đối với khách hàng.'}
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <AdminButton 
              type="button" 
              variant="secondary" 
              onClick={() => {
                setIsConfirmOpen(false);
                setCouponToToggle(null);
              }}
            >
              Hủy bỏ
            </AdminButton>
            <AdminButton 
              type="button" 
              variant={couponToToggle?.isActive ? "danger" : "success"} 
              onClick={executeToggleCoupon}
            >
              {couponToToggle?.isActive ? 'Xác nhận ẩn' : 'Xác nhận hiện'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </main>
  );
}

export default AdminCoupons;
