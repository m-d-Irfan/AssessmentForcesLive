import { User, UserRole } from "@/types";

const TOKEN_KEY = "devassess_token";
const USER_KEY = "devassess_user";
const ROLE_COOKIE = "devassess_role";

export function setStoredAuth(token: string, user: User) {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Store cookies for server-side Next.js middleware protection
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `${ROLE_COOKIE}=${encodeURIComponent(user.role)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
}

export function clearStoredAuth() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.clear();
  } catch {
    // Storage access may fail in private mode
  }

  // Force-expire cookies across domain and paths
  const expireCookieStr = "=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  document.cookie = `${TOKEN_KEY}${expireCookieStr}`;
  document.cookie = `${ROLE_COOKIE}${expireCookieStr}`;
}
