"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTables } from "@/lib/hooks/useTables";
import { useSocketEvents } from "@/lib/hooks/useSocket";
import { TableCard } from "@/components/TableCard";
import { PageHeader, pageHeaderIconButtonClass } from "@/components/PageHeader";
import { LoadingState, EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import { UserPlus } from "lucide-react";

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
    <div className="h-full flex flex-col bg-background">
      <PageHeader
        title={`Olá, ${user?.name?.split(" ")[0] ?? "Gerente"}`}
        subtitle={`${livres} ${livres === 1 ? "mesa livre" : "mesas livres"} de ${tables.length}`}
        action={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/clientes/novo")}
            className={pageHeaderIconButtonClass}
          >
            <UserPlus className="w-4 h-4" />
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <LoadingState label="Carregando mesas..." className="py-20" />
        ) : tables.length === 0 ? (
          <EmptyState title="Nenhuma mesa cadastrada." className="py-20" />
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
