"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface OrderItem {
  id: string;
  orderId: string;
  quantity: number;
  notes: string | null;
  withCheese: boolean | null;
  courtesy: boolean;
  status: "PENDENTE" | "EM_PREPARO" | "PRONTO" | "ENTREGUE";
  createdAt: string;
  updatedAt: string;
  product: { id: string; name: string; category: string };
}

export interface Order {
  id: string;
  status: "OPEN" | "CLOSED" | "CANCELED";
  toGo: boolean;
  createdAt: string;
  sessionId: string;
  session: {
    id: string;
    tableId: string;
    table: { id: string; code: string };
    customer: { id: string; name: string } | null;
    attendant: { id: string; name: string };
  };
  items: OrderItem[];
}

export function useSessionOrders(sessionId: string) {
  return useQuery<Order[]>({
    queryKey: ["orders", "session", sessionId],
    queryFn: async () => {
      const res = await api.get(`/orders?sessionId=${sessionId}`);
      return res.data;
    },
    refetchInterval: 15_000,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      sessionId: string;
      items: { productId: string; quantity: number; notes?: string }[];
    }) => api.post<Order>("/orders", data).then((r) => r.data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["orders", "session", vars.sessionId] });
    },
  });
}

export function useCloseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => api.patch(`/orders/${orderId}/close`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}
