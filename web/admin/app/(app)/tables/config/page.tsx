"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Badge, statusToBadge } from "@/components/ui/Badge";
import { PageHead } from "@/components/ui/PageHead";
import { useTables, useCreateTable, useUpdateTableStatus } from "@/lib/hooks/useTables";

function CreateTableModal({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateTable();
  const [code, setCode] = useState("");
  const [capacity, setCapacity] = useState(4);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await mutateAsync({ code, capacity });
      onClose();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erro ao criar mesa"
      );
    }
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-cream-200 bg-cream-50 text-ink-900 text-sm outline-none focus:border-bordeaux-500 focus:ring-1 focus:ring-bordeaux-500 transition";

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-cream-200 w-full max-w-sm p-6 shadow-xl">
        <h3 className="font-sans text-base font-semibold text-ink-900 mb-5">Nova mesa</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] tracking-widest text-ink-500 uppercase">
              Código
            </label>
            <input
              className={inputClass}
              placeholder="Ex: M01"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] tracking-widest text-ink-500 uppercase">
              Capacidade
            </label>
            <input
              type="number"
              className={inputClass}
              value={capacity}
              min={1}
              max={20}
              onChange={(e) => setCapacity(Number(e.target.value))}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-[var(--gu-canceled-tx)] bg-[var(--gu-canceled-bg)] border border-[var(--gu-canceled-br)] rounded-lg px-4 py-2">
              {error}
            </p>
          )}
          <div className="flex gap-3 justify-end mt-1">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              Criar mesa
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TablesConfigPage() {
  const { data: tables = [], isLoading } = useTables();
  const { mutate: updateStatus } = useUpdateTableStatus();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <PageHead
        eyebrow="Configuração · Mesas"
        title="Configuração de mesas"
        sub="Gerencie as mesas disponíveis para o evento"
        actions={<Button onClick={() => setShowCreate(true)}>+ Nova mesa</Button>}
      />

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200">
                {["Código", "Capacidade", "Status", "Ações"].map((h) => (
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
              {!isLoading && tables.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-sm text-ink-300 py-10">
                    Nenhuma mesa cadastrada
                  </td>
                </tr>
              )}
              {tables.map((table) => (
                <tr key={table.id} className="border-b border-cream-100 hover:bg-cream-50 transition">
                  <td className="px-5 py-3 font-mono text-sm font-medium text-ink-900">
                    {table.code}
                  </td>
                  <td className="px-5 py-3 text-sm text-ink-700">{table.capacity}</td>
                  <td className="px-5 py-3">
                    <Badge variant={statusToBadge(table.status)} />
                  </td>
                  <td className="px-5 py-3">
                    {table.status !== "OCCUPIED" && (
                      <button
                        onClick={() =>
                          updateStatus({
                            id: table.id,
                            status: table.status === "OPEN" ? "CLOSED" : "OPEN",
                          })
                        }
                        className="text-xs text-bordeaux-700 hover:underline font-sans"
                      >
                        {table.status === "OPEN" ? "Desativar" : "Ativar"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {showCreate && <CreateTableModal onClose={() => setShowCreate(false)} />}
    </>
  );
}
