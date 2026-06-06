import type {
  GameRound,
  GameSession,
  LobbyResponse,
  LoginResponse,
  SettledRound,
  Wallet,
} from "./types";

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

export function fetchLobby(token: string) {
  return request<LobbyResponse>("/lobby", {}, token);
}

export function fetchWallet(token: string) {
  return request<Wallet>("/wallet", {}, token);
}

export function fetchHistory(token: string) {
  return request<GameRound[]>("/history/rounds", {}, token);
}

export function createSession(token: string) {
  return request<GameSession>(
    "/games/sessions",
    {
      method: "POST",
      body: JSON.stringify({ clientPlatform: "mobile_web" }),
    },
    token,
  );
}

export function createRound(sessionId: string, token: string) {
  return request<GameRound>(
    `/games/sessions/${sessionId}/rounds`,
    {
      method: "POST",
    },
    token,
  );
}

export function settleRound(sessionId: string, roundId: string, betAmount: number, token: string) {
  return request<SettledRound>(
    `/games/sessions/${sessionId}/rounds/${roundId}/settle`,
    {
      method: "POST",
      body: JSON.stringify({ betAmount }),
    },
    token,
  );
}
