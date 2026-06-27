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
  busy: "bg-[#fdf6f7] text-bordeaux-700 border-bordeaux-300",
};

const DEFAULT_LABELS: Record<string, string> = {
  PENDENTE: "Pendente",
  EM_PREPARO: "Em preparo",
  PRONTO: "Pronto",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
  OPEN: "Livre",
  OCCUPIED: "Ocupada",
  CLOSED: "Fechada",
};

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

export function Badge({ variant, label }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border ${STYLES[variant]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label ?? DEFAULT_LABELS[variant] ?? variant}
    </span>
  );
}

/** Maps API status strings to badge variants */
export function tableStatusToBadge(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    OPEN: "free",
    OCCUPIED: "busy",
    CLOSED: "canceled",
  };
  return map[status] ?? "free";
}

export function itemStatusToBadge(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    PENDENTE: "pending",
    EM_PREPARO: "preparing",
    PRONTO: "ready",
    ENTREGUE: "delivered",
    CANCELADO: "canceled",
  };
  return map[status] ?? "pending";
}

export function orderStatusLabel(status: string): string {
  return status === "OPEN" ? "Em aberto" : "Fechado";
}

/** @deprecated use tableStatusToBadge or itemStatusToBadge */
export function statusToBadge(status: string): BadgeVariant {
  return tableStatusToBadge(status);
}
