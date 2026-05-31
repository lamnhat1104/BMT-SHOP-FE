import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Star, Calendar, MessageSquare, Tag, User, Eye, EyeOff } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader';
import AdminTable from '../components/admin/AdminTable';
import AdminButton from '../components/admin/AdminButton';
import AdminModal from '../components/admin/AdminModal';
import { reviewApi } from '../api/review';

function AdminReviews() {
  const { onMenuToggle } = useOutletContext();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL'); // 'ALL' | '1' | '2' | '3' | '4' | '5'

  const [actionFeedback, setActionFeedback] = useState({ text: '', type: '' });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewApi.getAllReviews({ showHidden: true });
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải danh sách đánh giá:', err);
      setError(err.message || 'Không thể lấy dữ liệu đánh giá từ hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDeleteReview = (review) => {
    setReviewToDelete(review);
    setIsConfirmOpen(true);
  };

  const executeDeleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      await reviewApi.deleteReview(reviewToDelete.id);
      setReviews(prev => prev.map(r => r.id === reviewToDelete.id ? { ...r, isActive: !r.isActive } : r));
      showFeedback(`${reviewToDelete.isActive ? 'Ẩn' : 'Hiện'} đánh giá thành công!`, 'success');
    } catch (err) {
      showFeedback(err.message || 'Thao tác thất bại!', 'error');
    } finally {
      setIsConfirmOpen(false);
      setReviewToDelete(null);
    }
  };

  const showFeedback = (text, type) => {
    setActionFeedback({ text, type });
    setTimeout(() => setActionFeedback({ text: '', type: '' }), 4000);
  };

  // Helper to format dates to Vietnamese display (dd/MM/yyyy HH:mm)
  const formatDisplayDateTime = (dateString) => {
    if (!dateString) return 'Chưa có';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Helper to render star rating icons
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            fill={i < rating ? "currentColor" : "none"} 
            className={i < rating ? "text-amber-400" : "text-slate-200"} 
          />
        ))}
      </div>
    );
  };

  // Filter logic
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      (review.comment && review.comment.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
      (review.productName && review.productName.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
      (review.userFullName && review.userFullName.toLowerCase().includes(searchQuery.toLowerCase().trim()));

    const matchesRating = ratingFilter === 'ALL' || review.rating === parseInt(ratingFilter, 10);

    return matchesSearch && matchesRating;
  });

  const columns = [
    {
      header: 'ID',
      render: (row) => <span className="font-bold text-slate-500">#{row.id}</span>
    },
    {
      header: 'Khách hàng',
      render: (row) => (
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <User size={15} className="text-slate-400" />
          {row.userFullName}
        </div>
      )
    },
    {
      header: 'Sản phẩm',
      render: (row) => (
        <div className="max-w-[200px] truncate font-medium text-slate-800 flex items-center gap-2" title={row.productName}>
          <Tag size={15} className="text-orange-500 shrink-0" />
          <span className="truncate">{row.productName}</span>
        </div>
      )
    },
    {
      header: 'Đánh giá',
      render: (row) => renderStars(row.rating)
    },
    {
      header: 'Nội dung nhận xét',
      render: (row) => (
        <div className="max-w-[300px] warp-break-words text-slate-600 italic flex items-start gap-1.5 py-1">
          <MessageSquare size={14} className="text-slate-300 shrink-0 mt-1" />
          <span className="warp-break-words">"{row.comment || 'Không có bình luận'}"</span>
        </div>
      )
    },
    {
      header: 'Thời gian',
      render: (row) => (
        <div className="text-slate-500 flex items-center gap-1.5 text-xs">
          <Calendar size={14} className="text-slate-400" />
          <span>{formatDisplayDateTime(row.createdAt)}</span>
        </div>
      )
    },
    {
      header: 'Trạng thái',
      render: (row) => (
        row.isActive === false ? (
          <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full font-bold uppercase">Đang ẩn</span>
        ) : (
          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-bold uppercase">Hoạt động</span>
        )
      )
    },
    {
      header: 'Thao tác',
      className: 'text-right',
      render: (row) => (
        <div className="flex gap-2 justify-end items-center">
          <AdminButton 
            variant={row.isActive === false ? "success" : "secondary"} 
            onClick={() => handleDeleteReview(row)}
            title={row.isActive === false ? "Hiện đánh giá" : "Ẩn đánh giá"}
          >
            {row.isActive === false ? <Eye size={13} /> : <EyeOff size={13} />}
            {row.isActive === false ? 'Hiện' : 'Ẩn'}
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
          <p className="text-gray-500 font-semibold animate-pulse">Đang tải danh sách đánh giá...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 md:p-10 space-y-8 overflow-x-hidden">
      <AdminHeader 
        title="Quản Lý Đánh Giá" 
        description="Xem và kiểm duyệt các đánh giá, nhận xét và số sao bình chọn sản phẩm từ khách hàng." 
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
            placeholder="Tìm theo nhận xét, tên sản phẩm, tên khách hàng..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-hidden text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap gap-4 items-center">
          <select 
            value={ratingFilter} 
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-750 text-sm font-semibold rounded-xl px-4 py-2.5 outline-hidden focus:border-[#f47920] cursor-pointer transition-colors"
          >
            <option value="ALL">Tất cả xếp hạng</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <AdminTable 
        columns={columns} 
        data={filteredReviews} 
        emptyMessage="Không tìm thấy đánh giá nào khớp với bộ lọc tìm kiếm."
      />

      {/* Toggle Visibility Confirmation Modal */}
      <AdminModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setReviewToDelete(null);
        }}
        title={reviewToDelete?.isActive ? "Xác nhận ẩn đánh giá" : "Xác nhận hiện đánh giá"}
        maxWidthClass="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Bạn có chắc chắn muốn {reviewToDelete?.isActive ? 'ẩn' : 'hiện'} đánh giá của khách hàng <span className="font-bold text-slate-800">{reviewToDelete?.userFullName}</span> cho sản phẩm <span className="font-bold text-slate-800">{reviewToDelete?.productName}</span> không?
          </p>
          <div className={`p-4 rounded-xl text-xs ${reviewToDelete?.isActive ? 'bg-amber-50 border border-amber-100 text-amber-800' : 'bg-emerald-50 border border-emerald-100 text-emerald-800'}`}>
            <strong>Lưu ý:</strong> {reviewToDelete?.isActive 
              ? 'Đánh giá bị ẩn sẽ không hiển thị công khai đối với khách hàng trên trang chi tiết sản phẩm.' 
              : 'Đánh giá sau khi hiện sẽ hiển thị công khai trên trang chi tiết sản phẩm.'}
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <AdminButton 
              type="button" 
              variant="secondary" 
              onClick={() => {
                setIsConfirmOpen(false);
                setReviewToDelete(null);
              }}
            >
              Hủy bỏ
            </AdminButton>
            <AdminButton 
              type="button" 
              variant={reviewToDelete?.isActive ? "danger" : "success"} 
              onClick={executeDeleteReview}
            >
              {reviewToDelete?.isActive ? 'Xác nhận ẩn' : 'Xác nhận hiện'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </main>
  );
}

export default AdminReviews;
