"use client";

import { useState } from "react";
import type { KanbanItem, ItemStatus } from "@/lib/hooks/useOrderItems";

interface Props {
  item: KanbanItem;
  accent: string;
  now: number;
  pending: boolean;
  onAdvance?: () => void;
  onRevert?: () => void;
  onCancel?: () => void;
}

function OptionBadge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span
      className="font-mono text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}

const ACTION_LABEL: Partial<Record<ItemStatus, string>> = {
  PENDENTE: "Iniciar preparo",
  EM_PREPARO: "Marcar pronto",
  PRONTO: "Marcar entregue",
};

export function KanbanCard({ item, accent, now, pending, onAdvance, onRevert, onCancel }: Props) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const customer = item.order.session.customer;
  const tableCode = item.order.session.table.code;
  const ageMin = Math.floor((now - new Date(item.createdAt).getTime()) / 60_000);
  const late = item.status === "EM_PREPARO" && ageMin > 8;
  const showTimer = item.status !== "ENTREGUE";

  return (
    <div
      className="bg-cream-50 rounded-xl overflow-hidden"
      style={{ borderLeft: `4px solid ${accent}`, opacity: pending ? 0.6 : 1 }}
    >
      <div className="px-2 pt-2 pb-1.5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-1 mb-1">
          <div className="min-w-0">
            <p className="text-ink-900 font-semibold text-xs leading-tight truncate">
              {customer?.name ?? "—"}
            </p>
            <p className="text-[10px] text-ink-400 font-mono">{tableCode}</p>
          </div>
          {showTimer && (
            <span className={`text-xs font-mono shrink-0 ${late ? "text-red-500 font-semibold" : "text-ink-500"}`}>
              {ageMin}m
            </span>
          )}
        </div>

        {/* Product */}
        <p className="text-ink-700 text-xs">
          <span className="font-mono text-bordeaux-700 mr-1">{item.quantity}×</span>
          {item.product.name}
        </p>

        {/* Option badges */}
        {(item.withCheese !== null || item.courtesy || item.order?.toGo) && (
          <div className="flex gap-1 flex-wrap mt-1">
            {item.withCheese === true  && <OptionBadge label="COM QUEIJO" bg="#FEF3C7" color="#92400E" />}
            {item.withCheese === false && <OptionBadge label="SEM QUEIJO" bg="#F3F4F6" color="#4B5563" />}
            {item.courtesy             && <OptionBadge label="CORTESIA"   bg="#DCFCE7" color="#166534" />}
            {item.order?.toGo          && <OptionBadge label="LEVAR"      bg="#EFF6FF" color="#1D4ED8" />}
          </div>
        )}

        {/* Notes */}
        {item.notes && (
          <div className="mt-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
            <p className="text-amber-800 text-[10px]">
              <span className="font-semibold font-mono">OBS </span>
              {item.notes}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-2 pb-2 flex flex-col gap-1">
        {pending && (
          <p className="text-center text-xs text-ink-400 font-mono py-1">Aguarde...</p>
        )}

        {!pending && onAdvance && item.status !== "ENTREGUE" && (
          <button
            onClick={onAdvance}
            className="w-full rounded-lg py-1.5 text-xs font-semibold transition-colors"
            style={{
              backgroundColor: item.status === "PENDENTE" ? "transparent" : accent,
              color: item.status === "PENDENTE" ? accent : "#FBF7EF",
              border: item.status === "PENDENTE" ? `1.5px solid ${accent}` : "none",
            }}
          >
            {ACTION_LABEL[item.status as ItemStatus]}
          </button>
        )}

        {!pending && onRevert && !confirmCancel && (
          <button
            onClick={onRevert}
            className="w-full rounded-lg py-1 text-xs transition-colors text-ink-500 hover:text-ink-700"
          >
            ← Voltar
          </button>
        )}

        {!pending && onCancel && !confirmCancel && (
          <button
            onClick={() => setConfirmCancel(true)}
            className="w-full rounded-lg py-1 text-xs"
            style={{ color: "#EF4444" }}
          >
            Cancelar pedido
          </button>
        )}

        {confirmCancel && (
          <div className="flex gap-1 mt-0.5">
            <button
              onClick={() => setConfirmCancel(false)}
              className="flex-1 rounded-lg py-1.5 text-xs font-medium"
              style={{ background: "#3D1825", color: "#C9B8B0" }}
            >
              Não
            </button>
            <button
              onClick={() => { setConfirmCancel(false); onCancel?.(); }}
              className="flex-1 rounded-lg py-1.5 text-xs font-semibold"
              style={{ background: "#EF4444", color: "#fff" }}
            >
              Confirmar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
