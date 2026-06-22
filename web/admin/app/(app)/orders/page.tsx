"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { Badge, statusToBadge } from "@/components/ui/Badge";
import { KpiCard } from "@/components/ui/KpiCard";
import { useOrders } from "@/lib/hooks/useOrders";

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useOrders();
  const [filter, setFilter] = useState("TODOS");

  const STATUS_FILTERS = ["TODOS", "OPEN", "CLOSED"];
  const STATUS_LABELS: Record<string, string> = { TODOS: "Todos", OPEN: "Abertos", CLOSED: "Fechados" };

  const filtered = filter === "TODOS" ? orders : orders.filter((o) => o.status === filter);
  const open = orders.filter((o) => o.status === "OPEN").length;
  const closed = orders.filter((o) => o.status === "CLOSED").length;
  const totalItems = orders.flatMap((o) => o.items).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Pedidos abertos" value={open} />
        <KpiCard label="Pedidos fechados" value={closed} />
        <KpiCard label="Total de itens" value={totalItems} />
      </div>

      <Panel title="Pedidos">
        {/* Filtros */}
        <div className="flex gap-1 px-5 py-3 border-b border-cream-200">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`font-mono text-xs tracking-widest uppercase px-3 py-1.5 rounded-lg transition ${
                filter === s ? "bg-bordeaux-700 text-cream-50" : "text-ink-500 hover:bg-cream-100"
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

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
              {isLoading && (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-ink-300 py-10">Carregando…</td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-ink-300 py-10">
                    Nenhum pedido
                  </td>
                </tr>
              )}
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-cream-100 hover:bg-cream-50 transition">
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
