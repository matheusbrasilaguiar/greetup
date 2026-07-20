"use client";

import { useEvents, type GrEventItem } from "@/lib/hooks/useEvents";

const STATUS_LABEL: Record<GrEventItem["status"], string> = {
  DRAFT:  "Rascunho",
  ACTIVE: "Ativo",
  CLOSED: "Encerrado",
};

interface Props {
  value: string | null;           // null = todos os eventos
  onChange: (id: string | null) => void;
}

export function EventSelector({ value, onChange }: Props) {
  const { data: events = [], isLoading } = useEvents();

  if (isLoading) return null;
  if (events.length === 0) {
    return (
      <p className="text-[13px]" style={{ color: "var(--gu-ink-500)" }}>
        Nenhum evento encontrado.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-[12px] font-mono uppercase tracking-wider" style={{ color: "var(--gu-bordeaux-500)" }}>
        Evento
      </label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="text-[13px] rounded-lg px-3 py-1.5 border outline-none"
        style={{
          background: "var(--gu-cream-50)",
          borderColor: "var(--gu-bordeaux-300)",
          color: "var(--gu-bordeaux-900)",
        }}
      >
        <option value="">Todos os eventos</option>
        {events.map((ev) => (
          <option key={ev.id} value={ev.id}>
            {ev.name} — {STATUS_LABEL[ev.status]}
          </option>
        ))}
      </select>
    </div>
  );
}
