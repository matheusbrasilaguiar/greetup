"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderItems, type KanbanItem, type ItemStatus, useAdvanceItemStatus, useCancelOrder } from "@/lib/hooks/useOrderItems";
import { useSocketEvents } from "@/lib/hooks/useSocket";
import { useAuth } from "@/lib/hooks/useAuth";
import { KanbanCard } from "@/components/KanbanCard";

const COLUMNS: { status: ItemStatus; label: string; accent: string }[] = [
  { status: "PENDENTE",   label: "Pendente",   accent: "#D9B58A" },
  { status: "EM_PREPARO", label: "Em preparo", accent: "#6366F1" },
  { status: "PRONTO",     label: "Pronto",     accent: "#22C55E" },
  { status: "ENTREGUE",   label: "Entregue",   accent: "#7A736E" },
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
      <div className="h-full flex items-center justify-center bg-bordeaux-900">
        <p className="text-ink-500 font-mono text-sm">Carregando pedidos...</p>
      </div>
    );
  }

  const pendingCount = items.filter((i) => i.status !== "ENTREGUE").length;

  return (
    <div className="h-full flex flex-col bg-bordeaux-900">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-8 pb-4 border-b border-bordeaux-800">
        <span className="text-xs font-mono text-champagne tracking-widest uppercase">
          Cozinha · Ao vivo
        </span>
        <span className="text-xs text-ink-500 font-mono">{pendingCount} pendentes</span>
        <button onClick={logout} className="ml-auto text-xs text-ink-500 hover:text-ink-300 transition-colors">
          Sair
        </button>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-hidden">
        <div className="flex gap-2 p-3 h-full">
          {COLUMNS.map(({ status, label, accent }) => {
            const col = byStatus[status] ?? [];
            return (
              <div key={status} className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex items-center gap-2 px-1">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                  <span className="text-xs font-mono text-ink-300 uppercase tracking-wider">{label}</span>
                  <span className="ml-auto text-xs font-mono text-ink-500">{col.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 pb-2">
                  {col.length === 0 && (
                    <div className="text-ink-700 text-xs text-center py-6 font-mono">—</div>
                  )}
                  {col.map((item) => {
                    const isPending = pendingItems.has(item.id);
                    const nextStatus = NEXT_STATUS[item.status];
                    const prevStatus = PREV_STATUS[item.status];
                    return (
                      <KanbanCard
                        key={item.id}
                        item={item}
                        accent={accent}
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
