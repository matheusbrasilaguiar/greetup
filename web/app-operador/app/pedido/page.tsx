"use client";

"use client";

import { useState, useMemo } from "react";
import api from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProducts, Product } from "@/lib/hooks/useProducts";

type Stage = "idle" | "building" | "confirm" | "success";

interface CartItem {
  product: Product;
  quantity: number;
  notes: string;
  withCheese: boolean | null;
  courtesy: boolean;
}

export default function PedidoPage() {
  const { logout } = useAuth();
  const { data: products = [], isLoading } = useProducts();
  const [stage, setStage] = useState<Stage>("idle");
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [customerName, setCustomerName] = useState("");
  const [toGo, setToGo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const activeProducts = useMemo(
    () => products.filter((p) => p.active),
    [products]
  );

  const total = useMemo(
    () =>
      Object.values(cart).reduce(
        (sum, { product, quantity, courtesy }) =>
          courtesy ? sum : sum + Number(product.price ?? 0) * quantity,
        0
      ),
    [cart]
  );

  const totalItems = Object.values(cart).reduce((s, i) => s + i.quantity, 0);

  function addToCart(product: Product) {
    setCart((prev) => ({
      ...prev,
      [product.id]: {
        product,
        quantity: (prev[product.id]?.quantity ?? 0) + 1,
        notes: prev[product.id]?.notes ?? "",
        withCheese: prev[product.id]?.withCheese ?? null,
        courtesy: prev[product.id]?.courtesy ?? false,
      },
    }));
  }

  function setWithCheese(productId: string, value: boolean | null) {
    setCart((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], withCheese: value },
    }));
  }

  function setCourtesy(productId: string, value: boolean) {
    setCart((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], courtesy: value },
    }));
  }

  function removeFromCart(productId: string) {
    setCart((prev) => {
      const qty = prev[productId]?.quantity ?? 0;
      if (qty <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: { ...prev[productId], quantity: qty - 1 } };
    });
  }

  function setNotes(productId: string, notes: string) {
    setCart((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], notes },
    }));
  }

  function resetAll() {
    setCart({});
    setCustomerName("");
    setToGo(false);
    setSubmitError(null);
    setStage("idle");
  }

  async function handleConfirm() {
    if (!customerName.trim() || totalItems === 0) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      console.log("[pedido] 1. criando mesa...");
      const tableRes = await api.post("/tables", { code: `P-${Date.now()}` });
      const tableId = tableRes.data.id;
      console.log("[pedido] mesa:", tableId);

      console.log("[pedido] 2. criando cliente...");
      const customerRes = await api.post("/customers", { name: customerName.trim() });
      const customerId = customerRes.data.id;
      console.log("[pedido] cliente:", customerId);

      console.log("[pedido] 3. abrindo sessão...");
      const attendantId = getUser<{ id: string }>()?.id;
      const sessionRes = await api.post(`/tables/${tableId}/sessions`, { customerId, attendantId });
      const sessionId = sessionRes.data.id;
      console.log("[pedido] sessão:", sessionId);

      const items = Object.values(cart).map(({ product, quantity, notes, withCheese, courtesy }) => ({
        productId: product.id,
        quantity,
        ...(notes.trim() ? { notes: notes.trim() } : {}),
        ...(withCheese !== null ? { withCheese } : {}),
        ...(courtesy ? { courtesy: true } : {}),
      }));
      console.log("[pedido] 4. criando pedido...", { sessionId, items, toGo });
      await api.post("/orders", { sessionId, toGo, items });

      setStage("success");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err as { message?: string })?.message ??
        "Erro desconhecido";
      console.error("[pedido] erro:", err);
      setSubmitError(`Erro: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Estado: IDLE ──────────────────────────────────────────────────────────
  if (stage === "idle") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bordeaux-900 px-6">
        <div className="mb-8 text-center">
          <p className="text-xs font-mono tracking-widest text-champagne uppercase mb-2">
            GreetUp · Feirinha
          </p>
          <h1 className="text-3xl font-semibold text-cream-50 tracking-tight">
            Pronto para atender
          </h1>
        </div>
        <button
          onClick={() => setStage("building")}
          className="w-full max-w-xs rounded-2xl bg-bordeaux-700 hover:bg-bordeaux-500 active:scale-95 text-cream-50 text-xl font-semibold py-6 transition-all"
        >
          + Novo Pedido
        </button>
        <button
          onClick={logout}
          className="mt-8 text-xs text-ink-500 hover:text-ink-300 transition-colors"
        >
          Sair
        </button>
      </div>
    );
  }

  // ── Estado: SUCCESS ───────────────────────────────────────────────────────
  if (stage === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bordeaux-900 px-6 text-center">
        <div className="text-5xl mb-6">✓</div>
        <h2 className="text-2xl font-semibold text-cream-50 mb-2">
          Pedido enviado para a cozinha!
        </h2>
        <p className="text-ink-300 text-sm mb-8">
          {customerName} — R$ {total.toFixed(2).replace(".", ",")}
        </p>
        <button
          onClick={resetAll}
          className="rounded-2xl bg-bordeaux-700 hover:bg-bordeaux-500 active:scale-95 text-cream-50 text-lg font-semibold px-10 py-4 transition-all"
        >
          + Novo Pedido
        </button>
      </div>
    );
  }

  // ── Estado: BUILDING ou CONFIRM ───────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-bordeaux-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-10 pb-4">
        <button
          onClick={resetAll}
          className="text-ink-300 text-sm active:opacity-60"
        >
          ← Cancelar
        </button>
        <span className="text-xs font-mono text-champagne tracking-widest uppercase">
          Novo Pedido
        </span>
        <span className="text-ink-500 text-sm font-mono">{totalItems} itens</span>
      </div>

      {/* Cardápio */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-ink-500">
          Carregando cardápio...
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {/* Agrupa por categoria */}
          {groupByCategory(activeProducts).map(([category, items]) => (
            <div key={category} className="mb-6">
              <p className="text-xs font-mono text-champagne tracking-widest uppercase mb-3">
                {category}
              </p>
              <div className="flex flex-col gap-2">
                {items.map((product) => {
                  const qty = cart[product.id]?.quantity ?? 0;
                  const notes = cart[product.id]?.notes ?? "";
                  return (
                    <div
                      key={product.id}
                      className="bg-bordeaux-800 rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="text-cream-50 font-medium text-sm leading-tight">
                            {product.name}
                          </p>
                          <p className="text-champagne text-xs mt-0.5 font-mono">
                            R$ {Number(product.price ?? 0).toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                        {qty === 0 ? (
                          <button
                            onClick={() => addToCart(product)}
                            className="rounded-lg bg-bordeaux-700 hover:bg-bordeaux-500 active:scale-95 text-cream-50 text-lg px-4 py-1.5 font-semibold transition-all"
                          >
                            +
                          </button>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="w-8 h-8 rounded-lg bg-bordeaux-900 text-cream-50 text-lg font-semibold active:scale-95 transition-all flex items-center justify-center"
                            >
                              −
                            </button>
                            <span className="text-cream-50 font-semibold w-4 text-center font-mono">
                              {qty}
                            </span>
                            <button
                              onClick={() => addToCart(product)}
                              className="w-8 h-8 rounded-lg bg-bordeaux-700 hover:bg-bordeaux-500 text-cream-50 text-lg font-semibold active:scale-95 transition-all flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                      {qty > 0 && (
                        <div className="mt-2 flex flex-col gap-2">
                          {/* Com/Sem queijo — só para MASSA */}
                          {product.subcategory === "MASSA" && (
                            <div className="flex gap-2">
                              {([true, false] as const).map((val) => {
                                const active = cart[product.id]?.withCheese === val;
                                return (
                                  <button
                                    key={String(val)}
                                    onClick={() => setWithCheese(product.id, active ? null : val)}
                                    className="flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors"
                                    style={{
                                      background: active ? "#D9B58A" : "transparent",
                                      color: active ? "#4A1A24" : "#B0AAA5",
                                      border: `1.5px solid ${active ? "#D9B58A" : "#4A1A24"}`,
                                    }}
                                  >
                                    {val ? "Com queijo" : "Sem queijo"}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Cortesia */}
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={cart[product.id]?.courtesy ?? false}
                              onChange={(e) => setCourtesy(product.id, e.target.checked)}
                              className="w-4 h-4 accent-champagne"
                            />
                            <span className="text-xs text-ink-300">Cortesia (gratuito)</span>
                          </label>

                          {/* Observação */}
                          <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(product.id, e.target.value)}
                            placeholder="Observação (opcional)"
                            className="w-full rounded-lg bg-bordeaux-900 border border-bordeaux-700 px-3 py-1.5 text-cream-50 placeholder:text-ink-500 focus:outline-none focus:border-champagne transition-colors"
                            style={{ fontSize: "16px" }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom bar — confirmar */}
      {totalItems > 0 && (
        <div className="px-4 pb-8 pt-3 border-t border-bordeaux-800">
          {stage === "confirm" ? (
            <div className="flex flex-col gap-3">
              {/* Pra levar toggle */}
              <button
                onClick={() => setToGo((v) => !v)}
                className="w-full rounded-xl py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                style={{
                  background: toGo ? "#D9B58A" : "transparent",
                  color: toGo ? "#4A1A24" : "#7A736E",
                  border: `1.5px solid ${toGo ? "#D9B58A" : "#4A1A24"}`,
                }}
              >
                🛍 {toGo ? "Pra levar ✓" : "Pra levar"}
              </button>

              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nome do cliente"
                autoFocus
                className="w-full rounded-xl bg-bordeaux-800 border border-bordeaux-700 px-4 py-3 text-cream-50 placeholder:text-ink-500 focus:outline-none focus:border-champagne transition-colors"
                style={{ fontSize: "16px" }}
              />
              {submitError && (
                <p className="text-red-400 text-sm text-center">{submitError}</p>
              )}
              <button
                onClick={handleConfirm}
                disabled={submitting || !customerName.trim()}
                className="w-full rounded-xl bg-bordeaux-700 hover:bg-bordeaux-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-cream-50 text-lg font-semibold py-4 transition-all"
              >
                {submitting
                  ? "Enviando..."
                  : `Pagou — R$ ${total.toFixed(2).replace(".", ",")}`}
              </button>
              <button
                onClick={() => setStage("building")}
                className="text-ink-500 text-sm text-center active:opacity-60"
              >
                ← Voltar ao cardápio
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-ink-500 font-mono uppercase tracking-wider">Total</p>
                <p className="text-2xl font-semibold text-cream-50 font-mono">
                  R$ {total.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <button
                onClick={() => setStage("confirm")}
                className="flex-1 rounded-xl bg-bordeaux-700 hover:bg-bordeaux-500 active:scale-95 text-cream-50 text-base font-semibold py-4 transition-all"
              >
                Confirmar →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function groupByCategory(products: Product[]): [string, Product[]][] {
  const map = new Map<string, Product[]>();
  for (const p of products) {
    if (!map.has(p.category)) map.set(p.category, []);
    map.get(p.category)!.push(p);
  }
  return Array.from(map.entries());
}
