import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from '../api/admin';
import AdminHeader from '../components/admin/AdminHeader';
import StatsGrid from '../components/admin/StatsGrid';
import RevenueChart from '../components/admin/RevenueChart';
import OrderStatusChart from '../components/admin/OrderStatusChart';
import RecentOrdersTable from '../components/admin/RecentOrdersTable';

function AdminDashboard() {
  const { onMenuToggle } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const statsData = await adminApi.getDashboardStats();
        
        // Map general metrics
        setStats({
          totalRevenue: statsData.totalRevenue || 0,
          revenueTrend: 0,
          totalOrders: statsData.totalOrders || 0,
          ordersTrend: 0,
          totalProducts: statsData.totalProducts || 0,
          productsTrend: 0,
          totalMembers: statsData.totalUsers || 0,
          membersTrend: 0
        });

        // Map monthly revenue chart data
        const revData = (statsData.monthlyRevenue || []).map(item => ({
          month: item.month,
          revenue: item.revenue || 0
        }));
        setRevenueData(revData);

        // Map order status chart data
        const colors = {
          'Chờ xác nhận': '#ffb800',
          'Chờ thanh toán': '#e65100',
          'Đang xử lý': '#0d47a1',
          'Đang giao hàng': '#0288d1',
          'Hoàn thành': '#1b5e20',
          'Đã hủy': '#c62828'
        };
        const statusDataArray = Object.entries(statsData.ordersByStatus || {}).map(([status, count]) => ({
          name: status,
          count: count,
          color: colors[status] || '#9e9e9e'
        }));
        setStatusData(statusDataArray);

        // Map recent orders list
        const ordersList = (statsData.recentOrders || []).map(item => ({
          id: item.id,
          orderCode: item.orderCode,
          fullName: item.fullName,
          totalPrice: item.totalAmount,
          status: item.status,
          orderDate: item.createdAt
        }));
        setRecentOrders(ordersList);
      } catch (error) {
        console.error('Lỗi tải dữ liệu Dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 flex-1">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-(--primary-color) border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-semibold animate-pulse">Đang tải số liệu thống kê quản trị...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 md:p-10 space-y-8 overflow-x-hidden">
      {/* Header */}
      <AdminHeader 
        title="Trang Tổng Quan" 
        description="Chào mừng quay trở lại, đây là những diễn biến mới nhất trên cửa hàng của bạn." 
        onMenuToggle={onMenuToggle} 
      />

      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RevenueChart revenueData={revenueData} />
        <OrderStatusChart statusData={statusData} />
      </div>

      {/* Recent Transactions Table */}
      <RecentOrdersTable recentOrders={recentOrders} />
    </main>
  );
}

export default AdminDashboard;

