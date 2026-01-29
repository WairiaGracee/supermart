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
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <label className="block text-gray-700 font-semibold mb-2">
        Select Branch:
      </label>
      <select
        value={selectedBranch}
        onChange={(e) => onBranchChange(e.target.value)}
        disabled={loading}
        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
      >
        <option value="">Choose a branch</option>
        {branches.map((branch) => (
          <option key={branch._id} value={branch._id}>
            {branch.name} - {branch.location}
          </option>
        ))}
      </select>
    </div>
  );
}