"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export type ItemStatus = "PENDENTE" | "EM_PREPARO" | "PRONTO" | "ENTREGUE" | "CANCELADO";

export interface OrderItem {
  id: string;
  orderId: string;
  quantity: number;
  notes: string | null;
  withCheese: boolean | null;
  courtesy: boolean;
  status: ItemStatus;
  createdAt: string;
  product: { id: string; name: string; category: string; price: number | null };
  order: {
    id: string;
    toGo: boolean;
    session: {
      customer: { id: string; name: string } | null;
    };
  };
}

export function useOrderItems(status?: ItemStatus | null, eventId?: string) {
  return useQuery<OrderItem[]>({
    queryKey: ["order-items", status, eventId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (eventId) params.set("eventId", eventId);
      const qs = params.toString();
      const res = await api.get(qs ? `/orders/items?${qs}` : "/orders/items");
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
