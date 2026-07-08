import React, { useState } from 'react';
import { Star, X, Image as ImageIcon, UploadCloud } from 'lucide-react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            ></div>
            
            {/* Modal Container */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100 opacity-100 ring-1 ring-black/5"
                 style={{ borderRadius: '20px' }}>
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                    <h3 className="text-xl font-bold text-gray-800 tracking-tight">Đánh giá sản phẩm</h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-7 overflow-y-auto flex-1 custom-scrollbar">
                    
                    {/* Rating Selection */}
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Chất lượng sản phẩm</span>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-1 transition-all duration-200 hover:scale-125 focus:outline-none"
                                >
                                    <Star 
                                        className={`w-10 h-10 transition-colors duration-300 ${
                                            star <= rating 
                                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-md' 
                                            : 'text-gray-200 fill-gray-100'
                                        }`} 
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-sm font-medium px-4 py-1 rounded-full bg-gray-100 text-gray-700 transition-colors duration-300" 
                              style={{ 
                                  backgroundColor: rating === 5 ? '#dcfce7' : rating >= 3 ? '#fef9c3' : '#fee2e2',
                                  color: rating === 5 ? '#166534' : rating >= 3 ? '#854d0e' : '#991b1b' 
                              }}>
                            {rating === 5 ? 'Tuyệt vời 😊' : rating === 4 ? 'Rất tốt 🙂' : rating === 3 ? 'Bình thường 😐' : rating === 2 ? 'Kém 😕' : 'Rất tệ 😞'}
                        </span>
                    </div>

                    {/* Comment */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">Chi tiết đánh giá</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này nhé..."
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0068FF] focus:border-transparent outline-none resize-none transition-all duration-200 shadow-sm"
                            style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-[#0068FF]" />
                            Hình ảnh thực tế <span className="text-gray-400 font-normal text-xs">(Tùy chọn, tối đa 5 ảnh)</span>
                        </label>
                        
                        <div className="flex flex-wrap gap-4">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="relative group w-24 h-24 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                    <img src={url} alt={`preview ${index}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-red-600 shadow-md"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            
                            {files.length < 5 && (
                                <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl text-blue-500 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer bg-blue-50/50 group">
                                    <UploadCloud className="w-6 h-6 mb-1 group-hover:-translate-y-1 transition-transform duration-200" />
                                    <span className="text-xs font-medium">Thêm ảnh</span>
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
                    <div className="pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={isSubmitting || !comment.trim()}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0068FF] to-[#0052cc] hover:from-[#0052cc] hover:to-[#0040a8] text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                            style={{ borderRadius: '12px', border: 'none' }}
                        >
                            {isSubmitting ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : 'Gửi Đánh Giá Ngay'}
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default ReviewFormModal;
