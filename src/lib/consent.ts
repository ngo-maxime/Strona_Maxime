// Wspólne stałe i helpery zgód cookies (baner, stopka, analityka, popup).
// Własne mini-helpery zamiast biblioteki js-cookie (mniej JS w przeglądarce).
export const CONSENT_COOKIE = "maxime_cookie_consent";
export const CONSENT_VERSION = 2;
export const CONSENT_MAX_AGE_DAYS = 180;
export const CONSENT_EVENT = "cookieConsentUpdated";
export const OPEN_SETTINGS_EVENT = "openCookieSettings";

export interface CookieConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  /** Data udzielenia zgody (rozliczalność – art. 7 ust. 1 RODO) */
  date?: string;
  version?: number;
}

export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function setCookie(name: string, value: string, days: number) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API nie działa jeszcze we wszystkich przeglądarkach
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${days * 86400}; Path=/; SameSite=Lax${secure}`;
}

/** Usuwa ciasteczka Google Analytics po wycofaniu zgody (również z domeny nadrzędnej). */
export function removeAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  for (const row of document.cookie.split("; ")) {
    const name = row.split("=")[0];
    if (name === "_ga" || name.startsWith("_ga_") || name === "_gid") {
      for (const d of domains) {
        // biome-ignore lint/suspicious/noDocumentCookie: j.w. – usuwanie ciasteczek GA
        document.cookie = `${name}=; Max-Age=0; Path=/${d ? `; Domain=${d}` : ""}`;
      }
    }
  }
}

export function readConsent(
  raw: string | undefined = getCookie(CONSENT_COOKIE),
): CookieConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CookieConsentState;
    // Starsza wersja zgody → prosimy o nią ponownie
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}
