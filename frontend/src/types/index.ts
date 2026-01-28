// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone: string;
  branch?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string, role: string, branch?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface Branch {
  _id: string;
  name: string;
  location: string;
  isHeadquarter: boolean;
}

export interface Product {
  _id: string;
  name: 'Coke' | 'Fanta' | 'Sprite';
  price: number;
  description?: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  branchId: string;
  totalPrice: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
}

export interface Sale {
  _id: string;
  customer: string;
  branch: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  mpesaTransactionId?: string;
  mpesaReceiptNumber?: string;
  saleDate: Date;
}

export interface Stock {
  _id: string;
  branch: string;
  product: string;
  quantity: number;
  lastRestocked: Date;
}

export interface SalesReport {
  totalSales: number;
  totalIncome: number;
  salesByProduct: Array<{
    productName: string;
    quantity: number;
    income: number;
  }>;
  salesByBranch: Array<{
    branchName: string;
    quantity: number;
    income: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
  user?: User;
}