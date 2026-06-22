"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Customer {
  id: string;
  name: string;
  employer: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
}

export function useClients() {
  return useQuery<Customer[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await api.get("/customers");
      return res.data;
    },
  });
}

export function useClientById(id: string | null) {
  return useQuery<Customer>({
    queryKey: ["clients", id],
    queryFn: async () => {
      const res = await api.get(`/customers/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}
