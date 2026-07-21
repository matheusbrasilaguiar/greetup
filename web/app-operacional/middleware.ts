import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = "gu_opc_token";

const GERENTE_PREFIXES = ["/mesas", "/conta"];
const OPERADOR_PREFIXES = ["/cozinha", "/garcom", "/display"];

function decodeJWT(token: string): { role?: string; operatorFunction?: string } | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function getRoleHome(role?: string, operatorFunction?: string): string {
  if (role === "GERENTE") return "/mesas";
  if (operatorFunction === "COZINHA") return "/cozinha";
  if (operatorFunction === "GARCOM") return "/garcom";
  return "/display";
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_KEY)?.value;
  const { pathname } = request.nextUrl;

  const isLogin = pathname === "/login" || pathname.startsWith("/login/");
  const isGerenteRoute = GERENTE_PREFIXES.some((p) => pathname.startsWith(p));
  const isOperadorRoute = OPERADOR_PREFIXES.some((p) => pathname.startsWith(p));
  const isProtected = isGerenteRoute || isOperadorRoute;

  // Sem token: protegidas vão para /login
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    const decoded = decodeJWT(token);
    const roleHome = getRoleHome(decoded?.role, decoded?.operatorFunction);

    // Na /login com token → vai para home do role
    if (isLogin) {
      return NextResponse.redirect(new URL(roleHome, request.url));
    }

    // GERENTE tentando acessar rota de OPERADOR → redireciona para home
    if (decoded?.role === "GERENTE" && isOperadorRoute) {
      return NextResponse.redirect(new URL("/mesas", request.url));
    }

    // OPERADOR tentando acessar rota de GERENTE → redireciona para home
    if (decoded?.role === "OPERADOR" && isGerenteRoute) {
      return NextResponse.redirect(new URL(roleHome, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
};
