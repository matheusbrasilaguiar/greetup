"use client";

import { useState } from "react";
import type { Product } from "@/lib/hooks/useProducts";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

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
    <div className="bg-card border-b border-border last:border-0 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
          {product.description && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{product.description}</p>
          )}
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            onClick={decrement}
            disabled={qty === 0}
            className="rounded-full border-primary text-primary hover:bg-primary/10"
          >
            <Minus />
          </Button>
          <span className="font-mono text-sm font-semibold text-foreground w-4 text-center">
            {qty > 0 ? qty : ""}
          </span>
          <Button
            size="icon"
            onClick={increment}
            className="rounded-full"
          >
            <Plus />
          </Button>
        </div>
      </div>

      {/* Notes (visible when qty > 0) */}
      {qty > 0 && (
        <div className="mt-2">
          {!showNotes && !notes ? (
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowNotes(true)}
              className="h-auto p-0 text-xs"
            >
              + Observação
            </Button>
          ) : (
            <Input
              type="text"
              value={notes}
              onChange={(e) => setNotes(product.id, e.target.value)}
              onBlur={() => { if (!notes) setShowNotes(false); }}
              autoFocus={showNotes && !notes}
              placeholder="Ex: sem cebola, bem gelado..."
              className="text-xs"
            />
          )}
        </div>
      )}
    </div>
  );
}
