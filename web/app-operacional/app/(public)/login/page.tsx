"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <div className="h-full flex flex-col items-center justify-center overflow-y-auto px-6 bg-chrome">
      <div className="mb-10 text-center">
        <div className="mb-3 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-chrome-foreground">GreetUp</h1>
        <p className="mt-1 text-xs font-mono tracking-widest text-chrome-accent uppercase">
          Operacional · Evento
        </p>
      </div>

      <Card className="w-full max-w-sm bg-chrome-card border-chrome-card-border shadow-xl">
        <CardHeader>
          <CardTitle className="text-chrome-card-foreground">Acesso ao sistema</CardTitle>
          <CardDescription className="text-chrome-muted-foreground">
            Entre com suas credenciais de Gerente ou Operador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-chrome-muted-foreground uppercase tracking-wider font-mono">
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="bg-chrome border-chrome-card-border text-chrome-foreground placeholder:text-chrome-subtle-foreground focus-visible:ring-chrome-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-chrome-muted-foreground uppercase tracking-wider font-mono">
                Senha
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="bg-chrome border-chrome-card-border text-chrome-foreground placeholder:text-chrome-subtle-foreground focus-visible:ring-chrome-accent"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-chrome-subtle-foreground text-center">
        Apenas Gerentes e Operadores.
        <br />
        Administradores usam o painel web/admin.
      </p>
    </div>
  );
}
