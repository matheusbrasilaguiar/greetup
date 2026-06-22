"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { saveToken, clearToken, getToken } from "@/lib/auth";
import { disconnectSocket } from "@/lib/socket";

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string;
}

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login({ email, password }: LoginPayload) {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<{ token: string; user: AuthUser }>("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      if (user.role !== "ADMIN") {
        setError("Acesso não autorizado para este painel");
        return;
      }

      saveToken(token);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Erro ao fazer login";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearToken();
    disconnectSocket();
    router.push("/login");
  }

  return { login, logout, loading, error, isLoggedIn: !!getToken() };
}
