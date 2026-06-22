"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { useUsers, useCreateUser, useDeleteUser, type CreateUserPayload } from "@/lib/hooks/useUsers";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  GERENTE: "Gerente",
  OPERADOR: "Operador",
};

const OPERATOR_FUNCTIONS = ["COZINHA", "GARCOM", "DISPLAY"];

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

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-cream-200 bg-cream-50 text-ink-900 text-sm outline-none focus:border-bordeaux-500 focus:ring-1 focus:ring-bordeaux-500 transition";
  const labelClass = "font-mono text-[10px] tracking-widest text-ink-500 uppercase";

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-cream-200 w-full max-w-md p-6 shadow-xl">
        <h3 className="font-sans text-base font-semibold text-ink-900 mb-5">Novo usuário</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Nome</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>E-mail</label>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Senha</label>
            <input
              type="password"
              className={inputClass}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
              minLength={6}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Perfil</label>
            <select
              className={inputClass}
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value, operatorFunction: undefined }))}
            >
              <option value="GERENTE">Gerente</option>
              <option value="OPERADOR">Operador</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {form.role === "OPERADOR" && (
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Função do operador</label>
              <select
                className={inputClass}
                value={form.operatorFunction ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, operatorFunction: e.target.value }))}
                required
              >
                <option value="" disabled>Selecione…</option>
                {OPERATOR_FUNCTIONS.map((fn) => (
                  <option key={fn} value={fn}>{fn}</option>
                ))}
              </select>
            </div>
          )}
          {error && (
            <p className="text-sm text-[var(--gu-canceled-tx)] bg-[var(--gu-canceled-bg)] border border-[var(--gu-canceled-br)] rounded-lg px-4 py-2">
              {error}
            </p>
          )}
          <div className="flex gap-3 justify-end mt-1">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              Criar usuário
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { data: users = [], isLoading } = useUsers();
  const { mutate: deleteUser } = useDeleteUser();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <Panel
        title="Usuários"
        action={
          <Button onClick={() => setShowCreate(true)}>+ Novo usuário</Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200">
                {["Nome", "E-mail", "Perfil", "Função", "Ações"].map((h) => (
                  <th
                    key={h}
                    className="font-mono text-[10px] tracking-widest text-ink-300 uppercase text-left px-5 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-ink-300 py-10 font-sans">
                    Carregando…
                  </td>
                </tr>
              )}
              {!isLoading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-ink-300 py-10 font-sans">
                    Nenhum usuário cadastrado
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className="border-b border-cream-100 hover:bg-cream-50 transition">
                  <td className="px-5 py-3 text-sm font-medium text-ink-900">{user.name}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-500">{user.email}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-700">
                    {ROLE_LABELS[user.role] ?? user.role}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-500">
                    {user.operatorFunction ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => {
                        if (confirm(`Remover ${user.name}?`)) deleteUser(user.id);
                      }}
                      className="text-xs text-[var(--gu-canceled-tx)] hover:underline font-sans"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} />}
    </>
  );
}
