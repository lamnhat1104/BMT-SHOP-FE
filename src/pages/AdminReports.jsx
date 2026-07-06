import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from '../api/admin';
import AdminHeader from '../components/admin/AdminHeader';
import { DollarSign, ShoppingBag, BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';

function AdminReports() {
  const { onMenuToggle } = useOutletContext();
  const [period, setPeriod] = useState('7days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeChart, setActiveChart] = useState('revenue'); // 'revenue' or 'orders'
  
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [revReport, catReport] = await Promise.all([
        adminApi.getRevenueReport(period, startDate, endDate),
        adminApi.getCategoryRevenueReport(period, startDate, endDate)
      ]);
      setRevenueData(revReport);
      
      // Sort category report by revenue descending
      const sortedCat = (catReport || []).sort((a, b) => b.revenue - a.revenue);
      setCategoryData(sortedCat);
    } catch (error) {
      console.error('Lỗi khi tải báo cáo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (period !== 'custom') {
      fetchReportData();
    }
  }, [period]);

  const handleCustomSearch = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    fetchReportData();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Calculations
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orderCount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Find max values for chart height calculations
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);
  const maxOrders = Math.max(...revenueData.map(d => d.orderCount), 1);

  // SVG Line Chart Helpers
  const width = 600;
  const height = 240;
  const padding = 40;

  const points = revenueData.map((d, i) => {
    const x = padding + (i / Math.max(revenueData.length - 1, 1)) * (width - padding * 2);
    const value = activeChart === 'revenue' ? d.revenue : d.orderCount;
    const maxValue = activeChart === 'revenue' ? maxRevenue : maxOrders;
    const y = height - padding - (value / maxValue) * (height - padding * 2);
    return { x, y, label: d.label, val: value };
  });

  const linePath = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

  return (
    <main className="flex-1 p-6 md:p-10 space-y-8 overflow-x-hidden">
      {/* Header */}
      <AdminHeader 
        title="Báo Cáo Doanh Thu" 
        description="Thống kê chuyên sâu về hiệu suất bán hàng, đơn hàng và danh mục sản phẩm." 
        onMenuToggle={onMenuToggle} 
      />

      {/* Filters Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Period selection tab */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: '7days', label: '7 ngày qua' },
            { id: '30days', label: '30 ngày qua' },
            { id: 'month', label: 'Năm nay (Tháng)' },
            { id: 'year', label: '5 năm gần nhất' },
            { id: 'custom', label: 'Tùy chọn khác' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                period === item.id 
                  ? 'bg-(--primary-color) text-white shadow-md shadow-orange-500/10'
                  : 'bg-slate-50 text-gray-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Custom date picker */}
        {period === 'custom' && (
          <form onSubmit={handleCustomSearch} className="flex flex-wrap items-center gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:border-(--primary-color)"
                required
              />
              <span className="text-gray-400 text-xs">đến</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:border-(--primary-color)"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              Lọc dữ liệu
            </button>
          </form>
        )}

        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 border border-gray-200 hover:border-slate-800 hover:bg-slate-50 text-gray-600 hover:text-slate-800 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer self-start md:self-auto"
        >
          <Download size={14} />
          Xuất báo cáo
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-(--primary-color) border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-xs font-semibold">Đang chuẩn bị báo cáo doanh thu...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Revenue card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-110 duration-500"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <DollarSign size={20} />
                </div>
              </div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Tổng Doanh Thu</p>
              <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 mt-2">{formatPrice(totalRevenue)}</h3>
              <p className="text-gray-500 text-[10px] mt-1.5">Tổng giá trị đơn hàng được bán ra</p>
            </div>

            {/* Total Orders card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-110 duration-500"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
                  <ShoppingBag size={20} />
                </div>
              </div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Tổng Đơn Hàng</p>
              <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 mt-2">{totalOrders} đơn</h3>
              <p className="text-gray-500 text-[10px] mt-1.5">Số lượng đơn hàng giao dịch thành công</p>
            </div>

            {/* AOV card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-110 duration-500"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600">
                  <TrendingUp size={20} />
                </div>
              </div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Giá Trị Đơn Trung Bình (AOV)</p>
              <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 mt-2">{formatPrice(averageOrderValue)}</h3>
              <p className="text-gray-500 text-[10px] mt-1.5">Mức chi tiêu trung bình trên mỗi đơn hàng</p>
            </div>
          </div>

          {/* Charts & Categorized Report split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* SVG Line Chart Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-slate-800">Biểu đồ Xu Hướng Bán Hàng</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Thể hiện xu hướng doanh thu và khối lượng đặt hàng</p>
                </div>
                
                {/* Toggle between Revenue & Orders */}
                <div className="flex bg-slate-100 p-0.5 rounded-xl self-start sm:self-auto">
                  <button
                    onClick={() => setActiveChart('revenue')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                      activeChart === 'revenue' ? 'bg-white text-slate-800 shadow-xs' : 'text-gray-500 hover:text-slate-800'
                    }`}
                  >
                    Xem Doanh Thu
                  </button>
                  <button
                    onClick={() => setActiveChart('orders')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                      activeChart === 'orders' ? 'bg-white text-slate-800 shadow-xs' : 'text-gray-500 hover:text-slate-800'
                    }`}
                  >
                    Xem Đơn Hàng
                  </button>
                </div>
              </div>

              {revenueData.length === 0 ? (
                <div className="h-64 flex items-center justify-center border border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-400 text-xs font-medium">Không có dữ liệu trong khoảng thời gian này</p>
                </div>
              ) : (
                <div className="relative pt-6">
                  {/* SVG Chart */}
                  <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                      const y = padding + ratio * (height - padding * 2);
                      const val = activeChart === 'revenue' 
                        ? (1 - ratio) * maxRevenue 
                        : (1 - ratio) * maxOrders;

                      return (
                        <g key={index}>
                          <line 
                            x1={padding} 
                            y1={y} 
                            x2={width - padding} 
                            y2={y} 
                            stroke="#f1f5f9" 
                            strokeWidth="1" 
                          />
                          <text 
                            x={padding - 8} 
                            y={y + 3} 
                            textAnchor="end" 
                            fill="#94a3b8" 
                            className="text-[9px] font-semibold"
                          >
                            {activeChart === 'revenue' 
                              ? new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(val)
                              : Math.round(val)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Area fill path under line */}
                    {areaPath && (
                      <path 
                        d={areaPath} 
                        fill={activeChart === 'revenue' ? 'url(#revenue-grad)' : 'url(#orders-grad)'} 
                      />
                    )}

                    {/* Line path */}
                    {linePath && (
                      <path 
                        d={linePath} 
                        fill="none" 
                        stroke={activeChart === 'revenue' ? '#f47920' : '#3b82f6'} 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    )}

                    {/* Interactive points & Tooltips */}
                    {points.map((p, index) => (
                      <g key={index} className="group/dot cursor-pointer">
                        <circle 
                          cx={p.x} 
                          cy={p.y} 
                          r="5" 
                          fill="#ffffff" 
                          stroke={activeChart === 'revenue' ? '#f47920' : '#3b82f6'} 
                          strokeWidth="2.5" 
                          className="transition-all duration-200 group-hover/dot:r-7 group-hover/dot:stroke-width-[3.5]"
                        />
                        {/* Point label on hover */}
                        <g className="opacity-0 group-hover/dot:opacity-100 transition-opacity duration-200 pointer-events-none">
                          <rect 
                            x={p.x - 50} 
                            y={p.y - 34} 
                            width="100" 
                            height="24" 
                            rx="6" 
                            fill="#1e293b" 
                          />
                          <text 
                            x={p.x} 
                            y={p.y - 19} 
                            fill="#ffffff" 
                            textAnchor="middle" 
                            className="text-[9px] font-extrabold"
                          >
                            {activeChart === 'revenue' ? formatPrice(p.val) : `${p.val} đơn`}
                          </text>
                        </g>

                        {/* X-axis date labels */}
                        {points.length <= 15 || index % Math.ceil(points.length / 10) === 0 ? (
                          <text 
                            x={p.x} 
                            y={height - 10} 
                            textAnchor="middle" 
                            fill="#64748b" 
                            className="text-[9px] font-bold"
                          >
                            {p.label}
                          </text>
                        ) : null}
                      </g>
                    ))}

                    {/* Gradients */}
                    <defs>
                      <linearGradient id="revenue-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f47920" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#f47920" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="orders-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
            </div>

            {/* Categorized Statistics Table */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <div className="mb-6">
                <h3 className="font-bold text-slate-800">Doanh Thu Theo Danh Mục</h3>
                <p className="text-gray-400 text-xs mt-0.5">Cơ cấu doanh thu phân tách theo nhóm sản phẩm</p>
              </div>

              {categoryData.length === 0 ? (
                <div className="h-64 flex items-center justify-center border border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-400 text-xs font-medium">Chưa có dữ liệu danh mục</p>
                </div>
              ) : (
                <div className="space-y-5 max-h-72 overflow-y-auto pr-1">
                  {categoryData.map((cat, index) => {
                    const percentage = totalRevenue > 0 ? (cat.revenue / totalRevenue) * 100 : 0;
                    return (
                      <div key={cat.categoryId} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 truncate max-w-[150px]">{cat.categoryName}</span>
                          <span className="font-medium text-gray-500">
                            {formatPrice(cat.revenue)} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${percentage}%` }}
                            className={`h-full rounded-full transition-all duration-1000 ${
                              index === 0 ? 'bg-orange-500' :
                              index === 1 ? 'bg-amber-500' :
                              index === 2 ? 'bg-emerald-500' :
                              index === 3 ? 'bg-blue-500' : 'bg-slate-400'
                            }`}
                          ></div>
                        </div>
                        <div className="text-[10px] text-gray-400 font-semibold">
                          Đã bán: {cat.quantitySold} sản phẩm
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default AdminReports;
