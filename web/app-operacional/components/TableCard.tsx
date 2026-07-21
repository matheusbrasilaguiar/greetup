import type { Table } from "@/lib/hooks/useTables";

interface Props {
  table: Table;
  myUserId: string;
  onClick: () => void;
}

export function TableCard({ table, myUserId, onClick }: Props) {
  const { status, code, activeSession } = table;

  const isClosed = status === "CLOSED";
  const isMine = activeSession?.attendantId === myUserId;
  const isOccupied = status === "OCCUPIED" && activeSession !== null;

  if (isClosed) {
    return (
      <div className="rounded-2xl bg-cream-100 border border-cream-200 p-4 opacity-50 flex flex-col items-center justify-center min-h-[110px]">
        <span className="font-mono text-xs text-ink-500 uppercase tracking-wider">Fora de serviço</span>
        <span className="text-2xl font-bold text-ink-300 mt-1">{code}</span>
      </div>
    );
  }

  if (isOccupied && !isMine) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex flex-col gap-1 min-h-[110px]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-rose-400 uppercase tracking-wider">Ocupada</span>
          <span className="font-mono text-xs text-rose-500 font-semibold">{code}</span>
        </div>
        <p className="text-sm font-semibold text-ink-900 truncate">
          {activeSession?.customer?.name ?? "—"}
        </p>
        <p className="text-xs text-ink-500">
          {activeSession?.attendant?.name} · {activeSession?.durationMinutes}min
        </p>
      </div>
    );
  }

  if (isMine && activeSession) {
    return (
      <button
        onClick={onClick}
        className="rounded-2xl bg-white border-2 border-bordeaux-700 p-4 flex flex-col gap-1 min-h-[110px] text-left w-full shadow-sm active:scale-95 transition-transform"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-bordeaux-700 uppercase tracking-wider font-semibold">
            Minha mesa
          </span>
          <span className="font-mono text-xs text-bordeaux-700 font-bold">{code}</span>
        </div>
        <p className="text-sm font-semibold text-ink-900 truncate">
          {activeSession.customer?.name ?? "—"}
        </p>
        <p className="text-xs text-ink-500">{activeSession.durationMinutes}min em atendimento</p>
      </button>
    );
  }

  // OPEN / LIVRE
  return (
    <button
      onClick={onClick}
      className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex flex-col items-center justify-center min-h-[110px] w-full active:scale-95 transition-transform"
    >
      <span className="font-mono text-xs text-emerald-600 uppercase tracking-wider mb-1">Livre</span>
      <span className="text-3xl font-bold text-emerald-700">{code}</span>
    </button>
  );
}
