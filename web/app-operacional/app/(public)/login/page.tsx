"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <div className="h-full flex flex-col items-center justify-center overflow-y-auto px-6 bg-bordeaux-900">
      <div className="mb-10 text-center">
        <div className="mb-3 flex justify-center">
          <Arch />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-cream-50">GreetUp</h1>
        <p className="mt-1 text-xs font-mono tracking-widest text-champagne uppercase">
          Operacional · Evento
        </p>
      </div>

      <Card className="w-full max-w-sm bg-bordeaux-800 border-bordeaux-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-cream-50">Acesso ao sistema</CardTitle>
          <CardDescription className="text-ink-300">
            Entre com suas credenciais de Gerente ou Operador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-ink-300 uppercase tracking-wider font-mono">
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="bg-bordeaux-900 border-bordeaux-700 text-cream-50 placeholder:text-ink-500 focus-visible:ring-champagne"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-ink-300 uppercase tracking-wider font-mono">
                Senha
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="bg-bordeaux-900 border-bordeaux-700 text-cream-50 placeholder:text-ink-500 focus-visible:ring-champagne"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-950/40 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-bordeaux-700 hover:bg-bordeaux-500 text-cream-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-ink-500 text-center">
        Apenas Gerentes e Operadores.
        <br />
        Administradores usam o painel web/admin.
      </p>
    </div>
  );
}

function Arch() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <path
        d="M5.5 44V20.17C5.5 10.98 12.98 3.5 22.17 3.5 31.36 3.5 38.5 10.98 38.5 20.17V44"
        stroke="#D9B58A"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <circle cx="22" cy="23.84" r="3" fill="#FBF7EF" />
    </svg>
  );
}
