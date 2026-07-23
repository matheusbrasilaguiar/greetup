"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableRowsSkeleton } from "@/components/TableRowsSkeleton";
import { CATEGORY_META } from "@/lib/statusBadge";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  type Product,
  type ProductPayload,
} from "@/lib/hooks/useProducts";
import { useOrders } from "@/lib/hooks/useOrders";
import { Pencil } from "lucide-react";

const CATEGORIES = ["COMIDA", "BEBIDA"] as const;
const SUBCATEGORIES_BY_CAT: Record<string, string[]> = { COMIDA: ["MASSA"] };

// ─── CategoryBadge ─────────────────────────────────────────────────────────

function CategoryBadge({ category, subcategory }: { category: string; subcategory?: string | null }) {
  const meta = CATEGORY_META[category] ?? CATEGORY_META.COMIDA;
  return (
    <span className="inline-flex items-center gap-1">
      <Badge variant={meta.variant}>{meta.label}</Badge>
      {subcategory && (
        <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase border-champagne text-ink-700 bg-cream-100">
          {subcategory}
        </Badge>
      )}
    </span>
  );
}

// ─── ProductDialog ───────────────────────────────────────────────────────────

function ProductDialog({ initial, open, onOpenChange }: { initial?: Product; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { mutateAsync: create, isPending: creating } = useCreateProduct();
  const { mutateAsync: update, isPending: updating } = useUpdateProduct();
  const [form, setForm] = useState<ProductPayload>({
    name: "",
    description: "",
    category: "COMIDA",
    subcategory: null,
    price: null,
  });
  const [error, setError] = useState<string | null>(null);
  const isPending = creating || updating;

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name ?? "",
        description: initial?.description ?? "",
        category: initial?.category ?? "COMIDA",
        subcategory: initial?.subcategory ?? null,
        price: initial?.price ?? null,
      });
      setError(null);
    }
  }, [open, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (initial) {
        await update({ id: initial.id, ...form });
      } else {
        await create(form);
      }
      onOpenChange(false);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erro ao salvar produto"
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Editar produto" : "Novo produto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Nome</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Descrição</Label>
            <Input value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Categoria</Label>
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v, subcategory: null }))}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{CATEGORY_META[c].label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {SUBCATEGORIES_BY_CAT[form.category]?.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Subcategoria</Label>
              <Select value={form.subcategory ?? "NONE"} onValueChange={(v) => setForm((f) => ({ ...f, subcategory: v === "NONE" ? null : v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Nenhuma</SelectItem>
                  {SUBCATEGORIES_BY_CAT[form.category].map((s) => (
                    <SelectItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Preço base (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={form.price ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value ? Number(e.target.value) : null }))}
            />
          </div>
          {error && (
            <p className="text-sm text-status-canceled-fg bg-status-canceled-bg border border-status-canceled-br rounded-lg px-4 py-2">{error}</p>
          )}
          <DialogFooter>
            <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" loading={isPending}>{initial ? "Salvar" : "Criar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "TODOS", label: "Todos os status" },
  { value: "ATIVO", label: "Ativos" },
  { value: "INATIVO", label: "Inativos" },
];

function fmt(price: number | null): string {
  if (price === null) return "—";
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: orders = [] } = useOrders();
  const { mutate: update } = useUpdateProduct();
  const [activeTab, setActiveTab] = useState<"COMIDA" | "BEBIDA">("COMIDA");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
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
    return true;
  });

  const countByCategory = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = products.filter((p) => p.category === cat).length;
    return acc;
  }, {});

  const colHead = "font-mono text-[10px] tracking-widest uppercase text-left px-5 py-3 text-muted-foreground/70";

  return (
    <>
      <PageHead
        eyebrow="Configuração · Catálogo"
        title="Produtos"
        sub="Gerencie os itens do cardápio"
        actions={<Button onClick={() => setShowCreate(true)}>+ Novo produto</Button>}
      />

      <Panel>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "COMIDA" | "BEBIDA")}>
          <TabsList variant="line" className="w-full !h-auto justify-start gap-6 rounded-none border-b border-border bg-transparent px-5">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="group/tab after:hidden h-auto flex-none gap-2 rounded-none border-x-0 border-t-0 border-b-2 border-transparent px-0 py-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-primary dark:data-[state=active]:bg-transparent"
              >
                {CATEGORY_META[cat].label}
                <span className="rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground group-data-[state=active]/tab:bg-primary group-data-[state=active]/tab:text-primary-foreground">
                  {countByCategory[cat] ?? 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <FiltersBar count={{ value: filtered.length, label: filtered.length === 1 ? "produto" : "produtos" }}>
          <SearchField value={search} onChange={setSearch} placeholder="Buscar por nome…" />
          <SelectField value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
        </FiltersBar>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                {[
                  { label: "Produto" },
                  { label: "Categoria" },
                  { label: "Descrição", hide: "hidden lg:table-cell" },
                  { label: "Preço base", hide: "hidden sm:table-cell" },
                  { label: "Servidos · evento", hide: "hidden md:table-cell" },
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
                    { width: "w-16" },
                    { hide: "hidden lg:table-cell" },
                    { hide: "hidden sm:table-cell", width: "w-14" },
                    { hide: "hidden md:table-cell", width: "w-8" },
                    { width: "w-9" },
                    { width: "w-7" },
                  ]}
                />
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center text-sm text-muted-foreground/70 py-10">Nenhum produto encontrado</td></tr>
              )}
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-border/60 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">
                    {product.name}
                  </td>
                  <td className="px-5 py-3">
                    <CategoryBadge category={product.category} subcategory={product.subcategory} />
                  </td>
                  <td className="hidden lg:table-cell px-5 py-3 text-[13px] text-muted-foreground">
                    {product.description ?? "—"}
                  </td>
                  <td className="hidden sm:table-cell px-5 py-3 font-mono text-sm font-medium text-primary">
                    {fmt(product.price)}
                  </td>
                  <td className="hidden md:table-cell px-5 py-3 font-mono text-[12.5px] text-muted-foreground">
                    {servedMap[product.id] ?? 0}
                  </td>
                  <td className="px-5 py-3">
                    <Switch checked={product.active} onCheckedChange={(checked) => update({ id: product.id, active: checked })} />
                  </td>
                  <td className="px-5 py-3">
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => setEditing(product)} title="Editar produto">
                      <Pencil className="size-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <ProductDialog open={showCreate} onOpenChange={setShowCreate} />
      <ProductDialog initial={editing} open={!!editing} onOpenChange={(o) => !o && setEditing(undefined)} />
    </>
  );
}
