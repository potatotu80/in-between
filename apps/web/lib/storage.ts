const TOKEN_KEY = "in-between-token";
const LOCALE_KEY = "in-between-locale";

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

export function readLocale() {
  if (typeof window === "undefined") {
    return "en";
  }

  return window.localStorage.getItem(LOCALE_KEY) ?? "en";
}

export function writeLocale(locale: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCALE_KEY, locale);
}
