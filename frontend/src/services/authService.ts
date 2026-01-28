// src/services/authService.ts

import api from './api';
import type { User } from '../types';

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export const authService = {
  register: async (
    name: string,
    email: string,
    password: string,
    phone: string,
    role: string = 'customer',
    branch?: string
  ): Promise<{ token: string; user: User }> => {
    const response = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
      phone,
      role,
      branch,
    });
    return {
      token: response.data.token || '',
      user: response.data.user || ({} as User),
    };
  },

  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return {
      token: response.data.token || '',
      user: response.data.user || ({} as User),
    };
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<{ success: boolean; user: User }>('/auth/me');
    return response.data.user;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};