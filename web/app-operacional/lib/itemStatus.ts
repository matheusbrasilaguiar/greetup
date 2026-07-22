import type { ItemStatus } from "@/lib/hooks/useOrderItems";

export const ITEM_STATUS_META: Record<
  ItemStatus,
  {
    label: string;
    badgeVariant: "warning" | "info" | "success" | "secondary";
    dotClass: string;
    borderClass: string;
  }
> = {
  PENDENTE: {
    label: "Pendente",
    badgeVariant: "warning",
    dotClass: "bg-status-warning-br",
    borderClass: "border-status-warning-br",
  },
  EM_PREPARO: {
    label: "Em preparo",
    badgeVariant: "info",
    dotClass: "bg-status-info-br",
    borderClass: "border-status-info-br",
  },
  PRONTO: {
    label: "Pronto",
    badgeVariant: "success",
    dotClass: "bg-status-success-br",
    borderClass: "border-status-success-br",
  },
  ENTREGUE: {
    label: "Entregue",
    badgeVariant: "secondary",
    dotClass: "bg-muted-foreground",
    borderClass: "border-border",
  },
};
