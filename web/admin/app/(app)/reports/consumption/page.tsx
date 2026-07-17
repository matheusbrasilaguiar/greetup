"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { KpiCard } from "@/components/ui/KpiCard";
import { PageHead } from "@/components/ui/PageHead";
import { EventSelector } from "@/components/ui/EventSelector";
import { useOrderItems } from "@/lib/hooks/useOrders";
import { useEvents } from "@/lib/hooks/useEvents";

export default function ConsumptionReportPage() {
  const { data: events = [] } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const eventId = selectedEventId ?? events[0]?.id ?? undefined;

  const { data: items = [], isLoading } = useOrderItems(eventId);

  const delivered = items.filter((i) => i.status === "ENTREGUE");

  const byProduct = delivered.reduce<Record<string, { name: string; category: string; qty: number }>>(
    (acc, item) => {
      const id = item.product.id;
      if (!acc[id]) {
        acc[id] = { name: item.product.name, category: item.product.category, qty: 0 };
      }
      acc[id].qty += item.quantity;
      return acc;
    },
    {}
  );

  const ranked = Object.entries(byProduct)
    .map(([, v]) => v)
    .sort((a, b) => b.qty - a.qty);

  const top = ranked[0];
  const total = ranked.reduce((s, r) => s + r.qty, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <PageHead eyebrow="Relatórios · Consumo" title="Relatório de consumo" sub="Ranking de produtos mais pedidos no evento" />
        <div className="pt-1">
          <EventSelector value={eventId ?? null} onChange={setSelectedEventId} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Itens entregues" value={total} valueColor="var(--gu-ready-tx)" />
        <KpiCard label="Produtos distintos" value={ranked.length} />
        <KpiCard label="Mais pedido" value={top?.name ?? "—"} sub={top ? `${top.qty}× pedido` : undefined} />
      </div>

      <Panel title="Ranking de consumo">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200">
                {["#", "Produto", "Categoria", "Quantidade"].map((h) => (
                  <th
                    key={h}
                    className="font-mono text-[10px] tracking-widest text-ink-300 uppercase text-left px-5 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={4} className="text-center text-sm text-ink-300 py-10">Carregando…</td>
                </tr>
              )}
              {ranked.map((row, i) => (
                <tr key={row.name} className="border-b border-cream-100 hover:bg-cream-50 transition">
                  <td className="px-5 py-3 font-mono text-xs text-ink-300">{i + 1}</td>
                  <td className="px-5 py-3 text-sm font-medium text-ink-900">{row.name}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-500">{row.category}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-cream-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-bordeaux-700"
                          style={{ width: `${total > 0 ? (row.qty / top.qty) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-ink-700 w-6 text-right">{row.qty}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && ranked.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-sm text-ink-300 py-10">
                    Nenhum item entregue ainda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
