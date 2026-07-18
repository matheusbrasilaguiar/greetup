"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  price: number | null;
  active: boolean;
  companyId: string;
}

export interface ProductPayload {
  name: string;
  description?: string;
  category: string;
  subcategory?: string | null;
  price?: number | null;
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductPayload) => api.post("/products", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<ProductPayload & { active: boolean }>) =>
      api.patch(`/products/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
