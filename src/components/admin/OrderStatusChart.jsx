import React from 'react';

function OrderStatusChart({ statusData }) {
  if (!statusData || statusData.length === 0) return null;

  const totalOrders = statusData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
      <div className="mb-6">
        <h3 className="font-bold text-slate-800">Trạng Thái Đơn Hàng</h3>
        <p className="text-gray-400 text-xs mt-0.5">Phân bổ trạng thái của các đơn hàng đã nhận</p>
      </div>

      {/* Donut Chart SVG */}
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative w-36 h-36">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Background base circle */}
            <circle cx="50" cy="50" r="35" stroke="#f1f5f9" strokeWidth="12" fill="none" />
            
            {/* Segment 1: Hoàn thành (2/6 = 33.3%) */}
            <circle cx="50" cy="50" r="35" stroke="#1b5e20" strokeWidth="12" fill="none" 
                    strokeDasharray="73.3 220" strokeDashoffset="0" />
            
            {/* Segment 2: Chờ xác nhận (1/6 = 16.7%) */}
            <circle cx="50" cy="50" r="35" stroke="#ffb800" strokeWidth="12" fill="none" 
                    strokeDasharray="36.7 220" strokeDashoffset="-73.3" />
            
            {/* Segment 3: Đang xử lý (1/6 = 16.7%) */}
            <circle cx="50" cy="50" r="35" stroke="#0d47a1" strokeWidth="12" fill="none" 
                    strokeDasharray="36.7 220" strokeDashoffset="-110" />

            {/* Segment 4: Đang giao hàng (1/6 = 16.7%) */}
            <circle cx="50" cy="50" r="35" stroke="#e65100" strokeWidth="12" fill="none" 
                    strokeDasharray="36.7 220" strokeDashoffset="-146.7" />

            {/* Segment 5: Đã hủy (1/6 = 16.7%) */}
            <circle cx="50" cy="50" r="35" stroke="#c62828" strokeWidth="12" fill="none" 
                    strokeDasharray="36.7 220" strokeDashoffset="-183.4" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-slate-800">{totalOrders}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Đơn hàng</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full text-xs">
          {statusData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span style={{ backgroundColor: item.color }} className="w-2.5 h-2.5 rounded-full block"></span>
              <span className="text-gray-600 font-medium truncate">{item.name}</span>
              <span className="text-gray-400 font-bold ml-auto">({item.count})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderStatusChart;
