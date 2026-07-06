import React from 'react';

function RevenueChart({ revenueData }) {
  if (!revenueData || revenueData.length === 0) return null;

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-800">Doanh Thu 5 Tháng Gần Nhất</h3>
          <p className="text-gray-400 text-xs mt-0.5">Biểu đồ thể hiện mức tăng trưởng doanh thu cửa hàng</p>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">VNĐ</span>
      </div>

      {/* Custom SVG/Tailwind Bar Chart */}
      <div className="h-64 flex flex-col justify-end pt-5 relative">
        {/* Grid lines */}
        <div className="absolute inset-x-0 bottom-6 border-b border-gray-100 w-full"></div>
        <div className="absolute inset-x-0 bottom-[35%] border-b border-gray-100 w-full"></div>
        <div className="absolute inset-x-0 bottom-[65%] border-b border-gray-100 w-full"></div>
        <div className="absolute inset-x-0 top-6 border-b border-gray-100 w-full"></div>

        <div className="flex justify-around items-end h-full px-4 z-10">
          {revenueData.map((d, index) => {
            const percentage = (d.revenue / maxRevenue) * 80; // Max 80% height of parent
            return (
              <div key={index} className="flex flex-col items-center group/bar w-12 sm:w-16 h-full justify-end">
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover/bar:opacity-100 bottom-[80%] bg-slate-800 text-white text-[10px] py-1.5 px-3 rounded-lg shadow-md transition-opacity duration-200 pointer-events-none whitespace-nowrap z-25 font-bold">
                  {formatPrice(d.revenue)}
                </div>
                
                {/* Dynamic Height Column */}
                <div 
                  style={{ height: `${percentage}%`, backgroundColor: '#f47920' }}
                  className="w-full rounded-t-lg transition-all duration-500 hover:brightness-105 shadow-[0_4px_10px_rgba(244,121,32,0.15)]"
                ></div>
                
                {/* X label */}
                <span className="text-gray-500 text-[10px] mt-2.5 font-bold text-center block whitespace-nowrap">
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RevenueChart;
