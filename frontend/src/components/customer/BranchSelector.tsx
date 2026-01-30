// src/components/customer/BranchSelector.tsx

import type { Branch } from '../../types';

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranch: string;
  onBranchChange: (branchId: string) => void;
  loading?: boolean;
}

export function BranchSelector({
  branches,
  selectedBranch,
  onBranchChange,
  loading = false,
}: BranchSelectorProps) {
  const selectedBranchData = branches.find(b => b._id === selectedBranch);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Shopping Location</h2>
            {selectedBranchData && (
              <p className="text-sm text-gray-500">{selectedBranchData.location}</p>
            )}
          </div>
        </div>

        <div className="relative">
          <select
            value={selectedBranch}
            onChange={(e) => onBranchChange(e.target.value)}
            disabled={loading}
            className="appearance-none w-full sm:w-64 px-4 py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 font-medium focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Choose a branch</option>
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
  );
}
