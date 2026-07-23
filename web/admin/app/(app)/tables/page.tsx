"use client";

import { useEffect, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { KpiCard } from "@/components/ui/KpiCard";
import { KpiCardSkeleton } from "@/components/KpiCardSkeleton";
import { PageHead } from "@/components/ui/PageHead";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTables } from "@/lib/hooks/useTables";
import { useSocketEvents } from "@/lib/hooks/useSocketEvents";
import { useActiveEvent } from "@/lib/hooks/useActiveEvent";
import { NoActiveEvent } from "@/components/ui/NoActiveEvent";
import { cn } from "@/lib/utils";

function ElapsedBadge({ openedAt }: { openedAt: string }) {
  const calc = () =>
    Math.floor((Date.now() - new Date(openedAt).getTime()) / 60_000);
  const [mins, setMins] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setMins(calc()), 30_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedAt]);

  return <Badge variant="busy" dot>{mins} min</Badge>;
}

export default function TablesLivePage() {
  const qc = useQueryClient();
  const { data: activeEvent, isLoading: loadingEvent } = useActiveEvent();
  const { data: tables = [], isLoading } = useTables();

  const invalidate = useCallback(() => {
    qc.invalidateQueries({ queryKey: ["tables"] });
  }, [qc]);

  useSocketEvents({
    table_session_opened: invalidate,
    table_session_closed: invalidate,
  });

  const occupied = tables.filter((t) => t.status === "OCCUPIED").length;
  const free = tables.filter((t) => t.status === "OPEN").length;
  const closed = tables.filter((t) => t.status === "CLOSED").length;

  if (!loadingEvent && !activeEvent) {
    return (
      <div className="flex flex-col gap-[22px]">
        <PageHead eyebrow="Evento ao vivo · Mesas" title="Mapa de mesas" sub="Visualize o estado de cada mesa em tempo real" />
        <NoActiveEvent />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <PageHead eyebrow={`Evento ao vivo · ${activeEvent?.name ?? ""}`} title="Mapa de mesas" sub="Visualize o estado de cada mesa em tempo real" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }, (_, i) => <KpiCardSkeleton key={i} />)
        ) : (
          <>
            <KpiCard label="Total de mesas" value={tables.length} />
            <KpiCard label="Ocupadas" value={occupied} valueClassName="text-primary" />
            <KpiCard label="Livres" value={free} valueClassName="text-status-success-fg" />
            <KpiCard label="Desativadas" value={closed} />
          </>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="rounded-[10px] border-[1.5px] border-border p-3 sm:p-4 min-h-[110px] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <Skeleton className="h-3 w-3/4 mt-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {tables.map((table) => {
            const busy = table.status === "OCCUPIED";
            const inactive = table.status === "CLOSED";
            const session = table.activeSession;
            const orderCount = session?.orders?.length ?? 0;

            return (
              <div
                key={table.id}
                className={cn(
                  "rounded-[10px] flex flex-col gap-1.5 p-3 sm:p-4 min-h-[110px] transition-all border-[1.5px]",
                  busy && "bg-status-busy-bg border-status-busy-br",
                  inactive && "bg-muted border-border opacity-50",
                  !busy && !inactive && "bg-status-success-bg border-status-success-br"
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={cn(
                      "font-mono text-sm font-medium",
                      busy && "text-primary",
                      inactive && "text-muted-foreground/70",
                      !busy && !inactive && "text-status-success-fg"
                    )}
                  >
                    {table.code}
                  </span>
                  {busy && session ? (
                    <ElapsedBadge openedAt={session.openedAt} />
                  ) : inactive ? (
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70">
                      Fechada
                    </span>
                  ) : (
                    <Badge variant="success" dot>Livre</Badge>
                  )}
                </div>

                {/* Body */}
                {busy && session ? (
                  <div className="flex flex-col gap-0.5 mt-1">
                    <p className="text-xs font-medium truncate text-foreground">
                      {session.customer?.name ?? "—"}
                    </p>
                    {session.customer?.employer && (
                      <p className="text-[11px] truncate text-muted-foreground">
                        {session.customer.employer}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[10px] truncate text-muted-foreground/70">
                        {session.attendant
                          ? session.attendant.name.split(" ")[0]
                          : "—"}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground/70">
                        {orderCount} pedido{orderCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                ) : (
                  !inactive && (
                    <p className="text-[11px] mt-1 text-muted-foreground/70">
                      Disponível · {table.capacity} lugares
                    </p>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
