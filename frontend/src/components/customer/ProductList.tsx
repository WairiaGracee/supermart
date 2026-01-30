// src/components/customer/ProductList.tsx

import React, { useState } from 'react';
import type { Product } from '../../types';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  selectedBranch: string;
  selectedBranchName?: string;
  onAddToCart: (product: Product, quantity: number) => void;
}

const productImages: Record<string, string> = {
  'Coke': 'from-red-500 to-red-700',
  'Fanta': 'from-orange-400 to-orange-600',
  'Sprite': 'from-green-400 to-green-600',
};

const productIcons: Record<string, React.ReactNode> = {
  'Coke': (
    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 3h14l-1.5 15a2 2 0 01-2 2h-7a2 2 0 01-2-2L5 3zm2.5 2l1 11h7l1-11h-9z"/>
    </svg>
  ),
  'Fanta': (
    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 3h14l-1.5 15a2 2 0 01-2 2h-7a2 2 0 01-2-2L5 3zm2.5 2l1 11h7l1-11h-9z"/>
    </svg>
  ),
  'Sprite': (
    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 3h14l-1.5 15a2 2 0 01-2 2h-7a2 2 0 01-2-2L5 3zm2.5 2l1 11h7l1-11h-9z"/>
    </svg>
  ),
};

export function ProductList({
  products,
  loading,
  selectedBranch,
  selectedBranchName,
  onAddToCart,
}: ProductListProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQuantity = (productId: string) => quantities[productId] || 1;

  const setQuantity = (productId: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(1, quantity) }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!selectedBranch) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Branch</h3>
          <p className="text-gray-500">Choose your preferred branch to see available products</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Available</h3>
          <p className="text-gray-500">This branch currently has no products in stock</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          {selectedBranchName && (
            <p className="text-sm text-gray-500">Available at {selectedBranchName}</p>
          )}
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {products.length} items
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
          >
            {/* Product Image/Color Header */}
            <div className={`h-32 bg-gradient-to-br ${productImages[product.name] || 'from-gray-400 to-gray-600'} flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              {productIcons[product.name] || (
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  KES <span className="text-blue-600">{product.price}</span>
                </span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">
                  In Stock
                </span>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex gap-2">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(product._id, getQuantity(product._id) - 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={getQuantity(product._id)}
                    onChange={(e) =>
                      setQuantity(product._id, parseInt(e.target.value) || 1)
                    }
                    className="w-12 text-center border-0 focus:ring-0 font-semibold text-gray-900"
                  />
                  <button
                    onClick={() => setQuantity(product._id, getQuantity(product._id) + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600 font-bold"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => {
                    onAddToCart(product, getQuantity(product._id));
                    setQuantity(product._id, 1);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
