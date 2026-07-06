import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Search, Plus, Edit2, Tag, Eye, EyeOff } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader';
import AdminTable from '../components/admin/AdminTable';
import AdminButton from '../components/admin/AdminButton';
import AdminInput from '../components/admin/AdminInput';
import AdminModal from '../components/admin/AdminModal';
import { categoryApi } from '../api/category';
import { uploadImage } from '../api/config';

function AdminCategories() {
  const { onMenuToggle } = useOutletContext();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('id'); // 'name', 'id'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc', 'desc'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' | 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    image: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [actionFeedback, setActionFeedback] = useState({ text: '', type: '' });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: url }));
      showFeedback('Tải hình ảnh lên thành công!', 'success');
    } catch (err) {
      showFeedback(err.message || 'Lỗi tải ảnh', 'error');
    } finally {
      setUploading(false);
    }
  };

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToToggle, setCategoryToToggle] = useState(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryApi.getAllCategories({ showHidden: true });
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải danh mục:', err);
      setError(err.message || 'Không thể lấy dữ liệu danh mục từ hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Tên danh mục không được để trống';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreateModal = () => {
    setModalType('create');
    setSelectedCategory(null);
    setFormData({
      name: '',
      image: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setModalType('edit');
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      image: category.image || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const requestData = {
      name: formData.name.trim(),
      image: formData.image.trim() || '/racket_category.png' // default fallback
    };

    try {
      if (modalType === 'create') {
        const newCat = await categoryApi.createCategory(requestData);
        setCategories(prev => [...prev, newCat]);
        showFeedback('Thêm danh mục mới thành công!', 'success');
      } else {
        const updated = await categoryApi.updateCategory(selectedCategory.id, requestData);
        setCategories(prev => prev.map(c => c.id === selectedCategory.id ? updated : c));
        showFeedback('Cập nhật danh mục thành công!', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showFeedback(err.message || 'Thao tác thất bại!', 'error');
    }
  };

  const handleDeleteCategory = (category) => {
    setCategoryToToggle(category);
    setIsConfirmOpen(true);
  };

  const executeToggleCategory = async () => {
    if (!categoryToToggle) return;
    try {
      await categoryApi.deleteCategory(categoryToToggle.id);
      setCategories(prev => prev.map(c => c.id === categoryToToggle.id ? { ...c, isActive: !c.isActive } : c));
      showFeedback(`${categoryToToggle.isActive ? 'Ẩn' : 'Hiện'} danh mục thành công!`, 'success');
    } catch (err) {
      showFeedback(err.message || 'Thao tác thất bại!', 'error');
    } finally {
      setIsConfirmOpen(false);
      setCategoryToToggle(null);
    }
  };

  const showFeedback = (text, type) => {
    setActionFeedback({ text, type });
    setTimeout(() => setActionFeedback({ text: '', type: '' }), 4000);
  };

  // Filter logic
  const filteredCategories = categories.filter(category => {
    return (category.name || '').toLowerCase().includes(searchQuery.toLowerCase().trim());
  });

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = (a.name || '').localeCompare(b.name || '');
    } else if (sortField === 'id') {
      comparison = (a.id || 0) - (b.id || 0);
    }
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  const resolveCategoryImage = (image) => {
    if (!image) return '/racket_category.png';
    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) {
      return image;
    }
    const defaultMapping = {
      'racket.png': '/racket_product_1.png',
      'shoes.png': '/shoe_product_1.png',
      'shirt.png': '/shoe_product_1.png',
      'shorts.png': '/shoe_product_1.png',
      'shuttlecock.png': '/racket_product_1.png',
      'bag.png': '/racket_product_1.png',
      'string.png': '/racket_product_1.png',
      'grip.png': '/racket_product_1.png',
      'accessory.png': '/racket_product_1.png'
    };
    return defaultMapping[image] || `/${image}`;
  };

  const columns = [
    {
      header: 'Ảnh đại diện',
      render: (row) => (
        <img 
          src={resolveCategoryImage(row.image)} 
          alt={row.name}
          className="w-12 h-12 object-contain rounded-lg border border-slate-100 bg-slate-50"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/racket_category.png';
          }}
        />
      )
    },
    {
      header: 'ID',
      render: (row) => (
        <span className="font-bold text-slate-500">#{row.id}</span>
      )
    },
    {
      header: 'Tên danh mục',
      render: (row) => (
        <div className="font-bold text-slate-800 flex items-center gap-2">
          <Tag size={16} className="text-orange-500" />
          {row.name}
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
            variant="outline" 
            onClick={() => handleOpenEditModal(row)}
            title="Sửa danh mục"
          >
            <Edit2 size={13} /> Sửa
          </AdminButton>
          
          <AdminButton 
            variant={row.isActive === false ? "success" : "secondary"} 
            onClick={() => handleDeleteCategory(row)}
            title={row.isActive === false ? "Hiện danh mục" : "Ẩn danh mục"}
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
          <p className="text-gray-500 font-semibold animate-pulse">Đang tải danh mục quản trị...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 md:p-10 space-y-8 overflow-x-hidden">
      <AdminHeader 
        title="Quản Lý Danh Mục" 
        description="Quản lý các danh mục phân loại sản phẩm như Vợt, Giày, Balo túi xách, Quần áo thể thao..." 
        onMenuToggle={onMenuToggle} 
      />

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
            placeholder="Tìm theo tên danh mục..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-hidden text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>

        <div className="flex gap-4 items-center">
          <select 
            value={`${sortField}-${sortDirection}`} 
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortField(field);
              setSortDirection(direction);
            }}
            className="bg-white border border-slate-200 text-slate-750 text-sm font-semibold rounded-xl px-4 py-2.5 outline-hidden focus:border-[#f47920] cursor-pointer transition-colors"
          >
            <option value="id-asc">Mã danh mục (Tăng dần)</option>
            <option value="id-desc">Mã danh mục (Giảm dần)</option>
            <option value="name-asc">Tên (A-Z)</option>
            <option value="name-desc">Tên (Z-A)</option>
          </select>

          <AdminButton onClick={handleOpenCreateModal}>
            <Plus size={15} /> Thêm danh mục
          </AdminButton>
        </div>
      </div>

      {/* Main Table */}
      <AdminTable 
        columns={columns} 
        data={sortedCategories} 
        emptyMessage="Không tìm thấy danh mục nào khớp với bộ lọc tìm kiếm."
      />

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'create' ? 'Thêm danh mục mới' : 'Cập nhật thông tin danh mục'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminInput 
            label="Tên danh mục" 
            placeholder="Ví dụ: Vợt Cầu Lông..."
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={formErrors.name}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Ảnh đại diện danh mục (Tải lên hoặc nhập URL)</label>
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Ví dụ: /racket_category.png..."
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#f47920]"
              />
              <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 flex items-center justify-center cursor-pointer transition-colors shrink-0">
                {uploading ? 'Đang tải...' : 'Tải lên'}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={uploading} 
                  className="hidden" 
                />
              </label>
            </div>
            {formData.image && (
              <div className="mt-2 border border-slate-100 p-2 rounded-xl bg-slate-50 inline-block">
                <img 
                  src={resolveCategoryImage(formData.image)} 
                  alt="Category Preview" 
                  className="max-h-[80px] object-contain rounded bg-white"
                  onError={(e) => { e.target.src = '/racket_category.png'; }}
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <AdminButton 
              type="button" 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
            >
              Hủy
            </AdminButton>
            <AdminButton type="submit">
              {modalType === 'create' ? 'Tạo danh mục' : 'Lưu thay đổi'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      {/* Toggle Visibility Confirmation Modal */}
      <AdminModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setCategoryToToggle(null);
        }}
        title={categoryToToggle?.isActive ? "Xác nhận ẩn danh mục" : "Xác nhận hiện danh mục"}
        maxWidthClass="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Bạn có chắc chắn muốn {categoryToToggle?.isActive ? 'ẩn' : 'hiện'} danh mục <span className="font-bold text-slate-800">{categoryToToggle?.name}</span> không?
          </p>
          <div className={`p-4 rounded-xl text-xs ${categoryToToggle?.isActive ? 'bg-amber-50 border border-amber-100 text-amber-800' : 'bg-emerald-50 border border-emerald-100 text-emerald-800'}`}>
            <strong>Lưu ý:</strong> {categoryToToggle?.isActive 
              ? 'Danh mục bị ẩn sẽ không hiển thị đối với khách hàng ngoài trang chủ và trang mua sắm.' 
              : 'Danh mục sau khi hiện sẽ hiển thị bình thường đối với khách hàng.'}
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <AdminButton 
              type="button" 
              variant="secondary" 
              onClick={() => {
                setIsConfirmOpen(false);
                setCategoryToToggle(null);
              }}
            >
              Hủy bỏ
            </AdminButton>
            <AdminButton 
              type="button" 
              variant={categoryToToggle?.isActive ? "danger" : "success"} 
              onClick={executeToggleCategory}
            >
              {categoryToToggle?.isActive ? 'Xác nhận ẩn' : 'Xác nhận hiện'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </main>
  );
}

export default AdminCategories;
