"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderItems, OrderItem } from "@/lib/hooks/useOrderItems";
import { useSocketEvents } from "@/lib/hooks/useSocketEvents";
import { useAuth } from "@/lib/hooks/useAuth";

export default function DisplayPage() {
  const { logout } = useAuth();
  const { data: items = [] } = useOrderItems();
  const qc = useQueryClient();
  const [clock, setClock] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      setClock(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
      );
    }
    tick();
    const t = setInterval(tick, 10_000);
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

  const prontos = useMemo(
    () => items.filter((i) => i.status === "PRONTO"),
    [items]
  );

  const entregues = useMemo(
    () =>
      items
        .filter((i) => i.status === "ENTREGUE")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10),
    [items]
  );

  return (
    <div className="min-h-screen flex flex-col bg-bordeaux-900 select-none">
      {/* Top bar */}
      <div className="flex items-center px-6 py-4 border-b border-bordeaux-800">
        <Arch />
        <span className="ml-3 font-semibold text-cream-50 tracking-tight">GreetUp</span>
        <span className="mx-3 w-px h-5 bg-bordeaux-700" />
        <span className="text-xs font-mono text-champagne tracking-widest uppercase">
          Display · Feirinha
        </span>
        <span className="font-mono text-cream-50 text-lg tracking-tight">{clock}</span>
        <button onClick={logout} className="ml-4 text-xs text-ink-500 hover:text-ink-300 transition-colors">
          Sair
        </button>
      </div>

      {/* Columns */}
      <div className="flex flex-1 overflow-hidden">
        {/* PRONTO */}
        <div className="flex-1 flex flex-col border-r border-bordeaux-800">
          <ColumnHeader
            label="Pronto para entrega"
            dot="#22C55E"
            count={prontos.length}
          />
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {prontos.length === 0 ? (
              <p className="text-ink-700 text-sm text-center py-8 font-mono">—</p>
            ) : (
              prontos.map((item) => (
                <DisplayCard key={item.id} item={item} accent="#22C55E" />
              ))
            )}
          </div>
        </div>

        {/* ENTREGUE */}
        <div className="flex-1 flex flex-col">
          <ColumnHeader
            label="Entregues · Recentes"
            dot="#7A736E"
            count={entregues.length}
          />
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 opacity-60">
            {entregues.length === 0 ? (
              <p className="text-ink-700 text-sm text-center py-8 font-mono">—</p>
            ) : (
              entregues.map((item) => (
                <DisplayCard key={item.id} item={item} accent="#7A736E" />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ColumnHeader({
  label,
  dot,
  count,
}: {
  label: string;
  dot: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-bordeaux-800">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />
      <span className="text-xs font-mono text-cream-100 uppercase tracking-wider">{label}</span>
      <span className="ml-auto text-xs font-mono bg-bordeaux-900 text-cream-100 px-2 py-0.5 rounded-full">
        {count}
      </span>
    </div>
  );
}

function DisplayCard({ item, accent }: { item: OrderItem; accent: string }) {
  const customer = item.order.session.customer;
  const orderId = item.orderId.slice(-4).toUpperCase();

  return (
    <div
      className="bg-cream-50 rounded-xl overflow-hidden"
      style={{ borderLeft: `5px solid ${accent}` }}
    >
      <div className="px-4 py-3">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="font-semibold text-ink-900 text-3xl leading-none tracking-tight">
            {customer?.name ?? "—"}
          </span>
          <span className="text-xs font-mono text-ink-500 shrink-0">#{orderId}</span>
        </div>
        <p className="text-ink-700 text-base">
          <span className="font-mono text-bordeaux-700 mr-1">{item.quantity}×</span>
          {item.product.name}
        </p>
      </div>
    </div>
  );
}

function Arch() {
  return (
    <svg width="26" height="26" viewBox="0 0 44 44" fill="none">
      <path
        d="M5.5 44V20.17C5.5 10.98 12.98 3.5 22.17 3.5 31.36 3.5 38.5 10.98 38.5 20.17V44"
        stroke="#D9B58A"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <circle cx="22" cy="23.84" r="3" fill="#FBF7EF" />
    </svg>
  );
}
