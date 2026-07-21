"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCustomerSearch, useCreateCustomer, type Customer } from "@/lib/hooks/useCustomers";
import { useOpenSession } from "@/lib/hooks/useSessions";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  // New customer form
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
      router.push(`/mesas/${tableId}/pedido?sessionId=${session.id}`);
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
    <div className="min-h-screen flex flex-col bg-cream-50">
      {/* Header */}
      <div className="bg-bordeaux-900 px-4 pt-10 pb-5">
        <button
          onClick={() => router.back()}
          className="text-xs text-ink-400 mb-3 flex items-center gap-1"
        >
          ← Voltar
        </button>
        <p className="text-xs font-mono text-champagne tracking-widest uppercase mb-1">
          Mesa {tableId.slice(-4).toUpperCase()}
        </p>
        <h1 className="text-xl font-semibold text-cream-50">Novo atendimento</h1>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-5">
        {/* Opção A: Buscar cliente */}
        <div className="bg-white rounded-2xl p-4 border border-cream-200">
          <p className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-3">
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
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-xs text-ink-400 hover:text-red-400 transition-colors"
              >
                Remover
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
                placeholder="Nome ou email..."
                className="w-full rounded-lg bg-cream-50 border border-cream-200 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-bordeaux-700 transition-colors"
              />
              {showSearch && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-cream-200 shadow-lg z-10 overflow-hidden">
                  {isFetching && (
                    <p className="text-xs text-ink-400 px-4 py-3 font-mono">Buscando...</p>
                  )}
                  {!isFetching && searchResults.length === 0 && (
                    <p className="text-xs text-ink-400 px-4 py-3">Nenhum resultado.</p>
                  )}
                  {searchResults.slice(0, 5).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCustomer(c)}
                      className="w-full text-left px-4 py-3 border-b border-cream-100 last:border-0 hover:bg-cream-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-ink-900">{c.name}</p>
                      {c.employer && <p className="text-xs text-ink-500">{c.employer}</p>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divisor */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-cream-200" />
          <span className="text-xs text-ink-400 font-mono uppercase tracking-wider">
            ou cadastrar novo
          </span>
          <div className="flex-1 h-px bg-cream-200" />
        </div>

        {/* Opção B: Novo cliente */}
        <div className="bg-white rounded-2xl p-4 border border-cream-200 flex flex-col gap-3">
          <p className="text-xs font-mono text-ink-500 uppercase tracking-wider">Novo visitante</p>

          {[
            { label: "Nome *", value: newName, onChange: setNewName, placeholder: "Nome completo", required: true },
            { label: "Empresa", value: newEmployer, onChange: setNewEmployer, placeholder: "Empresa ou organização" },
            { label: "E-mail", value: newEmail, onChange: setNewEmail, placeholder: "email@empresa.com" },
            { label: "Telefone", value: newPhone, onChange: setNewPhone, placeholder: "(11) 99999-9999" },
          ].map(({ label, value, onChange, placeholder }) => (
            <div key={label} className="flex flex-col gap-1">
              <label className="text-xs text-ink-500 font-mono">{label}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={!!selectedCustomer}
                className="w-full rounded-lg bg-cream-50 border border-cream-200 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-bordeaux-700 disabled:opacity-40 transition-colors"
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 p-4 bg-cream-50 border-t border-cream-200">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className="w-full rounded-xl py-4 text-base font-semibold transition-colors disabled:cursor-not-allowed"
          style={{
            backgroundColor: canSubmit && !loading ? "#6B2331" : "#ECE2CC",
            color: canSubmit && !loading ? "#FBF7EF" : "#7A736E",
          }}
        >
          {loading ? "Abrindo atendimento..." : "Abrir atendimento"}
        </button>
      </div>
    </div>
  );
}
