"use client";

import { useState } from "react";
import { KpiCard } from "@/components/ui/KpiCard";
import { Panel } from "@/components/ui/Panel";
import { PageHead } from "@/components/ui/PageHead";
import { EventSelector } from "@/components/ui/EventSelector";
import { useTables } from "@/lib/hooks/useTables";
import { useOrders, useOrderItems } from "@/lib/hooks/useOrders";
import { useClients } from "@/lib/hooks/useClients";
import { useUsers } from "@/lib/hooks/useUsers";

export default function SummaryReportPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const eventId = selectedEventId ?? undefined;

  const { data: tables = [] } = useTables();
  const { data: orders = [] } = useOrders(eventId);
  const { data: items = [] } = useOrderItems(eventId);
  const { data: clients = [] } = useClients();
  const { data: users = [] } = useUsers();

  const delivered = items.filter((i) => i.status === "ENTREGUE");
  const totalQty = delivered.reduce((s, i) => s + i.quantity, 0);

  const managers = users.filter((u) => u.role === "GERENTE");
  const operators = users.filter((u) => u.role === "OPERADOR");

  const byProduct = delivered.reduce<Record<string, { name: string; qty: number }>>((acc, item) => {
    const id = item.product.id;
    if (!acc[id]) acc[id] = { name: item.product.name, qty: 0 };
    acc[id].qty += item.quantity;
    return acc;
  }, {});

  const topProducts = Object.values(byProduct)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const maxQty = topProducts[0]?.qty ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <PageHead eyebrow="Relatórios · Resumo" title="Resumo do evento" sub="Visão consolidada de todas as métricas" />
        <div className="sm:pt-1 flex-shrink-0">
          <EventSelector value={eventId ?? null} onChange={setSelectedEventId} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Mesas" value={tables.length} />
        <KpiCard label="Clientes atendidos" value={clients.length} />
        <KpiCard label="Pedidos realizados" value={orders.length} />
        <KpiCard label="Itens entregues" value={totalQty} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipe */}
        <Panel title="Equipe">
          <div className="p-5 flex flex-col gap-3">
            {[
              { label: "Gerentes", value: managers.length },
              { label: "Operadores", value: operators.length },
              { label: "Total", value: users.length },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-ink-700">{label}</span>
                <span className="font-mono text-sm font-medium text-ink-900">{value}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Top 5 produtos */}
        <Panel title="Top 5 produtos mais pedidos">
          <div className="p-5 flex flex-col gap-3">
            {topProducts.length === 0 && (
              <p className="text-sm text-ink-300">Nenhum item entregue ainda</p>
            )}
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="font-mono text-xs text-ink-300 w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-ink-700">{p.name}</span>
                    <span className="font-mono text-xs text-ink-500">{p.qty}×</span>
                  </div>
                  <div className="h-1 rounded-full bg-cream-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-bordeaux-700"
                      style={{ width: `${(p.qty / maxQty) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
