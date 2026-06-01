import { fetchData } from './config';

// Mock API data for Admin Dashboard
export const adminApi = {
  getDashboardStats: async () => {
    // Giả lập độ trễ mạng
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      totalRevenue: 12850000, // 12.85M VND
      revenueTrend: 12.5, // +12.5%
      totalOrders: 6,
      ordersTrend: 8.3, // +8.3%
      totalProducts: 6,
      productsTrend: 0.0, // Không đổi
      totalMembers: 5,
      membersTrend: 25.0, // +25%
    };
  },

  getRevenueChartData: async () => {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [
      { month: 'Tháng 1', revenue: 4500000 },
      { month: 'Tháng 2', revenue: 7200000 },
      { month: 'Tháng 3', revenue: 5800000 },
      { month: 'Tháng 4', revenue: 9400000 },
      { month: 'Tháng 5', revenue: 12850000 },
    ];
  },

  getOrderStatusData: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { name: 'Chờ xác nhận', count: 1, color: '#ffb800' },
      { name: 'Đang xử lý', count: 1, color: '#0d47a1' },
      { name: 'Đang giao hàng', count: 1, color: '#e65100' },
      { name: 'Hoàn thành', count: 2, color: '#1b5e20' },
      { name: 'Đã hủy', count: 1, color: '#c62828' }
    ];
  },

  getRecentOrders: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      {
        id: 1,
        orderCode: 'ORD-9872',
        fullName: 'Nguyễn Văn Hùng',
        totalPrice: 3450000,
        status: 'Chờ xác nhận',
        orderDate: '2026-05-30T10:30:00'
      },
      {
        id: 2,
        orderCode: 'ORD-9861',
        fullName: 'Trần Thị Mai',
        totalPrice: 1250000,
        status: 'Hoàn thành',
        orderDate: '2026-05-29T15:20:00'
      },
      {
        id: 3,
        orderCode: 'ORD-9850',
        fullName: 'Lê Hoàng Nam',
        totalPrice: 4700000,
        status: 'Đang giao hàng',
        orderDate: '2026-05-29T09:15:00'
      },
      {
        id: 4,
        orderCode: 'ORD-9843',
        fullName: 'Phạm Thanh Sơn',
        totalPrice: 180000,
        status: 'Đang xử lý',
        orderDate: '2026-05-28T16:45:00'
      },
      {
        id: 5,
        orderCode: 'ORD-9830',
        fullName: 'Đỗ Thùy Chi',
        totalPrice: 3100000,
        status: 'Hoàn thành',
        orderDate: '2026-05-28T11:10:00'
      }
    ];
  },

  getUsers: async () => {
    return fetchData('/admin/users', {
      method: 'GET',
    });
  },

  createUser: async (user) => {
    return fetchData('/admin/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  updateUser: async (userId, updatedFields) => {
    return fetchData(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFields),
    });
  },

  toggleUserStatus: async (userId) => {
    return fetchData(`/admin/users/${userId}/toggle-status`, {
      method: 'POST',
    });
  }
};
