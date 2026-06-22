"use client";

import { KpiCard } from "@/components/ui/KpiCard";
import { Badge, statusToBadge } from "@/components/ui/Badge";
import { useTables } from "@/lib/hooks/useTables";

export default function TablesLivePage() {
  const { data: tables = [], isLoading } = useTables();

  const occupied = tables.filter((t) => t.status === "OCCUPIED").length;
  const free = tables.filter((t) => t.status === "FREE").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Total de mesas" value={tables.length} />
        <KpiCard label="Ocupadas" value={occupied} />
        <KpiCard label="Livres" value={free} />
      </div>

      {isLoading ? (
        <div className="text-sm text-ink-300 font-sans">Carregando mesas…</div>
      ) : (
        <div className="grid grid-cols-6 gap-3">
          {tables.map((table) => {
            const busy = table.status === "OCCUPIED";
            return (
              <div
                key={table.id}
                className={`rounded-xl border p-4 flex flex-col gap-2 transition ${
                  busy
                    ? "bg-[#FBE8EC] border-bordeaux-300"
                    : "bg-[var(--gu-ready-bg)] border-[var(--gu-ready-br)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs font-medium text-ink-900">{table.code}</p>
                  <Badge variant={statusToBadge(table.status)} />
                </div>
                {table.activeSession ? (
                  <div className="mt-1">
                    <p className="text-xs font-medium text-ink-900 truncate">
                      {table.activeSession.customer?.name ?? "—"}
                    </p>
                    <p className="text-[10px] text-ink-500 truncate">
                      {table.activeSession.customer?.employer ?? ""}
                    </p>
                    <p className="text-[10px] text-ink-300 mt-1 truncate">
                      {table.activeSession.attendant?.name ?? ""}
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-ink-300 mt-1">Disponível</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
