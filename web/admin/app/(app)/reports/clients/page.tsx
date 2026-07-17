"use client";

import { Panel } from "@/components/ui/Panel";
import { KpiCard } from "@/components/ui/KpiCard";
import { PageHead } from "@/components/ui/PageHead";
import { useClients } from "@/lib/hooks/useClients";

export default function ClientsReportPage() {
  const { data: clients = [], isLoading } = useClients();

  const today = new Date().toDateString();
  const todayCount = clients.filter(
    (c) => new Date(c.createdAt).toDateString() === today
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHead eyebrow="Relatórios · Clientes" title="Relatório de clientes" sub="Clientes atendidos durante o evento" />

      <div className="grid grid-cols-2 gap-4">
        <KpiCard label="Total de clientes" value={clients.length} />
        <KpiCard label="Cadastrados hoje" value={todayCount} />
      </div>

      <Panel title="Clientes atendidos">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-cream-200">
                {["Nome", "Empresa", "E-mail", "Telefone", "Cadastrado em"].map((h) => (
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
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-cream-100 hover:bg-cream-50 transition">
                  <td className="px-5 py-3 text-sm font-medium text-ink-900">{c.name}</td>
                  <td className="px-5 py-3 text-sm text-ink-500">{c.employer ?? "—"}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-500">{c.email ?? "—"}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-500">{c.phone ?? "—"}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-300">
                    {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
              {!isLoading && clients.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-ink-300 py-10">
                    Nenhum cliente cadastrado
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
