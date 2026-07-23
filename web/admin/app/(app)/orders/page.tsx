"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/ui/KpiCard";
import { PageHead } from "@/components/ui/PageHead";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { KpiCardSkeleton } from "@/components/KpiCardSkeleton";
import { TableRowsSkeleton } from "@/components/TableRowsSkeleton";
import { itemStatusMeta } from "@/lib/statusBadge";
import { useOrders, useCancelOrder, type Order } from "@/lib/hooks/useOrders";
import { useSocketEvents } from "@/lib/hooks/useSocketEvents";
import { useActiveEvent } from "@/lib/hooks/useActiveEvent";
import { NoActiveEvent } from "@/components/ui/NoActiveEvent";

const STATUS_FILTERS = [
  { value: "TODOS" as const, label: "Todos" },
  { value: "OPEN" as const, label: "Abertos" },
  { value: "CLOSED" as const, label: "Fechados" },
  { value: "CANCELED" as const, label: "Cancelados" },
];

export default function OrdersPage() {
  const qc = useQueryClient();
  const { data: activeEvent, isLoading: loadingEvent } = useActiveEvent();
  const { data: orders = [], isLoading } = useOrders("active");
  const cancelOrder = useCancelOrder();
  const [filter, setFilter] = useState<"TODOS" | "OPEN" | "CLOSED" | "CANCELED">("TODOS");
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);

  const invalidate = useCallback(() => {
    qc.invalidateQueries({ queryKey: ["orders"] });
  }, [qc]);

  useSocketEvents({
    order_created: invalidate,
    order_item_status_changed: invalidate,
    order_closed: invalidate,
    order_canceled: invalidate,
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
  const open = orders.filter((o) => o.status === "OPEN").length;
  const closed = orders.filter((o) => o.status === "CLOSED").length;
  const canceled = orders.filter((o) => o.status === "CANCELED").length;

  return (
    <div className="flex flex-col gap-[22px]">
      <PageHead eyebrow={`Evento ao vivo · ${activeEvent?.name ?? ""}`} title="Pedidos" sub="Acompanhe todos os pedidos do evento" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }, (_, i) => <KpiCardSkeleton key={i} />)
        ) : (
          <>
            <KpiCard label="Pedidos abertos" value={open} valueClassName="text-status-warning-fg" />
            <KpiCard label="Pedidos fechados" value={closed} />
            <KpiCard label="Cancelados" value={canceled} valueClassName="text-status-canceled-fg" />
            <KpiCard label="Total de itens" value={orders.flatMap((o) => o.items).length} />
          </>
        )}
      </div>

      <Panel title="Pedidos">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="m-3">
            {STATUS_FILTERS.map((f) => (
              <TabsTrigger key={f.value} value={f.value} className="font-mono text-xs tracking-widest uppercase">
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                {[
                  { label: "Mesa" },
                  { label: "Cliente" },
                  { label: "Gerente", hide: "hidden md:table-cell" },
                  { label: "Itens", hide: "hidden sm:table-cell" },
                  { label: "Pedido" },
                  { label: "Horário", hide: "hidden lg:table-cell" },
                  { label: "" },
                ].map(({ label, hide }, i) => (
                  <th key={i} className={`font-mono text-[10px] tracking-widest uppercase text-left px-5 py-3 text-muted-foreground/70 ${hide ?? ""}`}>
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
                    {},
                    { hide: "hidden md:table-cell" },
                    { hide: "hidden sm:table-cell", width: "w-6" },
                    { width: "w-16" },
                    { hide: "hidden lg:table-cell", width: "w-10" },
                    { width: "w-16" },
                  ]}
                />
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center text-sm text-muted-foreground/70 py-10">Nenhum pedido</td></tr>
              )}
              {filtered.map((order) => {
                const lastItem = order.items[order.items.length - 1];
                const isCanceled = order.status === "CANCELED";
                return (
                  <tr
                    key={order.id}
                    className="border-b border-border/60 hover:bg-muted/50 transition-colors"
                    style={{ opacity: isCanceled ? 0.55 : 1 }}
                  >
                    <td className="px-5 py-3 font-mono text-sm font-medium text-foreground">
                      {order.session.table.code}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">
                      {order.session.customer?.name ?? "—"}
                    </td>
                    <td className="hidden md:table-cell px-5 py-3 text-sm text-muted-foreground">
                      {order.session.attendant?.name ?? "—"}
                    </td>
                    <td className="hidden sm:table-cell px-5 py-3 text-sm text-muted-foreground">
                      {order.items.length}
                      {order.items.some((i) => i.notes) && (
                        <Badge variant="warning" className="ml-2">obs</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {isCanceled ? (
                        <Badge variant="canceled">Cancelado</Badge>
                      ) : lastItem ? (
                        <Badge variant={itemStatusMeta(lastItem.status).variant}>{lastItem.status}</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground/70">
                          {order.status === "OPEN" ? "Em aberto" : "Fechado"}
                        </span>
                      )}
                    </td>
                    <td className="hidden lg:table-cell px-5 py-3 font-mono text-xs text-muted-foreground/70">
                      {new Date(order.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-5 py-3">
                      {order.status === "OPEN" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-status-canceled-fg border-status-canceled-br hover:bg-status-canceled-bg"
                          onClick={() => setCancelTarget(order)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(o) => !o && setCancelTarget(null)}
        title="Cancelar pedido?"
        description={
          <>
            Cliente: <strong className="text-foreground">{cancelTarget?.session.customer?.name ?? "—"}</strong>
            <br />
            Os itens serão removidos da fila da cozinha imediatamente.
          </>
        }
        confirmLabel="Confirmar cancelamento"
        variant="destructive"
        loading={cancelOrder.isPending}
        onConfirm={async () => {
          if (cancelTarget) await cancelOrder.mutateAsync(cancelTarget.id);
        }}
      />
    </div>
  );
}
