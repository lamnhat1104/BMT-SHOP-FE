import { fetchData } from './config';

// Mock API data for Admin Dashboard
export const adminApi = {
  getDashboardStats: async () => {
    const data = await fetchData('/admin/dashboard');
    return {
      ...data,
      totalMembers: data.totalUsers || 0,
      revenueTrend: 0.0,
      ordersTrend: 0.0,
      productsTrend: 0.0,
      membersTrend: 0.0
    };
  },

  getRevenueChartData: async () => {
    const data = await fetchData('/admin/dashboard');
    return (data.monthlyRevenue || []).map(item => ({
      month: item.month,
      revenue: item.revenue
    }));
  },

  getOrderStatusData: async () => {
    const stats = await fetchData('/admin/dashboard');
    const colors = {
      'Chờ xác nhận': '#ffb800',
      'Chờ thanh toán': '#e65100',
      'Đang xử lý': '#0d47a1',
      'Đang giao hàng': '#0288d1',
      'Hoàn thành': '#1b5e20',
      'Đã hủy': '#c62828'
    };
    if (stats && stats.ordersByStatus) {
      return Object.entries(stats.ordersByStatus).map(([status, count]) => ({
        name: status,
        count: count,
        color: colors[status] || '#9e9e9e'
      }));
    }
    return [];
  },

  getRecentOrders: async () => {
    const stats = await fetchData('/admin/dashboard');
    return (stats.recentOrders || []).map(item => ({
      id: item.id,
      orderCode: item.orderCode,
      fullName: item.fullName,
      totalPrice: item.totalAmount,
      status: item.status,
      orderDate: item.createdAt
    }));
  },

  getRevenueReport: async (period, startDate, endDate) => {
    let url = `/admin/reports/revenue?period=${period}`;
    if (period === 'custom' && startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    return fetchData(url);
  },

  getCategoryRevenueReport: async (period, startDate, endDate) => {
    let url = `/admin/reports/category-revenue?period=${period}`;
    if (period === 'custom' && startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    return fetchData(url);
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
