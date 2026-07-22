"use client";

import { useRouter } from "next/navigation";
import { useSidebarContext } from "@/lib/sidebar-context";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Menu } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  back?: { label?: string; href: string } | true;
}

export function PageHeader({ title, subtitle, back }: PageHeaderProps) {
  const router = useRouter();
  const { setOpen } = useSidebarContext();

  function handleBack() {
    if (!back) return;
    if (back === true) router.back();
    else router.push(back.href);
  }

  return (
    <div className="bg-bordeaux-900 px-4 pt-safe pb-4">
      <div className="flex items-center gap-3">
        {back ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-cream-50/60 hover:text-cream-50 hover:bg-bordeaux-800 -ml-1 h-8 w-8 shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            className="text-cream-50/60 hover:text-cream-50 hover:bg-bordeaux-800 -ml-1 h-8 w-8 shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <div className="min-w-0 flex-1">
          {subtitle && (
            <p className="text-[10px] font-mono tracking-widest uppercase text-champagne leading-none mb-0.5">
              {subtitle}
            </p>
          )}
          <h1 className="text-lg font-semibold tracking-tight text-cream-50 truncate leading-tight">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
