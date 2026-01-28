// src/services/reportService.ts

import api from './api';
import type { SalesReport } from '../types';

interface ReportResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  report?: SalesReport;
  products?: Array<Record<string, unknown>>;
}

export const reportService = {
  getSalesSummary: async (startDate?: string, endDate?: string): Promise<SalesReport> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await api.get<ReportResponse>(`/reports/sales-summary?${params}`);
    const report = response.data.data?.report || response.data.report;
    return typeof report === 'object' && report !== null ? (report as SalesReport) : {} as SalesReport;
  },

  getSalesByProduct: async (productId: string, startDate?: string, endDate?: string): Promise<Record<string, unknown>> => {
    const params = new URLSearchParams({ productId });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await api.get<ReportResponse>(`/reports/sales-by-product?${params}`);
    const data = response.data.data || response.data;
    return typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : {};
  },

  getSalesByBranch: async (branchId: string, startDate?: string, endDate?: string): Promise<Record<string, unknown>> => {
    const params = new URLSearchParams({ branchId });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await api.get<ReportResponse>(`/reports/sales-by-branch?${params}`);
    const data = response.data.data || response.data;
    return typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : {};
  },

  getProducts: async (): Promise<Array<Record<string, unknown>>> => {
    const response = await api.get<ReportResponse>('/reports/products');
    const products = response.data.data?.products || response.data.products;
    return Array.isArray(products) ? products : [];
  },
};