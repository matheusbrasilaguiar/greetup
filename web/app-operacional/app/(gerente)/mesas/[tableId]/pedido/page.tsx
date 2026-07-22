"use client";

import { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useProducts, type Product } from "@/lib/hooks/useProducts";
import { CartProvider, useCart } from "@/lib/cart-context";
import { ProductRow } from "@/components/ProductRow";
import { PageHeader } from "@/components/PageHeader";
import { LoadingState, EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShoppingCart } from "lucide-react";

type Tab = "COMIDA" | "BEBIDA";

const tabTriggerClass =
  "rounded-full h-auto px-4 py-1.5 text-xs font-semibold border-none text-chrome-subtle-foreground hover:text-chrome-muted-foreground data-active:bg-chrome-accent data-active:text-chrome data-active:shadow-none";

function ProductList({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  if (isLoading) return <LoadingState />;
  if (products.length === 0) return <EmptyState title="Nenhum produto disponível." />;
  return (
    <div className="bg-card mt-2 mx-4 rounded-2xl overflow-hidden border border-border">
      {products.map((product) => (
        <ProductRow key={product.id} product={product} />
      ))}
    </div>
  );
}

function PedidoContent({ tableId, sessionId, tableCode }: { tableId: string; sessionId: string; tableCode: string }) {
  const router = useRouter();
  const { data: products = [], isLoading } = useProducts();
  const { totalItems } = useCart();
  const [activeTab, setActiveTab] = useState<Tab>("COMIDA");

  const comida = products.filter((p) => p.active && p.category === "COMIDA");
  const bebida = products.filter((p) => p.active && p.category === "BEBIDA");

  return (
    <div className="h-full flex flex-col bg-background">
      <PageHeader
        title="Cardápio"
        subtitle={`Mesa ${tableCode}`}
        back={{ label: "Mesas", href: "/mesas" }}
      />

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as Tab)}
        className="flex-1 min-h-0 flex flex-col gap-0"
      >
        <TabsList className="bg-chrome-border h-auto w-fit justify-start gap-2 rounded-none px-4 pb-3">
          <TabsTrigger value="COMIDA" className={tabTriggerClass}>Comidas</TabsTrigger>
          <TabsTrigger value="BEBIDA" className={tabTriggerClass}>Bebidas</TabsTrigger>
        </TabsList>

        <TabsContent value="COMIDA" className="flex-1 min-h-0 overflow-y-auto">
          <ProductList products={comida} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="BEBIDA" className="flex-1 min-h-0 overflow-y-auto">
          <ProductList products={bebida} isLoading={isLoading} />
        </TabsContent>
      </Tabs>

      {totalItems > 0 && (
        <div className="pb-safe px-4 pt-3 bg-background border-t border-border">
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
