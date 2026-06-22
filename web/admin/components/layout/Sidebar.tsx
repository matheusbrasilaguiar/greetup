"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    title: "Configuração",
    items: [
      { label: "Usuários", href: "/users", icon: "👤" },
      { label: "Produtos", href: "/products", icon: "🍽" },
      { label: "Mesas", href: "/tables/config", icon: "🪑" },
    ],
  },
  {
    title: "Evento",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "📊" },
      { label: "Mesas ao vivo", href: "/tables", icon: "🔴" },
      { label: "Pedidos", href: "/orders", icon: "📋" },
    ],
  },
  {
    title: "Relatórios",
    items: [
      { label: "Consumo", href: "/reports/consumption", icon: "📈" },
      { label: "Clientes", href: "/reports/clients", icon: "👥" },
      { label: "Gerentes", href: "/reports/managers", icon: "🏅" },
      { label: "Resumo", href: "/reports/summary", icon: "📄" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  function isActive(href: string) {
    if (href === "/tables" && pathname === "/tables") return true;
    if (href !== "/tables") return pathname.startsWith(href);
    return false;
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-bordeaux-900 flex flex-col z-10">
      {/* Wordmark */}
      <div className="px-6 pt-7 pb-6 border-b border-bordeaux-800">
        <p className="font-mono text-[10px] tracking-[0.2em] text-bordeaux-300 uppercase mb-0.5">
          Admin
        </p>
        <p className="font-display text-2xl font-semibold text-cream-50">Greetup</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {NAV.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="font-mono text-[10px] tracking-[0.18em] text-bordeaux-300 uppercase px-3 mb-2">
              {group.title}
            </p>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition mb-0.5 ${
                  isActive(item.href)
                    ? "bg-bordeaux-700 text-cream-50 font-medium"
                    : "text-bordeaux-300 hover:bg-bordeaux-800 hover:text-cream-50"
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-bordeaux-800">
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-bordeaux-300 hover:bg-bordeaux-800 hover:text-cream-50 transition"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
