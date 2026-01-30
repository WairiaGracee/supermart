// src/components/admin/RestockForm.tsx

import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { reportService } from '../../services/reportService';

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface RestockFormProps {
  branchId: string;
  onRestockSuccess: () => void;
}

export function RestockForm({ branchId, onRestockSuccess }: RestockFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await reportService.getProducts();
        setProducts(data as unknown as Product[]);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    loadProducts();
  }, []);

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
      const productName = products.find(p => p._id === formData.productId)?.name || 'Product';
      setMessage(`Successfully added ${formData.quantity} ${productName}(s) to stock!`);
      setMessageType('success');
      setFormData({ productId: '', quantity: '' });
      onRestockSuccess();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Restock failed');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find(p => p._id === formData.productId);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Restock Products</h3>
            <p className="text-emerald-100 text-xs">Add inventory to this branch</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 animate-fadeIn ${
            messageType === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {messageType === 'success' ? (
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {/* Product Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Select Product</label>
          <div className="relative">
            <select
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              className="appearance-none w-full px-4 py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 font-medium focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 cursor-pointer"
              required
            >
              <option value="">Choose a product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} - KES {product.price}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Quantity to Add</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="Enter quantity"
            min="1"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 font-medium focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Preview */}
        {selectedProduct && formData.quantity && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 animate-fadeIn">
            <p className="text-sm text-gray-600">
              Adding <span className="font-bold text-gray-900">{formData.quantity}</span> units of{' '}
              <span className="font-bold text-gray-900">{selectedProduct.name}</span>
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !branchId}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add to Stock</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
