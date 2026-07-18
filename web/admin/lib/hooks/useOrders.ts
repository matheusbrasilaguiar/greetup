"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface OrderItem {
  id: string;
  quantity: number;
  notes: string | null;
  withCheese: boolean | null;
  courtesy: boolean;
  status: "PENDENTE" | "EM_PREPARO" | "PRONTO" | "ENTREGUE" | "CANCELADO";
  product: { id: string; name: string; category: string; price: number | null };
}

export interface Order {
  id: string;
  /** "OPEN" = em aberto, "CLOSED" = fechado */
  status: "OPEN" | "CLOSED";
  toGo: boolean;
  createdAt: string;
  session: {
    id: string;
    table: { id: string; code: string };
    customer: { id: string; name: string; employer: string | null } | null;
    attendant: { id: string; name: string } | null;
  };
  items: OrderItem[];
}

export function useOrders(eventId?: string) {
  return useQuery<Order[]>({
    queryKey: ["orders", eventId],
    queryFn: async () => {
      const params = eventId ? `?eventId=${eventId}` : "";
      const res = await api.get(`/orders${params}`);
      return res.data;
    },
    refetchInterval: 8_000,
  });
}

export function useOrderItems(eventId?: string) {
  return useQuery<(OrderItem & { order: { session: { table: { code: string } } } })[]>({
    queryKey: ["order-items", eventId],
    queryFn: async () => {
      const params = eventId ? `?eventId=${eventId}` : "";
      const res = await api.get(`/orders/items${params}`);
      return res.data;
    },
    refetchInterval: 8_000,
  });
}
