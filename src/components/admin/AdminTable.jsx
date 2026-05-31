import React from 'react';

/**
 * Reusable dynamic Admin Table component
 */
export default function AdminTable({ columns, data, emptyMessage = "Không có dữ liệu" }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-150">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr 
                key={rowIdx} 
                className="hover:bg-slate-50/40 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td 
                    key={colIdx} 
                    className={`py-4 px-6 text-sm text-slate-700 ${col.className || ''}`}
                  >
                    {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={columns.length} 
                className="py-12 px-6 text-center text-slate-400 text-sm font-medium"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
