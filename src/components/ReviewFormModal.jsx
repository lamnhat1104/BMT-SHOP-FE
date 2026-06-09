import React, { useState } from 'react';
import { Star, X, Image as ImageIcon } from 'lucide-react';

const ReviewFormModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
        
        // Preview URLs
        const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };

    const removeImage = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            const newUrls = [...prev];
            URL.revokeObjectURL(newUrls[index]);
            newUrls.splice(index, 1);
            return newUrls;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ rating, comment, files });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Đánh giá sản phẩm</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Rating Selection */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Chất lượng sản phẩm</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star 
                                        className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">
                            {rating === 5 ? 'Tuyệt vời' : rating === 4 ? 'Rất tốt' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Kém' : 'Rất tệ'}
                        </span>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Chi tiết đánh giá</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Chia sẻ thêm cảm nhận của bạn về sản phẩm, quá trình giao hàng..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0f172a] focus:border-transparent outline-none resize-none transition-all"
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Đính kèm hình ảnh (Tùy chọn)
                        </label>
                        
                        <div className="flex flex-wrap gap-3">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={url} alt={`preview ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            
                            {files.length < 5 && (
                                <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors cursor-pointer bg-gray-50">
                                    <span className="text-2xl font-light">+</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-[#0f172a] hover:bg-gray-800 text-white font-medium rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : 'Gửi Đánh Giá'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewFormModal;
