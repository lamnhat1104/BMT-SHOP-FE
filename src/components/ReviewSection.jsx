import React from 'react';
import { Star, User } from 'lucide-react';

const ReviewSection = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
                <p className="text-sm text-gray-400 mt-1">Hãy là người đầu tiên nhận xét!</p>
            </div>
        );
    }

    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

    return (
        <div className="space-y-8">
            {/* Summary */}
            <div className="flex items-center gap-8 p-6 bg-gray-50 rounded-2xl">
                <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                    <div className="flex justify-center mt-2 text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-4 h-4 ${star <= Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{reviews.length} đánh giá</div>
                </div>

                <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter(r => r.rating === star).length;
                        const percent = (count / reviews.length) * 100;
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

            {/* List */}
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
                                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                            </div>
                            <div className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                ))}
                            </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{review.comment}</p>

                        {/* Images */}
                        {review.imageUrls && review.imageUrls.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {review.imageUrls.map((url, idx) => (
                                    <a key={idx} href={`http://localhost:8080${url}`} target="_blank" rel="noreferrer">
                                        <img 
                                            src={`http://localhost:8080${url}`} 
                                            alt={`review img ${idx}`} 
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity" 
                                        />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewSection;
