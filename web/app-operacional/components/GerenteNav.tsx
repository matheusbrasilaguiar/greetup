"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

export function GerenteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const active = pathname === "/mesas" ? "mesas"
    : pathname.startsWith("/conta") ? "conta"
    : "mesas";

  return (
    <nav className="shrink-0 flex items-stretch bg-cream-50 border-t border-cream-200 pb-safe">
      <NavItem
        label="Mesas"
        active={active === "mesas"}
        onClick={() => router.push("/mesas")}
        icon={
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="2" y="2" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <rect x="12" y="2" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <rect x="2" y="12" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <rect x="12" y="12" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        }
      />

      <div className="w-px bg-cream-200 my-2" />

      <NavItem
        label="Cardápio"
        active={pathname.includes("/pedido") || pathname.includes("/confirmar")}
        onClick={() => router.back()}
        icon={
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 6h14M4 11h10M4 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        }
      />

      <div className="w-px bg-cream-200 my-2" />

      <NavItem
        label="Sair"
        active={false}
        onClick={logout}
        icon={
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M9 4H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4M15 15l3-3-3-3M18 11H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />
    </nav>
  );
}

function NavItem({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors"
      style={{ color: active ? "#6B2331" : "#7A736E" }}
    >
      {icon}
      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">{label}</span>
    </button>
  );
}
