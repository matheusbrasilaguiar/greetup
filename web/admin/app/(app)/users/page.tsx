"use client";

import { useState, useEffect, useRef } from "react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { PageHead } from "@/components/ui/PageHead";
import { FiltersBar, SearchField, SelectField } from "@/components/ui/FiltersBar";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  type User,
  type CreateUserPayload,
} from "@/lib/hooks/useUsers";
import { getToken } from "@/lib/auth";

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

function roleBadgeLabel(user: User): string {
  if (user.role === "ADMIN") return "Admin";
  if (user.role === "GERENTE") return "Gerente";
  if (user.operatorFunction === "COZINHA") return "Cozinha";
  if (user.operatorFunction === "GARCOM") return "Garçom";
  if (user.operatorFunction === "DISPLAY") return "Display";
  return "Operador";
}

const BADGE_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  Admin: { bg: "#fbeef0", text: "var(--gu-bordeaux-700)", border: "var(--gu-bordeaux-300)" },
  Gerente: { bg: "var(--gu-preparing-bg)", text: "var(--gu-preparing-tx)", border: "var(--gu-preparing-br)" },
  Cozinha: { bg: "var(--gu-pending-bg)", text: "var(--gu-pending-tx)", border: "var(--gu-pending-br)" },
  "Garçom": { bg: "var(--gu-ready-bg)", text: "var(--gu-ready-tx)", border: "var(--gu-ready-br)" },
  Display: { bg: "var(--gu-delivered-bg)", text: "var(--gu-delivered-tx)", border: "var(--gu-delivered-br)" },
  Operador: { bg: "var(--gu-pending-bg)", text: "var(--gu-pending-tx)", border: "var(--gu-pending-br)" },
};

function RoleBadge({ user }: { user: User }) {
  const label = roleBadgeLabel(user);
  const s = BADGE_STYLE[label] ?? BADGE_STYLE.Operador;
  return (
    <span
      style={{
        display: "inline-flex",
        fontFamily: "var(--font-jetbrains)",
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        padding: "3px 9px",
        borderRadius: 99,
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.text,
      }}
    >
      {label}
    </span>
  );
}

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  return (
    <span
      className="rounded-full flex items-center justify-center font-medium flex-shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: 11,
        background: "var(--gu-cream-100)",
        color: "var(--gu-bordeaux-700)",
      }}
    >
      {initials}
    </span>
  );
}

// ─── dropdown ⋯ ────────────────────────────────────────────────────────────

