"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface TableSession {
  id: string;
  openedAt: string;
  closedAt: string | null;
  customer: { id: string; name: string; employer: string | null } | null;
  attendant: { id: string; name: string } | null;
}

export interface Table {
  id: string;
  code: string;
  capacity: number;
  status: string;
  activeSession: TableSession | null;
}

export function useTables() {
  return useQuery<Table[]>({
    queryKey: ["tables"],
    queryFn: async () => {
      const res = await api.get("/tables");
      return res.data;
    },
    refetchInterval: 8_000,
  });
}

export function useCreateTable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { code: string; capacity: number }) => api.post("/tables", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tables"] }),
  });
}

export function useUpdateTableStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/tables/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tables"] }),
  });
}
