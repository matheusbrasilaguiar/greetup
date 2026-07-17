"use client";

import { useState } from "react";
import { PageHead } from "@/components/ui/PageHead";
import {
  useEvents,
  useCreateEvent,
  useActivateEvent,
  useCloseEvent,
  type GrEventItem,
} from "@/lib/hooks/useEvents";

const STATUS_LABEL: Record<GrEventItem["status"], string> = {
  DRAFT:  "Rascunho",
  ACTIVE: "Ativo",
  CLOSED: "Encerrado",
};

const STATUS_STYLE: Record<GrEventItem["status"], string> = {
  DRAFT:  "bg-[var(--gu-pending-bg)]  text-[var(--gu-pending-tx)]  border-[var(--gu-pending-br)]",
  ACTIVE: "bg-[var(--gu-ready-bg)]    text-[var(--gu-ready-tx)]    border-[var(--gu-ready-br)]",
  CLOSED: "bg-[var(--gu-canceled-bg)] text-[var(--gu-canceled-tx)] border-[var(--gu-canceled-br)]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function EventsPage() {
  const { data: events = [], isLoading } = useEvents();
  const createEvent  = useCreateEvent();
  const activateEvent = useActivateEvent();
  const closeEvent   = useCloseEvent();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [confirmAction, setConfirmAction] = useState<{ type: "activate" | "close"; event: GrEventItem } | null>(null);

  async function handleCreate() {
    if (!name.trim()) return;
    await createEvent.mutateAsync({ name: name.trim(), date });
    setName("");
    setDate(new Date().toISOString().slice(0, 10));
    setShowModal(false);
  }

  async function handleConfirm() {
    if (!confirmAction) return;
    if (confirmAction.type === "activate") {
      await activateEvent.mutateAsync(confirmAction.event.id);
    } else {
      await closeEvent.mutateAsync(confirmAction.event.id);
    }
    setConfirmAction(null);
  }

  return (
    <div className="max-w-4xl">
      <PageHead
        eyebrow="Configuração · Eventos"
        title="Eventos"
        sub="Crie e gerencie os eventos do estande"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg text-[13px] font-medium"
            style={{ background: "var(--gu-bordeaux-900)", color: "var(--gu-cream-50)" }}
          >
            + Novo evento
          </button>
        }
      />

      {isLoading ? (
        <p className="text-[13px]" style={{ color: "var(--gu-ink-500)" }}>Carregando...</p>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[14px]" style={{ color: "var(--gu-ink-500)" }}>Nenhum evento criado ainda.</p>
        </div>
      ) : (
        <div className="bg-white border border-cream-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
          <table className="min-w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--gu-cream-200)" }}>
                {["Nome", "Data", "Status", "Ações"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 font-mono text-[10.5px] uppercase tracking-widest"
                    style={{ color: "var(--gu-ink-500)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} style={{ borderBottom: "1px solid var(--gu-cream-100)" }}>
                  <td className="px-5 py-3.5 font-medium" style={{ color: "var(--gu-ink-900)" }}>
                    {ev.name}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "var(--gu-ink-500)" }}>
                    {formatDate(ev.date)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border ${STATUS_STYLE[ev.status]}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      {STATUS_LABEL[ev.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      {ev.status !== "ACTIVE" && ev.status !== "CLOSED" && (
                        <button
                          onClick={() => setConfirmAction({ type: "activate", event: ev })}
                          className="px-3 py-1 rounded-lg text-[12px] font-medium border transition-colors"
                          style={{ borderColor: "var(--gu-bordeaux-300)", color: "var(--gu-bordeaux-700)" }}
                        >
                          Ativar
                        </button>
                      )}
                      {ev.status === "ACTIVE" && (
                        <button
                          onClick={() => setConfirmAction({ type: "close", event: ev })}
                          className="px-3 py-1 rounded-lg text-[12px] font-medium border transition-colors"
                          style={{ borderColor: "var(--gu-canceled-br)", color: "var(--gu-canceled-tx)" }}
                        >
                          Encerrar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Modal: Novo Evento */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-semibold text-[16px] mb-4" style={{ color: "var(--gu-ink-900)" }}>Novo evento</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--gu-ink-500)" }}>Nome</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Evento 17/07"
                  className="w-full border rounded-lg px-3 py-2 text-[13px] outline-none"
                  style={{ borderColor: "var(--gu-bordeaux-300)", color: "var(--gu-ink-900)" }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--gu-ink-500)" }}>Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-[13px] outline-none"
                  style={{ borderColor: "var(--gu-bordeaux-300)", color: "var(--gu-ink-900)" }}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-lg text-[13px] border"
                style={{ borderColor: "var(--gu-bordeaux-300)", color: "var(--gu-ink-500)" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={createEvent.isPending || !name.trim()}
                className="flex-1 py-2 rounded-lg text-[13px] font-medium disabled:opacity-50"
                style={{ background: "var(--gu-bordeaux-900)", color: "var(--gu-cream-50)" }}
              >
                {createEvent.isPending ? "Criando..." : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmação */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--gu-ink-900)" }}>
              {confirmAction.type === "activate" ? "Ativar evento?" : "Encerrar evento?"}
            </h2>
            <p className="text-[13px] mb-5" style={{ color: "var(--gu-ink-500)" }}>
              {confirmAction.type === "activate"
                ? `Ativar "${confirmAction.event.name}" vai encerrar o evento ativo atual (se houver) e fechar todas as sessões abertas.`
                : `Encerrar "${confirmAction.event.name}" vai fechar todas as sessões abertas e liberar as mesas.`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-2 rounded-lg text-[13px] border"
                style={{ borderColor: "var(--gu-bordeaux-300)", color: "var(--gu-ink-500)" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={activateEvent.isPending || closeEvent.isPending}
                className="flex-1 py-2 rounded-lg text-[13px] font-medium disabled:opacity-50"
                style={{
                  background: confirmAction.type === "close" ? "var(--gu-canceled-tx)" : "var(--gu-bordeaux-900)",
                  color: "white",
                }}
              >
                {activateEvent.isPending || closeEvent.isPending
                  ? "Aguarde..."
                  : confirmAction.type === "activate" ? "Ativar" : "Encerrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
