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
  X,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useActiveEvent } from "@/lib/hooks/useActiveEvent";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

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

export function Sidebar({
  isOpen = false,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { data: activeEvent } = useActiveEvent();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen w-60 flex flex-col z-20 transition-transform duration-300 bg-chrome border-r border-chrome-border",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Wordmark */}
      <div className="flex items-center gap-3 px-[18px] pt-5 pb-[22px] border-b border-chrome-border">
        <Logo size={36} strokeClassName="stroke-chrome-foreground" dotClassName="fill-chrome-accent" />
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-mono uppercase tracking-[0.18em] leading-[1.4] block text-chrome-subtle-foreground">
            Admin
          </span>
          <span className="text-[18px] font-sans font-semibold tracking-[-0.022em] leading-[1.1] block text-chrome-foreground">
            GreetUp
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded shrink-0 transition-colors text-chrome-subtle-foreground hover:text-chrome-foreground"
          aria-label="Fechar menu"
        >
          <X size={18} strokeWidth={1.6} />
        </button>
      </div>

      {/* Active event badge */}
      <Link
        href="/events"
        className="mx-3 my-2 px-3 py-2 rounded-lg flex items-center gap-2 bg-chrome-card hover:bg-chrome-card/80 transition-colors"
      >
        <span
          className={cn(
            "w-2 h-2 rounded-full shrink-0",
            activeEvent ? "bg-status-success-br shadow-[0_0_0_3px_rgba(34,197,94,0.2)]" : "bg-chrome-subtle-foreground"
          )}
        />
        <span className={cn("text-[11.5px] truncate", activeEvent ? "text-chrome-foreground" : "text-chrome-muted-foreground")}>
          {activeEvent ? activeEvent.name : "Sem evento ativo"}
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5">
        {NAV.map((group) => (
          <div key={group.title} className="mb-3">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] px-3 mb-1 text-chrome-subtle-foreground">
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
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg text-[13px] transition-colors mb-0.5 relative border-l-2",
                    active
                      ? "font-medium bg-chrome-card text-chrome-foreground border-chrome-accent"
                      : "text-chrome-muted-foreground border-transparent hover:bg-chrome-card hover:text-chrome-foreground"
                  )}
                >
                  <Icon size={15} strokeWidth={1.6} />
                  <span className="flex-1">{item.label}</span>
                  {isDashboard && (
                    <span className="w-[7px] h-[7px] rounded-full shrink-0 bg-status-success-br shadow-[0_0_0_3px_rgba(34,197,94,0.2)] animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3.5 border-t border-chrome-border">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg text-[13px] transition-colors text-chrome-subtle-foreground hover:bg-chrome-card hover:text-chrome-foreground"
        >
          <LogOut size={15} strokeWidth={1.6} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
