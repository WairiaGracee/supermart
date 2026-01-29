// src/components/admin/InventoryView.tsx

import { LoadingSpinner } from '../common/LoadingSpinner';

interface InventoryItem {
  [key: string]: unknown;
  productName?: string;
  price?: number;
  quantity?: number;
  lastRestocked?: string;
}

interface InventoryViewProps {
  inventory: InventoryItem[];
  loading: boolean;
}

export function InventoryView({ inventory, loading }: InventoryViewProps) {
  if (loading) return <LoadingSpinner />;

  if (inventory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">No inventory data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Inventory Management</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-left">Product</th>
              <th className="border px-4 py-2 text-left">Price</th>
              <th className="border px-4 py-2 text-left">Quantity</th>
              <th className="border px-4 py-2 text-left">Last Restocked</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-2 font-semibold">
                  {String(item.productName) || 'N/A'}
                </td>
                <td className="border px-4 py-2">KES {String(item.price) || 0}</td>
                <td className="border px-4 py-2 font-bold text-blue-600">
                  {String(item.quantity) || 0}
                </td>
                <td className="border px-4 py-2">
                  {item.lastRestocked
                    ? new Date(String(item.lastRestocked)).toLocaleDateString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}