function MoreMenu({
  user,
  onEdit,
  onDelete,
}: {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function toggle() {
    if (open) { setOpen(false); return; }
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function close(e: MouseEvent) {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="flex items-center justify-center rounded transition-colors"
        style={{
          width: 28,
          height: 28,
          color: "var(--gu-ink-500)",
          background: open ? "var(--gu-cream-100)" : "transparent",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--gu-cream-100)")}
        onMouseLeave={(e) => {
          if (!open) (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
        title={`Ações para ${user.name}`}
      >
        ⋯
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: pos.top,
            right: pos.right,
            minWidth: 120,
            zIndex: 9999,
            background: "white",
            border: "1px solid var(--gu-cream-200)",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          }}
        >
          <button
            onClick={() => { setOpen(false); onEdit(); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-cream-50 transition-colors"
            style={{ color: "var(--gu-ink-700)", borderRadius: "6px 6px 0 0" }}
          >
            Editar
          </button>
          <button
            onClick={() => { setOpen(false); onDelete(); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-cream-50 transition-colors"
            style={{ color: "var(--gu-canceled-tx)", borderRadius: "0 0 6px 6px" }}
          >
            Excluir
          </button>
        </div>
      )}
    </>
  );
}

// ─── CreateUserModal ────────────────────────────────────────────────────────

const OPERATOR_FUNCTIONS = ["COZINHA", "GARCOM", "DISPLAY"];
const inputClass =
  "w-full px-3 py-2 rounded-lg border text-sm outline-none transition focus:ring-1 focus:ring-bordeaux-500 focus:border-bordeaux-500 bg-cream-50 border-cream-200 text-ink-900";
const labelClass = "font-mono text-[10px] tracking-widest text-ink-500 uppercase";

function CreateUserModal({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateUser();
  const [form, setForm] = useState<CreateUserPayload>({
    name: "",
    email: "",
    password: "",
    role: "GERENTE",
    operatorFunction: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await mutateAsync(form);
      onClose();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erro ao criar usuário"
      );
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl" style={{ border: "1px solid var(--gu-cream-200)" }}>
        <h3 className="text-base font-semibold mb-5" style={{ color: "var(--gu-ink-900)" }}>Novo usuário</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Nome</label>
            <input className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>E-mail</label>
            <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Senha</label>
            <input type="password" className={inputClass} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required minLength={6} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Perfil</label>
            <select className={inputClass} value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value, operatorFunction: undefined }))}>
              <option value="GERENTE">Gerente</option>
              <option value="OPERADOR">Operador</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {form.role === "OPERADOR" && (
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Função</label>
              <select className={inputClass} value={form.operatorFunction ?? ""} onChange={(e) => setForm((f) => ({ ...f, operatorFunction: e.target.value }))} required>
                <option value="" disabled>Selecione…</option>
                {OPERATOR_FUNCTIONS.map((fn) => <option key={fn} value={fn}>{fn}</option>)}
              </select>
            </div>
          )}
          {error && (
            <p className="text-sm rounded-lg px-4 py-2" style={{ color: "var(--gu-canceled-tx)", background: "var(--gu-canceled-bg)", border: "1px solid var(--gu-canceled-br)" }}>{error}</p>
          )}
          <div className="flex gap-3 justify-end mt-1">
            <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={isPending}>Criar usuário</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── EditUserModal ─────────────────────────────────────────────────────────

function EditUserModal({ user, onClose }: { user: User; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateUser();
  const [form, setForm] = useState({
    name: user.name,
    role: user.role,
    operatorFunction: user.operatorFunction ?? "",
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await mutateAsync({
        id: user.id,
        name: form.name,
        role: form.role,
        operatorFunction: form.role === "OPERADOR" ? form.operatorFunction : undefined,
      });
      onClose();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erro ao salvar"
      );
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl" style={{ border: "1px solid var(--gu-cream-200)" }}>
        <h3 className="text-base font-semibold mb-5" style={{ color: "var(--gu-ink-900)" }}>Editar usuário</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Nome</label>
            <input className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Perfil</label>
            <select className={inputClass} value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value, operatorFunction: "" }))}>
              <option value="GERENTE">Gerente</option>
              <option value="OPERADOR">Operador</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {form.role === "OPERADOR" && (
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Função</label>
              <select className={inputClass} value={form.operatorFunction} onChange={(e) => setForm((f) => ({ ...f, operatorFunction: e.target.value }))} required>
                <option value="" disabled>Selecione…</option>
                {OPERATOR_FUNCTIONS.map((fn) => <option key={fn} value={fn}>{fn}</option>)}
              </select>
            </div>
          )}
          {error && (
            <p className="text-sm rounded-lg px-4 py-2" style={{ color: "var(--gu-canceled-tx)", background: "var(--gu-canceled-bg)", border: "1px solid var(--gu-canceled-br)" }}>{error}</p>
          )}
          <div className="flex gap-3 justify-end mt-1">
            <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={isPending}>Salvar</Button>
          </div>
        </form>
      </div>
    </div>
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
  const { mutate: deleteUser } = useDeleteUser();
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
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

  const colHead = "font-mono text-[10px] tracking-widest uppercase text-left px-5 py-3";

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
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--gu-cream-200)" }}>
                {["Nome", "E-mail", "Papel", "Último acesso", "Status", ""].map((h, i) => (
                  <th key={i} className={colHead} style={{ color: "var(--gu-ink-300)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={6} className="text-center text-sm py-10" style={{ color: "var(--gu-ink-300)" }}>Carregando…</td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center text-sm py-10" style={{ color: "var(--gu-ink-300)" }}>Nenhum usuário encontrado</td></tr>
              )}
              {filtered.map((user) => {
                const isMe = user.id === myId;
                return (
                  <tr
                    key={user.id}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid var(--gu-cream-100)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--gu-cream-50)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
                  >
                    {/* Nome */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={user.name} />
                        <div>
                          <span className="text-sm font-medium block" style={{ color: "var(--gu-ink-900)" }}>{user.name}</span>
                          {isMe && (
                            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "var(--gu-ink-300)" }}>você</span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* E-mail */}
                    <td className="px-5 py-3" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12.5, color: "var(--gu-ink-500)" }}>
                      {user.email}
                    </td>
                    {/* Papel */}
                    <td className="px-5 py-3"><RoleBadge user={user} /></td>
                    {/* Último acesso */}
                    <td className="px-5 py-3" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12.5, color: "var(--gu-ink-300)" }}>
                      {relativeTime(user.lastLogin)}
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3">
                      <Switch
                        checked={user.active}
                        onChange={(val) => updateUser({ id: user.id, active: val })}
                      />
                    </td>
                    {/* ⋯ */}
                    <td className="px-5 py-3">
                      <MoreMenu
                        user={user}
                        onEdit={() => setEditingUser(user)}
                        onDelete={() => {
                          if (confirm(`Remover ${user.name}?`)) deleteUser(user.id);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} />}
      {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} />}
    </>
  );
}
