"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: "COMIDA" | "BEBIDA";
  subcategory: string | null;
  price: number | null;
  active: boolean;
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    },
    staleTime: 60_000,
  });
}
