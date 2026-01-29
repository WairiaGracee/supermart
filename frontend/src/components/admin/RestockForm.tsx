// src/components/admin/RestockForm.tsx

import { useState } from 'react';
import { adminService } from '../../services/adminService';

interface RestockFormProps {
  branchId: string;
  onRestockSuccess: () => void;
}

export function RestockForm({ branchId, onRestockSuccess }: RestockFormProps) {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await adminService.restock(
        branchId,
        formData.productId,
        parseInt(formData.quantity)
      );
      setMessage('Stock updated successfully!');
      setFormData({ productId: '', quantity: '' });
      onRestockSuccess();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Restock failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Restock Products</h3>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Product
          </label>
          <input
            type="text"
            value={formData.productId}
            onChange={(e) =>
              setFormData({ ...formData, productId: e.target.value })
            }
            placeholder="Product ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Quantity
          </label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            placeholder="Enter quantity"
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {loading ? 'Updating...' : 'Update Stock'}
        </button>
      </div>
    </form>
  );
}