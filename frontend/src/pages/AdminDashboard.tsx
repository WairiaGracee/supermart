// src/pages/AdminDashboard.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { branchService } from '../services/branchService';
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
        const data = await branchService.getBranches();
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
          const data = await branchService.getBranchInventory(selectedBranch);
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
        const data = await branchService.getBranchInventory(selectedBranch);
        const inventoryData = Array.isArray(data?.inventory) ? data.inventory : [];
        setInventory(inventoryData as Record<string, unknown>[]);
      } catch (error) {
        console.error('Failed to reload inventory:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-blue-100">Welcome, {user?.name}!</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'inventory'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Inventory Management
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'reports'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Sales Reports
          </button>
        </div>

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Branch Selection</h2>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Select Branch:</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <InventoryView inventory={inventory} loading={loading} />

            <RestockForm
              branchId={selectedBranch}
              onRestockSuccess={handleRestockSuccess}
            />
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <ReportFilters onApplyFilters={loadReport} loading={loading} />
            <SalesReportComponent report={report} loading={loading} />
          </div>
        )}
      </div>
    </div>
  );
}