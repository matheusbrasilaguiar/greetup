"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionOrders, useCloseOrder, type OrderItem } from "@/lib/hooks/useOrders";
import { useCloseSession } from "@/lib/hooks/useSessions";
import { useSocketEvents } from "@/lib/hooks/useSocket";
import { toast } from "sonner";
import { ItemStatusBadge } from "@/components/ItemStatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AlertTriangle } from "lucide-react";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function useDuration(openedAt: string) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  return Math.floor((now - new Date(openedAt).getTime()) / 60_000);
}

export default function ContaPage() {
  const router = useRouter();
  const { tableId, sessionId } = useParams<{ tableId: string; sessionId: string }>();
  const qc = useQueryClient();

  const { data: orders = [], isLoading } = useSessionOrders(sessionId);
  const closeOrder = useCloseOrder();
  const closeSession = useCloseSession();

  const [showCloseSheet, setShowCloseSheet] = useState(false);
  const [closing, setClosing] = useState(false);

  const flatItems = useMemo(() => {
    return orders.flatMap((order) => order.items.map((item) => ({ ...item, order })));
  }, [orders]);

  const openOrders = orders.filter((o) => o.status === "OPEN");
  const deliveredCount = flatItems.filter((i) => i.status === "ENTREGUE").length;
  const hasUndeliveredItems = flatItems.some((i) => i.status !== "ENTREGUE");

  const sessionOpenedAt = orders[0]?.createdAt ?? new Date().toISOString();
  const durationMin = useDuration(sessionOpenedAt);
  const customerName = orders[0]?.session?.customer?.name;
  const tableCode = orders[0]?.session?.table?.code;

  const socketHandlers = useCallback(
    () => ({
      order_item_status_changed: (data: unknown) => {
        qc.invalidateQueries({ queryKey: ["orders", "session", sessionId] });
        const d = data as { status?: string; productName?: string };
        if (d?.status === "PRONTO" && d?.productName) {
          toast.success(`${d.productName} pronto para entrega!`);
        }
      },
      order_created: () => {
        qc.invalidateQueries({ queryKey: ["orders", "session", sessionId] });
      },
    }),
    [qc, sessionId]
  );
  useSocketEvents(socketHandlers());

  async function handleCloseAccount() {
    if (closing) return;
    setClosing(true);
    try {
      await Promise.all(openOrders.map((o) => closeOrder.mutateAsync(o.id)));
      await closeSession.mutateAsync({ tableId, sessionId });
      router.push("/mesas");
    } catch {
      setClosing(false);
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <PageHeader
        title={customerName ?? "Atendimento"}
        subtitle={tableCode ? `Mesa ${tableCode}` : "Conta ativa"}
        back={{ label: "Mesas", href: "/mesas" }}
      />

      {/* Duration pill */}
      <div className="bg-chrome px-4 pb-4 -mt-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chrome-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-chrome-accent" />
          </span>
          <p className="text-xs text-chrome-muted-foreground font-mono">
            Conta aberta há {durationMin}min
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {isLoading ? (
          <p className="text-muted-foreground text-sm text-center py-16 font-mono">Carregando...</p>
        ) : flatItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">Nenhum pedido ainda.</p>
            <p className="text-xs text-muted-foreground mt-1">Faça o primeiro pedido abaixo.</p>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-0">
              {flatItems.map((item, i) => (
                <div key={item.id}>
                  <FlatItem item={item} />
                  {i < flatItems.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {flatItems.length > 0 && (
          <Card>
            <CardContent className="py-3 flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                Itens entregues
              </span>
              <span className="text-sm font-semibold">
                {deliveredCount} / {flatItems.length}
              </span>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="pb-safe px-4 pt-3 bg-background border-t border-border flex flex-col gap-2">
        <Button
          variant="outline"
          onClick={() => router.push(`/mesas/${tableId}/pedido?sessionId=${sessionId}&code=${encodeURIComponent(tableCode ?? "")}`)}
          className="w-full h-11"
        >
          + Novo pedido
        </Button>
        <Button
          variant="ghost"
          onClick={() => setShowCloseSheet(true)}
          className="w-full h-10 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          Fechar conta
        </Button>
      </div>

      <Sheet open={showCloseSheet} onOpenChange={setShowCloseSheet}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-safe max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Fechar conta</SheetTitle>
          </SheetHeader>

          <div className="px-4 flex flex-col gap-3">
            <Card>
              <CardContent className="pt-3 pb-1">
                {[
                  { label: "Cliente", value: customerName ?? "—" },
                  { label: "Itens entregues", value: `${deliveredCount} de ${flatItems.length}` },
                  { label: "Duração", value: `${durationMin}min` },
                ].map(({ label, value }, i, arr) => (
                  <div key={label}>
                    <div className="flex justify-between py-2.5">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                    {i < arr.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {openOrders.length > 0 && hasUndeliveredItems && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Há itens ainda em preparo — serão cancelados ao fechar a conta.
                </p>
              </div>
            )}
          </div>

          <SheetFooter className="flex-col gap-2">
            <Button
              onClick={handleCloseAccount}
              disabled={closing}
              className="w-full h-12 text-base"
            >
              {closing ? "Fechando..." : "Confirmar fechamento"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowCloseSheet(false)}
              className="w-full text-muted-foreground"
            >
              Cancelar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function FlatItem({ item }: { item: OrderItem }) {
  const isDelivered = item.status === "ENTREGUE";
  return (
    <div className="flex items-center justify-between py-3" style={{ opacity: isDelivered ? 0.65 : 1 }}>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-mono text-bordeaux-700 mr-1">{item.quantity}×</span>
          {item.product.name}
        </p>
        {item.notes && (
          <p className="text-xs text-muted-foreground mt-0.5 italic">{item.notes}</p>
        )}
        <p className="text-xs text-muted-foreground mt-0.5 font-mono">
          {isDelivered ? "Entregue às" : "Pedido às"} {formatTime(item.createdAt)}
        </p>
      </div>
      <ItemStatusBadge status={item.status} />
    </div>
  );
}
