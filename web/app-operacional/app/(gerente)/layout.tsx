"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUser } from "@/lib/auth";
import { SidebarProvider } from "@/lib/sidebar-context";
import { AppSidebar } from "@/components/AppSidebar";

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
      if (user.operatorFunction === "COZINHA") router.replace("/cozinha");
      else if (user.operatorFunction === "GARCOM") router.replace("/garcom");
      else router.replace("/display");
    }
  }, [router]);

  return (
    <SidebarProvider>
      <div className="h-full flex flex-col">
        <AppSidebar />
        <div className="flex-1 min-h-0">{children}</div>
      </div>
    </SidebarProvider>
  );
}
