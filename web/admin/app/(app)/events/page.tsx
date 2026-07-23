"use client";

import { useState } from "react";
import { PageHead } from "@/components/ui/PageHead";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { TableRowsSkeleton } from "@/components/TableRowsSkeleton";
import { EVENT_STATUS_META } from "@/lib/statusBadge";
import {
  useEvents,
  useCreateEvent,
  useActivateEvent,
  useCloseEvent,
  type GrEventItem,
} from "@/lib/hooks/useEvents";

function formatDate(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

function CreateEventDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const createEvent = useCreateEvent();
  const [name, setName] = useState("");
  const [date, setDate] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await createEvent.mutateAsync({ name: name.trim(), date });
    setName("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo evento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Evento 17/07" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Data</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <DialogFooter>
            <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" loading={createEvent.isPending} disabled={!name.trim()}>Criar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function EventsPage() {
  const { data: events = [], isLoading } = useEvents();
  const activateEvent = useActivateEvent();
  const closeEvent = useCloseEvent();

  const [showModal, setShowModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: "activate" | "close"; event: GrEventItem } | null>(null);

  return (
    <div>
      <PageHead
        eyebrow="Configuração · Eventos"
        title="Eventos"
        sub="Crie e gerencie os eventos do estande"
        actions={<Button onClick={() => setShowModal(true)}>+ Novo evento</Button>}
      />

      {!isLoading && events.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[14px] text-muted-foreground">Nenhum evento criado ainda.</p>
        </div>
      ) : (
        <Panel>
          <div className="overflow-x-auto">
            <table className="min-w-full text-[13px]">
              <thead>
                <tr className="border-b border-border">
                  {[
                    { label: "Nome" },
                    { label: "Data", hide: "hidden sm:table-cell" },
                    { label: "Status" },
                    { label: "Ações" },
                  ].map(({ label, hide }) => (
                    <th key={label} className={`text-left px-5 py-3 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground/70 ${hide ?? ""}`}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <TableRowsSkeleton
                    columns={[
                      {},
                      { hide: "hidden sm:table-cell" },
                      { width: "w-16" },
                      { width: "w-16" },
                    ]}
                  />
                )}
                {!isLoading && events.map((ev) => {
                  const meta = EVENT_STATUS_META[ev.status];
                  return (
                    <tr key={ev.id} className="border-b border-border/60 hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-foreground">
                        {ev.name}
                      </td>
                      <td className="hidden sm:table-cell px-5 py-3.5 text-muted-foreground">
                        {formatDate(ev.date)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={meta.variant} dot>{meta.label}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          {ev.status !== "ACTIVE" && ev.status !== "CLOSED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-bordeaux-300 text-primary"
                              onClick={() => setConfirmAction({ type: "activate", event: ev })}
                            >
                              Ativar
                            </Button>
                          )}
                          {ev.status === "ACTIVE" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-status-canceled-br text-status-canceled-fg"
                              onClick={() => setConfirmAction({ type: "close", event: ev })}
                            >
                              Encerrar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <CreateEventDialog open={showModal} onOpenChange={setShowModal} />

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(o) => !o && setConfirmAction(null)}
        title={confirmAction?.type === "activate" ? "Ativar evento?" : "Encerrar evento?"}
        description={
          confirmAction?.type === "activate"
            ? `Ativar "${confirmAction.event.name}" vai encerrar o evento ativo atual (se houver) e fechar todas as sessões abertas.`
            : `Encerrar "${confirmAction?.event.name}" vai fechar todas as sessões abertas e liberar as mesas.`
        }
        confirmLabel={confirmAction?.type === "activate" ? "Ativar" : "Encerrar"}
        variant={confirmAction?.type === "close" ? "destructive" : "default"}
        loading={activateEvent.isPending || closeEvent.isPending}
        onConfirm={async () => {
          if (!confirmAction) return;
          if (confirmAction.type === "activate") {
            await activateEvent.mutateAsync(confirmAction.event.id);
          } else {
            await closeEvent.mutateAsync(confirmAction.event.id);
          }
        }}
      />
    </div>
  );
}
