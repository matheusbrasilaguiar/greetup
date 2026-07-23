"use client";

import { useState, useEffect } from "react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PageHead } from "@/components/ui/PageHead";
import { FiltersBar, SearchField, SelectField } from "@/components/ui/FiltersBar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { TableRowsSkeleton } from "@/components/TableRowsSkeleton";
import { Avatar } from "@/components/Avatar";
import { ROLE_META } from "@/lib/statusBadge";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  type User,
  type CreateUserPayload,
} from "@/lib/hooks/useUsers";
import { getToken } from "@/lib/auth";
import { MoreHorizontal } from "lucide-react";

// ─── helpers ───────────────────────────────────────────────────────────────

function decodeTokenId(): string | null {
  try {
    const token = getToken();
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).id as string;
  } catch {
    return null;
  }
}

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return "nunca";
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 60_000) return "agora mesmo";
  if (diff < 3_600_000) return `há ${Math.floor(diff / 60_000)} min`;
  if (diff < 86_400_000) return `há ${Math.floor(diff / 3_600_000)} h`;
  return `há ${Math.floor(diff / 86_400_000)} dias`;
}

function roleKey(user: User): string {
  if (user.role === "ADMIN") return "ADMIN";
  if (user.role === "GERENTE") return "GERENTE";
  if (user.operatorFunction === "COZINHA") return "COZINHA";
  if (user.operatorFunction === "GARCOM") return "GARCOM";
  if (user.operatorFunction === "DISPLAY") return "DISPLAY";
  return "OPERADOR";
}

