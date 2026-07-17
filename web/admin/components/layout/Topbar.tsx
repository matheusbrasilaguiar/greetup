"use client";

import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
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
    <header
      className="sticky top-0 z-10 flex items-center px-4 lg:px-8 gap-3 lg:gap-4 bg-white"
      style={{
        height: 60,
        borderBottom: "1px solid var(--gu-cream-200)",
      }}
    >
      {/* Hamburger (mobile only) */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden flex items-center justify-center flex-shrink-0 rounded transition-colors p-1.5"
        style={{ color: "var(--gu-ink-500)" }}
        aria-label="Abrir menu"
      >
        <Menu size={20} strokeWidth={1.6} />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.14em] uppercase flex-1 min-w-0">
        <span style={{ color: "var(--gu-ink-500)" }}>Greetup</span>
        <span style={{ color: "var(--gu-ink-300)" }}>›</span>
        <span style={{ color: "var(--gu-ink-500)" }}>{crumb.section}</span>
        {crumb.page && (
          <>
            <span style={{ color: "var(--gu-ink-300)" }}>›</span>
            <span style={{ color: "var(--gu-bordeaux-700)" }}>{crumb.page}</span>
          </>
        )}
      </div>

      {/* Search (hidden on mobile) */}
      <div
        className="hidden md:flex items-center gap-2 rounded-md px-2.5 py-[7px]"
        style={{
          background: "var(--gu-cream-50)",
          border: "1px solid var(--gu-cream-200)",
          width: 240,
        }}
      >
        <Search size={13} strokeWidth={1.6} style={{ color: "var(--gu-ink-300)", flexShrink: 0 }} />
        <input
          className="flex-1 bg-transparent border-none outline-none text-[13px]"
          style={{ color: "var(--gu-ink-900)" }}
          placeholder="Buscar cliente, mesa, pedido…"
        />
        <span
          className="font-mono text-[10px] px-1 rounded"
          style={{
            color: "var(--gu-ink-500)",
            border: "1px solid var(--gu-cream-200)",
          }}
        >
          ⌘K
        </span>
      </div>

      {/* Event info (hidden on small screens) */}
      <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
        <span className="font-mono text-[10.5px] tracking-[0.1em]" style={{ color: "var(--gu-ink-500)" }}>
          Estande · <LiveClock />
        </span>
        <span
          className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
          style={{
            color: "#15803D",
            background: "#F0FDF4",
            border: "1px solid #22C55E",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#22C55E",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          ao vivo
        </span>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        input::placeholder { color: var(--gu-ink-300); }
      `}</style>
    </header>
  );
}
