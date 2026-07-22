"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useCustomerSearch, useCreateCustomer, type Customer } from "@/lib/hooks/useCustomers";
import { useOpenSession } from "@/lib/hooks/useSessions";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

function useDebounce(value: string, ms: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export default function AbrirSessaoPage() {
  const router = useRouter();
  const { tableId } = useParams<{ tableId: string }>();
  const searchParams = useSearchParams();
  const tableCode = searchParams.get("code") ?? tableId.slice(-4).toUpperCase();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const [newName, setNewName] = useState("");
  const [newEmployer, setNewEmployer] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const debouncedQuery = useDebounce(searchQuery, 300);
  const { data: searchResults = [], isFetching } = useCustomerSearch(debouncedQuery);

  const createCustomer = useCreateCustomer();
  const openSession = useOpenSession();
  const submittingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = selectedCustomer !== null || newName.trim().length > 0;

  const handleSelectCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setSearchQuery("");
    setShowSearch(false);
  }, []);

  async function handleSubmit() {
    if (submittingRef.current || !canSubmit) return;
    submittingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      let customerId: string;
      if (selectedCustomer) {
        customerId = selectedCustomer.id;
      } else {
        const customer = await createCustomer.mutateAsync({
          name: newName.trim(),
          employer: newEmployer.trim() || undefined,
          email: newEmail.trim() || undefined,
          phone: newPhone.trim() || undefined,
        });
        customerId = customer.id;
      }
      const session = await openSession.mutateAsync({ tableId, customerId });
      router.push(`/mesas/${tableId}/pedido?sessionId=${session.id}&code=${encodeURIComponent(tableCode)}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Não foi possível abrir o atendimento. Tente novamente.";
      setError(msg);
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }

  return (
    <div className="h-full flex flex-col bg-cream-50">
      <PageHeader
        title="Novo atendimento"
        subtitle={`Mesa ${tableCode}`}
        back={{ label: "Mesas", href: "/mesas" }}
      />

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Buscar cliente */}
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
              Buscar cliente cadastrado
            </p>

            {selectedCustomer ? (
              <div className="flex items-center justify-between bg-bordeaux-900 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-cream-50">{selectedCustomer.name}</p>
                  {selectedCustomer.employer && (
                    <p className="text-xs text-ink-300">{selectedCustomer.employer}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedCustomer(null)}
                  className="text-ink-400 hover:text-red-400 hover:bg-transparent h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
                  onFocus={() => setShowSearch(true)}
                  placeholder="Nome ou email..."
                />
                {showSearch && searchQuery.length >= 2 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-border shadow-lg z-10 overflow-hidden">
                    {isFetching && (
                      <p className="text-xs text-muted-foreground px-4 py-3 font-mono">Buscando...</p>
                    )}
                    {!isFetching && searchResults.length === 0 && (
                      <p className="text-xs text-muted-foreground px-4 py-3">Nenhum resultado.</p>
                    )}
                    {searchResults.slice(0, 5).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectCustomer(c)}
                        className="w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-secondary transition-colors"
                      >
                        <p className="text-sm font-medium">{c.name}</p>
                        {c.employer && <p className="text-xs text-muted-foreground">{c.employer}</p>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
            ou cadastrar novo
          </span>
          <Separator className="flex-1" />
        </div>

        {/* Novo cliente */}
        <Card>
          <CardContent className="pt-4 flex flex-col gap-3">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Novo visitante
            </p>

            {[
              { label: "Nome *", value: newName, set: setNewName, placeholder: "Nome completo" },
              { label: "Empresa", value: newEmployer, set: setNewEmployer, placeholder: "Empresa ou organização" },
              { label: "E-mail", value: newEmail, set: setNewEmail, placeholder: "email@empresa.com" },
              { label: "Telefone", value: newPhone, set: setNewPhone, placeholder: "(11) 99999-9999" },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground font-mono">{label}</Label>
                <Input
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                  disabled={!!selectedCustomer}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">{error}</p>
        )}
      </div>

      <div className="pb-safe px-4 pt-4 bg-cream-50 border-t border-border">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className="w-full h-12 text-base"
        >
          {loading ? "Abrindo atendimento..." : "Abrir atendimento"}
        </Button>
      </div>
    </div>
  );
}
