'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Muat keranjang dari localStorage saat pertama kali dirender (sisi klien)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mystore-cart') || '[]');
      setItems(saved);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mystore-cart', JSON.stringify(items));
  }, [items]);

  function addItem(product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function setQty(id, qty) {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const total = useMemo(() => items.reduce((s, i) => s + i.qty * i.price, 0), [items]);

  return (
    <CartContext.Provider value={{ items, count, total, addItem, setQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
