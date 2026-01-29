// src/components/customer/ProductList.tsx

import { useState } from 'react';
import type { Product } from '../../types';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  selectedBranch: string;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductList({
  products,
  loading,
  selectedBranch,
  onAddToCart,
}: ProductListProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQuantity = (productId: string) => quantities[productId] || 1;

  const setQuantity = (productId: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(1, quantity) }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Products</h2>

      {loading ? (
        <div className="text-center text-gray-600">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600">
          {selectedBranch ? 'No products available' : 'Please select a branch'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                KES {product.price}
              </p>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="1"
                  value={getQuantity(product._id)}
                  onChange={(e) =>
                    setQuantity(product._id, parseInt(e.target.value) || 1)
                  }
                  className="w-16 px-2 py-1 border border-gray-300 rounded"
                />
                <button
                  onClick={() => {
                    onAddToCart(product, getQuantity(product._id));
                    setQuantity(product._id, 1);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}