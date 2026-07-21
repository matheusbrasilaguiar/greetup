"use client";

import { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useProducts } from "@/lib/hooks/useProducts";
import { CartProvider, useCart } from "@/lib/cart-context";
import { ProductRow } from "@/components/ProductRow";

type Tab = "COMIDA" | "BEBIDA";

function PedidoContent({ tableId, sessionId }: { tableId: string; sessionId: string }) {
  const router = useRouter();
  const { data: products = [], isLoading } = useProducts();
  const { totalItems } = useCart();
  const [activeTab, setActiveTab] = useState<Tab>("COMIDA");

  const filtered = products.filter((p) => p.active && p.category === activeTab);

  return (
    <div className="h-full flex flex-col bg-cream-50">
      {/* Header */}
      <div className="bg-bordeaux-900 px-4 pt-10 pb-4">
        <button
          onClick={() => router.push("/mesas")}
          className="text-xs text-ink-400 mb-3 flex items-center gap-1"
        >
          ← Mesas
        </button>
        <p className="text-xs font-mono text-champagne tracking-widest uppercase mb-1">
          Cardápio
        </p>
        <h1 className="text-xl font-semibold text-cream-50">Selecionar itens</h1>
      </div>

      {/* Tabs */}
      <div className="bg-bordeaux-800 px-4 pb-3 flex gap-2">
        {(["COMIDA", "BEBIDA"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={{
              backgroundColor: activeTab === tab ? "#D9B58A" : "transparent",
              color: activeTab === tab ? "#2E1116" : "#7A736E",
            }}
          >
            {tab === "COMIDA" ? "Comidas" : "Bebidas"}
          </button>
        ))}
      </div>

      {/* Product list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <p className="text-ink-400 text-sm text-center py-16 font-mono">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-ink-400 text-sm text-center py-16">Nenhum produto disponível.</p>
        ) : (
          <div className="bg-white mt-2 mx-4 rounded-2xl overflow-hidden border border-cream-200">
            {filtered.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>
        )}
        {/* Bottom padding for floating bar */}
        <div className="h-24" />
      </div>

      {/* Floating action bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 pb-safe px-4 pt-4 bg-cream-50 border-t border-cream-200">
          <button
            onClick={() => router.push(`/mesas/${tableId}/confirmar?sessionId=${sessionId}`)}
            className="w-full rounded-xl py-4 bg-bordeaux-700 text-cream-50 text-base font-semibold flex items-center justify-between px-5 active:scale-95 transition-transform"
          >
            <span className="font-mono text-sm">{totalItems} {totalItems === 1 ? "item" : "itens"}</span>
            <span>Confirmar pedido →</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function PedidoPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") ?? "";

  return (
    <CartProvider tableId={tableId}>
      <PedidoContent tableId={tableId} sessionId={sessionId} />
    </CartProvider>
  );
}
