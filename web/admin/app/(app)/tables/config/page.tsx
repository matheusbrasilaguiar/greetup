"use client";

import { useState } from "react";
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
import { PageHead } from "@/components/ui/PageHead";
import { TableRowsSkeleton } from "@/components/TableRowsSkeleton";
import { TABLE_STATUS_META } from "@/lib/statusBadge";
import { useTables, useCreateTable, useUpdateTableStatus } from "@/lib/hooks/useTables";

function CreateTableDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { mutateAsync, isPending } = useCreateTable();
  const [code, setCode] = useState("");
  const [capacity, setCapacity] = useState(4);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await mutateAsync({ code, capacity });
      setCode("");
      setCapacity(4);
      onOpenChange(false);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erro ao criar mesa"
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova mesa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Código</Label>
            <Input placeholder="Ex: M01" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Capacidade</Label>
            <Input type="number" value={capacity} min={1} max={20} onChange={(e) => setCapacity(Number(e.target.value))} required />
          </div>
          {error && (
            <p className="text-sm text-status-canceled-fg bg-status-canceled-bg border border-status-canceled-br rounded-lg px-4 py-2">{error}</p>
          )}
          <DialogFooter>
            <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" loading={isPending}>Criar mesa</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function TablesConfigPage() {
  const { data: tables = [], isLoading } = useTables();
  const { mutate: updateStatus } = useUpdateTableStatus();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <PageHead
        eyebrow="Configuração · Mesas"
        title="Configuração de mesas"
        sub="Gerencie as mesas disponíveis para o evento"
        actions={<Button onClick={() => setShowCreate(true)}>+ Nova mesa</Button>}
      />

      <Panel>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                {[
                  { label: "Código" },
                  { label: "Capacidade", hide: "hidden sm:table-cell" },
                  { label: "Status" },
                  { label: "Ações" },
                ].map(({ label, hide }) => (
                  <th key={label} className={`font-mono text-[10px] tracking-widest text-muted-foreground/70 uppercase text-left px-5 py-3 ${hide ?? ""}`}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <TableRowsSkeleton
                  columns={[
                    { width: "w-12" },
                    { hide: "hidden sm:table-cell", width: "w-6" },
                    { width: "w-16" },
                    { width: "w-16" },
                  ]}
                />
              )}
              {!isLoading && tables.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-sm text-muted-foreground/70 py-10">
                    Nenhuma mesa cadastrada
                  </td>
                </tr>
              )}
              {tables.map((table) => {
                const meta = TABLE_STATUS_META[table.status] ?? TABLE_STATUS_META.CLOSED;
                return (
                  <tr key={table.id} className="border-b border-border/60 hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-sm font-medium text-foreground">
                      {table.code}
                    </td>
                    <td className="hidden sm:table-cell px-5 py-3 text-sm text-muted-foreground">{table.capacity}</td>
                    <td className="px-5 py-3">
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      {table.status !== "OCCUPIED" && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() =>
                            updateStatus({
                              id: table.id,
                              status: table.status === "OPEN" ? "CLOSED" : "OPEN",
                            })
                          }
                        >
                          {table.status === "OPEN" ? "Desativar" : "Ativar"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <CreateTableDialog open={showCreate} onOpenChange={setShowCreate} />
    </>
  );
}
