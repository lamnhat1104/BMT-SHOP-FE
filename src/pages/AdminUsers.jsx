import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Search, UserPlus, Edit2, ShieldAlert, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader';
import AdminTable from '../components/admin/AdminTable';
import AdminButton from '../components/admin/AdminButton';
import AdminInput from '../components/admin/AdminInput';
import AdminModal from '../components/admin/AdminModal';
import { adminApi } from '../api/admin';

function AdminUsers() {
  const { onMenuToggle } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    role: 'member'
  });
  const [formErrors, setFormErrors] = useState({});
  const [actionFeedback, setActionFeedback] = useState({ text: '', type: '' });

  // Load initial users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Lỗi tải người dùng:', err);
      setError(err.message || 'Không thể lấy dữ liệu người dùng từ hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Họ tên không được để trống';
    if (!formData.email.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không đúng định dạng';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.trim())) {
      errors.phone = 'Số điện thoại gồm 10-11 chữ số';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open modal for creating new user
  const handleOpenCreateModal = () => {
    setModalType('create');
    setSelectedUser(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      role: 'member'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing user
  const handleOpenEditModal = (user) => {
    setModalType('edit');
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      role: user.role
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Submit create or edit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (modalType === 'create') {
        // Check duplication
        const duplicate = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase().trim());
        if (duplicate) {
          setFormErrors({ email: 'Email này đã tồn tại trên hệ thống' });
          return;
        }

        const newUser = await adminApi.createUser({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          role: formData.role
        });
        setUsers(prev => [...prev, newUser]);
        showFeedback('Thêm thành viên mới thành công!', 'success');
      } else {
        const updated = await adminApi.updateUser(selectedUser.userId, {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          role: formData.role
        });
        setUsers(prev => prev.map(u => u.userId === selectedUser.userId ? updated : u));
        showFeedback('Cập nhật thông tin thành viên thành công!', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showFeedback(err.message || 'Thao tác thất bại!', 'error');
    }
  };

  // Toggle activation status
  const handleToggleStatus = async (userId) => {
    try {
      const updated = await adminApi.toggleUserStatus(userId);
      setUsers(prev => prev.map(u => u.userId === userId ? updated : u));
      showFeedback(`Đã ${updated.isActive === 1 ? 'mở khóa' : 'khóa'} tài khoản thành công!`, 'success');
    } catch (err) {
      showFeedback(err.message || 'Thay đổi trạng thái thất bại!', 'error');
    }
  };

  const showFeedback = (text, type) => {
    setActionFeedback({ text, type });
    setTimeout(() => setActionFeedback({ text: '', type: '' }), 4000);
  };

  // Filter users based on query, role, status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (user.phone && user.phone.includes(searchQuery.trim()));
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = 
      statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && user.isActive === 1) || 
      (statusFilter === 'BLOCKED' && user.isActive === 0);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Table Columns Definition
  const columns = [
    {
      header: 'Thành viên',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 text-[#f47920] font-black text-sm flex items-center justify-center border border-orange-200">
            {row.fullName.split(' ').pop().substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-slate-800">{row.fullName}</div>
            <div className="text-xs text-slate-400">ID: #{row.userId}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Liên hệ',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-700">{row.email}</div>
          <div className="text-xs text-slate-400">SĐT: {row.phone || 'Chưa cung cấp'}</div>
        </div>
      )
    },
    {
      header: 'Địa chỉ',
      render: (row) => (
        <div className="max-w-[150px] truncate text-slate-500" title={row.address}>
          {row.address || 'Chưa cập nhật'}
        </div>
      )
    },
    {
      header: 'Vai trò',
      className: 'whitespace-nowrap',
      render: (row) => (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap ${
          row.role === 'admin' 
            ? 'bg-rose-50 text-rose-700 border border-rose-100' 
            : 'bg-blue-50 text-blue-700 border border-blue-100'
        }`}>
          {row.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
        </span>
      )
    },
    {
      header: 'Trạng thái',
      className: 'whitespace-nowrap',
      render: (row) => (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 whitespace-nowrap ${
          row.isActive === 1 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
            : 'bg-slate-100 text-slate-500 border border-slate-200'
        }`}>
          {row.isActive === 1 ? 'Hoạt động' : 'Đang khóa'}
        </span>
      )
    },
    {
      header: 'Thao tác',
      className: 'text-right whitespace-nowrap',
      render: (row) => (
        <div className="flex gap-2 justify-end items-center whitespace-nowrap">
          <AdminButton 
            variant="outline" 
            onClick={() => handleOpenEditModal(row)}
            title="Chỉnh sửa thông tin"
          >
            <Edit2 size={13} /> Sửa
          </AdminButton>
          
          <AdminButton 
            variant={row.isActive === 1 ? 'danger' : 'success'}
            onClick={() => handleToggleStatus(row.userId)}
            title={row.isActive === 1 ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
          >
            {row.isActive === 1 ? (
              <>
                <ShieldAlert size={13} /> Khóa
              </>
            ) : (
              <>
                <CheckCircle2 size={13} /> Mở khóa
              </>
            )}
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
          <p className="text-gray-500 font-semibold animate-pulse">Đang tải thông tin thành viên...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 md:p-10 space-y-8 overflow-x-hidden">
      {/* Header component */}
      <AdminHeader 
        title="Quản Lý Tài Khoản" 
        description="Xem danh sách người dùng, phân quyền quản trị và quản lý trạng thái kích hoạt tài khoản." 
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
        {/* Search Input */}
        <div className="flex-1 min-w-[280px] flex items-center border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-[#f47920] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Tìm theo tên thành viên, email, số điện thoại..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-hidden text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap gap-4 items-center">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-750 text-sm font-semibold rounded-xl px-4 py-2.5 outline-hidden focus:border-[#f47920] cursor-pointer transition-colors"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="member">Khách hàng</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-750 text-sm font-semibold rounded-xl px-4 py-2.5 outline-hidden focus:border-[#f47920] cursor-pointer transition-colors"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="BLOCKED">Đang khóa</option>
          </select>

          <AdminButton onClick={handleOpenCreateModal}>
            <UserPlus size={15} /> Thêm thành viên
          </AdminButton>
        </div>
      </div>

      {/* Main Table */}
      <AdminTable 
        columns={columns} 
        data={filteredUsers} 
        emptyMessage="Không tìm thấy thành viên nào phù hợp với bộ lọc."
      />

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'create' ? 'Thêm thành viên mới' : 'Cập nhật thông tin thành viên'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminInput 
            label="Họ và tên" 
            placeholder="Nhập đầy đủ họ tên..."
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            error={formErrors.fullName}
            required
          />

          <AdminInput 
            label="Email" 
            type="email"
            placeholder="example@gmail.com..."
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            error={formErrors.email}
            disabled={modalType === 'edit'} // Không cho sửa email khi cập nhật
            required
          />

          <AdminInput 
            label="Số điện thoại" 
            type="tel"
            placeholder="09xxxxxxxx..."
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            error={formErrors.phone}
            required
          />

          <AdminInput 
            label="Địa chỉ" 
            placeholder="Địa chỉ giao hàng/cư trú..."
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          />

          <AdminInput 
            label="Phân quyền vai trò" 
            type="select"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            options={[
              { value: 'member', label: 'Khách hàng (Member)' },
              { value: 'admin', label: 'Quản trị viên (Admin)' }
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
              {modalType === 'create' ? 'Tạo tài khoản' : 'Lưu thay đổi'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </main>
  );
}

export default AdminUsers;
