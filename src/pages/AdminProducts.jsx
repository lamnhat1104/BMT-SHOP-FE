import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Search, Plus, Edit2, Tag, Percent, Layers, Box, AlertCircle, Eye, EyeOff } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader';
import AdminTable from '../components/admin/AdminTable';
import AdminButton from '../components/admin/AdminButton';
import AdminInput from '../components/admin/AdminInput';
import AdminModal from '../components/admin/AdminModal';
import { productApi } from '../api/product';

function AdminProducts() {
  const { onMenuToggle } = useOutletContext();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' | 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    categoryId: 1,
    brand: '',
    price: 0,
    stock: 0,
    discountPercent: 0,
    imageUrl: '',
    description: '',
    status: 'available',
    isFeatured: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [actionFeedback, setActionFeedback] = useState({ text: '', type: '' });

  // Map category names
  const categoryNames = {
    1: 'Vợt Cầu Lông',
    2: 'Giày Cầu Lông',
    3: 'Balo - Túi Xách',
    4: 'Quần Áo Cầu Lông'
  };

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToToggle, setProductToToggle] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAllProducts({ showHidden: true });
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải sản phẩm:', err);
      setError(err.message || 'Không thể lấy dữ liệu sản phẩm từ hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Tên sản phẩm không được để trống';
    if (!formData.brand.trim()) errors.brand = 'Thương hiệu không được để trống';
    if (formData.price <= 0) errors.price = 'Giá sản phẩm phải lớn hơn 0';
    if (formData.stock < 0) errors.stock = 'Số lượng kho không được âm';
    if (formData.discountPercent < 0 || formData.discountPercent > 100) {
      errors.discountPercent = 'Khuyến mãi từ 0% đến 100%';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreateModal = () => {
    setModalType('create');
    setSelectedProduct(null);
    setFormData({
      name: '',
      categoryId: 1,
      brand: 'YONEX',
      price: '',
      stock: '',
      discountPercent: 0,
      imageUrl: '',
      description: '',
      status: 'available',
      isFeatured: false
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setModalType('edit');
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categoryId || 1,
      brand: product.brand || '',
      price: product.price,
      stock: product.stock,
      discountPercent: product.discountPercent || 0,
      imageUrl: product.imageUrl || '',
      description: product.description || '',
      status: product.status || 'available',
      isFeatured: !!product.isFeatured
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const requestData = {
      name: formData.name.trim(),
      categoryId: parseInt(formData.categoryId),
      brand: formData.brand.trim().toUpperCase(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      discountPercent: parseInt(formData.discountPercent),
      imageUrl: formData.imageUrl.trim() || '/racket_product_1.png', // fallback default
      description: formData.description.trim(),
      status: formData.status,
      isFeatured: formData.isFeatured,
      quantity: 1
    };

    try {
      if (modalType === 'create') {
        const newProd = await productApi.createProduct(requestData);
        setProducts(prev => [newProd, ...prev]);
        showFeedback('Thêm sản phẩm mới thành công!', 'success');
      } else {
        const updated = await productApi.updateProduct(selectedProduct.id, requestData);
        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updated : p));
        showFeedback('Cập nhật sản phẩm thành công!', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showFeedback(err.message || 'Thao tác thất bại!', 'error');
    }
  };

  const handleDeleteProduct = (product) => {
    setProductToToggle(product);
    setIsConfirmOpen(true);
  };

  const executeToggleProduct = async () => {
    if (!productToToggle) return;
    try {
      await productApi.deleteProduct(productToToggle.id);
      setProducts(prev => prev.map(p => {
        if (p.id === productToToggle.id) {
          const nextDeleted = p.isDeleted === null ? true : !p.isDeleted;
          return {
            ...p,
            isDeleted: nextDeleted,
            status: nextDeleted ? 'out_of_stock' : 'available'
          };
        }
        return p;
      }));
      showFeedback(`${productToToggle.isDeleted ? 'Hiện' : 'Ẩn'} sản phẩm thành công!`, 'success');
    } catch (err) {
      showFeedback(err.message || 'Thao tác thất bại!', 'error');
    } finally {
      setIsConfirmOpen(false);
      setProductToToggle(null);
    }
  };

  const showFeedback = (text, type) => {
    setActionFeedback({ text, type });
    setTimeout(() => setActionFeedback({ text: '', type: '' }), 4000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Filter logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase().trim());
    
    const matchesCategory = categoryFilter === 'ALL' || product.categoryId === parseInt(categoryFilter);
    
    const matchesStatus = 
      statusFilter === 'ALL' || 
      product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const columns = [
    {
      header: 'Hình ảnh',
      render: (row) => (
        <img 
          src={row.imageUrl || '/racket_product_1.png'} 
          alt={row.name}
          className="w-12 h-12 object-contain rounded-lg border border-slate-100 bg-slate-50"
          onError={(e) => {
            e.target.src = '/racket_product_1.png';
          }}
        />
      )
    },
    {
      header: 'Tên Sản Phẩm',
      render: (row) => (
        <div className="max-w-[280px]">
          <div className="font-bold text-slate-800 leading-tight">{row.name}</div>
          <div className="flex gap-2 items-center mt-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{row.brand}</span>
            {row.isFeatured && (
              <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.2 rounded-sm font-bold uppercase">Nổi bật</span>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Danh mục',
      render: (row) => (
        <span className="text-slate-600 font-medium text-xs">
          {categoryNames[row.categoryId] || `Danh mục #${row.categoryId}`}
        </span>
      )
    },
    {
      header: 'Đơn giá',
      render: (row) => (
        <div>
          <div className="font-extrabold text-slate-800 text-sm">{formatPrice(row.price)}</div>
          {row.discountPercent > 0 && (
            <div className="text-xs text-rose-500 font-bold flex items-center gap-0.5 mt-0.5">
              <Percent size={11} /> Giảm {row.discountPercent}%
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Kho hàng',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-700 text-xs flex items-center gap-1">
            <Box size={12} className="text-slate-400" /> {row.stock} sản phẩm
          </div>
          <div className="mt-1">
            {row.stock > 0 ? (
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-bold uppercase">Còn hàng</span>
            ) : (
              <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-full font-bold uppercase">Hết hàng</span>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Trạng thái hiển thị',
      render: (row) => (
        row.isDeleted ? (
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
            title="Sửa sản phẩm"
          >
            <Edit2 size={13} /> Sửa
          </AdminButton>
          
          <AdminButton 
            variant={row.isDeleted ? "success" : "secondary"} 
            onClick={() => handleDeleteProduct(row)}
            title={row.isDeleted ? "Hiện sản phẩm" : "Ẩn sản phẩm"}
          >
            {row.isDeleted ? <Eye size={13} /> : <EyeOff size={13} />}
            {row.isDeleted ? 'Hiện' : 'Ẩn'}
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
          <p className="text-gray-500 font-semibold animate-pulse">Đang tải danh sách sản phẩm quản trị...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 md:p-10 space-y-8 overflow-x-hidden">
      <AdminHeader 
        title="Quản Lý Sản Phẩm" 
        description="Quản lý kho hàng sản phẩm, thiết lập giá bán, khuyến mãi và thông tin chi tiết từng sản phẩm." 
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
            placeholder="Tìm theo tên sản phẩm, thương hiệu..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-hidden text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap gap-4 items-center">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-750 text-sm font-semibold rounded-xl px-4 py-2.5 outline-hidden focus:border-[#f47920] cursor-pointer transition-colors"
          >
            <option value="ALL">Tất cả danh mục</option>
            <option value="1">Vợt Cầu Lông</option>
            <option value="2">Giày Cầu Lông</option>
            <option value="3">Balo - Túi Xách</option>
            <option value="4">Quần Áo Cầu Lông</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-750 text-sm font-semibold rounded-xl px-4 py-2.5 outline-hidden focus:border-[#f47920] cursor-pointer transition-colors"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="available">Còn hàng (Available)</option>
            <option value="out_of_stock">Hết hàng (Out of stock)</option>
          </select>

          <AdminButton onClick={handleOpenCreateModal}>
            <Plus size={15} /> Thêm sản phẩm
          </AdminButton>
        </div>
      </div>

      {/* Main Table */}
      <AdminTable 
        columns={columns} 
        data={filteredProducts} 
        emptyMessage="Không tìm thấy sản phẩm nào khớp với bộ lọc."
      />

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'create' ? 'Thêm sản phẩm mới' : 'Cập nhật thông tin sản phẩm'}
        maxWidthClass="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput 
              label="Tên sản phẩm" 
              placeholder="Nhập tên sản phẩm..."
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={formErrors.name}
              required
            />

            <AdminInput 
              label="Thương hiệu" 
              placeholder="Ví dụ: YONEX, LINING..."
              value={formData.brand}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              error={formErrors.brand}
              required
            />

            <AdminInput 
              label="Danh mục" 
              type="select"
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              options={[
                { value: 1, label: 'Vợt Cầu Lông' },
                { value: 2, label: 'Giày Cầu Lông' },
                { value: 3, label: 'Balo - Túi Xách' },
                { value: 4, label: 'Quần Áo Cầu Lông' }
              ]}
            />

            <AdminInput 
              label="Trạng thái kho" 
              type="select"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              options={[
                { value: 'available', label: 'Còn hàng (Available)' },
                { value: 'out_of_stock', label: 'Hết hàng (Out of Stock)' }
              ]}
            />

            <AdminInput 
              label="Đơn giá (VND)" 
              type="number"
              placeholder="Ví dụ: 2500000"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              error={formErrors.price}
              required
            />

            <AdminInput 
              label="Số lượng trong kho" 
              type="number"
              placeholder="Ví dụ: 10"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              error={formErrors.stock}
              required
            />

            <AdminInput 
              label="Khuyến mãi (%)" 
              type="number"
              placeholder="Từ 0 đến 100"
              value={formData.discountPercent}
              onChange={(e) => setFormData(prev => ({ ...prev, discountPercent: e.target.value }))}
              error={formErrors.discountPercent}
            />

            <AdminInput 
              label="Đường dẫn ảnh sản phẩm" 
              placeholder="Nhập link ảnh (ví dụ: /racket_product_1.png)..."
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-bold text-slate-700">Mô tả sản phẩm</label>
            <textarea
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#f47920] min-h-[100px] transition-colors"
              placeholder="Nhập mô tả sản phẩm..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-2 py-2">
            <input 
              type="checkbox" 
              id="isFeatured" 
              checked={formData.isFeatured}
              onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
              className="w-4 h-4 text-[#f47920] border-slate-300 rounded-sm focus:ring-[#f47920] cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
              Đặt sản phẩm làm nổi bật (Featured)
            </label>
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
              {modalType === 'create' ? 'Thêm sản phẩm' : 'Lưu thay đổi'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      {/* Toggle Visibility Confirmation Modal */}
      <AdminModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setProductToToggle(null);
        }}
        title={productToToggle?.isDeleted ? "Xác nhận hiện sản phẩm" : "Xác nhận ẩn sản phẩm"}
        maxWidthClass="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Bạn có chắc chắn muốn {productToToggle?.isDeleted ? 'hiện' : 'ẩn'} sản phẩm <span className="font-bold text-slate-800">{productToToggle?.name}</span> không?
          </p>
          <div className={`p-4 rounded-xl text-xs ${productToToggle?.isDeleted ? 'bg-emerald-50 border border-emerald-100 text-emerald-800' : 'bg-amber-50 border border-amber-100 text-amber-800'}`}>
            <strong>Lưu ý:</strong> {productToToggle?.isDeleted 
              ? 'Sản phẩm sau khi hiện sẽ quay lại hiển thị trên danh mục bán hàng công khai.' 
              : 'Sản phẩm bị ẩn sẽ tạm thời không hiển thị đối với khách hàng mua sắm và kho sẽ được cập nhật tạm thời về hết hàng.'}
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <AdminButton 
              type="button" 
              variant="secondary" 
              onClick={() => {
                setIsConfirmOpen(false);
                setProductToToggle(null);
              }}
            >
              Hủy bỏ
            </AdminButton>
            <AdminButton 
              type="button" 
              variant={productToToggle?.isDeleted ? "success" : "danger"} 
              onClick={executeToggleProduct}
            >
              {productToToggle?.isDeleted ? 'Xác nhận hiện' : 'Xác nhận ẩn'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </main>
  );
}

export default AdminProducts;
