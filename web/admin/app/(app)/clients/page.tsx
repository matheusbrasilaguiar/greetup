"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { PageHead } from "@/components/ui/PageHead";
import { useClients, useClientById } from "@/lib/hooks/useClients";

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <span
      className="rounded-full flex items-center justify-center font-medium flex-shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size > 40 ? 20 : 13,
        background: "var(--gu-cream-100)",
        color: "var(--gu-bordeaux-700)",
      }}
    >
      {initials}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid gap-3.5 py-[5px]" style={{ gridTemplateColumns: "120px 1fr" }}>
      <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--gu-ink-500)" }}>
        {label}
      </span>
      <span className="text-sm" style={{ color: value ? "var(--gu-ink-700)" : "var(--gu-ink-300)" }}>
        {value ?? "—"}
      </span>
    </div>
  );
}

export default function ClientsPage() {
  const { data: clients = [], isLoading } = useClients();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: detail } = useClientById(selectedId);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.employer ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-[18px]">
    <PageHead eyebrow="Evento ao vivo · Clientes" title="Clientes" sub="Histórico de visitantes cadastrados" />
    <div className="grid gap-[18px]" style={{ gridTemplateColumns: "1.55fr 0.85fr", height: "calc(100vh - 14rem)" }}>
      {/* Lista */}
      <Panel title="Clientes" className="flex flex-col overflow-hidden">
        {/* Search */}
        <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--gu-cream-200)" }}>
          <input
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition focus:ring-1 focus:ring-bordeaux-500 focus:border-bordeaux-500"
            style={{
              background: "var(--gu-cream-50)",
              border: "1px solid var(--gu-cream-200)",
              color: "var(--gu-ink-900)",
            }}
            placeholder="Buscar por nome ou empresa…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabela */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr style={{ borderBottom: "1px solid var(--gu-cream-200)" }}>
                {["Nome", "Empresa", "E-mail"].map((h) => (
                  <th key={h} className="font-mono text-[10px] tracking-widest uppercase text-left px-5 py-3" style={{ color: "var(--gu-ink-300)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={3} className="text-center text-sm py-10" style={{ color: "var(--gu-ink-300)" }}>Carregando…</td></tr>
              )}
              {filtered.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => setSelectedId(client.id)}
                  className="cursor-pointer transition-colors"
                  style={{
                    borderBottom: "1px solid var(--gu-cream-100)",
                    background: selectedId === client.id ? "var(--gu-cream-100)" : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (selectedId !== client.id)
                      (e.currentTarget as HTMLElement).style.background = "var(--gu-cream-50)";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedId !== client.id)
                      (e.currentTarget as HTMLElement).style.background = "";
                  }}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={client.name} />
                      <span className="text-sm font-medium" style={{ color: "var(--gu-ink-900)" }}>{client.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm" style={{ color: "var(--gu-ink-500)" }}>{client.employer ?? "—"}</td>
                  <td className="px-5 py-3 font-mono text-xs" style={{ color: "var(--gu-ink-500)" }}>{client.email ?? "—"}</td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={3} className="text-center text-sm py-10" style={{ color: "var(--gu-ink-300)" }}>Nenhum cliente encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Detalhe */}
      {!detail ? (
        <Panel className="flex items-center justify-center">
          <p className="text-sm" style={{ color: "var(--gu-ink-300)" }}>Selecione um cliente</p>
        </Panel>
      ) : (
        <Panel title="Dados do cliente" className="overflow-y-auto">
          <div className="p-5 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-3.5 pb-3.5" style={{ borderBottom: "1px solid var(--gu-cream-200)" }}>
              <Avatar name={detail.name} size={54} />
              <div>
                <h3 className="text-base font-semibold" style={{ color: "var(--gu-ink-900)" }}>
                  {detail.name}
                </h3>
                {detail.employer && (
                  <p className="text-sm" style={{ color: "var(--gu-ink-500)" }}>
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
