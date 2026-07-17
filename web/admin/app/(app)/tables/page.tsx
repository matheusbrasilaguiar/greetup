"use client";

import { useEffect, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { KpiCard } from "@/components/ui/KpiCard";
import { PageHead } from "@/components/ui/PageHead";
import { useTables } from "@/lib/hooks/useTables";
import { useSocketEvents } from "@/lib/hooks/useSocketEvents";
import { useActiveEvent } from "@/lib/hooks/useActiveEvent";
import { NoActiveEvent } from "@/components/ui/NoActiveEvent";

function ElapsedBadge({ openedAt }: { openedAt: string }) {
  const calc = () =>
    Math.floor((Date.now() - new Date(openedAt).getTime()) / 60_000);
  const [mins, setMins] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setMins(calc()), 30_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedAt]);

  return (
    <span
      className="flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border"
      style={{
        background: "#fbeef0",
        color: "var(--gu-bordeaux-800)",
        borderColor: "var(--gu-bordeaux-300)",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--gu-bordeaux-700)" }} />
      {mins} min
    </span>
  );
}

function FreeBadge() {
  return (
    <span
      className="flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border"
      style={{
        background: "#F7FDF8",
        color: "#15803D",
        borderColor: "#bfe8c9",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22C55E" }} />
      Livre
    </span>
  );
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

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Total de mesas" value={tables.length} />
        <KpiCard label="Ocupadas" value={occupied} valueColor="var(--gu-bordeaux-700)" />
        <KpiCard label="Livres" value={free} valueColor="var(--gu-ready-tx)" />
        <KpiCard label="Desativadas" value={closed} />
      </div>

      {isLoading ? (
        <p className="text-sm" style={{ color: "var(--gu-ink-300)" }}>Carregando mesas…</p>
      ) : (
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
          {tables.map((table) => {
            const busy = table.status === "OCCUPIED";
            const inactive = table.status === "CLOSED";
            const session = table.activeSession;
            const orderCount = session?.orders?.length ?? 0;

            return (
              <div
                key={table.id}
                className="rounded-[10px] flex flex-col gap-2 p-4 transition-all"
                style={{
                  minHeight: 130,
                  border: busy
                    ? "1.5px solid var(--gu-bordeaux-300)"
                    : inactive
                    ? "1.5px solid var(--gu-cream-200)"
                    : "1.5px solid #bfe8c9",
                  background: busy ? "#fdf6f7" : inactive ? "var(--gu-cream-50)" : "#F7FDF8",
                  opacity: inactive ? 0.5 : 1,
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="font-mono text-sm font-medium"
                    style={{ color: busy ? "var(--gu-bordeaux-700)" : inactive ? "var(--gu-ink-300)" : "#15803D" }}
                  >
                    {table.code}
                  </span>
                  {busy && session ? (
                    <ElapsedBadge openedAt={session.openedAt} />
                  ) : inactive ? (
                    <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "var(--gu-ink-300)" }}>
                      Fechada
                    </span>
                  ) : (
                    <FreeBadge />
                  )}
                </div>

                {/* Body */}
                {busy && session ? (
                  <div className="flex flex-col gap-0.5 mt-1">
                    <p className="text-xs font-medium truncate" style={{ color: "var(--gu-ink-900)" }}>
                      {session.customer?.name ?? "—"}
                    </p>
                    {session.customer?.employer && (
                      <p className="text-[11px] truncate" style={{ color: "var(--gu-ink-500)" }}>
                        {session.customer.employer}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[10px] truncate" style={{ color: "var(--gu-ink-300)" }}>
                        {session.attendant
                          ? session.attendant.name.split(" ")[0]
                          : "—"}
                      </p>
                      <p className="font-mono text-[10px]" style={{ color: "var(--gu-ink-300)" }}>
                        {orderCount} pedido{orderCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                ) : (
                  !inactive && (
                    <p className="text-[11px] mt-1" style={{ color: "var(--gu-ink-300)" }}>
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
