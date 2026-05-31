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
        const [statsData, revData, statData, ordersData] = await Promise.all([
          adminApi.getDashboardStats(),
          adminApi.getRevenueChartData(),
          adminApi.getOrderStatusData(),
          adminApi.getRecentOrders()
        ]);
        setStats(statsData);
        setRevenueData(revData);
        setStatusData(statData);
        setRecentOrders(ordersData);
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

