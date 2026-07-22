"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSidebarContext } from "@/lib/sidebar-context";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  back?: { label?: string; href: string } | true;
  action?: React.ReactNode;
}

export const pageHeaderIconButtonClass =
  "text-chrome-foreground/60 hover:text-chrome-foreground hover:bg-chrome-border h-8 w-8 shrink-0";

export function PageHeader({ title, subtitle, back, action }: PageHeaderProps) {
  const router = useRouter();
  const { setOpen } = useSidebarContext();

  function handleBack() {
    if (!back) return;
    if (back === true) router.back();
    else router.push(back.href);
  }

  return (
    <div className="bg-chrome px-4 pt-safe pb-4">
      <div className="flex items-center gap-3">
        {back ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className={cn(pageHeaderIconButtonClass, "-ml-1")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            className={cn(pageHeaderIconButtonClass, "-ml-1")}
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <div className="min-w-0 flex-1">
          {subtitle && (
            <p className="text-[10px] font-mono tracking-widest uppercase text-chrome-accent leading-none mb-0.5">
              {subtitle}
            </p>
          )}
          <h1 className="text-lg font-semibold tracking-tight text-chrome-foreground truncate leading-tight">
            {title}
          </h1>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
