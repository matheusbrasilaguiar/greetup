"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUser } from "@/lib/auth";
import { GerenteNav } from "@/components/GerenteNav";

// CartProvider is applied per-page where tableId is available from params.
// This layout only enforces GERENTE role.
export default function GerenteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const user = getUser();
    if (!token || !user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "GERENTE") {
      // OPERADOR tentando acessar área de Gerente
      if (user.operatorFunction === "COZINHA") router.replace("/cozinha");
      else if (user.operatorFunction === "GARCOM") router.replace("/garcom");
      else router.replace("/display");
    }
  }, [router]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">{children}</div>
      <GerenteNav />
    </div>
  );
}
