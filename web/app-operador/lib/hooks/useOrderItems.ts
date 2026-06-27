"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export type ItemStatus = "PENDENTE" | "EM_PREPARO" | "PRONTO" | "ENTREGUE" | "CANCELADO";

export interface OrderItem {
  id: string;
  orderId: string;
  quantity: number;
  notes: string | null;
  status: ItemStatus;
  createdAt: string;
  product: { id: string; name: string; category: string; price: number | null };
  order: {
    id: string;
    session: {
      customer: { id: string; name: string } | null;
    };
  };
}

export function useOrderItems(status?: ItemStatus) {
  return useQuery<OrderItem[]>({
    queryKey: ["order-items", status],
    queryFn: async () => {
      const url = status ? `/orders/items?status=${status}` : "/orders/items";
      const res = await api.get(url);
      return res.data;
    },
    refetchInterval: 10_000,
  });
}

export function useAdvanceItemStatus() {
  const qc = useQueryClient();
  return async (orderId: string, itemId: string, status: ItemStatus) => {
    await api.patch(`/orders/${orderId}/items/${itemId}/status`, { status });
    qc.invalidateQueries({ queryKey: ["order-items"] });
  };
}
