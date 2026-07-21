"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface TableSession {
  id: string;
  openedAt: string;
  durationMinutes: number;
  tableId: string;
  attendantId: string;
  customer: { id: string; name: string; employer?: string | null } | null;
  attendant: { id: string; name: string };
}

export interface Table {
  id: string;
  code: string;
  status: "OPEN" | "OCCUPIED" | "CLOSED";
  activeSession: TableSession | null;
}

export function useTables() {
  return useQuery<Table[]>({
    queryKey: ["tables"],
    queryFn: async () => {
      const res = await api.get("/tables");
      return res.data;
    },
    refetchInterval: 30_000,
  });
}
