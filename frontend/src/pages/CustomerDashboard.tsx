// src/pages/CustomerDashboard.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { saleService } from '../services/saleService';
import { adminService } from '../services/adminService';
import type { Product, Branch } from '../types';
import { BranchSelector } from '../components/customer/BranchSelector';
import { ProductList } from '../components/customer/ProductList';
import { CartSummary } from '../components/customer/CartItem';
import { PurchaseHistory } from '../components/customer/PurchaseHistory';

export function CustomerDashboard() {
  const { user, logout } = useAuth();
  const { items, addToCart, clearCart } = useCart();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await adminService.getBranches();
        setBranches(data);
        if (user?.branch) {
          setSelectedBranch(user.branch);
        }
      } catch (error) {
        console.error('Failed to load branches:', error);
      }
    };
    loadBranches();
  }, [user]);

  useEffect(() => {
    if (!selectedBranch) return;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await saleService.getAvailableProducts(selectedBranch);
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedBranch]);

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart({
      productId: product._id,
      productName: product.name,
      quantity,
      price: product.price,
      branchId: selectedBranch,
      totalPrice: quantity * product.price,
    });
    setMessage(`${product.name} added to cart!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        <BranchSelector
          branches={branches}
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
          loading={loading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProductList
              products={products}
              loading={loading}
              selectedBranch={selectedBranch}
              onAddToCart={handleAddToCart}
            />
          </div>

          <CartSummary
            items={items}
            totalAmount={totalAmount}
            onClearCart={clearCart}
          />
        </div>

        <div className="mt-8">
          <PurchaseHistory />
        </div>
      </div>
    </div>
  );
}