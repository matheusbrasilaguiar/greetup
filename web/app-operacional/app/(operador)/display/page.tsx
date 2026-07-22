"use client";

import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderItems, type KanbanItem } from "@/lib/hooks/useOrderItems";
import { useSocketEvents } from "@/lib/hooks/useSocket";
import { cn } from "@/lib/utils";

export default function DisplayPage() {
  const { data: items = [] } = useOrderItems(undefined, "active");
  const qc = useQueryClient();

  const ready = useMemo(() => items.filter((i) => i.status === "PRONTO"), [items]);
  const recentDelivered = useMemo(
    () =>
      items
        .filter((i) => i.status === "ENTREGUE")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10),
    [items]
  );

  useSocketEvents({
    order_item_status_changed: () => qc.invalidateQueries({ queryKey: ["order-items"] }),
    order_created: () => qc.invalidateQueries({ queryKey: ["order-items"] }),
  });

  // Wakelock — keep screen on
  useEffect(() => {
    let wakeLock: { release: () => Promise<void> } | null = null;
    async function requestWakeLock() {
      try {
        if ("wakeLock" in navigator) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          wakeLock = await (navigator as any).wakeLock.request("screen");
        }
      } catch {
        // wakeLock not supported — graceful degradation
      }
    }
    requestWakeLock();
    document.addEventListener("visibilitychange", requestWakeLock);
    return () => {
      document.removeEventListener("visibilitychange", requestWakeLock);
      wakeLock?.release();
    };
  }, []);

  // Request fullscreen on mount
  useEffect(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  return (
    <div className="h-full flex flex-col bg-chrome landscape:flex-row">
      {/* Left: Pronto para entrega */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-full bg-status-success-br animate-pulse" />
          <h2 className="text-sm font-mono text-status-success-br uppercase tracking-widest font-semibold">
            Pronto para entrega
          </h2>
          <span className="ml-auto font-mono text-xs text-chrome-muted-foreground">{ready.length}</span>
        </div>

        <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {ready.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-chrome-muted-foreground/60 font-mono text-sm">Nenhum item pronto</p>
            </div>
          )}
          {ready.map((item) => <DisplayCard key={item.id} item={item} highlight />)}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-chrome-border hidden landscape:block" />
      <div className="h-px bg-chrome-border landscape:hidden" />

      {/* Right: Entregues recentes */}
      <div className="flex-1 flex flex-col p-4 opacity-60">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-full bg-chrome-muted-foreground" />
          <h2 className="text-sm font-mono text-chrome-muted-foreground uppercase tracking-widest font-semibold">
            Entregues · Recentes
          </h2>
          <span className="ml-auto font-mono text-xs text-chrome-muted-foreground/70">{recentDelivered.length}</span>
        </div>

        <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {recentDelivered.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-chrome-muted-foreground/60 font-mono text-sm">Nenhum entregue ainda</p>
            </div>
          )}
          {recentDelivered.map((item) => <DisplayCard key={item.id} item={item} highlight={false} />)}
        </div>
      </div>
    </div>
  );
}

function DisplayCard({ item, highlight }: { item: KanbanItem; highlight: boolean }) {
  const customer = item.order.session.customer;
  const tableCode = item.order.session.table.code;

  return (
    <div
      className={cn(
        "rounded-xl p-3 border",
        highlight
          ? "bg-status-success-br/15 border-status-success-br"
          : "bg-chrome-card/40 border-chrome-border"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-chrome-foreground font-semibold text-sm">{customer?.name ?? "—"}</p>
          <p className="text-chrome-muted-foreground font-mono text-xs">{tableCode}</p>
        </div>
      </div>
      <p className="text-chrome-foreground/90 text-sm mt-1">
        <span className="font-mono text-chrome-accent mr-1">{item.quantity}×</span>
        {item.product.name}
      </p>
    </div>
  );
}
