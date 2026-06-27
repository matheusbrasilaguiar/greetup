"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderItems, OrderItem, ItemStatus, useAdvanceItemStatus } from "@/lib/hooks/useOrderItems";
import { useSocketEvents } from "@/lib/hooks/useSocketEvents";
import { useAuth } from "@/lib/hooks/useAuth";

const COLUMNS: { status: ItemStatus; label: string; accent: string }[] = [
  { status: "PENDENTE",   label: "Pendente",   accent: "#D9B58A" },
  { status: "EM_PREPARO", label: "Em preparo", accent: "#6366F1" },
  { status: "PRONTO",     label: "Pronto",     accent: "#22C55E" },
  { status: "ENTREGUE",   label: "Entregue",   accent: "#7A736E" },
];

export default function CozinhaPage() {
  const { logout } = useAuth();
  const { data: items = [], isLoading } = useOrderItems();
  const advance = useAdvanceItemStatus();
  const qc = useQueryClient();
  const [now, setNow] = useState(Date.now());

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
    const map: Record<string, OrderItem[]> = {};
    for (const col of COLUMNS) map[col.status] = [];
    for (const item of items) {
      if (map[item.status]) map[item.status].push(item);
    }
    return map;
  }, [items]);

  async function handleAdvance(item: OrderItem) {
    const next: Record<string, ItemStatus> = {
      PENDENTE: "EM_PREPARO",
      EM_PREPARO: "PRONTO",
    };
    const nextStatus = next[item.status];
    if (!nextStatus) return;
    await advance(item.orderId, item.id, nextStatus);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bordeaux-900">
        <p className="text-ink-500 font-mono text-sm">Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bordeaux-900">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-8 pb-4 border-b border-bordeaux-800">
        <span className="text-xs font-mono text-champagne tracking-widest uppercase">
          Cozinha · Ao vivo
        </span>
        <span className="text-xs text-ink-500 font-mono">
          {items.filter((i) => i.status !== "ENTREGUE").length} pendentes
        </span>
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
                {/* Column header */}
                <div className="flex items-center gap-2 px-1">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: accent }}
                  />
                  <span className="text-xs font-mono text-ink-300 uppercase tracking-wider">
                    {label}
                  </span>
                  <span className="ml-auto text-xs font-mono text-ink-500">{col.length}</span>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 pb-2">
                  {col.length === 0 && (
                    <div className="text-ink-700 text-xs text-center py-6 font-mono">
                      —
                    </div>
                  )}
                  {col.map((item) => (
                    <KanbanCard
                      key={item.id}
                      item={item}
                      accent={accent}
                      now={now}
                      onAction={["PENDENTE", "EM_PREPARO"].includes(item.status)
                        ? () => handleAdvance(item)
                        : undefined}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KanbanCard({
  item,
  accent,
  now,
  onAction,
}: {
  item: OrderItem;
  accent: string;
  now: number;
  onAction?: () => void;
}) {
  const customer = item.order.session.customer;
  const ageMin = Math.floor((now - new Date(item.createdAt).getTime()) / 60_000);
  const late = ageMin > 8;

  return (
    <div
      className="bg-cream-50 rounded-xl overflow-hidden"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div className="px-2 pt-2 pb-1.5">
        {/* Customer + ID */}
        <div className="flex items-start justify-between gap-1 mb-1">
          <p className="text-ink-900 font-semibold text-xs leading-tight truncate">
            {customer?.name ?? "—"}
          </p>
          <span
            className={`text-xs font-mono shrink-0 ${late ? "text-red-500 font-semibold" : "text-ink-500"}`}
          >
            {ageMin}m
          </span>
        </div>

        {/* Product */}
        <p className="text-ink-700 text-xs">
          <span className="font-mono text-bordeaux-700 mr-1">{item.quantity}×</span>
          {item.product.name}
        </p>

        {/* Notes */}
        {item.notes && (
          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
            <p className="text-amber-800 text-xs">
              <span className="font-semibold font-mono">OBS </span>
              {item.notes}
            </p>
          </div>
        )}
      </div>

      {/* Action */}
      {onAction && (
        <div className="px-2 pb-2">
          <button
            onClick={onAction}
            className="w-full rounded-lg py-1.5 text-xs font-semibold transition-colors"
            style={{
              backgroundColor: item.status === "PENDENTE" ? "transparent" : accent,
              color: item.status === "PENDENTE" ? accent : "#FBF7EF",
              border: item.status === "PENDENTE" ? `1.5px solid ${accent}` : "none",
            }}
          >
            {item.status === "PENDENTE" ? "Iniciar preparo" : "Marcar pronto"}
          </button>
        </div>
      )}
    </div>
  );
}
