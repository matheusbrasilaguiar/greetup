"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  employer: string | null;
}

export function useCustomerSearch(q: string) {
  return useQuery<Customer[]>({
    queryKey: ["customers", q],
    queryFn: async () => {
      if (!q.trim()) return [];
      const res = await api.get(`/customers?q=${encodeURIComponent(q)}`);
      return res.data;
    },
    enabled: q.trim().length >= 2,
    staleTime: 10_000,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; employer?: string; email?: string; phone?: string }) =>
      api.post<Customer>("/customers", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
}
