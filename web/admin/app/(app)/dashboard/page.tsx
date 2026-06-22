"use client";

import { KpiCard } from "@/components/ui/KpiCard";
import { Panel } from "@/components/ui/Panel";
import { Badge, statusToBadge } from "@/components/ui/Badge";
import { useTables } from "@/lib/hooks/useTables";
import { useOrders } from "@/lib/hooks/useOrders";

export default function DashboardPage() {
  const { data: tables = [] } = useTables();
  const { data: orders = [] } = useOrders();

  const occupied = tables.filter((t) => t.status === "OCCUPIED").length;
  const total = tables.length;
  const openOrders = orders.filter((o) => o.status === "OPEN").length;
  const awaitingDelivery = orders
    .flatMap((o) => o.items)
    .filter((i) => i.status === "PRONTO").length;
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-6">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="Mesas ocupadas"
          value={`${occupied}/${total}`}
          sub={total > 0 ? `${Math.round((occupied / total) * 100)}% de ocupação` : undefined}
        />
        <KpiCard label="Pedidos em aberto" value={openOrders} />
        <KpiCard label="Aguardando entrega" value={awaitingDelivery} sub="itens com status PRONTO" />
        <KpiCard label="Total de mesas" value={total} />
      </div>

      {/* Últimos pedidos */}
      <Panel title="Últimos pedidos">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200">
                {["Mesa", "Gerente", "Itens", "Status", "Horário"].map((h) => (
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
              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-sm text-ink-300 py-10 font-sans"
                  >
                    Nenhum pedido ainda
                  </td>
                </tr>
              )}
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-cream-100 hover:bg-cream-50 transition"
                >
                  <td className="px-5 py-3 font-mono text-sm text-ink-900">
                    {order.session.table.code}
                  </td>
                  <td className="px-5 py-3 text-sm text-ink-700">
                    {order.session.attendant?.name ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-sm text-ink-700">{order.items.length}</td>
                  <td className="px-5 py-3">
                    <Badge variant={statusToBadge(order.status)} label={order.status} />
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-300">
                    {new Date(order.createdAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
