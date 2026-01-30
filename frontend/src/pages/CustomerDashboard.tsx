// src/pages/CustomerDashboard.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { saleService } from '../services/saleService';
import { branchService } from '../services/branchService';
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
  const [activeTab, setActiveTab] = useState<'shop' | 'history'>('shop');

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await branchService.getBranches();
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
  const selectedBranchName = branches.find(b => b._id === selectedBranch)?.name || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SuperMart</h1>
                <p className="text-xs text-gray-500">Welcome, {user?.name}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('shop')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'shop'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Shop
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'history'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  My Orders
                </button>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <div className="sm:hidden bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'shop'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            My Orders
          </button>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-fadeIn">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'shop' ? (
          <>
            {/* Branch Selector */}
            <BranchSelector
              branches={branches}
              selectedBranch={selectedBranch}
              onBranchChange={setSelectedBranch}
              loading={loading}
            />

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Products */}
              <div className="lg:col-span-2">
                <ProductList
                  products={products}
                  loading={loading}
                  selectedBranch={selectedBranch}
                  selectedBranchName={selectedBranchName}
                  onAddToCart={handleAddToCart}
                />
              </div>

              {/* Cart */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <CartSummary
                    items={items}
                    totalAmount={totalAmount}
                    onClearCart={clearCart}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <PurchaseHistory />
        )}
      </div>
    </div>
  );
}
