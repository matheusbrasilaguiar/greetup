"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Package,
  LayoutGrid,
  BarChart2,
  Radio,
  ClipboardList,
  GlassWater,
  UserCheck,
  Award,
  FileText,
  LogOut,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useActiveEvent } from "@/lib/hooks/useActiveEvent";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    title: "Configuração",
    items: [
      { label: "Eventos", href: "/events", icon: CalendarDays },
      { label: "Usuários", href: "/users", icon: Users },
      { label: "Produtos", href: "/products", icon: Package },
      { label: "Mesas", href: "/tables/config", icon: LayoutGrid },
    ],
  },
  {
    title: "Evento",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: BarChart2, exact: true },
      { label: "Mesas ao vivo", href: "/tables", icon: Radio, exact: true },
      { label: "Pedidos", href: "/orders", icon: ClipboardList },
    ],
  },
  {
    title: "Relatórios",
    items: [
      { label: "Consumo", href: "/reports/consumption", icon: GlassWater },
      { label: "Clientes", href: "/reports/clients", icon: UserCheck },
      { label: "Gerentes", href: "/reports/managers", icon: Award },
      { label: "Resumo", href: "/reports/summary", icon: FileText },
    ],
  },
];

function isItemActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname.startsWith(item.href);
}

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { data: activeEvent } = useActiveEvent();

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-20"
      style={{
        width: 240,
        background: "var(--gu-bordeaux-900)",
        borderRight: "1px solid var(--gu-bordeaux-800)",
      }}
    >
      {/* Wordmark */}
      <div
        className="flex items-center gap-3 px-[18px] pt-5 pb-[22px]"
        style={{ borderBottom: "1px solid var(--gu-bordeaux-800)" }}
      >
        {/* Arch symbol */}
        <svg viewBox="0 0 120 120" width="36" height="36" aria-hidden="true" style={{ flexShrink: 0 }}>
          <path d="M18 102 V54 a42 42 0 0 1 84 0 V102" fill="none" stroke="#F5EEDE" strokeWidth="4.2" strokeLinecap="round" />
          <circle cx="60" cy="64" r="6.6" fill="#D9B58A" />
        </svg>
        <div>
          <span
            className="font-mono uppercase tracking-[0.18em] block"
            style={{ fontSize: 9, color: "var(--gu-bordeaux-300)", lineHeight: 1.4 }}
          >
            Admin
          </span>
          <span
            className="font-sans font-semibold tracking-[-0.022em] block"
            style={{ fontSize: 18, color: "var(--gu-cream-50)", lineHeight: 1.1 }}
          >
            GreetUp
          </span>
        </div>
      </div>

      {/* Active event badge */}
      <Link
        href="/events"
        className="mx-3 my-2 px-3 py-2 rounded-lg flex items-center gap-2"
        style={{ background: "var(--gu-bordeaux-800)" }}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{
            background: activeEvent ? "#22C55E" : "var(--gu-bordeaux-400)",
            boxShadow: activeEvent ? "0 0 0 3px rgba(34,197,94,.2)" : "none",
          }}
        />
        <span className="text-[11.5px] truncate" style={{ color: activeEvent ? "var(--gu-cream-100)" : "var(--gu-bordeaux-400)" }}>
          {activeEvent ? activeEvent.name : "Sem evento ativo"}
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5">
        {NAV.map((group) => (
          <div key={group.title} className="mb-3">
            <p
              className="font-mono text-[9.5px] uppercase tracking-[0.18em] px-3 mb-1"
              style={{ color: "var(--gu-bordeaux-300)" }}
            >
              {group.title}
            </p>
            {group.items.map((item) => {
              const active = isItemActive(pathname, item);
              const Icon = item.icon;
              const isDashboard = item.href === "/dashboard";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg text-[13px] transition-colors mb-0.5 relative ${
                    active ? "font-medium" : ""
                  }`}
                  style={{
                    color: active
                      ? "var(--gu-cream-50)"
                      : "var(--gu-cream-200)",
                    background: active
                      ? "var(--gu-bordeaux-800)"
                      : "transparent",
                    borderLeft: active
                      ? "2px solid var(--gu-champagne)"
                      : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background =
                        "var(--gu-bordeaux-800)";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--gu-cream-50)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--gu-cream-200)";
                    }
                  }}
                >
                  <Icon size={15} strokeWidth={1.6} />
                  <span className="flex-1">{item.label}</span>
                  {isDashboard && (
                    <span
                      className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                      style={{
                        background: "#22C55E",
                        boxShadow: "0 0 0 3px rgba(34,197,94,.2)",
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="p-3.5"
        style={{ borderTop: "1px solid var(--gu-bordeaux-800)" }}
      >
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg text-[13px] transition-colors"
          style={{ color: "var(--gu-bordeaux-300)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "var(--gu-bordeaux-800)";
            (e.currentTarget as HTMLElement).style.color = "var(--gu-cream-50)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color =
              "var(--gu-bordeaux-300)";
          }}
        >
          <LogOut size={15} strokeWidth={1.6} />
          <span>Sair</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </aside>
  );
}
