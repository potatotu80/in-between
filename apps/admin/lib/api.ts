import type { AdminOverview, AdminRound, AdminUser, LoginResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api/v1";

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }

  return (await response.json()) as T;
}

export function login(username: string, password: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function fetchOverview(token: string) {
  return request<AdminOverview>("/admin/overview", {}, token);
}

export function fetchUsers(token: string) {
  return request<AdminUser[]>("/admin/users", {}, token);
}

export function fetchRounds(token: string) {
  return request<AdminRound[]>("/admin/rounds", {}, token);
}
