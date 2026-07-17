"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { GrEventItem } from "./useEvents";

export function useActiveEvent() {
  return useQuery<GrEventItem | null>({
    queryKey: ["active-event"],
    queryFn: async () => {
      const res = await api.get("/events/active");
      return res.data;
    },
    refetchInterval: 30_000,
  });
}
