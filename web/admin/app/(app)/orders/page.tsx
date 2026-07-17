"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Panel } from "@/components/ui/Panel";
import { Badge, itemStatusToBadge, orderStatusLabel } from "@/components/ui/Badge";
import { KpiCard } from "@/components/ui/KpiCard";
import { PageHead } from "@/components/ui/PageHead";
import { useOrders } from "@/lib/hooks/useOrders";
import { useSocketEvents } from "@/lib/hooks/useSocketEvents";
import { useActiveEvent } from "@/lib/hooks/useActiveEvent";
import { NoActiveEvent } from "@/components/ui/NoActiveEvent";

export default function OrdersPage() {
  const qc = useQueryClient();
  const { data: activeEvent, isLoading: loadingEvent } = useActiveEvent();
  const { data: orders = [], isLoading } = useOrders("active");
  const [filter, setFilter] = useState<"TODOS" | "OPEN" | "CLOSED">("TODOS");

  const invalidate = useCallback(() => {
    qc.invalidateQueries({ queryKey: ["orders"] });
  }, [qc]);

  useSocketEvents({
    order_created: invalidate,
    order_item_status_changed: invalidate,
    order_closed: invalidate,
  });

  const STATUS_FILTERS = [
    { value: "TODOS" as const, label: "Todos" },
    { value: "OPEN" as const, label: "Abertos" },
    { value: "CLOSED" as const, label: "Fechados" },
  ];

  if (!loadingEvent && !activeEvent) {
    return (
      <div className="flex flex-col gap-[22px]">
        <PageHead eyebrow={`Evento ao vivo · ${activeEvent?.name ?? ""}`} title="Pedidos" sub="Acompanhe todos os pedidos do evento" />
        <NoActiveEvent />
      </div>
    );
  }

  const filtered = filter === "TODOS" ? orders : orders.filter((o) => o.status === filter);
  const open = orders.filter((o) => o.status === "OPEN").length;
  const closed = orders.filter((o) => o.status === "CLOSED").length;
  const totalItems = orders.flatMap((o) => o.items).length;

  return (
    <div className="flex flex-col gap-[22px]">
      <PageHead eyebrow={`Evento ao vivo · ${activeEvent?.name ?? ""}`} title="Pedidos" sub="Acompanhe todos os pedidos do evento" />

      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Pedidos abertos" value={open} valueColor="var(--gu-pending-tx)" />
        <KpiCard label="Pedidos fechados" value={closed} />
        <KpiCard label="Total de itens" value={totalItems} />
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
                color: filter === f.value ? "var(--gu-cream-50)" : "var(--gu-ink-500)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--gu-cream-200)" }}>
                {["Mesa", "Cliente", "Gerente", "Itens", "Pedido", "Horário"].map((h) => (
                  <th key={h} className="font-mono text-[10px] tracking-widest uppercase text-left px-5 py-3" style={{ color: "var(--gu-ink-300)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={6} className="text-center text-sm py-10" style={{ color: "var(--gu-ink-300)" }}>Carregando…</td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center text-sm py-10" style={{ color: "var(--gu-ink-300)" }}>Nenhum pedido</td></tr>
              )}
              {filtered.map((order) => {
                const lastItem = order.items[order.items.length - 1];
                return (
                  <tr
                    key={order.id}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid var(--gu-cream-100)" }}
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
                          style={{
                            background: "#FEF3C7",
                            color: "#7C2D12",
                            border: "1px solid #F5D08C",
                          }}
                        >
                          obs
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {lastItem ? (
                        <Badge variant={itemStatusToBadge(lastItem.status)} label={lastItem.status} />
                      ) : (
                        <span className="text-xs" style={{ color: "var(--gu-ink-300)" }}>
                          {orderStatusLabel(order.status)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs" style={{ color: "var(--gu-ink-300)" }}>
                      {new Date(order.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
