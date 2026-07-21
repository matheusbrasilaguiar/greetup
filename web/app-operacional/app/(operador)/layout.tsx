"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUser } from "@/lib/auth";

export default function OperadorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const user = getUser();
    if (!token || !user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "OPERADOR") {
      // GERENTE tentando acessar área de Operador
      router.replace("/mesas");
    }
  }, [router]);

  return <>{children}</>;
}
