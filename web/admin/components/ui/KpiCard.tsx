import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  of?: string | number;
  sub?: string;
  valueClassName?: string;
}

export function KpiCard({ label, value, of: ofProp, sub, valueClassName }: KpiCardProps) {
  return (
    <Card className="p-5 gap-2.5">
      <p className="font-mono text-[10.5px] tracking-[.14em] text-muted-foreground uppercase">{label}</p>
      <p
        className={cn(
          "font-sans text-[32px] leading-none font-semibold tracking-[-0.028em] tabular-nums text-foreground",
          valueClassName
        )}
      >
        {value}
        {ofProp !== undefined && (
          <span className="ml-1.5 text-[18px] font-normal text-muted-foreground">{ofProp}</span>
        )}
      </p>
      {sub && (
        <p className="font-mono text-[11px] tracking-[.04em] text-muted-foreground/70">{sub}</p>
      )}
    </Card>
  );
}
