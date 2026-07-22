"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTables } from "@/lib/hooks/useTables";
import { useSocketEvents } from "@/lib/hooks/useSocket";
import { TableCard } from "@/components/TableCard";
import { PageHeader } from "@/components/PageHeader";
import { getUser } from "@/lib/auth";

export default function MesasPage() {
  const router = useRouter();
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
      router.push(`/mesas/${table.id}/abrir?code=${encodeURIComponent(table.code)}`);
    }
  }

  return (
    <div className="h-full flex flex-col bg-cream-50">
      <PageHeader
        title={`Olá, ${user?.name?.split(" ")[0] ?? "Gerente"}`}
        subtitle={`${livres} ${livres === 1 ? "mesa livre" : "mesas livres"} de ${tables.length}`}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground text-sm font-mono">Carregando mesas...</p>
          </div>
        ) : tables.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground text-sm">Nenhuma mesa cadastrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
