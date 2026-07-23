"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { PageHead } from "@/components/ui/PageHead";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TableRowsSkeleton } from "@/components/TableRowsSkeleton";
import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { useClients, useClientById } from "@/lib/hooks/useClients";

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid gap-3.5 py-[5px]" style={{ gridTemplateColumns: "120px 1fr" }}>
      <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
        {label}
      </span>
      <span className={cn("text-sm", value ? "text-muted-foreground" : "text-muted-foreground/50")}>
        {value ?? "—"}
      </span>
    </div>
  );
}

export default function ClientsPage() {
  const { data: clients = [], isLoading } = useClients();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: detail, isLoading: loadingDetail } = useClientById(selectedId);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.employer ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-[18px]">
      <PageHead eyebrow="Evento ao vivo · Clientes" title="Clientes" sub="Histórico de visitantes cadastrados" />
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_0.85fr] gap-[18px] lg:h-[calc(100vh-14rem)]">
        {/* Lista */}
        <Panel title="Clientes" className="flex flex-col overflow-hidden">
          {/* Search */}
          <div className="px-4 py-3 border-b border-border">
            <Input
              placeholder="Buscar por nome ou empresa…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Tabela */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border">
                  {[
                    { label: "Nome" },
                    { label: "Empresa", hide: "hidden sm:table-cell" },
                    { label: "E-mail", hide: "hidden md:table-cell" },
                  ].map(({ label, hide }) => (
                    <th key={label} className={`font-mono text-[10px] tracking-widest uppercase text-left px-5 py-3 text-muted-foreground/70 ${hide ?? ""}`}>
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
                    ]}
                  />
                )}
                {!isLoading && filtered.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => setSelectedId(client.id)}
                    className={cn(
                      "cursor-pointer transition-colors border-b border-border/60",
                      selectedId === client.id ? "bg-muted" : "hover:bg-muted/50"
                    )}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={client.name} />
                        <span className="text-sm font-medium text-foreground">{client.name}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-5 py-3 text-sm text-muted-foreground">{client.employer ?? "—"}</td>
                    <td className="hidden md:table-cell px-5 py-3 font-mono text-xs text-muted-foreground">{client.email ?? "—"}</td>
                  </tr>
                ))}
                {!isLoading && filtered.length === 0 && (
                  <tr><td colSpan={3} className="text-center text-sm text-muted-foreground/70 py-10">Nenhum cliente encontrado</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Detalhe */}
        {loadingDetail ? (
          <Panel title="Dados do cliente" className="overflow-y-auto">
            <div className="p-5 flex flex-col gap-5">
              <div className="flex items-center gap-3.5 pb-3.5 border-b border-border">
                <Skeleton className="size-[54px] rounded-full shrink-0" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} className="h-3.5 w-full" />
                ))}
              </div>
            </div>
          </Panel>
        ) : !detail ? (
          <Panel className="flex items-center justify-center">
            <p className="text-sm text-muted-foreground/70">Selecione um cliente</p>
          </Panel>
        ) : (
          <Panel title="Dados do cliente" className="overflow-y-auto">
            <div className="p-5 flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-center gap-3.5 pb-3.5 border-b border-border">
                <Avatar name={detail.name} size={54} />
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {detail.name}
                  </h3>
                  {detail.employer && (
                    <p className="text-sm text-muted-foreground">
                      {detail.employer}
                    </p>
                  )}
                </div>
              </div>

              {/* Campos */}
              <div>
                <DetailRow label="E-mail" value={detail.email} />
                <DetailRow label="Telefone" value={detail.phone} />
                <DetailRow label="Empresa" value={detail.employer} />
                <DetailRow
                  label="Cadastrado"
                  value={new Date(detail.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                />
              </div>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
