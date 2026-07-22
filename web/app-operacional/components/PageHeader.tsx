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
    <div className="bg-bordeaux-900 px-4 pt-safe-or-10 pb-5 pt-10">
      <div className="flex items-center gap-2 mb-4">
        {back ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-ink-400 hover:text-cream-50 hover:bg-bordeaux-800 -ml-2 h-8 w-8"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            className="text-ink-400 hover:text-cream-50 hover:bg-bordeaux-800 -ml-2 h-8 w-8"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="min-w-0">
        {subtitle && (
          <p className="text-xs font-mono tracking-widest uppercase mb-0.5 text-champagne">
            {subtitle}
          </p>
        )}
        <h1 className="text-xl font-semibold tracking-tight text-cream-50 truncate">
          {title}
        </h1>
      </div>
    </div>
  );
}
