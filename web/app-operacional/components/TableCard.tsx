import type { Table } from "@/lib/hooks/useTables";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  table: Table;
  myUserId: string;
  onClick: () => void;
}

const clickableCardClasses = cn(
  "rounded-xl bg-card ring-1 ring-foreground/10 p-4 flex flex-col min-h-27.5 w-full text-left",
  "outline-none transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
);

export function TableCard({ table, myUserId, onClick }: Props) {
  const { status, code, activeSession } = table;

  const isClosed = status === "CLOSED";
  const isMine = activeSession?.attendantId === myUserId;
  const isOccupied = status === "OCCUPIED" && activeSession !== null;

  if (isClosed) {
    return (
      <Card className="bg-muted p-4 opacity-50 flex flex-col items-center justify-center min-h-27.5">
        <Badge variant="secondary" className="font-mono uppercase tracking-wider">Fora de serviço</Badge>
        <span className="text-2xl font-bold text-muted-foreground mt-1">{code}</span>
      </Card>
    );
  }

  if (isOccupied && !isMine) {
    return (
      <Card className="bg-status-occupied-bg border-status-occupied-br p-4 flex flex-col gap-1 min-h-27.5">
        <div className="flex items-center justify-between">
          <Badge variant="occupied" className="font-mono uppercase tracking-wider">Ocupada</Badge>
          <span className="font-mono text-xs text-status-occupied-fg font-semibold">{code}</span>
        </div>
        <p className="text-sm font-semibold text-foreground truncate">
          {activeSession?.customer?.name ?? "—"}
        </p>
        <p className="text-xs text-muted-foreground">
          {activeSession?.attendant?.name} · {activeSession?.durationMinutes}min
        </p>
      </Card>
    );
  }

  if (isMine && activeSession) {
    return (
      <button
        onClick={onClick}
        className={cn(clickableCardClasses, "border-2 border-primary gap-1")}
      >
        <span className="font-mono text-[10px] text-muted-foreground self-end">{code}</span>
        <p className="text-sm font-semibold text-foreground truncate flex-1">
          {activeSession.customer?.name ?? "—"}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="default" className="font-mono uppercase tracking-wider">Minha mesa</Badge>
          <span className="text-[10px] text-muted-foreground">{activeSession.durationMinutes}min</span>
        </div>
      </button>
    );
  }

  // OPEN / LIVRE
  return (
    <button
      onClick={onClick}
      className={cn(clickableCardClasses, "bg-status-success-bg border border-status-success-br items-center justify-center")}
    >
      <Badge variant="success" className="font-mono uppercase tracking-wider mb-1">Livre</Badge>
      <span className="text-3xl font-bold text-status-success-fg">{code}</span>
    </button>
  );
}
