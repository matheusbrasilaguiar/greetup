"use client";

import { useRef, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { CartProvider, useCart } from "@/lib/cart-context";
import { useCreateOrder } from "@/lib/hooks/useOrders";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";

function ConfirmarContent({ tableId, sessionId, tableCode }: { tableId: string; sessionId: string; tableCode: string }) {
  const router = useRouter();
  const { items, totalItems, clear } = useCart();
  const createOrder = useCreateOrder();
  const submittingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (submittingRef.current || items.length === 0) return;
    submittingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      await createOrder.mutateAsync({
        sessionId,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          notes: i.notes || undefined,
        })),
      });
      clear();
      router.push(`/conta/${tableId}/${sessionId}`);
    } catch {
      setError("Não foi possível enviar o pedido. Tente novamente.");
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }

  return (
    <div className="h-full flex flex-col bg-cream-50">
      <PageHeader
        title="Revisar pedido"
        subtitle={`Mesa ${tableCode}`}
        back={true}
      />

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <Card>
          <CardContent className="pt-0">
            {items.map((item, i) => (
              <div key={item.productId}>
                <div className="flex items-center justify-between py-3">
                  <p className="text-sm font-medium text-foreground">
                    <span className="font-mono text-bordeaux-700 mr-1">{item.quantity}×</span>
                    {item.name}
                  </p>
                </div>
                {item.notes && (
                  <p className="text-xs text-muted-foreground -mt-2 pb-2 italic">Obs: {item.notes}</p>
                )}
                {i < items.length - 1 && <Separator />}
              </div>
            ))}
            <Separator />
            <div className="flex justify-between py-3">
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Total</span>
              <span className="text-sm font-semibold">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Os itens serão enviados automaticamente para a cozinha após a confirmação.
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">{error}</p>
        )}
      </div>

      <div className="pb-safe px-4 pt-4 bg-cream-50 border-t border-border">
        <Button
          onClick={handleConfirm}
          disabled={loading || items.length === 0}
          className="w-full h-12 text-base"
        >
          {loading ? "Enviando para cozinha..." : "Confirmar pedido"}
        </Button>
      </div>
    </div>
  );
}

export default function ConfirmarPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") ?? "";
  const tableCode = searchParams.get("code") ?? "";

  return (
    <CartProvider tableId={tableId}>
      <ConfirmarContent tableId={tableId} sessionId={sessionId} tableCode={tableCode} />
    </CartProvider>
  );
}
