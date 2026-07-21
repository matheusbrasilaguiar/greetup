"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { setToken, setUser, removeToken, getToken, getUser, getRoleHome, type AuthUser } from "@/lib/auth";
import { disconnectSocket } from "@/lib/socket";

export { type AuthUser };

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login({ email, password }: { email: string; password: string }) {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<{ token: string; user: AuthUser }>("/auth/login", { email, password });
      const { token, user } = res.data;

      if (user.role !== "GERENTE" && user.role !== "OPERADOR") {
        setError("Acesso não permitido. Use o painel administrativo.");
        return;
      }

      setToken(token);
      setUser(user);
      router.push(getRoleHome(user.role, user.operatorFunction));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Email ou senha incorretos";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    removeToken();
    disconnectSocket();
    router.push("/login");
  }

  return { login, logout, loading, error, isLoggedIn: !!getToken(), getUser };
}
