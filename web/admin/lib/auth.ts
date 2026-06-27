const TOKEN_KEY = "gu_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  // Sync to cookie so middleware can read it (client-side, SameSite=Strict)
  document.cookie = `${TOKEN_KEY}=${token}; path=/; SameSite=Strict`;
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}
