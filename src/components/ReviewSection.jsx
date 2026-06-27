import React, { useState, useEffect } from 'react';
import { Star, User, MessageCircle, Edit2, Trash2 } from 'lucide-react';
import { reviewApi } from '../api/review';
import { authApi } from '../api/auth';

const ReviewSection = ({ reviews, productId, onReviewAdded }) => {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editComment, setEditComment] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            authApi.getProfile()
                .then(user => setCurrentUser(user))
                .catch(err => console.error(err));
        }
    }, [token]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        
        try {
            setIsSubmitting(true);
            await reviewApi.createReview(null, productId, null, comment, null);
            setComment('');
            if (onReviewAdded) onReviewAdded();
        } catch (err) {
            alert(err.message || 'Lỗi gửi bình luận');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
        try {
            await reviewApi.deleteReviewByUser(id);
            if (onReviewAdded) onReviewAdded();
        } catch (err) {
            alert(err.message || 'Lỗi xóa bình luận');
        }
    };

    const handleEditSubmit = async (id) => {
        try {
            await reviewApi.updateReviewByUser(id, editComment);
            setEditingReviewId(null);
            if (onReviewAdded) onReviewAdded();
        } catch (err) {
            alert(err.message || 'Lỗi cập nhật bình luận');
        }
    };

    const averageRating = reviews && reviews.length > 0 
        ? reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / reviews.filter(r => r.rating).length || 0 
        : 0;

    return (
        <div className="space-y-8">
            {/* Summary */}
            {reviews && reviews.length > 0 && (
                <div className="flex items-center gap-8 p-6 bg-gray-50 rounded-2xl">
                    <div className="text-center">
                        <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                        <div className="flex justify-center mt-2 text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`w-4 h-4 ${star <= Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{reviews.filter(r => r.rating).length} đánh giá sao</div>
                    </div>

                    <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const ratedReviews = reviews.filter(r => r.rating);
                            const count = ratedReviews.filter(r => r.rating === star).length;
                            const percent = ratedReviews.length > 0 ? (count / ratedReviews.length) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-12">
                                        <span className="text-sm font-medium text-gray-700">{star}</span>
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-yellow-400 rounded-full"
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                    <div className="w-8 text-right text-sm text-gray-500">{count}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Write Comment Form */}
            {token ? (
                <form onSubmit={handleSubmitComment} className="bg-white p-6 border border-gray-100 rounded-2xl shadow-sm">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 shrink-0">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Bạn có thắc mắc hoặc bình luận gì về sản phẩm này?"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0f172a] focus:border-transparent outline-none resize-none transition-all"
                                rows={3}
                                required
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-[#0f172a] hover:bg-gray-800 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 p-6 rounded-2xl text-center">
                    <p className="text-gray-600 mb-2">Vui lòng đăng nhập để gửi câu hỏi hoặc bình luận</p>
                    <a href="/login" className="text-[#f47920] font-semibold hover:underline">Đăng nhập ngay</a>
                </div>
            )}

            {/* List */}
            {(!reviews || reviews.length === 0) ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Chưa có đánh giá hoặc bình luận nào cho sản phẩm này.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="p-6 border border-gray-100 rounded-2xl hover:shadow-sm transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{review.userFullName}</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString('vi-VN')} lúc {new Date(review.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    {review.rating && (
                                        <div className="flex text-yellow-400">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                    )}
                                    {currentUser && currentUser.userId === review.userId && (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => {
                                                    setEditingReviewId(review.id);
                                                    setEditComment(review.comment);
                                                }}
                                                className="text-gray-400 hover:text-[#f47920] transition-colors"
                                                title="Sửa bình luận"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(review.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                title="Xóa bình luận"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {editingReviewId === review.id ? (
                                <div className="mt-2 space-y-2">
                                    <textarea
                                        value={editComment}
                                        onChange={(e) => setEditComment(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none"
                                        rows={2}
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => setEditingReviewId(null)} className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-md">Hủy</button>
                                        <button onClick={() => handleEditSubmit(review.id)} className="px-3 py-1 text-sm bg-[#f47920] text-white rounded-md hover:bg-orange-600">Lưu</button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                            )}

                            {/* Images */}
                            {review.imageUrls && review.imageUrls.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {review.imageUrls.map((url, idx) => {
                                        const imageUrl = url.startsWith('http') ? url : `http://localhost:8080${url}`;
                                        return (
                                            <a key={idx} href={imageUrl} target="_blank" rel="noreferrer">
                                                <img 
                                                    src={imageUrl} 
                                                    alt={`review img ${idx}`} 
                                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity" 
                                                />
                                            </a>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Admin Reply */}
                            {review.reply && (
                                <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100 relative">
                                    <div className="absolute left-4 -top-2 w-4 h-4 bg-gray-50 border-t border-l border-gray-100 transform rotate-45"></div>
                                    <div className="relative z-10">
                                        <div className="font-semibold text-[#0f172a] mb-1 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-[#f47920] rounded-full"></span>
                                            Phản hồi từ Cửa hàng
                                        </div>
                                        <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">{review.reply}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
