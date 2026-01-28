// src/services/adminService.ts

import api from './api';
import type { Branch, Stock } from '../types';

interface AdminResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  branches?: Branch[];
  inventory?: Array<Record<string, unknown>>;
  stocks?: Stock[];
}

export const adminService = {
  getBranches: async (): Promise<Branch[]> => {
    const response = await api.get<AdminResponse>('/admin/branches');
    const branches = response.data.data?.branches || response.data.branches;
    return Array.isArray(branches) ? branches : [];
  },

  getAllInventory: async (): Promise<Array<Record<string, unknown>>> => {
    const response = await api.get<AdminResponse>('/admin/inventory');
    const inventory = response.data.data?.inventory || response.data.inventory;
    return Array.isArray(inventory) ? inventory : [];
  },

  getBranchInventory: async (branchId: string): Promise<Record<string, unknown>> => {
    const response = await api.get<AdminResponse>(
      `/admin/inventory/${branchId}`
    );
    const data = response.data.data || response.data;
    return typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : {};
  },

  initializeStock: async (
    branchId: string,
    stocks: Array<{ productId: string; quantity: number }>
  ): Promise<Stock[]> => {
    const response = await api.post<AdminResponse>('/admin/initialize-stock', {
      branchId,
      stocks,
    });
    const createdStocks = response.data.data?.stocks || response.data.stocks;
    return Array.isArray(createdStocks) ? createdStocks : [];
  },

  restock: async (
    branchId: string,
    productId: string,
    quantity: number
  ): Promise<Record<string, unknown>> => {
    const response = await api.post<AdminResponse>('/admin/restock', {
      branchId,
      productId,
      quantity,
    });
    const data = response.data.data || response.data;
    return typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : {};
  },

  updateStock: async (stockId: string, quantity: number): Promise<Record<string, unknown>> => {
    const response = await api.put<AdminResponse>(`/admin/stock/${stockId}`, {
      quantity,
    });
    const data = response.data.data || response.data;
    return typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : {};
  },
};