function RoleBadge({ user }: { user: User }) {
  const meta = ROLE_META[roleKey(user)] ?? ROLE_META.OPERADOR;
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

// ─── CreateUserDialog ───────────────────────────────────────────────────────

const OPERATOR_FUNCTIONS = ["COZINHA", "GARCOM", "DISPLAY"];

function CreateUserDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { mutateAsync, isPending } = useCreateUser();
  const [form, setForm] = useState<CreateUserPayload>({
    name: "",
    email: "",
    password: "",
    role: "GERENTE",
    operatorFunction: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm({ name: "", email: "", password: "", role: "GERENTE", operatorFunction: undefined });
      setError(null);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await mutateAsync(form);
      onOpenChange(false);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erro ao criar usuário"
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Nome</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">E-mail</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Senha</Label>
            <Input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required minLength={6} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Perfil</Label>
            <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v, operatorFunction: undefined }))}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="GERENTE">Gerente</SelectItem>
                <SelectItem value="OPERADOR">Operador</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.role === "OPERADOR" && (
            <div className="flex flex-col gap-1.5">
              <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Função</Label>
              <Select value={form.operatorFunction ?? ""} onValueChange={(v) => setForm((f) => ({ ...f, operatorFunction: v }))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Selecione…" /></SelectTrigger>
                <SelectContent>
                  {OPERATOR_FUNCTIONS.map((fn) => <SelectItem key={fn} value={fn}>{fn}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          {error && (
            <p className="text-sm text-status-canceled-fg bg-status-canceled-bg border border-status-canceled-br rounded-lg px-4 py-2">{error}</p>
          )}
          <DialogFooter>
            <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" loading={isPending}>Criar usuário</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── EditUserDialog ─────────────────────────────────────────────────────────

function EditUserDialog({ user, open, onOpenChange }: { user: User | null; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { mutateAsync, isPending } = useUpdateUser();
  const [form, setForm] = useState({ name: "", role: "GERENTE", operatorFunction: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && open) {
      setForm({ name: user.name, role: user.role, operatorFunction: user.operatorFunction ?? "" });
      setError(null);
    }
  }, [user, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    try {
      await mutateAsync({
        id: user.id,
        name: form.name,
        role: form.role,
        operatorFunction: form.role === "OPERADOR" ? form.operatorFunction : undefined,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erro ao salvar"
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Nome</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Perfil</Label>
            <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v, operatorFunction: "" }))}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="GERENTE">Gerente</SelectItem>
                <SelectItem value="OPERADOR">Operador</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.role === "OPERADOR" && (
            <div className="flex flex-col gap-1.5">
              <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Função</Label>
              <Select value={form.operatorFunction} onValueChange={(v) => setForm((f) => ({ ...f, operatorFunction: v }))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Selecione…" /></SelectTrigger>
                <SelectContent>
                  {OPERATOR_FUNCTIONS.map((fn) => <SelectItem key={fn} value={fn}>{fn}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          {error && (
            <p className="text-sm text-status-canceled-fg bg-status-canceled-bg border border-status-canceled-br rounded-lg px-4 py-2">{error}</p>
          )}
          <DialogFooter>
            <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" loading={isPending}>Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

const ROLE_FILTER_OPTIONS = [
  { value: "TODOS", label: "Todos os papéis" },
  { value: "ADMIN", label: "Admin" },
  { value: "GERENTE", label: "Gerente" },
  { value: "OP_COZINHA", label: "Cozinha" },
  { value: "OP_GARCOM", label: "Garçom" },
  { value: "OP_DISPLAY", label: "Display" },
];

export default function UsersPage() {
  const { data: users = [], isLoading } = useUsers();
  const { mutate: updateUser } = useUpdateUser();
  const { mutateAsync: deleteUserAsync, isPending: deleting } = useDeleteUser();
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("TODOS");
  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => { setMyId(decodeTokenId()); }, []);

  function matchesRole(u: User): boolean {
    if (roleFilter === "TODOS") return true;
    if (roleFilter === "ADMIN") return u.role === "ADMIN";
    if (roleFilter === "GERENTE") return u.role === "GERENTE";
    if (roleFilter === "OP_COZINHA") return u.role === "OPERADOR" && u.operatorFunction === "COZINHA";
    if (roleFilter === "OP_GARCOM") return u.role === "OPERADOR" && u.operatorFunction === "GARCOM";
    if (roleFilter === "OP_DISPLAY") return u.role === "OPERADOR" && u.operatorFunction === "DISPLAY";
    return true;
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) &&
      matchesRole(u)
  );

  const colHead = "font-mono text-[10px] tracking-widest uppercase text-left px-5 py-3 text-muted-foreground/70";

  return (
    <>
      <PageHead
        eyebrow="Configuração · Equipe"
        title="Usuários do sistema"
        sub="Gerencie acessos e permissões da equipe"
        actions={<Button onClick={() => setShowCreate(true)}>+ Novo usuário</Button>}
      />

      <Panel>
        <FiltersBar count={{ value: filtered.length, label: filtered.length === 1 ? "usuário" : "usuários" }}>
          <SearchField value={search} onChange={setSearch} placeholder="Buscar por nome…" />
          <SelectField value={roleFilter} onChange={setRoleFilter} options={ROLE_FILTER_OPTIONS} />
        </FiltersBar>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                {[
                  { label: "Nome" },
                  { label: "E-mail", hide: "hidden md:table-cell" },
                  { label: "Papel" },
                  { label: "Último acesso", hide: "hidden lg:table-cell" },
                  { label: "Status" },
                  { label: "" },
                ].map(({ label, hide }, i) => (
                  <th key={i} className={`${colHead} ${hide ?? ""}`}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <TableRowsSkeleton
                  columns={[
                    {},
                    { hide: "hidden md:table-cell" },
                    {},
                    { hide: "hidden lg:table-cell" },
                    { width: "w-8" },
                    { width: "w-7" },
                  ]}
                />
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center text-sm text-muted-foreground/70 py-10">Nenhum usuário encontrado</td></tr>
              )}
              {filtered.map((user) => {
                const isMe = user.id === myId;
                return (
                  <tr key={user.id} className="border-b border-border/60 hover:bg-muted/50 transition-colors">
                    {/* Nome */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={user.name} />
                        <div>
                          <span className="text-sm font-medium block text-foreground">{user.name}</span>
                          {isMe && (
                            <span className="font-mono text-[10px] text-muted-foreground/70">você</span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* E-mail */}
                    <td className="hidden md:table-cell px-5 py-3 font-mono text-[12.5px] text-muted-foreground">
                      {user.email}
                    </td>
                    {/* Papel */}
                    <td className="px-5 py-3"><RoleBadge user={user} /></td>
                    {/* Último acesso */}
                    <td className="hidden lg:table-cell px-5 py-3 font-mono text-[12.5px] text-muted-foreground/70">
                      {relativeTime(user.lastLogin)}
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3">
                      <Switch
                        checked={user.active}
                        onCheckedChange={(val) => updateUser({ id: user.id, active: val })}
                      />
                    </td>
                    {/* ⋯ */}
                    <td className="px-5 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7" title={`Ações para ${user.name}`}>
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingUser(user)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => setDeletingUser(user)}>
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <CreateUserDialog open={showCreate} onOpenChange={setShowCreate} />
      <EditUserDialog user={editingUser} open={!!editingUser} onOpenChange={(o) => !o && setEditingUser(null)} />
      <ConfirmDialog
        open={!!deletingUser}
        onOpenChange={(o) => !o && setDeletingUser(null)}
        title="Excluir usuário?"
        description={`"${deletingUser?.name}" perderá o acesso ao sistema imediatamente. Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        variant="destructive"
        loading={deleting}
        onConfirm={async () => {
          if (deletingUser) await deleteUserAsync(deletingUser.id);
        }}
      />
    </>
  );
}
