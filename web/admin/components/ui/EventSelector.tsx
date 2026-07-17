"use client";

import { useEvents, type GrEventItem } from "@/lib/hooks/useEvents";

const STATUS_LABEL: Record<GrEventItem["status"], string> = {
  DRAFT:  "Rascunho",
  ACTIVE: "Ativo",
  CLOSED: "Encerrado",
};

interface Props {
  value: string | null;
  onChange: (id: string) => void;
}

export function EventSelector({ value, onChange }: Props) {
  const { data: events = [], isLoading } = useEvents();

  if (isLoading) return null;
  if (events.length === 0) {
    return (
      <p className="text-[13px]" style={{ color: "var(--gu-bordeaux-400)" }}>
        Nenhum evento encontrado.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-[12px] font-mono uppercase tracking-wider" style={{ color: "var(--gu-bordeaux-400)" }}>
        Evento
      </label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="text-[13px] rounded-lg px-3 py-1.5 border outline-none"
        style={{
          background: "var(--gu-cream-50)",
          borderColor: "var(--gu-bordeaux-200)",
          color: "var(--gu-bordeaux-900)",
        }}
      >
        {events.map((ev) => (
          <option key={ev.id} value={ev.id}>
            {ev.name} — {STATUS_LABEL[ev.status]}
          </option>
        ))}
      </select>
    </div>
  );
}
