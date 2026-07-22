"use client";

import type { KanbanItem, ItemStatus } from "@/lib/hooks/useOrderItems";
import { ITEM_STATUS_META } from "@/lib/itemStatus";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { OrderOptionBadges } from "@/components/OrderOptionBadge";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface Props {
  item: KanbanItem;
  now: number;
  pending: boolean;
  onAdvance?: () => void;
  onRevert?: () => void;
  onCancel?: () => void;
}

const ACTION_LABEL: Partial<Record<ItemStatus, string>> = {
  PENDENTE: "Iniciar preparo",
  EM_PREPARO: "Marcar pronto",
  PRONTO: "Marcar entregue",
};

const ADVANCE_BUTTON_CLASS: Partial<Record<ItemStatus, string>> = {
  PENDENTE: "border-status-warning-br text-status-warning-fg bg-transparent hover:bg-status-warning-bg",
  EM_PREPARO: "bg-status-info-br text-white hover:bg-status-info-br/90 border-transparent",
  PRONTO: "bg-status-success-br text-white hover:bg-status-success-br/90 border-transparent",
};

export function KanbanCard({ item, now, pending, onAdvance, onRevert, onCancel }: Props) {
  const meta = ITEM_STATUS_META[item.status];
  const customer = item.order.session.customer;
  const tableCode = item.order.session.table.code;
  const ageMin = Math.floor((now - new Date(item.createdAt).getTime()) / 60_000);
  const late = item.status === "EM_PREPARO" && ageMin > 8;
  const showTimer = item.status !== "ENTREGUE";

  return (
    <Card
      className={cn("border-l-4 py-0 gap-0", meta.borderClass)}
      style={{ opacity: pending ? 0.6 : 1 }}
    >
      <CardContent className="px-2 pt-2 pb-1.5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-1 mb-1">
          <div className="min-w-0">
            <p className="text-foreground font-semibold text-xs leading-tight truncate">
              {customer?.name ?? "—"}
            </p>
            <p className="text-[10px] text-muted-foreground font-mono">{tableCode}</p>
          </div>
          {showTimer && (
            <span className={cn("text-xs font-mono shrink-0", late ? "text-destructive font-semibold" : "text-muted-foreground")}>
              {ageMin}m
            </span>
          )}
        </div>

        {/* Product */}
        <p className="text-foreground/80 text-xs">
          <span className="font-mono text-primary mr-1">{item.quantity}×</span>
          {item.product.name}
        </p>

        <OrderOptionBadges withCheese={item.withCheese} courtesy={item.courtesy} toGo={item.order?.toGo ?? false} />

        {/* Notes */}
        {item.notes && (
          <div className="mt-1.5 bg-status-warning-bg border border-status-warning-br/40 rounded-lg px-2 py-1">
            <p className="text-status-warning-fg text-[10px]">
              <span className="font-semibold font-mono">OBS </span>
              {item.notes}
            </p>
          </div>
        )}
      </CardContent>

      {/* Actions */}
      <CardContent className="px-2 pb-2 flex flex-col gap-1">
        {pending && (
          <p className="text-center text-xs text-muted-foreground font-mono py-1">Aguarde...</p>
        )}

        {!pending && onAdvance && item.status !== "ENTREGUE" && (
          <Button
            onClick={onAdvance}
            variant="outline"
            className={cn("w-full text-xs font-semibold", ADVANCE_BUTTON_CLASS[item.status])}
          >
            {ACTION_LABEL[item.status as ItemStatus]}
          </Button>
        )}

        {!pending && onRevert && (
          <Button
            onClick={onRevert}
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft />
            Voltar
          </Button>
        )}

        {!pending && onCancel && (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                />
              }
            >
              Cancelar pedido
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancelar pedido?</AlertDialogTitle>
                <AlertDialogDescription>
                  O item de {customer?.name ?? "cliente"} será removido e não poderá ser recuperado.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Não</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={onCancel}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
}
