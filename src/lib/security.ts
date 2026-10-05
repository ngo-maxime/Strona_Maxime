import { headers } from "next/headers";

// UWAGA: plik wyłącznie do użytku po stronie serwera (Server Actions / Route Handlers).

/** Escapowanie HTML – dane z formularzy trafiają do treści e-maila. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Usuwa znaki nowej linii – chroni nagłówki (np. temat e-maila) przed wstrzyknięciem. */
export function singleLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

const EMAIL_RE =
  /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

export function isValidEmail(value: string) {
  return value.length <= 254 && EMAIL_RE.test(value);
}

/** Bezpieczne pobranie pola tekstowego z FormData z limitem długości. */
export function field(formData: FormData, name: string, maxLength: number) {
  const value = formData.get(name);
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export async function getClientIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

// Prosty limiter w pamięci instancji (best effort na serverless).
// Przy większym ruchu warto podmienić na Upstash Redis / Vercel KV.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

/** Honeypot – ukryte pole, które wypełniają tylko boty. */
export const HONEYPOT_FIELD = "website";
