"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface OrderItem {
  id: string;
  quantity: number;
  notes: string | null;
  status: "PENDENTE" | "EM_PREPARO" | "PRONTO" | "ENTREGUE" | "CANCELADO";
  product: { id: string; name: string; category: string };
}

export interface Order {
  id: string;
  /** "OPEN" = em aberto, "CLOSED" = fechado */
  status: "OPEN" | "CLOSED";
  createdAt: string;
  session: {
    id: string;
    table: { id: string; code: string };
    customer: { id: string; name: string; employer: string | null } | null;
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
  return useQuery<(OrderItem & { order: { session: { table: { code: string } } } })[]>({
    queryKey: ["order-items"],
    queryFn: async () => {
      const res = await api.get("/orders/items");
      return res.data;
    },
    refetchInterval: 8_000,
  });
}
