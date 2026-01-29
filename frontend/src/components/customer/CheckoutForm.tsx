// src/components/customer/CheckoutForm.tsx

import { useState } from 'react';
import { saleService } from '../../services/saleService';
import { useCart } from '../../hooks/useCart';
import { ErrorMessage } from '../common/ErrorMessage';

interface CheckoutFormProps {
  onSuccess: () => void;
}

export function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const { items, totalAmount } = useCart();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      for (const item of items) {
        await saleService.initiateMpesaPayment(
          item.branchId,
          item.productId,
          item.quantity,
          phoneNumber
        );
      }
      alert('Payment initiated! Check your phone for M-Pesa prompt.');
      onSuccess();
    } catch (err: unknown) {
      // Check if it's an authentication error
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err instanceof Error ? err.message : 'Payment failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-3">Order Summary</h3>
        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span>{item.productName} x {item.quantity}</span>
              <span>KES {item.totalPrice}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Total:</span>
          <span className="text-blue-600">KES {totalAmount}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          M-Pesa Phone Number
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="254712345678"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        {loading ? 'Processing...' : 'Pay with M-Pesa'}
      </button>
    </form>
  );
}