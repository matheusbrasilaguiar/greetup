import { Badge } from "@/components/ui/badge";
import { ITEM_STATUS_META } from "@/lib/itemStatus";
import type { ItemStatus } from "@/lib/hooks/useOrderItems";

export function ItemStatusBadge({ status }: { status: ItemStatus }) {
  const meta = ITEM_STATUS_META[status];
  return (
    <Badge variant={meta.badgeVariant} className="font-mono text-[10px] uppercase shrink-0">
      {meta.label}
    </Badge>
  );
}
