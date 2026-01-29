// src/services/branchService.ts

import api from './api';
import type { Branch } from '../types';

interface BranchResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  branches?: Branch[];
  inventory?: Array<Record<string, unknown>>;
}

export const branchService = {
  getBranches: async (): Promise<Branch[]> => {
    const response = await api.get<BranchResponse>('/branches');
    const branches = response.data.data?.branches || response.data.branches;
    return Array.isArray(branches) ? branches : [];
  },

  getBranchInventory: async (branchId: string): Promise<Record<string, unknown>> => {
    const response = await api.get<BranchResponse>(`/branches/${branchId}/inventory`);
    const data = response.data.data || response.data;
    return typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : {};
  },
};