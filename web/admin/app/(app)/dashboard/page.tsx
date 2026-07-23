"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { KpiCard } from "@/components/ui/KpiCard";
import { PageHead } from "@/components/ui/PageHead";
import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/badge";
import { KpiCardSkeleton } from "@/components/KpiCardSkeleton";
import { TableRowsSkeleton } from "@/components/TableRowsSkeleton";
import { itemStatusMeta } from "@/lib/statusBadge";
import { useTables } from "@/lib/hooks/useTables";
import { useOrders, useOrderItems } from "@/lib/hooks/useOrders";
import { useSocketEvents } from "@/lib/hooks/useSocketEvents";
import { useActiveEvent } from "@/lib/hooks/useActiveEvent";
import { NoActiveEvent } from "@/components/ui/NoActiveEvent";

interface FeedItem {
  id: string;
  ts: Date;
  dotClassName: string;
  text: string;
}

let feedCounter = 0;
function makeFeedId() {
  return `feed-${++feedCounter}`;
}

function FeedDot({ className }: { className: string }) {
  return <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-[5px] ${className}`} />;
}

export default function DashboardPage() {
  const qc = useQueryClient();
  const { data: activeEvent, isLoading: loadingEvent } = useActiveEvent();
  const { data: tables = [], isLoading: loadingTables } = useTables();
  const { data: orders = [], isLoading: loadingOrders } = useOrders("active");
  const { data: items = [], isLoading: loadingItems } = useOrderItems("active");
  const isLoading = loadingTables || loadingOrders || loadingItems;
  const [feed, setFeed] = useState<FeedItem[]>([]);

  const addFeed = useCallback((text: string, dotClassName: string) => {
    setFeed((prev) =>
      [{ id: makeFeedId(), ts: new Date(), dotClassName, text }, ...prev].slice(0, 30)
    );
  }, []);

  useSocketEvents({
    table_session_opened: useCallback(
      (data: unknown) => {
        const d = data as { tableCode: string; customerName?: string; attendantName: string };
        addFeed(
          `Mesa ${d.tableCode} aberta · ${d.customerName ?? "sem cliente"} · ${d.attendantName}`,
          "bg-primary"
        );
        qc.invalidateQueries({ queryKey: ["tables"] });
        qc.invalidateQueries({ queryKey: ["orders"] });
      },
      [addFeed, qc]
    ),
    table_session_closed: useCallback(
      (data: unknown) => {
        const d = data as { tableCode: string };
        addFeed(`Mesa ${d.tableCode} encerrada`, "bg-muted-foreground");
        qc.invalidateQueries({ queryKey: ["tables"] });
      },
      [addFeed, qc]
    ),
    order_created: useCallback(
      (data: unknown) => {
        const d = data as { tableCode: string; items: { productName: string }[] };
        addFeed(
          `Novo pedido · Mesa ${d.tableCode} · ${d.items.length} iten(s)`,
          "bg-status-success-br"
        );
        qc.invalidateQueries({ queryKey: ["orders"] });
        qc.invalidateQueries({ queryKey: ["order-items"] });
      },
      [addFeed, qc]
    ),
    order_item_status_changed: useCallback(
      (data: unknown) => {
        const d = data as { productName: string; status: string };
        addFeed(`${d.productName} → ${d.status}`, "bg-status-info-br");
        qc.invalidateQueries({ queryKey: ["orders"] });
        qc.invalidateQueries({ queryKey: ["order-items"] });
      },
      [addFeed, qc]
    ),
    order_closed: useCallback(
      (data: unknown) => {
        const d = data as { tableCode: string };
        addFeed(`Pedido fechado · Mesa ${d.tableCode}`, "bg-champagne");
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
        {isLoading ? (
          Array.from({ length: 4 }, (_, i) => <KpiCardSkeleton key={i} />)
        ) : (
          <>
            <KpiCard
              label="Mesas ocupadas"
              value={occupied}
              sub="sessões abertas agora"
              valueClassName="text-primary"
            />
            <KpiCard
              label="Pedidos em aberto"
              value={openOrders}
              sub="aguardando encerramento"
              valueClassName="text-status-warning-fg"
            />
            <KpiCard
              label="Aguardando entrega"
              value={awaitingDelivery}
              sub="itens com status PRONTO"
              valueClassName="text-status-success-fg"
            />
            <KpiCard
              label="Total de pedidos"
              value={orders.length}
              sub="no evento ativo"
            />
          </>
        )}
      </div>

      {/* Corpo: tabela + feed */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-[18px]">
        {/* Últimos pedidos */}
        <Panel title="Últimos pedidos">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  {[
                    { label: "Mesa" },
                    { label: "Gerente", hide: "hidden sm:table-cell" },
                    { label: "Itens", hide: "hidden md:table-cell" },
                    { label: "Status" },
                    { label: "Horário", hide: "hidden lg:table-cell" },
                  ].map(({ label, hide }) => (
                    <th key={label} className={`font-mono text-[10px] tracking-widest uppercase text-left px-5 py-3 text-muted-foreground/70 ${hide ?? ""}`}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <TableRowsSkeleton
                    columns={[
                      { width: "w-10" },
                      { hide: "hidden sm:table-cell" },
                      { hide: "hidden md:table-cell", width: "w-6" },
                      { width: "w-16" },
                      { hide: "hidden lg:table-cell", width: "w-10" },
                    ]}
                  />
                )}
                {!isLoading && recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-sm text-muted-foreground/70 py-10">
                      Nenhum pedido ainda
                    </td>
                  </tr>
                )}
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/60 hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-sm text-foreground">
                      {order.session.table.code}
                    </td>
                    <td className="hidden sm:table-cell px-5 py-3 text-sm text-muted-foreground">
                      {order.session.attendant?.name ?? "—"}
                    </td>
                    <td className="hidden md:table-cell px-5 py-3 text-sm text-muted-foreground">
                      {order.items.length}
                    </td>
                    <td className="px-5 py-3">
                      {order.items.length > 0 ? (
                        <Badge variant={itemStatusMeta(order.items[order.items.length - 1].status).variant}>
                          {order.items[order.items.length - 1].status}
                        </Badge>
                      ) : (
                        <Badge variant="warning">PENDENTE</Badge>
                      )}
                    </td>
                    <td className="hidden lg:table-cell px-5 py-3 font-mono text-xs text-muted-foreground/70">
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
        <Panel
          title="Atividade recente"
          action={
            <Badge variant="success" dot className="animate-pulse">
              ao vivo
            </Badge>
          }
        >
          <div className="overflow-y-auto max-h-[420px]">
            {feed.length === 0 ? (
              <p className="text-sm text-center text-muted-foreground/70 py-10">
                Aguardando eventos…
              </p>
            ) : (
              feed.map((item) => (
                <div key={item.id} className="flex gap-3 px-5 py-3 border-t border-border">
                  <FeedDot className={item.dotClassName} />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[10px] text-muted-foreground/70">
                      {item.ts.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                    <span className="text-[12.5px] leading-snug text-muted-foreground">
                      {item.text}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
