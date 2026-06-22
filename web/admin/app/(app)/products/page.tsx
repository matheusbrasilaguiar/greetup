"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  type Product,
  type ProductPayload,
} from "@/lib/hooks/useProducts";

const CATEGORIES = ["COMIDA", "BEBIDA", "SOBREMESA"];

const CAT_LABEL: Record<string, string> = {
  COMIDA: "Comidas",
  BEBIDA: "Bebidas",
  SOBREMESA: "Sobremesas",
};

function ProductModal({
  initial,
  onClose,
}: {
  initial?: Product;
  onClose: () => void;
}) {
  const { mutateAsync: create, isPending: creating } = useCreateProduct();
  const { mutateAsync: update, isPending: updating } = useUpdateProduct();
  const [form, setForm] = useState<ProductPayload>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "COMIDA",
  });
  const [error, setError] = useState<string | null>(null);

  const isPending = creating || updating;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (initial) {
        await update({ id: initial.id, ...form });
      } else {
        await create(form);
      }
      onClose();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erro ao salvar produto"
      );
    }
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-cream-200 bg-cream-50 text-ink-900 text-sm outline-none focus:border-bordeaux-500 focus:ring-1 focus:ring-bordeaux-500 transition";
  const labelClass = "font-mono text-[10px] tracking-widest text-ink-500 uppercase";

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-cream-200 w-full max-w-md p-6 shadow-xl">
        <h3 className="font-sans text-base font-semibold text-ink-900 mb-5">
          {initial ? "Editar produto" : "Novo produto"}
        </h3>
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
            <label className={labelClass}>Descrição</label>
            <input
              className={inputClass}
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Categoria</label>
            <select
              className={inputClass}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CAT_LABEL[c]}</option>
              ))}
            </select>
          </div>
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
              {initial ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const { mutate: update } = useUpdateProduct();
  const [activeTab, setActiveTab] = useState("COMIDA");
  const [editing, setEditing] = useState<Product | undefined>();
  const [showCreate, setShowCreate] = useState(false);

  const filtered = products.filter((p) => p.category === activeTab);

  return (
    <>
      <Panel
        title="Produtos"
        action={<Button onClick={() => setShowCreate(true)}>+ Novo produto</Button>}
      >
        {/* Tabs */}
        <div className="flex gap-1 px-5 py-3 border-b border-cream-200">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`font-mono text-xs tracking-widest uppercase px-3 py-1.5 rounded-lg transition ${
                activeTab === cat
                  ? "bg-bordeaux-700 text-cream-50"
                  : "text-ink-500 hover:bg-cream-100"
              }`}
            >
              {CAT_LABEL[cat]}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200">
                {["Nome", "Descrição", "Ativo", "Ações"].map((h) => (
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
                  <td colSpan={4} className="text-center text-sm text-ink-300 py-10 font-sans">
                    Carregando…
                  </td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-sm text-ink-300 py-10 font-sans">
                    Nenhum produto nesta categoria
                  </td>
                </tr>
              )}
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-cream-100 hover:bg-cream-50 transition">
                  <td className="px-5 py-3 text-sm font-medium text-ink-900">{product.name}</td>
                  <td className="px-5 py-3 text-sm text-ink-500">{product.description ?? "—"}</td>
                  <td className="px-5 py-3">
                    <Switch
                      checked={product.active}
                      onChange={(checked) => update({ id: product.id, active: checked })}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setEditing(product)}
                      className="text-xs text-bordeaux-700 hover:underline font-sans"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {showCreate && <ProductModal onClose={() => setShowCreate(false)} />}
      {editing && <ProductModal initial={editing} onClose={() => setEditing(undefined)} />}
    </>
  );
}
