"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { getUser } from "@/lib/auth";

export function useOpenSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tableId,
      customerId,
    }: {
      tableId: string;
      customerId: string;
    }) => {
      const user = getUser();
      const res = await api.post(`/tables/${tableId}/sessions`, {
        attendantId: user?.id,
        customerId,
      });
      return res.data as { id: string };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tables"] }),
  });
}

export function useCloseSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tableId, sessionId }: { tableId: string; sessionId: string }) =>
      api.patch(`/tables/${tableId}/sessions/${sessionId}/close`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tables"] }),
  });
}
