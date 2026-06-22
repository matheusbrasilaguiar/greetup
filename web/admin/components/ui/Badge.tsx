type BadgeVariant =
  | "pending"
  | "preparing"
  | "ready"
  | "delivered"
  | "canceled"
  | "free"
  | "busy";

const STYLES: Record<BadgeVariant, string> = {
  pending:
    "bg-[var(--gu-pending-bg)] text-[var(--gu-pending-tx)] border-[var(--gu-pending-br)]",
  preparing:
    "bg-[var(--gu-preparing-bg)] text-[var(--gu-preparing-tx)] border-[var(--gu-preparing-br)]",
  ready:
    "bg-[var(--gu-ready-bg)] text-[var(--gu-ready-tx)] border-[var(--gu-ready-br)]",
  delivered:
    "bg-[var(--gu-delivered-bg)] text-[var(--gu-delivered-tx)] border-[var(--gu-delivered-br)]",
  canceled:
    "bg-[var(--gu-canceled-bg)] text-[var(--gu-canceled-tx)] border-[var(--gu-canceled-br)]",
  free: "bg-[var(--gu-ready-bg)] text-[var(--gu-ready-tx)] border-[var(--gu-ready-br)]",
  busy: "bg-[#FBE8EC] text-bordeaux-700 border-bordeaux-300",
};

const LABELS: Record<string, string> = {
  PENDENTE: "Pendente",
  PREPARANDO: "Preparando",
  PRONTO: "Pronto",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
  FREE: "Livre",
  OCCUPIED: "Ocupada",
};

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

export function Badge({ variant, label }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border ${STYLES[variant]}`}
    >
      {label ?? LABELS[variant] ?? variant}
    </span>
  );
}

export function statusToBadge(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    PENDENTE: "pending",
    PREPARANDO: "preparing",
    PRONTO: "ready",
    ENTREGUE: "delivered",
    CANCELADO: "canceled",
    FREE: "free",
    OCCUPIED: "busy",
  };
  return map[status] ?? "pending";
}
