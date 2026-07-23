"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

interface BreadcrumbDef {
  section: string;
  page: string;
}

const BREADCRUMBS: Record<string, BreadcrumbDef> = {
  "/dashboard":          { section: "Evento ao vivo", page: "Dashboard" },
  "/tables":             { section: "Evento ao vivo", page: "Mesas ao vivo" },
  "/orders":             { section: "Evento ao vivo", page: "Pedidos" },
  "/users":              { section: "Configuração", page: "Usuários" },
  "/products":           { section: "Configuração", page: "Produtos" },
  "/tables/config":      { section: "Configuração", page: "Mesas" },
  "/clients":            { section: "Configuração", page: "Clientes" },
  "/reports/consumption":{ section: "Relatórios", page: "Consumo" },
  "/reports/clients":    { section: "Relatórios", page: "Clientes" },
  "/reports/managers":   { section: "Relatórios", page: "Gerentes" },
  "/reports/summary":    { section: "Relatórios", page: "Resumo" },
};

function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function tick() {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      setTime(`${hh}:${mm}`);
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return <>{time}</>;
}

export function Topbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const pathname = usePathname();
  const crumb = BREADCRUMBS[pathname] ?? { section: "Admin", page: "" };

  return (
    <header className="sticky top-0 z-10 flex items-center h-[60px] px-4 lg:px-8 gap-3 lg:gap-4 bg-card border-b border-border">
      {/* Hamburger (mobile only) */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden flex items-center justify-center shrink-0 rounded transition-colors p-1.5 text-muted-foreground hover:bg-muted"
        aria-label="Abrir menu"
      >
        <Menu size={20} strokeWidth={1.6} />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.14em] uppercase flex-1 min-w-0">
        <span className="text-muted-foreground">Greetup</span>
        <span className="text-muted-foreground/50">›</span>
        <span className="text-muted-foreground">{crumb.section}</span>
        {crumb.page && (
          <>
            <span className="text-muted-foreground/50">›</span>
            <span className="text-primary">{crumb.page}</span>
          </>
        )}
      </div>

      {/* Relógio */}
      <span className="hidden sm:inline font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground shrink-0">
        Estande · <LiveClock />
      </span>
    </header>
  );
}
