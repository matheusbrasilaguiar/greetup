"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-bordeaux-900">
      {/* Logo / header */}
      <div className="mb-10 text-center">
        <div className="mb-3 flex justify-center">
          <Arch />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-cream-50">GreetUp</h1>
        <p className="mt-1 text-xs font-mono tracking-widest text-champagne uppercase">
          Operação · Feirinha
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-bordeaux-800 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-ink-300 uppercase tracking-wider font-mono">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg bg-bordeaux-900 border border-bordeaux-700 px-4 py-3 text-cream-50 text-base placeholder:text-ink-500 focus:outline-none focus:border-champagne transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-ink-300 uppercase tracking-wider font-mono">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg bg-bordeaux-900 border border-bordeaux-700 px-4 py-3 text-cream-50 text-base placeholder:text-ink-500 focus:outline-none focus:border-champagne transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-950/40 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-bordeaux-700 hover:bg-bordeaux-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 text-base font-semibold text-cream-50 transition-colors"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
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
