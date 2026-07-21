"use client";

import { useRef, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { CartProvider, useCart } from "@/lib/cart-context";
import { useCreateOrder } from "@/lib/hooks/useOrders";

function ConfirmarContent({ tableId, sessionId }: { tableId: string; sessionId: string }) {
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
    <div className="min-h-screen flex flex-col bg-cream-50">
      {/* Header */}
      <div className="bg-bordeaux-900 px-4 pt-10 pb-5">
        <button
          onClick={() => router.back()}
          disabled={loading}
          className="text-xs text-ink-400 mb-3 flex items-center gap-1 disabled:opacity-40"
        >
          ← Editar itens
        </button>
        <p className="text-xs font-mono text-champagne tracking-widest uppercase mb-1">
          Confirmar
        </p>
        <h1 className="text-xl font-semibold text-cream-50">Revisar pedido</h1>
      </div>

      {/* Items list */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        <div className="bg-white rounded-2xl overflow-hidden border border-cream-200">
          {items.map((item, i) => (
            <div
              key={item.productId}
              className={`px-4 py-3 ${i < items.length - 1 ? "border-b border-cream-100" : ""}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink-900">
                  <span className="font-mono text-bordeaux-700 mr-1">{item.quantity}×</span>
                  {item.name}
                </p>
              </div>
              {item.notes && (
                <p className="text-xs text-ink-400 mt-0.5 italic">Obs: {item.notes}</p>
              )}
            </div>
          ))}
          <div className="px-4 py-3 bg-cream-50 border-t border-cream-200 flex justify-between">
            <span className="text-xs text-ink-500 font-mono uppercase tracking-wider">Total</span>
            <span className="text-sm font-semibold text-ink-900">
              {totalItems} {totalItems === 1 ? "item" : "itens"}
            </span>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <p className="text-xs text-blue-700">
            Os itens serão enviados automaticamente para a cozinha após a confirmação.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
        )}
      </div>

      {/* CTA */}
      <div className="p-4 border-t border-cream-200">
        <button
          onClick={handleConfirm}
          disabled={loading || items.length === 0}
          className="w-full rounded-xl py-4 text-base font-semibold transition-colors disabled:cursor-not-allowed"
          style={{
            backgroundColor: !loading && items.length > 0 ? "#6B2331" : "#ECE2CC",
            color: !loading && items.length > 0 ? "#FBF7EF" : "#7A736E",
          }}
        >
          {loading ? "Enviando para cozinha..." : "Confirmar pedido"}
        </button>
      </div>
    </div>
  );
}

export default function ConfirmarPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") ?? "";

  return (
    <CartProvider tableId={tableId}>
      <ConfirmarContent tableId={tableId} sessionId={sessionId} />
    </CartProvider>
  );
}
