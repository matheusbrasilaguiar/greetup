"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface OrderItem {
  id: string;
  quantity: number;
  notes: string | null;
  status: string;
  product: { id: string; name: string; category: string };
}

export interface Order {
  id: string;
  status: string;
  createdAt: string;
  session: {
    id: string;
    table: { id: string; code: string };
    attendant: { id: string; name: string } | null;
  };
  items: OrderItem[];
}

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/orders");
      return res.data;
    },
    refetchInterval: 8_000,
  });
}

export function useOrderItems() {
  return useQuery<OrderItem[]>({
    queryKey: ["order-items"],
    queryFn: async () => {
      const res = await api.get("/orders/items");
      return res.data;
    },
    refetchInterval: 8_000,
  });
}
