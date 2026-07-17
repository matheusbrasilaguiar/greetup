"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { KpiCard } from "@/components/ui/KpiCard";
import { PageHead } from "@/components/ui/PageHead";
import { Panel } from "@/components/ui/Panel";
import { Badge, itemStatusToBadge } from "@/components/ui/Badge";
import { useTables } from "@/lib/hooks/useTables";
import { useOrders, useOrderItems } from "@/lib/hooks/useOrders";
import { useSocketEvents } from "@/lib/hooks/useSocketEvents";
import { useActiveEvent } from "@/lib/hooks/useActiveEvent";
import { NoActiveEvent } from "@/components/ui/NoActiveEvent";

interface FeedItem {
  id: string;
  ts: Date;
  dotColor: string;
  text: string;
}

let feedCounter = 0;
function makeFeedId() {
  return `feed-${++feedCounter}`;
}

function FeedDot({ color }: { color: string }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px]"
      style={{ background: color }}
    />
  );
}

export default function DashboardPage() {
  const qc = useQueryClient();
  const { data: activeEvent, isLoading: loadingEvent } = useActiveEvent();
  const { data: tables = [] } = useTables();
  const { data: orders = [] } = useOrders("active");
  const { data: items = [] } = useOrderItems("active");
  const [feed, setFeed] = useState<FeedItem[]>([]);

  const addFeed = useCallback((text: string, dotColor: string) => {
    setFeed((prev) =>
      [{ id: makeFeedId(), ts: new Date(), dotColor, text }, ...prev].slice(0, 30)
    );
  }, []);

  useSocketEvents({
    table_session_opened: useCallback(
      (data: unknown) => {
        const d = data as { tableCode: string; customerName?: string; attendantName: string };
        addFeed(
          `Mesa ${d.tableCode} aberta · ${d.customerName ?? "sem cliente"} · ${d.attendantName}`,
          "var(--gu-bordeaux-700)"
        );
        qc.invalidateQueries({ queryKey: ["tables"] });
        qc.invalidateQueries({ queryKey: ["orders"] });
      },
      [addFeed, qc]
    ),
    table_session_closed: useCallback(
      (data: unknown) => {
        const d = data as { tableCode: string };
        addFeed(`Mesa ${d.tableCode} encerrada`, "var(--gu-ink-300)");
        qc.invalidateQueries({ queryKey: ["tables"] });
      },
      [addFeed, qc]
    ),
    order_created: useCallback(
      (data: unknown) => {
        const d = data as { tableCode: string; items: { productName: string }[] };
        addFeed(
          `Novo pedido · Mesa ${d.tableCode} · ${d.items.length} iten(s)`,
          "#22C55E"
        );
        qc.invalidateQueries({ queryKey: ["orders"] });
        qc.invalidateQueries({ queryKey: ["order-items"] });
      },
      [addFeed, qc]
    ),
    order_item_status_changed: useCallback(
      (data: unknown) => {
        const d = data as { productName: string; status: string };
        addFeed(`${d.productName} → ${d.status}`, "#6366F1");
        qc.invalidateQueries({ queryKey: ["orders"] });
        qc.invalidateQueries({ queryKey: ["order-items"] });
      },
      [addFeed, qc]
    ),
    order_closed: useCallback(
      (data: unknown) => {
        const d = data as { tableCode: string };
        addFeed(`Pedido fechado · Mesa ${d.tableCode}`, "var(--gu-champagne)");
        qc.invalidateQueries({ queryKey: ["orders"] });
      },
      [addFeed, qc]
    ),
  });

  if (!loadingEvent && !activeEvent) {
    return (
      <div className="flex flex-col gap-[22px]">
        <PageHead eyebrow="Evento ao vivo" title="Painel operacional" sub="Acompanhe o evento em tempo real" />
        <NoActiveEvent />
      </div>
    );
  }

  const occupied = tables.filter((t) => t.status === "OCCUPIED").length;
  const total = tables.length;
  const openOrders = orders.filter((o) => o.status === "OPEN").length;
  const awaitingDelivery = items.filter((i) => i.status === "PRONTO").length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-[22px]">
      <PageHead eyebrow={`Evento ao vivo · ${activeEvent?.name ?? ""}`} title="Painel operacional" sub="Acompanhe o evento em tempo real" />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Mesas ocupadas"
          value={occupied}
          of={`/ ${total}`}
          sub={total > 0 ? `${Math.round((occupied / total) * 100)}% de ocupação` : "—"}
          valueColor="var(--gu-bordeaux-700)"
        />
        <KpiCard
          label="Pedidos em aberto"
          value={openOrders}
          sub="aguardando encerramento"
          valueColor="var(--gu-pending-tx)"
        />
        <KpiCard
          label="Aguardando entrega"
          value={awaitingDelivery}
          sub="itens com status PRONTO"
          valueColor="var(--gu-ready-tx)"
        />
        <KpiCard
          label="Total de mesas"
          value={total}
          sub="configuradas no evento"
        />
      </div>

      {/* Corpo: tabela + feed */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-[18px]">
        {/* Últimos pedidos */}
        <Panel title="Últimos pedidos">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--gu-cream-200)" }}>
                  {["Mesa", "Gerente", "Itens", "Status", "Horário"].map((h) => (
                    <th
                      key={h}
                      className="font-mono text-[10px] tracking-widest uppercase text-left px-5 py-3"
                      style={{ color: "var(--gu-ink-300)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-sm py-10"
                      style={{ color: "var(--gu-ink-300)" }}
                    >
                      Nenhum pedido ainda
                    </td>
                  </tr>
                )}
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid var(--gu-cream-100)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "var(--gu-cream-50)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "")
                    }
                  >
                    <td className="px-5 py-3 font-mono text-sm" style={{ color: "var(--gu-ink-900)" }}>
                      {order.session.table.code}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "var(--gu-ink-700)" }}>
                      {order.session.attendant?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "var(--gu-ink-700)" }}>
                      {order.items.length}
                    </td>
                    <td className="px-5 py-3">
                      {order.items.length > 0 ? (
                        <Badge
                          variant={itemStatusToBadge(order.items[order.items.length - 1].status)}
                          label={order.items[order.items.length - 1].status}
                        />
                      ) : (
                        <Badge variant="pending" label="PENDENTE" />
                      )}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs" style={{ color: "var(--gu-ink-300)" }}>
                      {new Date(order.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Feed de atividade */}
        <Panel title="Atividade recente" action={
          <span
            className="flex items-center gap-1 font-mono text-[9.5px] tracking-widest uppercase px-2 py-0.5 rounded-full"
            style={{ color: "#15803D", background: "#F0FDF4", border: "1px solid #22C55E" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22C55E", animation: "pulse 2s ease-in-out infinite" }} />
            ao vivo
          </span>
        }>
          <div className="overflow-y-auto" style={{ maxHeight: 420 }}>
            {feed.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: "var(--gu-ink-300)" }}>
                Aguardando eventos…
              </p>
            ) : (
              feed.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 px-5 py-3"
                  style={{ borderTop: "1px solid var(--gu-cream-200)" }}
                >
                  <FeedDot color={item.dotColor} />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[10px]" style={{ color: "var(--gu-ink-300)" }}>
                      {item.ts.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                    <span className="text-[12.5px] leading-snug" style={{ color: "var(--gu-ink-700)" }}>
                      {item.text}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <style jsx>{`
            @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
          `}</style>
        </Panel>
      </div>
    </div>
  );
}
