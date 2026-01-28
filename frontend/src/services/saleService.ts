// src/services/saleService.ts

import api from './api';
import type { Product, Sale } from '../types';

interface SaleResponse {
  success: boolean;
  message: string;
  data?: {
    products?: Product[];
    purchases?: Sale[];
    saleId?: string;
    checkoutRequestID?: string;
    totalAmount?: number;
  } | Sale;
  saleId?: string;
  checkoutRequestID?: string;
  totalAmount?: number;
  products?: Product[];
  purchases?: Sale[];
}

export const saleService = {
  getAvailableProducts: async (branchId: string): Promise<Product[]> => {
    const response = await api.get<SaleResponse>(
      `/sales/available-products/${branchId}`
    );
    const data = response.data.data;
    const products = (data && typeof data === 'object' && 'products' in data) 
      ? data.products 
      : response.data.products;
    return Array.isArray(products) ? products : [];
  },

  initiateMpesaPayment: async (
    branchId: string,
    productId: string,
    quantity: number,
    phoneNumber: string
  ): Promise<{ saleId: string; checkoutRequestID: string; totalAmount: number }> => {
    const response = await api.post<SaleResponse>('/sales/initiate-payment', {
      branchId,
      productId,
      quantity,
      phoneNumber,
    });
    const data = response.data.data;
    return {
      saleId: response.data.saleId || (data && typeof data === 'object' && 'saleId' in data ? data.saleId as string : '') || '',
      checkoutRequestID: response.data.checkoutRequestID || (data && typeof data === 'object' && 'checkoutRequestID' in data ? data.checkoutRequestID as string : '') || '',
      totalAmount: response.data.totalAmount || (data && typeof data === 'object' && 'totalAmount' in data ? data.totalAmount as number : 0) || 0,
    };
  },

  confirmPayment: async (
    saleId: string,
    mpesaReceiptNumber?: string
  ): Promise<Sale> => {
    const response = await api.post<SaleResponse>('/sales/confirm-payment', {
      saleId,
      mpesaReceiptNumber,
    });
    return (response.data.data as unknown as Sale) || ({} as Sale);
  },

  getMyPurchases: async (): Promise<Sale[]> => {
    const response = await api.get<SaleResponse>('/sales/my-purchases');
    const data = response.data.data;
    const purchases = (data && typeof data === 'object' && 'purchases' in data)
      ? data.purchases
      : response.data.purchases;
    return Array.isArray(purchases) ? purchases : [];
  },
};