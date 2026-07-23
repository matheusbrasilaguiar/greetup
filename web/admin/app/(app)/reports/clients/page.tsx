"use client";

import { Panel } from "@/components/ui/Panel";
import { KpiCard } from "@/components/ui/KpiCard";
import { KpiCardSkeleton } from "@/components/KpiCardSkeleton";
import { PageHead } from "@/components/ui/PageHead";
import { TableRowsSkeleton } from "@/components/TableRowsSkeleton";
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
        {isLoading ? (
          <>
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </>
        ) : (
          <>
            <KpiCard label="Total de clientes" value={clients.length} />
            <KpiCard label="Cadastrados hoje" value={todayCount} />
          </>
        )}
      </div>

      <Panel title="Clientes atendidos">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                {[
                  { label: "Nome" },
                  { label: "Empresa", hide: "hidden sm:table-cell" },
                  { label: "E-mail", hide: "hidden md:table-cell" },
                  { label: "Telefone", hide: "hidden lg:table-cell" },
                  { label: "Cadastrado em", hide: "hidden md:table-cell" },
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
                    {},
                    { hide: "hidden sm:table-cell" },
                    { hide: "hidden md:table-cell" },
                    { hide: "hidden lg:table-cell" },
                    { hide: "hidden md:table-cell" },
                  ]}
                />
              )}
              {!isLoading && clients.map((c) => (
                <tr key={c.id} className="border-b border-border/60 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{c.name}</td>
                  <td className="hidden sm:table-cell px-5 py-3 text-sm text-muted-foreground">{c.employer ?? "—"}</td>
                  <td className="hidden md:table-cell px-5 py-3 font-mono text-xs text-muted-foreground">{c.email ?? "—"}</td>
                  <td className="hidden lg:table-cell px-5 py-3 font-mono text-xs text-muted-foreground">{c.phone ?? "—"}</td>
                  <td className="hidden md:table-cell px-5 py-3 font-mono text-xs text-muted-foreground/70">
                    {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
              {!isLoading && clients.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-muted-foreground/70 py-10">
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
