"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { KpiCard } from "@/components/ui/KpiCard";
import { KpiCardSkeleton } from "@/components/KpiCardSkeleton";
import { PageHead } from "@/components/ui/PageHead";
import { EventSelector } from "@/components/ui/EventSelector";
import { TableRowsSkeleton } from "@/components/TableRowsSkeleton";
import { useOrderItems } from "@/lib/hooks/useOrders";

export default function ConsumptionReportPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const eventId = selectedEventId ?? undefined;

  const { data: items = [], isLoading } = useOrderItems(eventId);

  const delivered = items.filter((i) => i.status === "ENTREGUE");
  const paidDelivered = delivered.filter((i) => !i.courtesy);
  const courtesyCount = delivered.filter((i) => i.courtesy).length;

  const byProduct = paidDelivered.reduce<Record<string, { name: string; category: string; qty: number }>>(
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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <PageHead eyebrow="Relatórios · Consumo" title="Relatório de consumo" sub="Ranking de produtos mais pedidos no evento" />
        <div className="sm:pt-1 flex-shrink-0">
          <EventSelector value={eventId ?? null} onChange={setSelectedEventId} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }, (_, i) => <KpiCardSkeleton key={i} />)
        ) : (
          <>
            <KpiCard label="Itens entregues" value={total} valueClassName="text-status-success-fg" />
            <KpiCard label="Produtos distintos" value={ranked.length} />
            <KpiCard label="Cortesias" value={courtesyCount} sub="não contam no ranking" />
            <KpiCard label="Mais pedido" value={top?.name ?? "—"} sub={top ? `${top.qty}× pedido` : undefined} />
          </>
        )}
      </div>

      <Panel title="Ranking de consumo">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                {[
                  { label: "#" },
                  { label: "Produto" },
                  { label: "Categoria", hide: "hidden sm:table-cell" },
                  { label: "Quantidade" },
                ].map(({ label, hide }) => (
                  <th
                    key={label}
                    className={`font-mono text-[10px] tracking-widest text-muted-foreground/70 uppercase text-left px-5 py-3 ${hide ?? ""}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <TableRowsSkeleton
                  columns={[
                    { width: "w-4" },
                    {},
                    { hide: "hidden sm:table-cell" },
                    {},
                  ]}
                />
              )}
              {!isLoading && ranked.map((row, i) => (
                <tr key={row.name} className="border-b border-border/60 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground/70">{i + 1}</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{row.name}</td>
                  <td className="hidden sm:table-cell px-5 py-3 font-mono text-xs text-muted-foreground">{row.category}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${total > 0 ? (row.qty / top.qty) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground w-6 text-right">{row.qty}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && ranked.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-sm text-muted-foreground/70 py-10">
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
