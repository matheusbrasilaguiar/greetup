"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await login({ email, password });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-mono text-xs tracking-[0.2em] text-ink-500 uppercase mb-1">
            Admin
          </p>
          <h1 className="font-display text-4xl font-semibold text-bordeaux-700">
            Greetup
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white border border-cream-200 rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="font-mono text-xs text-ink-500 uppercase tracking-widest"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-cream-200 bg-cream-50 text-ink-900 font-sans text-sm outline-none focus:border-bordeaux-500 focus:ring-1 focus:ring-bordeaux-500 transition"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="font-mono text-xs text-ink-500 uppercase tracking-widest"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-cream-200 bg-cream-50 text-ink-900 font-sans text-sm outline-none focus:border-bordeaux-500 focus:ring-1 focus:ring-bordeaux-500 transition"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-[var(--gu-canceled-tx)] bg-[var(--gu-canceled-bg)] border border-[var(--gu-canceled-br)] rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-bordeaux-700 text-white font-sans text-sm font-medium hover:bg-bordeaux-800 active:bg-bordeaux-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
