// src/components/customer/PurchaseHistory.tsx

import { useState, useEffect } from 'react';
import { saleService } from '../../services/saleService';
import type { Sale } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function PurchaseHistory() {
  const [purchases, setPurchases] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        const data = await saleService.getMyPurchases();
        setPurchases(data);
      } catch (error) {
        console.error('Failed to load purchases:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPurchases();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">No purchases yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Purchase History</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Product</th>
              <th className="border px-4 py-2 text-left">Qty</th>
              <th className="border px-4 py-2 text-left">Amount</th>
              <th className="border px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  {new Date(purchase.saleDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  {typeof purchase.product === 'object' && purchase.product !== null
                    ? (purchase.product as { name: string }).name
                    : purchase.product}
                </td>
                <td className="border px-4 py-2">{purchase.quantity}</td>
                <td className="border px-4 py-2 font-bold">KES {purchase.totalAmount}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      purchase.paymentStatus === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : purchase.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {purchase.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}