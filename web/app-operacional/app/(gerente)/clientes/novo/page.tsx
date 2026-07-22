"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCreateCustomer } from "@/lib/hooks/useCustomers";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function NovoClientePage() {
  const router = useRouter();
  const createCustomer = useCreateCustomer();
  const submittingRef = useRef(false);

  const [name, setName] = useState("");
  const [employer, setEmployer] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdName, setCreatedName] = useState<string | null>(null);

  const canSubmit = name.trim().length > 0;

  async function handleSubmit() {
    if (submittingRef.current || !canSubmit) return;
    submittingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      await createCustomer.mutateAsync({
        name: name.trim(),
        employer: employer.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      setCreatedName(name.trim());
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Não foi possível cadastrar o cliente. Tente novamente.";
      setError(msg);
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }

  function resetForm() {
    setName("");
    setEmployer("");
    setEmail("");
    setPhone("");
    setCreatedName(null);
    setError(null);
  }

  if (createdName) {
    return (
      <div className="h-full flex flex-col bg-background">
        <PageHeader title="Novo cliente" back={{ href: "/mesas" }} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-5">
          <div className="w-14 h-14 rounded-full bg-status-success-bg flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-status-success-fg" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">{createdName}</p>
            <p className="text-sm text-muted-foreground mt-1">Cliente cadastrado com sucesso.</p>
          </div>
          <div className="flex flex-col gap-2 w-full mt-2">
            <Button variant="outline" onClick={resetForm} className="w-full h-11">
              Cadastrar outro cliente
            </Button>
            <Button onClick={() => router.push("/mesas")} className="w-full h-11">
              Voltar para mesas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <PageHeader title="Novo cliente" back={{ href: "/mesas" }} />

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <Card className="overflow-visible">
          <CardHeader>
            <CardTitle>Dados do visitante</CardTitle>
            <CardDescription>
              Registre um novo visitante para atendimentos futuros. Apenas o nome é obrigatório — os demais campos facilitam buscas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { label: "Nome *", value: name, set: setName, placeholder: "Nome completo", type: "text" },
              { label: "Empresa", value: employer, set: setEmployer, placeholder: "Empresa ou organização", type: "text" },
              { label: "E-mail", value: email, set: setEmail, placeholder: "email@empresa.com", type: "email" },
              { label: "Telefone", value: phone, set: setPhone, placeholder: "(11) 99999-9999", type: "tel" },
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

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">{error}</p>
        )}
      </div>

      <div className="pb-safe px-4 pt-4 bg-background border-t border-border">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className="w-full h-12 text-base"
        >
          {loading ? "Cadastrando..." : "Cadastrar cliente"}
        </Button>
      </div>
    </div>
  );
}
