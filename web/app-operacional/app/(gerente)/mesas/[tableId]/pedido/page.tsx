"use client";

import { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useProducts } from "@/lib/hooks/useProducts";
import { CartProvider, useCart } from "@/lib/cart-context";
import { ProductRow } from "@/components/ProductRow";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

type Tab = "COMIDA" | "BEBIDA";

function PedidoContent({ tableId, sessionId, tableCode }: { tableId: string; sessionId: string; tableCode: string }) {
  const router = useRouter();
  const { data: products = [], isLoading } = useProducts();
  const { totalItems } = useCart();
  const [activeTab, setActiveTab] = useState<Tab>("COMIDA");

  const filtered = products.filter((p) => p.active && p.category === activeTab);

  return (
    <div className="h-full flex flex-col bg-cream-50">
      <PageHeader
        title="Cardápio"
        subtitle={`Mesa ${tableCode}`}
        back={{ label: "Mesas", href: "/mesas" }}
      />

      {/* Tabs */}
      <div className="bg-bordeaux-800 px-4 pb-3 flex gap-2">
        {(["COMIDA", "BEBIDA"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors",
              activeTab === tab
                ? "bg-champagne text-bordeaux-900"
                : "text-ink-500 hover:text-ink-300"
            )}
          >
            {tab === "COMIDA" ? "Comidas" : "Bebidas"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <p className="text-muted-foreground text-sm text-center py-16 font-mono">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-16">Nenhum produto disponível.</p>
        ) : (
          <div className="bg-white mt-2 mx-4 rounded-2xl overflow-hidden border border-border">
            {filtered.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <div className="pb-safe px-4 pt-3 bg-cream-50 border-t border-border">
          <Button
            onClick={() => router.push(`/mesas/${tableId}/confirmar?sessionId=${sessionId}&code=${encodeURIComponent(tableCode)}`)}
            className="w-full h-12 text-base flex items-center justify-between px-5"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="font-mono text-sm">{totalItems} {totalItems === 1 ? "item" : "itens"}</span>
            </span>
            <span>Confirmar pedido →</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export default function PedidoPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") ?? "";
  const tableCode = searchParams.get("code") ?? "";

  return (
    <CartProvider tableId={tableId}>
      <PedidoContent tableId={tableId} sessionId={sessionId} tableCode={tableCode} />
    </CartProvider>
  );
}
