import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function LoadingState({ label = "Carregando...", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <p className="text-muted-foreground text-sm font-mono">{label}</p>
    </div>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon, title, description, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {icon && (
        <div className="w-16 h-16 rounded-full bg-status-success-bg flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <p className="text-foreground font-semibold text-base">{title}</p>
      {description && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
    </div>
  );
}
