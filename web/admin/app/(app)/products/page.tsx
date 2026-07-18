"use client";

import { useState, useMemo } from "react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { PageHead } from "@/components/ui/PageHead";
import { FiltersBar, SearchField, SelectField } from "@/components/ui/FiltersBar";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  type Product,
  type ProductPayload,
} from "@/lib/hooks/useProducts";
import { useOrders } from "@/lib/hooks/useOrders";

const CATEGORIES = ["COMIDA", "BEBIDA", "MASSA"] as const;
const CAT_LABEL: Record<string, string> = { COMIDA: "Comidas", BEBIDA: "Bebidas", MASSA: "Massas" };

const inputClass =
  "w-full px-3 py-2 rounded-lg border text-sm outline-none transition" +
  " focus:ring-1 focus:ring-bordeaux-500 focus:border-bordeaux-500" +
  " bg-cream-50 border-cream-200 text-ink-900";
const labelClass = "font-mono text-[10px] tracking-widest text-ink-500 uppercase";

// ─── CategoryBadge ─────────────────────────────────────────────────────────

const CAT_STYLE: Record<string, { border: string; background: string; color: string }> = {
  COMIDA: { border: "var(--gu-delivered-br)", background: "var(--gu-delivered-bg)", color: "var(--gu-delivered-tx)" },
  BEBIDA: { border: "var(--gu-pending-br)",   background: "var(--gu-pending-bg)",   color: "var(--gu-pending-tx)"   },
  MASSA:  { border: "#C49A6C",                background: "#FEF3E2",                color: "#7C4A1E"                },
};

function CategoryBadge({ category }: { category: string }) {
  const style = CAT_STYLE[category] ?? CAT_STYLE.COMIDA;
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
        border: `1px solid ${style.border}`,
        background: style.background,
        color: style.color,
      }}
    >
      {CAT_LABEL[category] ?? category}
    </span>
  );
}

// ─── ProductModal ───────────────────────────────────────────────────────────

function ProductModal({ initial, onClose }: { initial?: Product; onClose: () => void }) {
  const { mutateAsync: create, isPending: creating } = useCreateProduct();
  const { mutateAsync: update, isPending: updating } = useUpdateProduct();
  const [form, setForm] = useState<ProductPayload>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "COMIDA",
    price: initial?.price ?? null,
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

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl" style={{ border: "1px solid var(--gu-cream-200)" }}>
        <h3 className="text-base font-semibold mb-5" style={{ color: "var(--gu-ink-900)" }}>
          {initial ? "Editar produto" : "Novo produto"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Nome</label>
            <input className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Descrição</label>
            <input className={inputClass} value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Categoria</label>
            <select className={inputClass} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_LABEL[c]}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Preço base (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={inputClass}
              placeholder="0,00"
              value={form.price ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value ? Number(e.target.value) : null }))}
            />
          </div>
          {error && (
            <p className="text-sm rounded-lg px-4 py-2" style={{ color: "var(--gu-canceled-tx)", background: "var(--gu-canceled-bg)", border: "1px solid var(--gu-canceled-br)" }}>{error}</p>
          )}
          <div className="flex gap-3 justify-end mt-1">
            <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={isPending}>{initial ? "Salvar" : "Criar"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "TODOS", label: "Todos os status" },
  { value: "ATIVO", label: "Ativos" },
  { value: "INATIVO", label: "Inativos" },
];

const CAT_OPTIONS = [
  { value: "TODOS", label: "Todas categorias" },
  { value: "COMIDA", label: "Comidas" },
  { value: "BEBIDA", label: "Bebidas" },
];

