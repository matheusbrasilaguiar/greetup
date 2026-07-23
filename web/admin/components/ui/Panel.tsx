import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PanelProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Panel({ title, action, children, className = "" }: PanelProps) {
  return (
    <Card className={cn("py-0 gap-0", className)}>
      {(title || action) && (
        <CardHeader className="flex-row items-center justify-between gap-3 border-b border-border px-5 py-4">
          {title && (
            <CardTitle className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {title}
            </CardTitle>
          )}
          {action && <div>{action}</div>}
        </CardHeader>
      )}
      {children}
    </Card>
  );
}
