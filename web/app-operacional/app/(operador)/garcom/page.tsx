"use client";

import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useOrderItems, type KanbanItem, useAdvanceItemStatus } from "@/lib/hooks/useOrderItems";
import { useSocketEvents } from "@/lib/hooks/useSocket";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { OrderOptionBadges } from "@/components/OrderOptionBadge";
import { EmptyState, LoadingState } from "@/components/EmptyState";
import { CheckCircle } from "lucide-react";

export default function GarcomPage() {
  const { logout } = useAuth();
  const { data: items = [], isLoading } = useOrderItems("PRONTO", "active");
  const advance = useAdvanceItemStatus();
  const qc = useQueryClient();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [deliveringGroups, setDeliveringGroups] = useState<Set<string>>(new Set());

  const socketHandlers = useCallback(
    () => ({
      order_item_status_changed: (data: unknown) => {
        qc.invalidateQueries({ queryKey: ["order-items"] });
        const d = data as { status?: string; tableCode?: string };
        if (d?.status === "PRONTO") {
          toast.info(`Novo item pronto · Mesa ${d.tableCode ?? ""}`);
        }
      },
    }),
    [qc]
  );
  useSocketEvents(socketHandlers());

  const byCustomer = useMemo(() => {
    const map = new Map<string, { key: string; name: string; tableCode: string; attendantName?: string; items: KanbanItem[] }>();
    for (const item of items) {
      const customer = item.order.session.customer;
      const name = customer?.name ?? "Sem nome";
      const key = customer?.id ?? name;
      const tableCode = item.order.session.table.code;
      const attendantName = item.order.session.attendant?.name;
      if (!map.has(key)) map.set(key, { key, name, tableCode, attendantName, items: [] });
      map.get(key)!.items.push(item);
    }
    return Array.from(map.values());
  }, [items]);

  function toggleCheck(itemId: string) {
    setChecked((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  }

  async function confirmDelivery(groupKey: string, groupItems: KanbanItem[]) {
    if (deliveringGroups.has(groupKey)) return;
    setDeliveringGroups((prev) => new Set(prev).add(groupKey));
    try {
      await Promise.all(
        groupItems.map((item) => advance(item.orderId, item.id, "ENTREGUE"))
      );
      setChecked((prev) => {
        const next = { ...prev };
        for (const item of groupItems) delete next[item.id];
        return next;
      });
    } finally {
      setDeliveringGroups((prev) => {
        const next = new Set(prev);
        next.delete(groupKey);
        return next;
      });
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-chrome px-4 pt-safe pb-5">
        <p className="text-xs font-mono text-chrome-accent tracking-widest uppercase mb-1">
          GreetUp · Garçom
        </p>
        <h1 className="text-xl font-semibold text-chrome-foreground tracking-tight">Itens prontos</h1>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-chrome-muted-foreground">
            {byCustomer.length} {byCustomer.length === 1 ? "cliente" : "clientes"} aguardando
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-xs text-chrome-subtle-foreground hover:text-chrome-muted-foreground hover:bg-white/5 h-auto p-0"
          >
            Sair
          </Button>
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <LoadingState />
        ) : byCustomer.length === 0 ? (
          <EmptyState
            icon={<CheckCircle className="w-7 h-7 text-status-success-fg" />}
            title="Tudo entregue!"
            description="Aguardando novos pedidos prontos."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {byCustomer.map(({ key: groupKey, name, tableCode, attendantName, items: groupItems }) => {
              const allChecked = groupItems.every((i) => checked[i.id]);
              const delivering = deliveringGroups.has(groupKey);
              return (
                <Card key={groupKey} className="overflow-hidden gap-0 py-0">
                  {/* Group header */}
                  <div className="bg-muted px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground text-sm truncate">{name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[10px] font-mono text-primary uppercase font-semibold tracking-wide">
                          Mesa {tableCode}
                        </span>
                        {attendantName && (
                          <>
                            <span className="text-muted-foreground/60 text-[10px]">·</span>
                            <span className="text-[10px] text-muted-foreground">{attendantName}</span>
                          </>
                        )}
                        <span className="text-muted-foreground/60 text-[10px]">·</span>
                        <span className="text-[10px] text-muted-foreground">
                          {groupItems.length} {groupItems.length === 1 ? "item" : "itens"}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono bg-primary text-primary-foreground px-2.5 py-1 rounded-full shrink-0">
                      {groupItems.length}
                    </span>
                  </div>

                  {/* Items */}
                  <CardContent className="px-0">
                    {groupItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between px-4 py-3 border-t border-border">
                        <div className="flex-1">
                          <p className="text-foreground text-sm">
                            <span className="font-mono text-primary mr-1">{item.quantity}×</span>
                            {item.product.name}
                          </p>
                          <OrderOptionBadges withCheese={item.withCheese} courtesy={item.courtesy} toGo={item.order?.toGo ?? false} />
                          {item.notes && (
                            <p className="text-status-warning-fg text-xs mt-0.5 font-medium">Obs: {item.notes}</p>
                          )}
                        </div>
                        <Checkbox
                          checked={checked[item.id] ?? false}
                          onCheckedChange={() => toggleCheck(item.id)}
                          className="ml-3 shrink-0 size-6"
                        />
                      </div>
                    ))}
                  </CardContent>

                  {/* Confirm button */}
                  <div className="px-4 py-3 border-t border-border">
                    <Button
                      disabled={!allChecked || delivering}
                      onClick={() => confirmDelivery(groupKey, groupItems)}
                      className="w-full h-11"
                    >
                      {delivering ? "Confirmando..." : "Confirmar entrega"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