function fmt(price: number | null): string {
  if (price === null) return "—";
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: orders = [] } = useOrders();
  const { mutate: update } = useUpdateProduct();
  const [activeTab, setActiveTab] = useState<"COMIDA" | "BEBIDA" | "MASSA">("COMIDA");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [catFilter, setCatFilter] = useState("TODOS");
  const [editing, setEditing] = useState<Product | undefined>();
  const [showCreate, setShowCreate] = useState(false);

  // Mapa productId → quantidade servida (ENTREGUE) no evento
  const servedMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const order of orders) {
      for (const item of order.items) {
        if (item.status === "ENTREGUE") {
          map[item.product.id] = (map[item.product.id] ?? 0) + (item.quantity ?? 1);
        }
      }
    }
    return map;
  }, [orders]);

  const filtered = products.filter((p) => {
    if (p.category !== activeTab) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter === "ATIVO" && !p.active) return false;
    if (statusFilter === "INATIVO" && p.active) return false;
    if (catFilter !== "TODOS" && p.category !== catFilter) return false;
    return true;
  });

  const countByCategory = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = products.filter((p) => p.category === cat).length;
    return acc;
  }, {});

  const colHead = "font-mono text-[10px] tracking-widest uppercase text-left px-5 py-3";

  return (
    <>
      <PageHead
        eyebrow="Configuração · Catálogo"
        title="Produtos"
        sub="Gerencie os itens do cardápio"
        actions={<Button onClick={() => setShowCreate(true)}>+ Novo produto</Button>}
      />

      <Panel>
        {/* Tabs */}
        <div className="flex gap-6 px-5" style={{ borderBottom: "1px solid var(--gu-cream-200)" }}>
          {CATEGORIES.map((cat) => {
            const active = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className="relative pb-3 pt-3 flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: active ? "var(--gu-bordeaux-700)" : "var(--gu-ink-500)" }}
              >
                {CAT_LABEL[cat]}
                <span
                  className="font-mono text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: active ? "var(--gu-bordeaux-700)" : "var(--gu-cream-100)",
                    color: active ? "#fff" : "var(--gu-ink-500)",
                  }}
                >
                  {countByCategory[cat] ?? 0}
                </span>
                {active && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 rounded-t" style={{ background: "var(--gu-bordeaux-700)" }} />
                )}
              </button>
            );
          })}
        </div>

        <FiltersBar count={{ value: filtered.length, label: filtered.length === 1 ? "produto" : "produtos" }}>
          <SearchField value={search} onChange={setSearch} placeholder="Buscar por nome…" />
          <SelectField value={catFilter} onChange={setCatFilter} options={CAT_OPTIONS} />
          <SelectField value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
        </FiltersBar>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--gu-cream-200)" }}>
                {["Produto", "Categoria", "Descrição", "Preço base", "Servidos · evento", "Status", ""].map((h, i) => (
                  <th key={i} className={colHead} style={{ color: "var(--gu-ink-300)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={7} className="text-center text-sm py-10" style={{ color: "var(--gu-ink-300)" }}>Carregando…</td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center text-sm py-10" style={{ color: "var(--gu-ink-300)" }}>Nenhum produto encontrado</td></tr>
              )}
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid var(--gu-cream-100)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--gu-cream-50)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
                >
                  <td className="px-5 py-3 text-sm font-medium" style={{ color: "var(--gu-ink-900)" }}>
                    {product.name}
                  </td>
                  <td className="px-5 py-3">
                    <CategoryBadge category={product.category} />
                  </td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: "var(--gu-ink-700)" }}>
                    {product.description ?? "—"}
                  </td>
                  <td className="px-5 py-3" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 14, fontWeight: 500, color: "var(--gu-bordeaux-700)" }}>
                    {fmt(product.price)}
                  </td>
                  <td className="px-5 py-3" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12.5, color: "var(--gu-ink-500)" }}>
                    {servedMap[product.id] ?? 0}
                  </td>
                  <td className="px-5 py-3">
                    <Switch checked={product.active} onChange={(checked) => update({ id: product.id, active: checked })} />
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setEditing(product)}
                      className="flex items-center justify-center rounded transition-colors"
                      style={{ width: 28, height: 28, color: "var(--gu-ink-500)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--gu-cream-100)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                      title="Editar produto"
                    >
                      ⋯
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
