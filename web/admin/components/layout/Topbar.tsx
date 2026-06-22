"use client";

import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tables": "Mesas ao vivo",
  "/tables/config": "Configuração de mesas",
  "/orders": "Pedidos",
  "/products": "Produtos",
  "/clients": "Clientes",
  "/users": "Usuários",
  "/reports/consumption": "Relatório de consumo",
  "/reports/clients": "Relatório de clientes",
  "/reports/managers": "Relatório de gerentes",
  "/reports/summary": "Resumo do evento",
};

export function Topbar() {
  const pathname = usePathname();
  const title = LABELS[pathname] ?? "Admin";

  return (
    <header className="h-14 border-b border-cream-200 bg-white flex items-center px-6 gap-4">
      <h2 className="font-sans text-sm font-medium text-ink-900 flex-1">{title}</h2>
      <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-[var(--gu-ready-tx)] bg-[var(--gu-ready-bg)] border border-[var(--gu-ready-br)] px-2.5 py-1 rounded-full uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--gu-ready-tx)] animate-pulse" />
        Ao vivo
      </span>
    </header>
  );
}
