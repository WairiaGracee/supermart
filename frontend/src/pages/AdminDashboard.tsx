// src/pages/AdminDashboard.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/adminService';
import { reportService } from '../services/reportService';
import type { Branch, SalesReport } from '../types';
import { InventoryView } from '../components/admin/InventoryView';
import { SalesReport as SalesReportComponent } from '../components/admin/SalesReport';
import { RestockForm } from '../components/admin/RestockForm';
import { ReportFilters } from '../components/admin/ReportFilters';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'inventory' | 'reports'>('inventory');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [inventory, setInventory] = useState<Record<string, unknown>[]>([]);
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await adminService.getBranches();
        setBranches(data);
        if (data.length > 0) {
          setSelectedBranch(data[0]._id);
        }
      } catch (error) {
        console.error('Failed to load branches:', error);
      }
    };
    loadBranches();
  }, []);

  useEffect(() => {
    if (activeTab === 'inventory' && selectedBranch) {
      const loadInventory = async () => {
        try {
          setLoading(true);
          const data = await adminService.getBranchInventory(selectedBranch);
          const inventoryData = Array.isArray(data?.inventory) ? data.inventory : [];
          setInventory(inventoryData as Record<string, unknown>[]);
        } catch (error) {
          console.error('Failed to load inventory:', error);
        } finally {
          setLoading(false);
        }
      };
      loadInventory();
    }
  }, [activeTab, selectedBranch]);

  const loadReport = async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      const data = await reportService.getSalesSummary(startDate, endDate);
      setReport(data);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'reports') {
      loadReport();
    }
  }, [activeTab]);

  const handleRestockSuccess = async () => {
    if (selectedBranch) {
      try {
        const data = await adminService.getBranchInventory(selectedBranch);
        const inventoryData = Array.isArray(data?.inventory) ? data.inventory : [];
        setInventory(inventoryData as Record<string, unknown>[]);
      } catch (error) {
        console.error('Failed to reload inventory:', error);
      }
    }
  };

  const selectedBranchData = branches.find(b => b._id === selectedBranch);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">{user?.name}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'inventory'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Inventory
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'reports'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Reports
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
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'inventory'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'reports'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Reports
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Branch Selector Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Branch Management</h2>
                    <p className="text-sm text-gray-500">
                      {selectedBranchData ? `${selectedBranchData.name} - ${selectedBranchData.location}` : 'Select a branch'}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="appearance-none w-full md:w-64 px-4 py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 font-medium focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 cursor-pointer"
                  >
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
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
            </div>

            {/* Inventory & Restock Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InventoryView inventory={inventory} loading={loading} />
              </div>
              <div>
                <RestockForm
                  branchId={selectedBranch}
                  onRestockSuccess={handleRestockSuccess}
                />
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fadeIn">
            <ReportFilters onApplyFilters={loadReport} loading={loading} />
            <SalesReportComponent report={report} loading={loading} />
          </div>
        )}
      </div>
    </div>
  );
}
