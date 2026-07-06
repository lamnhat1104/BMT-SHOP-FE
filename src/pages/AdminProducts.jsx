import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Search, Plus, Edit2, Tag, Percent, Layers, Box, AlertCircle, Eye, EyeOff } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader';
import AdminTable from '../components/admin/AdminTable';
import AdminButton from '../components/admin/AdminButton';
import AdminInput from '../components/admin/AdminInput';
import AdminModal from '../components/admin/AdminModal';
import { productApi } from '../api/product';
import { uploadImage } from '../api/config';

function AdminProducts() {
  const { onMenuToggle } = useOutletContext();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('name'); // 'name', 'price', 'stock', 'id'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc', 'desc'

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
    isFeatured: false,
    variants: [],
    images: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [actionFeedback, setActionFeedback] = useState({ text: '', type: '' });
  const [uploading, setUploading] = useState(false);

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

    if (formData.variants && formData.variants.length > 0) {
      const variantErrors = [];
      formData.variants.forEach((v, index) => {
        const vErr = {};
        if (!v.color && !v.size) {
          vErr.color = 'Nhập màu';
          vErr.size = 'Nhập size';
        }
        
        const priceNum = parseFloat(v.price);
        if (v.price === '' || isNaN(priceNum) || priceNum <= 0) {
          vErr.price = 'Giá > 0';
        }
        
        const stockNum = parseInt(v.stock);
        if (v.stock === '' || isNaN(stockNum) || stockNum < 0) {
          vErr.stock = 'Kho >= 0';
        }
        
        if (Object.keys(vErr).length > 0) {
          variantErrors[index] = vErr;
        }
      });
      if (variantErrors.some(Boolean)) {
        errors.variants = variantErrors;
      }
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
      isFeatured: false,
      variants: [],
      images: []
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setModalType('edit');
    setSelectedProduct(product);
    const existingImages = product.images && product.images.length > 0
      ? product.images.map(img => img.imageUrl)
      : (product.imageUrl ? [product.imageUrl] : []);

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
      isFeatured: !!product.isFeatured,
      variants: product.variants || [],
      images: existingImages
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const requestImages = formData.images && formData.images.length > 0
      ? formData.images.filter(Boolean)
      : (formData.imageUrl ? [formData.imageUrl] : ['/racket_product_1.png']);

    const requestData = {
      name: formData.name.trim(),
      categoryId: parseInt(formData.categoryId),
      brand: formData.brand.trim().toUpperCase(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      discountPercent: parseInt(formData.discountPercent),
      imageUrl: requestImages[0] || '/racket_product_1.png',
      description: formData.description.trim(),
      status: formData.status,
      isFeatured: formData.isFeatured,
      quantity: 1,
      variants: formData.variants || [],
      images: requestImages
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
      (product.name || '').toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (product.brand || '').toLowerCase().includes(searchQuery.toLowerCase().trim());
    
    const matchesCategory = categoryFilter === 'ALL' || product.categoryId === parseInt(categoryFilter);
    
    const matchesStatus = 
      statusFilter === 'ALL' || 
      product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = (a.name || '').localeCompare(b.name || '');
    } else if (sortField === 'price') {
      comparison = (a.price || 0) - (b.price || 0);
    } else if (sortField === 'stock') {
      comparison = (a.stock || 0) - (b.stock || 0);
    } else if (sortField === 'id') {
      comparison = (a.id || 0) - (b.id || 0);
    }
    return sortDirection === 'desc' ? -comparison : comparison;
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
            e.target.onerror = null;
            e.target.src = '/racket_product_1.png';
          }}
        />
      )
    },
    {
      header: 'Tên Sản Phẩm',
      render: (row) => {
        const uniqueColors = Array.from(new Set((row.variants || []).map(v => v.color).filter(Boolean)));
        const uniqueSizes = Array.from(new Set((row.variants || []).map(v => v.size).filter(Boolean)));

        return (
          <div className="max-w-[280px]">
            <div className="font-bold text-slate-800 leading-tight">{row.name}</div>
            <div className="flex gap-2 items-center mt-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{row.brand}</span>
              {row.isFeatured && (
                <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.2 rounded-sm font-bold uppercase">Nổi bật</span>
              )}
            </div>

            {/* Display Variants (Colors/Sizes) */}
            {(uniqueColors.length > 0 || uniqueSizes.length > 0) && (
              <div className="flex flex-col gap-1 mt-2">
                {uniqueColors.length > 0 && (
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[10px] font-bold text-slate-400">Màu:</span>
                    {uniqueColors.map((color, i) => (
                      <span key={i} className="text-[9px] bg-slate-100 text-slate-650 px-1.5 py-0.2 rounded-sm font-semibold border border-slate-200/60">{color}</span>
                    ))}
                  </div>
                )}
                {uniqueSizes.length > 0 && (
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[10px] font-bold text-slate-400">Size:</span>
                    {uniqueSizes.map((size, i) => (
                      <span key={i} className="text-[9px] bg-orange-50 text-orange-600 px-1.5 py-0.2 rounded-sm font-semibold border border-orange-100/60">{size}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }
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
      render: (row) => {
        const prices = (row.variants || []).map(v => v.price).filter(Boolean);
        const hasPriceRange = prices.length > 0;
        const minPrice = hasPriceRange ? Math.min(...prices) : row.price;
        const maxPrice = hasPriceRange ? Math.max(...prices) : row.price;

        return (
          <div>
            <div className="font-extrabold text-slate-800 text-sm">
              {hasPriceRange && minPrice !== maxPrice 
                ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}` 
                : formatPrice(row.price)}
            </div>
            {row.discountPercent > 0 && (
              <div className="text-xs text-rose-500 font-bold flex items-center gap-0.5 mt-0.5">
                <Percent size={11} /> Giảm {row.discountPercent}%
              </div>
            )}
          </div>
        );
      }
    },
    {
      header: 'Kho hàng',
      render: (row) => {
        const totalStock = row.variants && row.variants.length > 0 
          ? row.variants.reduce((sum, v) => sum + (v.stock || 0), 0) 
          : row.stock;

        return (
          <div>
            <div className="font-bold text-slate-700 text-xs flex items-center gap-1">
              <Box size={12} className="text-slate-400" /> {totalStock} sản phẩm
            </div>
            <div className="mt-1">
              {totalStock > 0 ? (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-bold uppercase">Còn hàng</span>
              ) : (
                <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-full font-bold uppercase">Hết hàng</span>
              )}
            </div>
          </div>
        );
      }
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

          <select 
            value={`${sortField}-${sortDirection}`} 
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortField(field);
              setSortDirection(direction);
            }}
            className="bg-white border border-slate-200 text-slate-750 text-sm font-semibold rounded-xl px-4 py-2.5 outline-hidden focus:border-[#f47920] cursor-pointer transition-colors"
          >
            <option value="name-asc">Tên (A-Z)</option>
            <option value="name-desc">Tên (Z-A)</option>
            <option value="price-asc">Giá (Thấp → Cao)</option>
            <option value="price-desc">Giá (Cao → Thấp)</option>
            <option value="stock-asc">Kho (Ít → Nhiều)</option>
            <option value="stock-desc">Kho (Nhiều → Ít)</option>
            <option value="id-asc">Mã sản phẩm (Tăng dần)</option>
            <option value="id-desc">Mã sản phẩm (Giảm dần)</option>
          </select>

          <AdminButton onClick={handleOpenCreateModal}>
            <Plus size={15} /> Thêm sản phẩm
          </AdminButton>
        </div>
      </div>

      {/* Main Table */}
      <AdminTable 
        columns={columns} 
        data={sortedProducts} 
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
          </div>

          {/* Multiple Images Section */}
          <div className="pt-2 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700">Hình ảnh sản phẩm (Danh sách URL ảnh)</label>
              <button 
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  images: [...(prev.images || []), '']
                }))}
                className="text-xs font-bold text-[#f47920] hover:text-[#e06810] flex items-center gap-1"
              >
                + Thêm đường dẫn ảnh
              </button>
            </div>

            {(formData.images || []).length === 0 ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs text-slate-400 italic">Chưa có ảnh nào. Sản phẩm sẽ sử dụng ảnh mặc định.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                {(formData.images || []).map((imgUrl, i) => (
                  <div key={i} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <img 
                      src={imgUrl || '/racket_product_1.png'} 
                      alt="Preview" 
                      className="w-10 h-10 object-contain rounded bg-white border border-slate-100 shrink-0"
                      onError={(e) => { e.target.src = '/racket_product_1.png'; }}
                    />
                    <input 
                      type="text"
                      placeholder="Nhập URL hoặc chọn file..."
                      value={imgUrl || ''}
                      onChange={(e) => {
                        const updated = [...formData.images];
                        updated[i] = e.target.value;
                        setFormData(prev => ({ ...prev, images: updated, imageUrl: updated[0] || '' }));
                      }}
                      className="flex-1 px-2 py-1 rounded border border-slate-200 text-xs focus:outline-none focus:border-[#f47920] min-w-0"
                    />
                    <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded text-[10px] font-bold border border-slate-250 cursor-pointer shrink-0">
                      Tải lên
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          try {
                            setUploading(true);
                            const url = await uploadImage(file);
                            const updated = [...formData.images];
                            updated[i] = url;
                            setFormData(prev => ({ ...prev, images: updated, imageUrl: updated[0] || '' }));
                            showFeedback('Tải hình ảnh lên thành công!', 'success');
                          } catch (err) {
                            showFeedback(err.message || 'Lỗi tải ảnh', 'error');
                          } finally {
                            setUploading(false);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    <button 
                      type="button"
                      onClick={() => {
                        const updated = formData.images.filter((_, idx) => idx !== i);
                        setFormData(prev => ({ ...prev, images: updated, imageUrl: updated[0] || '' }));
                      }}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold px-1 shrink-0"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            )}
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

          {/* Variants Section */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-850">Biến thể sản phẩm (Màu, Size, Giá, Kho)</label>
              <button 
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  variants: [...(prev.variants || []), { size: '', color: '', price: formData.price || '', stock: formData.stock || '', sku: '' }]
                }))}
                className="text-xs font-bold text-[#f47920] hover:text-[#e06810] flex items-center gap-1"
              >
                + Thêm biến thể
              </button>
            </div>

            {(formData.variants || []).length === 0 ? (
              <p className="text-xs text-slate-400 italic">Sản phẩm chưa có biến thể nào. Mặc định sẽ sử dụng đơn giá và số kho chung.</p>
            ) : (
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                {(formData.variants || []).map((v, idx) => (
                  <div key={idx} className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 relative space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-600">Biến thể #{idx + 1}</span>
                      <button 
                        type="button"
                        onClick={() => {
                          const updated = formData.variants.filter((_, i) => i !== idx);
                          setFormData(prev => ({ ...prev, variants: updated }));
                        }}
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
                      >
                        Xóa biến thể
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Màu sắc</label>
                        <input 
                          type="text"
                          placeholder="Ví dụ: Đỏ, Xanh..."
                          value={v.color || ''}
                          onChange={(e) => {
                            const updated = [...formData.variants];
                            updated[idx].color = e.target.value;
                            setFormData(prev => ({ ...prev, variants: updated }));
                          }}
                          className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                            formErrors.variants?.[idx]?.color ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-[#f47920]'
                          }`}
                        />
                        {formErrors.variants?.[idx]?.color && (
                          <p className="text-[10px] text-rose-500 mt-1 font-semibold">{formErrors.variants[idx].color}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Kích cỡ (Size)</label>
                        <input 
                          type="text"
                          placeholder="Ví dụ: 3U/G5, 39, L..."
                          value={v.size || ''}
                          onChange={(e) => {
                            const updated = [...formData.variants];
                            updated[idx].size = e.target.value;
                            setFormData(prev => ({ ...prev, variants: updated }));
                          }}
                          className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                            formErrors.variants?.[idx]?.size ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-[#f47920]'
                          }`}
                        />
                        {formErrors.variants?.[idx]?.size && (
                          <p className="text-[10px] text-rose-500 mt-1 font-semibold">{formErrors.variants[idx].size}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Đơn giá (VND)</label>
                        <input 
                          type="number"
                          placeholder="Giá biến thể"
                          value={v.price || ''}
                          onChange={(e) => {
                            const updated = [...formData.variants];
                            updated[idx].price = e.target.value;
                            setFormData(prev => ({ ...prev, variants: updated }));
                          }}
                          className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                            formErrors.variants?.[idx]?.price ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-[#f47920]'
                          }`}
                        />
                        {formErrors.variants?.[idx]?.price && (
                          <p className="text-[10px] text-rose-500 mt-1 font-semibold">{formErrors.variants[idx].price}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Số lượng kho</label>
                        <input 
                          type="number"
                          placeholder="Số kho..."
                          value={v.stock || ''}
                          onChange={(e) => {
                            const updated = [...formData.variants];
                            updated[idx].stock = e.target.value;
                            setFormData(prev => ({ ...prev, variants: updated }));
                          }}
                          className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                            formErrors.variants?.[idx]?.stock ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-[#f47920]'
                          }`}
                        />
                        {formErrors.variants?.[idx]?.stock && (
                          <p className="text-[10px] text-rose-500 mt-1 font-semibold">{formErrors.variants[idx].stock}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Mã SKU</label>
                        <input 
                          type="text"
                          placeholder="Mã SKU..."
                          value={v.sku || ''}
                          onChange={(e) => {
                            const updated = [...formData.variants];
                            updated[idx].sku = e.target.value;
                            setFormData(prev => ({ ...prev, variants: updated }));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#f47920]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
