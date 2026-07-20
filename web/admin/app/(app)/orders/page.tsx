"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Panel } from "@/components/ui/Panel";
import { Badge, itemStatusToBadge, orderStatusLabel } from "@/components/ui/Badge";
import { KpiCard } from "@/components/ui/KpiCard";
import { PageHead } from "@/components/ui/PageHead";
import { useOrders, useCancelOrder, type Order } from "@/lib/hooks/useOrders";
import { useSocketEvents } from "@/lib/hooks/useSocketEvents";
import { useActiveEvent } from "@/lib/hooks/useActiveEvent";
import { NoActiveEvent } from "@/components/ui/NoActiveEvent";

const STATUS_FILTERS = [
  { value: "TODOS"    as const, label: "Todos"      },
  { value: "OPEN"     as const, label: "Abertos"    },
  { value: "CLOSED"   as const, label: "Fechados"   },
  { value: "CANCELED" as const, label: "Cancelados" },
];

function CancelModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const { mutateAsync, isPending } = useCancelOrder();
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    try {
      await mutateAsync(order.id);
      onClose();
    } catch {
      setError("Erro ao cancelar. Tente novamente.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" style={{ border: "1px solid var(--gu-cream-200)" }}>
        <h2 className="font-semibold text-base mb-1" style={{ color: "var(--gu-ink-900)" }}>
          Cancelar pedido?
        </h2>
        <p className="text-sm mb-1" style={{ color: "var(--gu-ink-500)" }}>
          Cliente: <strong style={{ color: "var(--gu-ink-700)" }}>{order.session.customer?.name ?? "—"}</strong>
        </p>
        <p className="text-sm mb-5" style={{ color: "var(--gu-ink-500)" }}>
          Os itens serão removidos da fila da cozinha imediatamente.
        </p>
        {error && (
          <p className="text-sm mb-3 text-center" style={{ color: "var(--gu-canceled-tx)" }}>{error}</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2 rounded-lg text-sm border disabled:opacity-50"
            style={{ borderColor: "var(--gu-cream-200)", color: "var(--gu-ink-500)" }}
          >
            Voltar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="flex-1 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            style={{ background: "var(--gu-canceled-tx)", color: "#fff" }}
          >
            {isPending ? "Cancelando..." : "Confirmar cancelamento"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const qc = useQueryClient();
  const { data: activeEvent, isLoading: loadingEvent } = useActiveEvent();
  const { data: orders = [], isLoading } = useOrders("active");
  const [filter, setFilter] = useState<"TODOS" | "OPEN" | "CLOSED" | "CANCELED">("TODOS");
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);

  const invalidate = useCallback(() => {
    qc.invalidateQueries({ queryKey: ["orders"] });
  }, [qc]);

  useSocketEvents({
    order_created:             invalidate,
    order_item_status_changed: invalidate,
    order_closed:              invalidate,
    order_canceled:            invalidate,
  });

  if (!loadingEvent && !activeEvent) {
    return (
      <div className="flex flex-col gap-[22px]">
        <PageHead eyebrow="Evento ao vivo · Gestão de pedidos" title="Pedidos" sub="Acompanhe todos os pedidos do evento" />
        <NoActiveEvent />
      </div>
    );
  }

  const filtered = filter === "TODOS" ? orders : orders.filter((o) => o.status === filter);
  const open     = orders.filter((o) => o.status === "OPEN").length;
  const closed   = orders.filter((o) => o.status === "CLOSED").length;
  const canceled = orders.filter((o) => o.status === "CANCELED").length;

  return (
    <div className="flex flex-col gap-[22px]">
      <PageHead eyebrow={`Evento ao vivo · ${activeEvent?.name ?? ""}`} title="Pedidos" sub="Acompanhe todos os pedidos do evento" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard label="Pedidos abertos"   value={open}     valueColor="var(--gu-pending-tx)" />
        <KpiCard label="Pedidos fechados"  value={closed}   />
        <KpiCard label="Cancelados"        value={canceled} valueColor="var(--gu-canceled-tx)" />
        <KpiCard label="Total de itens"    value={orders.flatMap((o) => o.items).length} />
      </div>

      <Panel title="Pedidos">
        {/* Filtros */}
        <div className="flex gap-1 px-5 py-3" style={{ borderBottom: "1px solid var(--gu-cream-200)" }}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="font-mono text-xs tracking-widest uppercase px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background: filter === f.value ? "var(--gu-bordeaux-700)" : "transparent",
                color:      filter === f.value ? "var(--gu-cream-50)"     : "var(--gu-ink-500)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--gu-cream-200)" }}>
                {["Mesa", "Cliente", "Gerente", "Itens", "Pedido", "Horário", ""].map((h, i) => (
                  <th key={i} className="font-mono text-[10px] tracking-widest uppercase text-left px-5 py-3" style={{ color: "var(--gu-ink-300)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={7} className="text-center text-sm py-10" style={{ color: "var(--gu-ink-300)" }}>Carregando…</td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center text-sm py-10" style={{ color: "var(--gu-ink-300)" }}>Nenhum pedido</td></tr>
              )}
              {filtered.map((order) => {
                const lastItem = order.items[order.items.length - 1];
                const isCanceled = order.status === "CANCELED";
                return (
                  <tr
                    key={order.id}
                    className="transition-colors"
                    style={{
                      borderBottom: "1px solid var(--gu-cream-100)",
                      opacity: isCanceled ? 0.55 : 1,
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--gu-cream-50)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
                  >
                    <td className="px-5 py-3 font-mono text-sm font-medium" style={{ color: "var(--gu-ink-900)" }}>
                      {order.session.table.code}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "var(--gu-ink-700)" }}>
                      {order.session.customer?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "var(--gu-ink-700)" }}>
                      {order.session.attendant?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "var(--gu-ink-700)" }}>
                      {order.items.length}
                      {order.items.some((i) => i.notes) && (
                        <span
                          className="ml-2 font-mono text-[9.5px] uppercase px-1.5 py-0.5 rounded-full"
                          style={{ background: "#FEF3C7", color: "#7C2D12", border: "1px solid #F5D08C" }}
                        >
                          obs
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {isCanceled ? (
                        <span
                          className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full"
                          style={{ background: "var(--gu-canceled-bg)", color: "var(--gu-canceled-tx)", border: "1px solid var(--gu-canceled-br)" }}
                        >
                          Cancelado
                        </span>
                      ) : lastItem ? (
                        <Badge variant={itemStatusToBadge(lastItem.status)} label={lastItem.status} />
                      ) : (
                        <span className="text-xs" style={{ color: "var(--gu-ink-300)" }}>
                          {orderStatusLabel(order.status)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs" style={{ color: "var(--gu-ink-300)" }}>
                      {new Date(order.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-5 py-3">
                      {order.status === "OPEN" && (
                        <button
                          onClick={() => setCancelTarget(order)}
                          className="text-xs font-medium px-2.5 py-1 rounded-lg transition-colors"
                          style={{
                            color: "var(--gu-canceled-tx)",
                            border: "1px solid var(--gu-canceled-br)",
                            background: "transparent",
                          }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--gu-canceled-bg)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {cancelTarget && (
        <CancelModal order={cancelTarget} onClose={() => setCancelTarget(null)} />
      )}
    </div>
  );
}
