"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderItems, type KanbanItem, type ItemStatus, useAdvanceItemStatus, useCancelOrder } from "@/lib/hooks/useOrderItems";
import { useSocketEvents } from "@/lib/hooks/useSocket";
import { useAuth } from "@/lib/hooks/useAuth";
import { KanbanCard } from "@/components/KanbanCard";
import { ITEM_STATUS_META } from "@/lib/itemStatus";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COLUMNS: { status: ItemStatus; label: string }[] = [
  { status: "PENDENTE",   label: "Pendente" },
  { status: "EM_PREPARO", label: "Em preparo" },
  { status: "PRONTO",     label: "Pronto" },
  { status: "ENTREGUE",   label: "Entregue" },
];

const NEXT_STATUS: Partial<Record<ItemStatus, ItemStatus>> = {
  PENDENTE: "EM_PREPARO",
  EM_PREPARO: "PRONTO",
  PRONTO: "ENTREGUE",
};

const PREV_STATUS: Partial<Record<ItemStatus, ItemStatus>> = {
  EM_PREPARO: "PENDENTE",
  PRONTO: "EM_PREPARO",
  ENTREGUE: "PRONTO",
};

export default function CozinhaPage() {
  const { logout } = useAuth();
  const { data: items = [], isLoading } = useOrderItems(undefined, "active");
  const advance = useAdvanceItemStatus();
  const cancelOrder = useCancelOrder();
  const qc = useQueryClient();
  const [now, setNow] = useState(Date.now());
  const [pendingItems, setPendingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const socketHandlers = useCallback(
    () => ({
      order_created: () => qc.invalidateQueries({ queryKey: ["order-items"] }),
      order_item_status_changed: () => qc.invalidateQueries({ queryKey: ["order-items"] }),
    }),
    [qc]
  );
  useSocketEvents(socketHandlers());

  const byStatus = useMemo(() => {
    const map: Record<string, KanbanItem[]> = {};
    for (const col of COLUMNS) map[col.status] = [];
    for (const item of items) {
      if (map[item.status]) map[item.status].push(item);
    }
    return map;
  }, [items]);

  function withItemGuard(item: KanbanItem, fn: () => Promise<void>) {
    return async () => {
      if (pendingItems.has(item.id)) return;
      setPendingItems((prev) => new Set(prev).add(item.id));
      try { await fn(); }
      finally {
        setPendingItems((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }
    };
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-chrome">
        <p className="text-chrome-muted-foreground font-mono text-sm">Carregando pedidos...</p>
      </div>
    );
  }

  const pendingCount = items.filter((i) => i.status !== "ENTREGUE").length;

  return (
    <div className="h-full flex flex-col bg-chrome">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-8 pb-4 border-b border-chrome-border">
        <span className="text-xs font-mono text-chrome-accent tracking-widest uppercase">
          Cozinha · Ao vivo
        </span>
        <span className="text-xs text-chrome-subtle-foreground font-mono">{pendingCount} pendentes</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="ml-auto text-xs text-chrome-subtle-foreground hover:text-chrome-muted-foreground hover:bg-white/5"
        >
          Sair
        </Button>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-hidden">
        <div className="flex gap-2 p-3 h-full">
          {COLUMNS.map(({ status, label }) => {
            const col = byStatus[status] ?? [];
            const meta = ITEM_STATUS_META[status];
            return (
              <div key={status} className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex items-center gap-2 px-1">
                  <span className={cn("w-2 h-2 rounded-full shrink-0", meta.dotClass)} />
                  <span className="text-xs font-mono text-chrome-foreground uppercase tracking-wider">{label}</span>
                  <span className="ml-auto text-xs font-mono text-chrome-subtle-foreground">{col.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 pb-2">
                  {col.length === 0 && (
                    <div className="text-chrome-muted-foreground/60 text-xs text-center py-6 font-mono">—</div>
                  )}
                  {col.map((item) => {
                    const isPending = pendingItems.has(item.id);
                    const nextStatus = NEXT_STATUS[item.status];
                    const prevStatus = PREV_STATUS[item.status];
                    return (
                      <KanbanCard
                        key={item.id}
                        item={item}
                        now={now}
                        pending={isPending}
                        onAdvance={nextStatus
                          ? withItemGuard(item, () => advance(item.orderId, item.id, nextStatus))
                          : undefined}
                        onRevert={prevStatus
                          ? withItemGuard(item, () => advance(item.orderId, item.id, prevStatus))
                          : undefined}
                        onCancel={withItemGuard(item, () => cancelOrder(item.orderId))}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
