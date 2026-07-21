"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Product } from "@/lib/hooks/useProducts";

export interface CartItem {
  productId: string;
  name: string;
  category: string;
  quantity: number;
  notes?: string;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  add: (product: Product) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  setNotes: (productId: string, notes: string) => void;
  clear: () => void;
  quantityOf: (productId: string) => number;
  notesOf: (productId: string) => string;
}

const CartContext = createContext<CartContextValue | null>(null);

function storageKey(tableId: string) {
  return `greetup_cart_${tableId}`;
}

export function CartProvider({ tableId, children }: { tableId: string; children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = sessionStorage.getItem(storageKey(tableId));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Sync to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem(storageKey(tableId), JSON.stringify(items));
  }, [items, tableId]);

  const add = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        { productId: product.id, name: product.name, category: product.category, quantity: 1 },
      ];
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
      );
    }
  }, []);

  const setNotes = useCallback((productId: string, notes: string) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, notes } : i))
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    sessionStorage.removeItem(storageKey(tableId));
  }, [tableId]);

  const quantityOf = useCallback(
    (productId: string) => items.find((i) => i.productId === productId)?.quantity ?? 0,
    [items]
  );

  const notesOf = useCallback(
    (productId: string) => items.find((i) => i.productId === productId)?.notes ?? "",
    [items]
  );

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalItems, add, remove, setQty, setNotes, clear, quantityOf, notesOf }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
