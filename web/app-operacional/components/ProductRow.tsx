"use client";

import { useState } from "react";
import type { Product } from "@/lib/hooks/useProducts";
import { useCart } from "@/lib/cart-context";

interface Props {
  product: Product;
}

export function ProductRow({ product }: Props) {
  const { quantityOf, notesOf, add, setQty, setNotes } = useCart();
  const qty = quantityOf(product.id);
  const notes = notesOf(product.id);
  const [showNotes, setShowNotes] = useState(false);

  function increment() { setQty(product.id, qty + 1); if (qty === 0) add(product); }
  function decrement() { if (qty > 0) setQty(product.id, qty - 1); }

  return (
    <div className="bg-white border-b border-cream-100 last:border-0 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink-900 truncate">{product.name}</p>
          {product.description && (
            <p className="text-xs text-ink-400 truncate mt-0.5">{product.description}</p>
          )}
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decrement}
            disabled={qty === 0}
            className="w-8 h-8 rounded-full border-2 border-bordeaux-700 flex items-center justify-center text-bordeaux-700 font-semibold disabled:opacity-30 active:scale-90 transition-transform text-lg leading-none"
          >
            −
          </button>
          <span className="font-mono text-sm font-semibold text-ink-900 w-4 text-center">
            {qty > 0 ? qty : ""}
          </span>
          <button
            onClick={increment}
            className="w-8 h-8 rounded-full bg-bordeaux-700 flex items-center justify-center text-cream-50 font-semibold active:scale-90 transition-transform text-lg leading-none"
          >
            +
          </button>
        </div>
      </div>

      {/* Notes (visible when qty > 0) */}
      {qty > 0 && (
        <div className="mt-2">
          {!showNotes && !notes ? (
            <button
              onClick={() => setShowNotes(true)}
              className="text-xs text-bordeaux-500 underline-offset-2 underline"
            >
              + Observação
            </button>
          ) : (
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(product.id, e.target.value)}
              onBlur={() => { if (!notes) setShowNotes(false); }}
              autoFocus={showNotes && !notes}
              placeholder="Ex: sem cebola, bem gelado..."
              className="w-full rounded-lg bg-cream-50 border border-cream-200 px-3 py-2 text-xs text-ink-700 placeholder:text-ink-300 focus:outline-none focus:border-bordeaux-700 transition-colors"
            />
          )}
        </div>
      )}
    </div>
  );
}
