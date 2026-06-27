"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { saveToken, saveUser, clearToken, getToken } from "@/lib/auth";
import { disconnectSocket } from "@/lib/socket";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "GERENTE" | "OPERADOR";
  operatorFunction?: "COZINHA" | "GARCOM" | "DISPLAY";
  companyId: string;
}

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login({ email, password }: { email: string; password: string }) {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<{ token: string; user: AuthUser }>("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      if (user.role !== "GERENTE" && user.role !== "OPERADOR") {
        setError("Acesso não autorizado para este painel");
        return;
      }

      saveToken(token);
      saveUser(user);

      if (user.role === "GERENTE") {
        router.push("/pedido");
      } else {
        const fn = user.operatorFunction;
        if (fn === "COZINHA") router.push("/cozinha");
        else if (fn === "GARCOM") router.push("/garcom");
        else router.push("/display");
      }
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
    clearToken();
    disconnectSocket();
    router.push("/login");
  }

  return { login, logout, loading, error, isLoggedIn: !!getToken() };
}
