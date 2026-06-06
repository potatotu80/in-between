const TOKEN_KEY = "in-between-admin-token";

export function readToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(TOKEN_KEY) ?? "";
}

export function writeToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
}
