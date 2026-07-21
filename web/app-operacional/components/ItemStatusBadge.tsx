type Status = "PENDENTE" | "EM_PREPARO" | "PRONTO" | "ENTREGUE";

const CONFIG: Record<Status, { label: string; bg: string; tx: string }> = {
  PENDENTE:   { label: "Pendente",   bg: "var(--gu-pending-bg)",   tx: "var(--gu-pending-tx)" },
  EM_PREPARO: { label: "Em preparo", bg: "var(--gu-preparing-bg)", tx: "var(--gu-preparing-tx)" },
  PRONTO:     { label: "Pronto",     bg: "var(--gu-ready-bg)",     tx: "var(--gu-ready-tx)" },
  ENTREGUE:   { label: "Entregue",   bg: "var(--gu-delivered-bg)", tx: "var(--gu-delivered-tx)" },
};

export function ItemStatusBadge({ status }: { status: Status }) {
  const c = CONFIG[status];
  return (
    <span
      className="font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full shrink-0"
      style={{ background: c.bg, color: c.tx }}
    >
      {c.label}
    </span>
  );
}
