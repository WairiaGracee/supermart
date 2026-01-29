// src/components/admin/SalesReport.tsx

import type { SalesReport } from '../../types';

interface SalesReportProps {
  report: SalesReport | null;
  loading: boolean;
}

export function SalesReport({ report, loading }: SalesReportProps) {
  if (loading) {
    return (
      <div className="text-center text-gray-600 py-8">Loading reports...</div>
    );
  }

  if (!report) {
    return (
      <div className="text-center text-gray-600 py-8">
        No report data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <p className="text-gray-600 text-sm font-semibold">Total Sales</p>
          <p className="text-3xl font-bold text-blue-600">{report.totalSales}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <p className="text-gray-600 text-sm font-semibold">Total Income</p>
          <p className="text-3xl font-bold text-green-600">
            KES {report.totalIncome}
          </p>
        </div>
      </div>

      {/* Sales by Product */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Sales by Product</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Product</th>
                <th className="border px-4 py-2 text-left">Quantity Sold</th>
                <th className="border px-4 py-2 text-left">Income</th>
              </tr>
            </thead>
            <tbody>
              {report.salesByProduct.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 font-semibold">
                    {item.productName}
                  </td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2 font-bold text-green-600">
                    KES {item.income}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales by Branch */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Sales by Branch</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Branch</th>
                <th className="border px-4 py-2 text-left">Quantity Sold</th>
                <th className="border px-4 py-2 text-left">Income</th>
              </tr>
            </thead>
            <tbody>
              {report.salesByBranch.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 font-semibold">
                    {item.branchName}
                  </td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2 font-bold text-green-600">
                    KES {item.income}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}