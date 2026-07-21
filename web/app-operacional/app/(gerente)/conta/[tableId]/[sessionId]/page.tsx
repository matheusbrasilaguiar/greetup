"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionOrders, useCloseOrder, type OrderItem } from "@/lib/hooks/useOrders";
import { useCloseSession } from "@/lib/hooks/useSessions";
import { useSocketEvents } from "@/lib/hooks/useSocket";
import { useAuth } from "@/lib/hooks/useAuth";
import { ItemStatusBadge } from "@/components/ItemStatusBadge";
import { Banner } from "@/components/Banner";
import { BottomSheet } from "@/components/BottomSheet";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function useDuration(openedAt: string) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  return Math.floor((now - new Date(openedAt).getTime()) / 60_000);
}

export default function ContaPage() {
  const router = useRouter();
  const { tableId, sessionId } = useParams<{ tableId: string; sessionId: string }>();
  const { logout } = useAuth();
  const qc = useQueryClient();

  const { data: orders = [], isLoading } = useSessionOrders(sessionId);
  const closeOrder = useCloseOrder();
  const closeSession = useCloseSession();

  const [banner, setBanner] = useState<string | null>(null);
  const [showCloseSheet, setShowCloseSheet] = useState(false);
  const [closing, setClosing] = useState(false);

  // Flat list of all items across all orders
  const flatItems = useMemo(() => {
    return orders.flatMap((order) =>
      order.items.map((item) => ({ ...item, order }))
    );
  }, [orders]);

  const openOrders = orders.filter((o) => o.status === "OPEN");
  const deliveredCount = flatItems.filter((i) => i.status === "ENTREGUE").length;

  // Detect session openedAt from the first order or use now as fallback
  const sessionOpenedAt = orders[0]?.createdAt ?? new Date().toISOString();
  const durationMin = useDuration(sessionOpenedAt);

  const customerName = orders[0]?.session?.customer?.name;
  const tableCode = orders[0]?.session?.table?.code;

  const socketHandlers = useCallback(
    () => ({
      order_item_status_changed: (data: unknown) => {
        qc.invalidateQueries({ queryKey: ["orders", "session", sessionId] });
        const d = data as { status?: string; productName?: string };
        if (d?.status === "PRONTO" && d?.productName) {
          setBanner(`${d.productName} pronto para entrega!`);
        }
      },
      order_created: () => {
        qc.invalidateQueries({ queryKey: ["orders", "session", sessionId] });
      },
    }),
    [qc, sessionId]
  );
  useSocketEvents(socketHandlers());

  async function handleCloseAccount() {
    if (closing) return;
    setClosing(true);
    try {
      // Close all open orders
      await Promise.all(openOrders.map((o) => closeOrder.mutateAsync(o.id)));
      // Close the session
      await closeSession.mutateAsync({ tableId, sessionId });
      router.push("/mesas");
    } catch {
      setClosing(false);
    }
  }

  return (
    <div className="h-full flex flex-col bg-cream-50">
      {/* Header */}
      <div className="bg-bordeaux-900 px-4 pt-10 pb-5">
        <button
          onClick={() => router.push("/mesas")}
          className="text-xs text-ink-400 mb-3 flex items-center gap-1"
        >
          ← Mesas
        </button>
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs font-mono text-champagne tracking-widest uppercase mb-1">
              {tableCode ? `Mesa ${tableCode}` : "Conta ativa"}
            </p>
            <h1 className="text-xl font-semibold text-cream-50 truncate">
              {customerName ?? "Atendimento"}
            </h1>
          </div>
          <button
            onClick={logout}
            className="text-xs text-ink-500 hover:text-ink-300 transition-colors"
          >
            Sair
          </button>
        </div>

        {/* Duration pill */}
        <div className="flex items-center gap-2 mt-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-champagne opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-champagne" />
          </span>
          <p className="text-xs text-ink-300 font-mono">
            Conta aberta há {durationMin}min
          </p>
        </div>
      </div>

      {/* Banner */}
      <Banner message={banner} onDismiss={() => setBanner(null)} />

      {/* Items list */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <p className="text-ink-400 text-sm text-center py-16 font-mono">Carregando...</p>
        ) : flatItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-ink-400 text-sm">Nenhum pedido ainda.</p>
            <p className="text-xs text-ink-300 mt-1">Faça o primeiro pedido abaixo.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden border border-cream-200">
            {flatItems.map((item, i) => (
              <FlatItem key={item.id} item={item} isLast={i === flatItems.length - 1} />
            ))}
          </div>
        )}

        {/* Summary */}
        {flatItems.length > 0 && (
          <div className="mt-4 bg-white rounded-2xl border border-cream-200 px-4 py-3 flex justify-between">
            <span className="text-xs text-ink-500 font-mono uppercase tracking-wider">
              Itens entregues
            </span>
            <span className="text-sm font-semibold text-ink-900">
              {deliveredCount} / {flatItems.length}
            </span>
          </div>
        )}

        <div className="h-28" />
      </div>

      {/* CTA buttons */}
      <div className="fixed bottom-0 left-0 right-0 pb-safe px-4 pt-4 bg-cream-50 border-t border-cream-200 flex flex-col gap-2">
        <button
          onClick={() => router.push(`/mesas/${tableId}/pedido?sessionId=${sessionId}`)}
          className="w-full rounded-xl py-3 text-sm font-semibold border-2 border-bordeaux-700 text-bordeaux-700 transition-colors active:bg-bordeaux-50"
        >
          + Novo pedido
        </button>
        <button
          onClick={() => setShowCloseSheet(true)}
          className="w-full rounded-xl py-3 text-sm font-semibold text-red-600"
        >
          Fechar conta
        </button>
      </div>

      {/* Close account bottom sheet */}
      <BottomSheet
        open={showCloseSheet}
        onClose={() => setShowCloseSheet(false)}
        title="Fechar conta"
      >
        <div className="flex flex-col gap-4">
          {/* Summary */}
          <div className="bg-cream-50 rounded-xl p-4 flex flex-col gap-2">
            {[
              { label: "Cliente", value: customerName ?? "—" },
              { label: "Itens entregues", value: `${deliveredCount}` },
              { label: "Total de itens", value: `${flatItems.length}` },
              { label: "Duração", value: `${durationMin}min` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-xs text-ink-500">{label}</span>
                <span className="text-sm font-medium text-ink-900">{value}</span>
              </div>
            ))}
          </div>

          {openOrders.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-700">
                {openOrders.length} {openOrders.length === 1 ? "pedido ainda em aberto" : "pedidos ainda em aberto"} — serão fechados automaticamente.
              </p>
            </div>
          )}

          <button
            onClick={handleCloseAccount}
            disabled={closing}
            className="w-full rounded-xl py-4 font-semibold text-sm transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#EF4444", color: "#fff" }}
          >
            {closing ? "Fechando..." : "Confirmar fechamento"}
          </button>

          <button
            onClick={() => setShowCloseSheet(false)}
            className="w-full text-sm text-ink-500 py-2"
          >
            Cancelar
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}

function FlatItem({ item, isLast }: { item: OrderItem; isLast: boolean }) {
  const isDelivered = item.status === "ENTREGUE";
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${!isLast ? "border-b border-cream-100" : ""}`}
      style={{ opacity: isDelivered ? 0.7 : 1 }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink-900">
          <span className="font-mono text-bordeaux-700 mr-1">{item.quantity}×</span>
          {item.product.name}
        </p>
        {item.notes && (
          <p className="text-xs text-ink-400 mt-0.5 italic">{item.notes}</p>
        )}
        <p className="text-xs text-ink-300 mt-0.5 font-mono">
          {isDelivered ? "Entregue às" : "Pedido às"} {formatTime(item.createdAt)}
        </p>
      </div>
      <ItemStatusBadge status={item.status} />
    </div>
  );
}
