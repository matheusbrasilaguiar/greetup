"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useCustomerSearch, useCreateCustomer, type Customer } from "@/lib/hooks/useCustomers";
import { useOpenSession } from "@/lib/hooks/useSessions";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { X, UserPlus, Search } from "lucide-react";

type Mode = "search" | "create";

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

  const [mode, setMode] = useState<Mode>("search");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

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

  const canSubmit =
    mode === "search" ? selectedCustomer !== null : newName.trim().length > 0;

  const handleSelectCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setSearchQuery("");
    setShowResults(false);
  }, []);

  function switchToCreate() {
    setMode("create");
    setSelectedCustomer(null);
    setSearchQuery("");
    setShowResults(false);
    setError(null);
  }

  function switchToSearch() {
    setMode("search");
    setNewName("");
    setNewEmployer("");
    setNewEmail("");
    setNewPhone("");
    setError(null);
  }

  async function handleSubmit() {
    if (submittingRef.current || !canSubmit) return;
    submittingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      let customerId: string;
      if (mode === "search" && selectedCustomer) {
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

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">

        {mode === "search" ? (
          <>
            {selectedCustomer ? (
              /* Cliente selecionado */
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Visitante selecionado</CardTitle>
                  <CardDescription>Cliente vinculado a este atendimento.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{selectedCustomer.name}</p>
                    {selectedCustomer.employer && (
                      <p className="text-xs text-muted-foreground truncate">{selectedCustomer.employer}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedCustomer(null)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ) : (
              /* Campo de busca */
              <Card className="overflow-visible">
                <CardHeader className="pb-3">
                  <CardTitle>Buscar visitante</CardTitle>
                  <CardDescription>
                    Encontre pelo nome ou e-mail. Caso seja a primeira visita, cadastre um novo abaixo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                      onFocus={() => setShowResults(true)}
                      placeholder="Nome ou email..."
                      autoComplete="off"
                    />
                    {showResults && searchQuery.length >= 2 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-border shadow-lg z-10 overflow-hidden">
                        {isFetching && (
                          <p className="text-xs text-muted-foreground px-4 py-3 font-mono">Buscando...</p>
                        )}
                        {!isFetching && searchResults.length === 0 && (
                          <p className="text-xs text-muted-foreground px-4 py-3">Nenhum resultado encontrado.</p>
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
                </CardContent>
              </Card>
            )}

            <Button
              variant="outline"
              onClick={switchToCreate}
              className="w-full h-10 gap-2 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Cadastrar novo cliente
            </Button>
          </>
        ) : (
          <>
            {/* Modo de cadastro */}
            <Button
              variant="ghost"
              onClick={switchToSearch}
              className="w-full h-10 gap-2 text-sm text-muted-foreground"
            >
              <Search className="w-4 h-4" />
              Buscar cliente existente
            </Button>

            <Card className="overflow-visible">
              <CardHeader className="pb-3">
                <CardTitle>Novo visitante</CardTitle>
                <CardDescription>
                  Preencha os dados para cadastro e abertura do atendimento. Apenas o nome é obrigatório.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {[
                  { label: "Nome *", value: newName, set: setNewName, placeholder: "Nome completo", type: "text" },
                  { label: "Empresa", value: newEmployer, set: setNewEmployer, placeholder: "Empresa ou organização", type: "text" },
                  { label: "E-mail", value: newEmail, set: setNewEmail, placeholder: "email@empresa.com", type: "email" },
                  { label: "Telefone", value: newPhone, set: setNewPhone, placeholder: "(11) 99999-9999", type: "tel" },
                ].map(({ label, value, set, placeholder, type }) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground font-mono">{label}</Label>
                    <Input
                      type={type}
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

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
