"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { useClients, useClientById } from "@/lib/hooks/useClients";

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
    <div className="flex gap-4 h-[calc(100vh-9rem)]">
      {/* Lista */}
      <Panel title="Clientes" className="w-80 flex-shrink-0 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-cream-200">
          <input
            className="w-full px-3 py-2 rounded-lg border border-cream-200 bg-cream-50 text-sm text-ink-900 outline-none focus:border-bordeaux-500 focus:ring-1 focus:ring-bordeaux-500 transition"
            placeholder="Buscar…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <p className="text-sm text-ink-300 text-center py-10">Carregando…</p>
          )}
          {filtered.map((client) => (
            <button
              key={client.id}
              onClick={() => setSelectedId(client.id)}
              className={`w-full text-left px-4 py-3 border-b border-cream-100 transition ${
                selectedId === client.id ? "bg-cream-100" : "hover:bg-cream-50"
              }`}
            >
              <p className="text-sm font-medium text-ink-900">{client.name}</p>
              <p className="text-xs text-ink-500 mt-0.5">{client.employer ?? "—"}</p>
            </button>
          ))}
          {!isLoading && filtered.length === 0 && (
            <p className="text-sm text-ink-300 text-center py-10">Nenhum cliente</p>
          )}
        </div>
      </Panel>

      {/* Detalhe */}
      <div className="flex-1">
        {!detail ? (
          <Panel className="h-full flex items-center justify-center">
            <p className="text-sm text-ink-300">Selecione um cliente</p>
          </Panel>
        ) : (
          <Panel title="Dados do cliente" className="h-full overflow-y-auto">
            <div className="p-5 flex flex-col gap-4">
              <h3 className="font-sans text-xl font-semibold text-ink-900">{detail.name}</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Empresa", value: detail.employer },
                  { label: "E-mail", value: detail.email },
                  { label: "Telefone", value: detail.phone },
                  {
                    label: "Cadastrado em",
                    value: new Date(detail.createdAt).toLocaleDateString("pt-BR"),
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-mono text-[10px] tracking-widest text-ink-300 uppercase mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-ink-700">{value ?? "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
