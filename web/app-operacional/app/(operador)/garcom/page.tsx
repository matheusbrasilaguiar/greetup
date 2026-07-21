"use client";

import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderItems, type KanbanItem, useAdvanceItemStatus } from "@/lib/hooks/useOrderItems";
import { useSocketEvents } from "@/lib/hooks/useSocket";
import { useAuth } from "@/lib/hooks/useAuth";
import { Banner } from "@/components/Banner";

export default function GarcomPage() {
  const { logout } = useAuth();
  const { data: items = [], isLoading } = useOrderItems("PRONTO", "active");
  const advance = useAdvanceItemStatus();
  const qc = useQueryClient();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [banner, setBanner] = useState<string | null>(null);
  const [deliveringGroups, setDeliveringGroups] = useState<Set<string>>(new Set());

  const socketHandlers = useCallback(
    () => ({
      order_item_status_changed: (data: unknown) => {
        qc.invalidateQueries({ queryKey: ["order-items"] });
        const d = data as { status?: string; tableCode?: string };
        if (d?.status === "PRONTO") {
          setBanner(`Novo item pronto · Mesa ${d.tableCode ?? ""}`);
        }
      },
    }),
    [qc]
  );
  useSocketEvents(socketHandlers());

  const byCustomer = useMemo(() => {
    const map = new Map<string, { key: string; name: string; items: KanbanItem[] }>();
    for (const item of items) {
      const customer = item.order.session.customer;
      const name = customer?.name ?? "Sem nome";
      const key = customer?.id ?? name;
      if (!map.has(key)) map.set(key, { key, name, items: [] });
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
    <div className="min-h-screen flex flex-col bg-cream-50">
      {/* Header */}
      <div className="bg-bordeaux-900 px-4 pt-10 pb-5">
        <p className="text-xs font-mono text-champagne tracking-widest uppercase mb-1">
          GreetUp · Garçom
        </p>
        <h1 className="text-xl font-semibold text-cream-50 tracking-tight">Itens prontos</h1>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-ink-300">
            {byCustomer.length} {byCustomer.length === 1 ? "cliente" : "clientes"} aguardando
          </p>
          <button onClick={logout} className="text-xs text-ink-500 hover:text-ink-300 transition-colors">
            Sair
          </button>
        </div>
      </div>

      {/* Banner */}
      <Banner message={banner} onDismiss={() => setBanner(null)} />

      {/* Lista */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <p className="text-ink-500 text-sm text-center py-16 font-mono">Carregando...</p>
        ) : byCustomer.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-4">
            {byCustomer.map(({ key: groupKey, name, items: groupItems }) => {
              const allChecked = groupItems.every((i) => checked[i.id]);
              const delivering = deliveringGroups.has(groupKey);
              return (
                <div key={groupKey} className="bg-white rounded-xl overflow-hidden border border-cream-200">
                  {/* Group header */}
                  <div className="bg-cream-100 px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-ink-900 text-sm">{name}</p>
                      <p className="text-xs text-ink-500 mt-0.5">
                        {groupItems.length} {groupItems.length === 1 ? "item" : "itens"}
                      </p>
                    </div>
                    <span className="text-xs font-mono bg-bordeaux-700 text-cream-50 px-2.5 py-1 rounded-full">
                      {groupItems.length}
                    </span>
                  </div>

                  {/* Items */}
                  {groupItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3 border-t border-cream-200">
                      <div className="flex-1">
                        <p className="text-ink-900 text-sm">
                          <span className="font-mono text-bordeaux-700 mr-1">{item.quantity}×</span>
                          {item.product.name}
                        </p>
                        {(item.withCheese !== null || item.courtesy || item.order?.toGo) && (
                          <div className="flex gap-1 flex-wrap mt-1">
                            {item.withCheese === true  && <GarcomBadge label="COM QUEIJO" bg="#FEF3C7" color="#92400E" />}
                            {item.withCheese === false && <GarcomBadge label="SEM QUEIJO" bg="#F3F4F6" color="#4B5563" />}
                            {item.courtesy             && <GarcomBadge label="CORTESIA"   bg="#DCFCE7" color="#166534" />}
                            {item.order?.toGo          && <GarcomBadge label="LEVAR"      bg="#EFF6FF" color="#1D4ED8" />}
                          </div>
                        )}
                        {item.notes && (
                          <p className="text-amber-700 text-xs mt-0.5 font-medium">Obs: {item.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => toggleCheck(item.id)}
                        className="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ml-3 shrink-0"
                        style={{
                          backgroundColor: checked[item.id] ? "#6B2331" : "white",
                          borderColor: checked[item.id] ? "#6B2331" : "#B0AAA5",
                        }}
                      >
                        {checked[item.id] && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}

                  {/* Confirm button */}
                  <div className="px-4 py-3 border-t border-cream-200">
                    <button
                      disabled={!allChecked || delivering}
                      onClick={() => confirmDelivery(groupKey, groupItems)}
                      className="w-full rounded-lg py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: allChecked && !delivering ? "#6B2331" : "#ECE2CC",
                        color: allChecked && !delivering ? "#FBF7EF" : "#7A736E",
                      }}
                    >
                      {delivering ? "Confirmando..." : "Confirmar entrega"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function GarcomBadge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span className="font-mono text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded" style={{ background: bg, color }}>
      {label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M5 14L11 20L23 8" stroke="#6B2331" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="text-ink-900 font-semibold text-base">Tudo entregue!</p>
      <p className="text-ink-500 text-sm mt-1">Aguardando novos pedidos prontos.</p>
    </div>
  );
}
