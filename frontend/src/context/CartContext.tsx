// src/context/CartContext.tsx

import { createContext, useState, type ReactNode } from 'react';
import type { CartItem, CartContextType } from '../types';

// Create context but DON'T export it - only the provider and hook
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const saveCart = (newItems: CartItem[]): void => {
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const addToCart = (item: CartItem): void => {
    const existing = items.find((i) => i.productId === item.productId && i.branchId === item.branchId);

    if (existing) {
      const updated = items.map((i) =>
        i.productId === item.productId && i.branchId === item.branchId
          ? {
              ...i,
              quantity: i.quantity + item.quantity,
              totalPrice: (i.quantity + item.quantity) * i.price,
            }
          : i
      );
      saveCart(updated);
    } else {
      saveCart([...items, item]);
    }
  };

  const removeFromCart = (productId: string): void => {
    saveCart(items.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      const updated = items.map((i) =>
        i.productId === productId
          ? { ...i, quantity, totalPrice: quantity * i.price }
          : i
      );
      saveCart(updated);
    }
  };

  const clearCart = (): void => {
    saveCart([]);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Export this for use in hooks file
export { CartContext };