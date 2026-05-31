import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

function RecentOrdersTable({ recentOrders }) {
  if (!recentOrders) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Đang xử lý':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Đang giao hàng':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'Hoàn thành':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Đã hủy':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800">Giao Dịch Gần Đây</h3>
          <p className="text-gray-400 text-xs mt-0.5">Danh sách các đơn hàng mới nhất trên hệ thống</p>
        </div>
        <Link to="/admin/orders" className="flex items-center gap-1.5 text-xs font-bold text-(--primary-color) hover:text-(--primary-hover) self-start sm:self-auto transition-colors">
          <span>Xem toàn bộ danh sách đơn hàng</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-gray-100">
              <th className="py-4 px-6">Mã đơn</th>
              <th className="py-4 px-6">Khách hàng</th>
              <th className="py-4 px-6">Ngày đặt</th>
              <th className="py-4 px-6">Tổng tiền</th>
              <th className="py-4 px-6">Trạng thái</th>
              <th className="py-4 px-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {recentOrders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4.5 px-6 font-bold text-slate-800">{o.orderCode}</td>
                <td className="py-4.5 px-6 font-semibold text-gray-700">{o.fullName}</td>
                <td className="py-4.5 px-6 text-gray-500 text-xs">{new Date(o.orderDate).toLocaleString('vi-VN')}</td>
                <td className="py-4.5 px-6 font-extrabold text-slate-800">{formatPrice(o.totalPrice)}</td>
                <td className="py-4.5 px-6">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide inline-block ${getStatusBadgeStyle(o.status)}`}>
                    {o.status}
                  </span>
                </td>
                <td className="py-4.5 px-6 text-right">
                  <Link to="/admin/orders" className="text-(--primary-color) hover:underline font-bold text-xs">Chi tiết</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrdersTable;
