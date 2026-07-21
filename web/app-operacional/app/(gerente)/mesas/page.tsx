"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTables } from "@/lib/hooks/useTables";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSocketEvents } from "@/lib/hooks/useSocket";
import { TableCard } from "@/components/TableCard";
import { getUser } from "@/lib/auth";

export default function MesasPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { data: tables = [], isLoading } = useTables();
  const qc = useQueryClient();
  const user = getUser();

  const socketHandlers = useCallback(
    () => ({
      table_session_opened: () => qc.invalidateQueries({ queryKey: ["tables"] }),
      table_session_closed: () => qc.invalidateQueries({ queryKey: ["tables"] }),
    }),
    [qc]
  );
  useSocketEvents(socketHandlers());

  const livres = tables.filter((t) => t.status === "OPEN" && !t.activeSession).length;

  function handleTableClick(table: (typeof tables)[0]) {
    if (table.status === "CLOSED") return;
    if (table.activeSession && table.activeSession.attendantId !== user?.id) return;

    if (table.activeSession && table.activeSession.attendantId === user?.id) {
      router.push(`/conta/${table.id}/${table.activeSession.id}`);
    } else {
      router.push(`/mesas/${table.id}/abrir`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      {/* Header */}
      <div className="bg-bordeaux-900 px-4 pt-10 pb-5">
        <p className="text-xs font-mono text-champagne tracking-widest uppercase mb-1">
          GreetUp · Gerente
        </p>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-cream-50 tracking-tight">
              Olá, {user?.name?.split(" ")[0] ?? "Gerente"}
            </h1>
            <p className="text-xs text-ink-300 mt-0.5">
              {livres} {livres === 1 ? "mesa livre" : "mesas livres"} de {tables.length}
            </p>
          </div>
          <button
            onClick={logout}
            className="text-xs text-ink-500 hover:text-ink-300 transition-colors mt-1"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-4">
        {isLoading ? (
          <p className="text-ink-500 text-sm text-center py-16 font-mono">Carregando mesas...</p>
        ) : tables.length === 0 ? (
          <p className="text-ink-400 text-sm text-center py-16">Nenhuma mesa cadastrada.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                myUserId={user?.id ?? ""}
                onClick={() => handleTableClick(table)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
