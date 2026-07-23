export type BadgeVariant =
  | "warning"
  | "info"
  | "success"
  | "muted"
  | "canceled"
  | "busy";

interface StatusMeta {
  label: string;
  variant: BadgeVariant;
}

export const ITEM_STATUS_META: Record<string, StatusMeta> = {
  PENDENTE: { label: "Pendente", variant: "warning" },
  EM_PREPARO: { label: "Em preparo", variant: "info" },
  PRONTO: { label: "Pronto", variant: "success" },
  ENTREGUE: { label: "Entregue", variant: "muted" },
  CANCELADO: { label: "Cancelado", variant: "canceled" },
};

export const TABLE_STATUS_META: Record<string, StatusMeta> = {
  OPEN: { label: "Livre", variant: "success" },
  OCCUPIED: { label: "Ocupada", variant: "busy" },
  CLOSED: { label: "Fechada", variant: "muted" },
};

export const EVENT_STATUS_META: Record<string, StatusMeta> = {
  DRAFT: { label: "Rascunho", variant: "warning" },
  ACTIVE: { label: "Ativo", variant: "success" },
  CLOSED: { label: "Encerrado", variant: "canceled" },
};

export const ROLE_META: Record<string, StatusMeta> = {
  ADMIN: { label: "Admin", variant: "busy" },
  GERENTE: { label: "Gerente", variant: "info" },
  COZINHA: { label: "Cozinha", variant: "warning" },
  GARCOM: { label: "Garçom", variant: "success" },
  DISPLAY: { label: "Display", variant: "muted" },
  OPERADOR: { label: "Operador", variant: "warning" },
};

export const CATEGORY_META: Record<string, StatusMeta> = {
  COMIDA: { label: "Comidas", variant: "muted" },
  BEBIDA: { label: "Bebidas", variant: "warning" },
};

export function itemStatusMeta(status: string): StatusMeta {
  return ITEM_STATUS_META[status] ?? { label: status, variant: "warning" };
}

export function tableStatusMeta(status: string): StatusMeta {
  return TABLE_STATUS_META[status] ?? { label: status, variant: "muted" };
}
