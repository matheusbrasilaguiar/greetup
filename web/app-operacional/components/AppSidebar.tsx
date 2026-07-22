"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useSidebarContext } from "@/lib/sidebar-context";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUser } from "@/lib/auth";
import { LayoutGrid, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Mesas", href: "/mesas", icon: LayoutGrid },
];

export function AppSidebar() {
  const { open, setOpen } = useSidebarContext();
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const user = getUser();

  function navigate(href: string) {
    router.push(href);
    setOpen(false);
  }

  function handleLogout() {
    setOpen(false);
    logout();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-72 flex flex-col p-0 border-r-0">
        {/* User info */}
        <SheetHeader className="px-5 pt-8 pb-5 bg-bordeaux-900">
          <div className="flex items-center gap-1 mb-3">
            <Arch />
            <span className="text-xs font-mono tracking-widest text-champagne uppercase ml-1">
              GreetUp
            </span>
          </div>
          <SheetTitle className="text-left text-cream-50 text-lg font-semibold">
            {user?.name ?? "Gerente"}
          </SheetTitle>
          <p className="text-xs text-ink-300 font-mono -mt-1">
            {user?.role === "GERENTE" ? "Gerente de Atendimento" : "Operador"}
          </p>
        </SheetHeader>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <button
                key={href}
                onClick={() => navigate(href)}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                  active
                    ? "bg-bordeaux-700/10 text-bordeaux-700"
                    : "text-ink-700 hover:bg-secondary"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        <Separator />

        {/* Logout */}
        <div className="px-3 py-4 pb-safe">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            Sair da conta
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Arch() {
  return (
    <svg width="20" height="20" viewBox="0 0 44 44" fill="none">
      <path
        d="M5.5 44V20.17C5.5 10.98 12.98 3.5 22.17 3.5 31.36 3.5 38.5 10.98 38.5 20.17V44"
        stroke="#D9B58A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="22" cy="23.84" r="3.5" fill="#FBF7EF" />
    </svg>
  );
}
