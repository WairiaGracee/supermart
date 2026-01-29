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
    <div className="bg-white rounded-lg shadow p-6 h-fit">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Shopping Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-600 text-center py-4">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.productId} className="border-b pb-2">
                <p className="font-semibold text-gray-800">{item.productName}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity} x KES {item.price} = KES {item.totalPrice}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-4">
            <div className="flex justify-between text-lg font-bold text-gray-800">
              <span>Total:</span>
              <span className="text-blue-600">KES {totalAmount}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition mb-2"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={onClearCart}
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}