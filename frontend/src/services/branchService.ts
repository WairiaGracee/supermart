// src/services/branchService.ts

import api from './api';
import type { Branch } from '../types';

interface BranchResponse {
  success: boolean;
  count: number;
  branches: Branch[];
}

export const branchService = {
  // Public endpoint - no auth required
  getBranches: async (): Promise<Branch[]> => {
    const response = await api.get<BranchResponse>('/branches');
    return response.data.branches || [];
  },
};
