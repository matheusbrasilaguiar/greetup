"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface GrEventItem {
  id: string;
  name: string;
  date: string;
  status: "DRAFT" | "ACTIVE" | "CLOSED";
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export function useEvents() {
  return useQuery<GrEventItem[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await api.get("/events");
      return res.data;
    },
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; date?: string }) => api.post("/events", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useActivateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/events/${id}/activate`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["active-event"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order-items"] });
      qc.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}

export function useCloseEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/events/${id}/close`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["active-event"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order-items"] });
      qc.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}
