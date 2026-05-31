import React from 'react';
import { DollarSign, ShoppingBag, Box, Users, TrendingUp } from 'lucide-react';

function StatsGrid({ stats }) {
  if (!stats) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const statItems = [
    {
      label: 'Tổng Doanh Thu',
      value: formatPrice(stats.totalRevenue),
      trend: `+${stats.revenueTrend}%`,
      subText: 'So với tháng trước',
      icon: <DollarSign size={20} />,
      bgClass: 'bg-emerald-50',
      iconClass: 'bg-emerald-500/10 text-emerald-600',
      trendClass: 'text-emerald-600 bg-emerald-50'
    },
    {
      label: 'Tổng Đơn Hàng',
      value: `${stats.totalOrders} đơn`,
      trend: `+${stats.ordersTrend}%`,
      subText: 'Mới phát sinh',
      icon: <ShoppingBag size={20} />,
      bgClass: 'bg-blue-50',
      iconClass: 'bg-blue-500/10 text-blue-600',
      trendClass: 'text-blue-600 bg-blue-50'
    },
    {
      label: 'Tổng Sản Phẩm',
      value: `${stats.totalProducts} dòng`,
      trend: 'Mới',
      subText: 'Sẵn sàng bán hàng',
      icon: <Box size={20} />,
      bgClass: 'bg-orange-50',
      iconClass: 'bg-orange-500/10 text-orange-600',
      trendClass: 'text-gray-500 bg-gray-50'
    },
    {
      label: 'Tổng Thành Viên',
      value: `${stats.totalMembers} khách`,
      trend: `+${stats.membersTrend}%`,
      subText: 'Đã đăng ký',
      icon: <Users size={20} />,
      bgClass: 'bg-violet-50',
      iconClass: 'bg-violet-500/10 text-violet-600',
      trendClass: 'text-violet-600 bg-violet-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          {/* Subtle hovered color block */}
          <div className={`absolute top-0 right-0 w-24 h-24 ${item.bgClass} rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-110 duration-500`}></div>
          
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${item.iconClass}`}>
              {item.icon}
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full z-10 ${item.trendClass}`}>
              {index !== 2 && <TrendingUp size={12} />}
              <span>{item.trend}</span>
            </div>
          </div>
          
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{item.label}</p>
          <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 mt-2">{item.value}</h3>
          <p className="text-gray-500 text-[10px] mt-1.5">{item.subText}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsGrid;
