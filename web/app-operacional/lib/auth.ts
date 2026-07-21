const TOKEN_KEY = "gu_opc_token";
const USER_KEY  = "gu_opc_user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "GERENTE" | "OPERADOR";
  operatorFunction?: "COZINHA" | "GARCOM" | "DISPLAY";
  companyId: string;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; SameSite=Strict`;
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

export function setUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as AuthUser; } catch { return null; }
}

export function decodeToken(token: string): { sub: string; role: string; operatorFunction?: string; companyId: string } | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function getRoleHome(role: string, operatorFunction?: string | null): string {
  if (role === "GERENTE") return "/mesas";
  if (operatorFunction === "COZINHA") return "/cozinha";
  if (operatorFunction === "GARCOM") return "/garcom";
  return "/display";
}
