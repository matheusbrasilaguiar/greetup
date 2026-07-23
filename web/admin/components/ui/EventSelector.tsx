"use client";

import { useEvents, type GrEventItem } from "@/lib/hooks/useEvents";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_LABEL: Record<GrEventItem["status"], string> = {
  DRAFT: "Rascunho",
  ACTIVE: "Ativo",
  CLOSED: "Encerrado",
};

interface Props {
  value: string | null; // null = todos os eventos
  onChange: (id: string | null) => void;
}

export function EventSelector({ value, onChange }: Props) {
  const { data: events = [], isLoading } = useEvents();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Skeleton className="h-3.5 w-12" />
        <Skeleton className="h-8 w-full sm:w-[180px]" />
      </div>
    );
  }
  if (events.length === 0) {
    return <p className="text-[13px] text-muted-foreground">Nenhum evento encontrado.</p>;
  }

  return (
    <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
      <label className="text-[12px] font-mono uppercase tracking-wider text-primary/80 shrink-0">
        Evento
      </label>
      <Select value={value ?? "ALL"} onValueChange={(v) => onChange(v === "ALL" ? null : v)}>
        <SelectTrigger className="text-[13px] w-full sm:w-auto sm:max-w-[220px]">
          <SelectValue className="truncate" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos os eventos</SelectItem>
          {events.map((ev) => (
            <SelectItem key={ev.id} value={ev.id}>
              {ev.name} — {STATUS_LABEL[ev.status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
