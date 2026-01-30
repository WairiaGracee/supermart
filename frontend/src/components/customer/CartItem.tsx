// src/components/customer/CartSummary.tsx

import { useNavigate } from 'react-router-dom';
import type { CartItem } from '../../types';

interface CartSummaryProps {
  items: CartItem[];
  totalAmount: number;
  onClearCart: () => void;
}

export function CartSummary({ items, totalAmount, onClearCart }: CartSummaryProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
              <p className="text-xs text-gray-500">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          {items.length > 0 && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
              KES {totalAmount}
            </span>
          )}
        </div>
      </div>

      {/* Cart Content */}
      <div className="p-4">
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Cart is Empty</h3>
            <p className="text-sm text-gray-500">Add products to get started</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4 pr-1">
              {items.map((item, index) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x KES {item.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">KES {item.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-white">KES {totalAmount}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Checkout with M-Pesa
              </button>
              <button
                onClick={onClearCart}
                className="w-full bg-white hover:bg-red-50 border-2 border-gray-200 hover:border-red-200 text-gray-700 hover:text-red-600 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
