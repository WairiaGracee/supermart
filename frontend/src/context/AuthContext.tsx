// src/context/AuthContext.tsx

import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import { authService } from '../services/authService';

// Create context but DON'T export it - only the provider and hook
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const { token, user } = await authService.login(email, password);
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    role: string,
    branch?: string
  ): Promise<void> => {
    try {
      setLoading(true);
      const { token, user } = await authService.register(name, email, password, phone, role, branch);
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Export this for use in hooks file
export { AuthContext };