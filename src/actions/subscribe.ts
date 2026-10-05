"use server";

import {
  field,
  getClientIp,
  HONEYPOT_FIELD,
  isValidEmail,
  rateLimit,
} from "@/lib/security";

const GENERIC_ERROR = "Wystąpił nieoczekiwany błąd serwera.";

// Format daty wymagany przez MailerLite: "YYYY-MM-DD HH:MM:SS" (UTC)
function mailerLiteDate(d = new Date()) {
  return d.toISOString().replace("T", " ").slice(0, 19);
}

export async function subscribeToNewsletter(formData: FormData) {
  // Honeypot – bot dostaje „sukces”, ale nic nie zapisujemy
  if (field(formData, HONEYPOT_FIELD, 200)) return { success: true };

  const email = field(formData, "email", 254).toLowerCase();
  const consent = formData.get("rodo_consent");

  if (!email) {
    return { error: "Adres e-mail jest wymagany." };
  }
  if (!isValidEmail(email) || !consent) {
    // Zgoda RODO weryfikowana także po stronie serwera (checkbox można obejść w przeglądarce)
    return {
      error: "Wystąpił błąd podczas zapisu. Być może jesteś już na liście.",
    };
  }

  const ip = await getClientIp();
  if (!rateLimit(`newsletter:${ip}`, 5, 10 * 60 * 1000)) {
    return { error: GENERIC_ERROR };
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    console.error("Brak zmiennej środowiskowej MAILERLITE_API_KEY");
    return { error: GENERIC_ERROR };
  }

  try {
    const groupId = process.env.MAILERLITE_GROUP_ID;
    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          // Status "unconfirmed" → MailerLite wysyła maila Double Opt-In
          status: "unconfirmed",
          // Dowód zgody (rozliczalność – art. 7 ust. 1 RODO): kiedy i z jakiego IP
          subscribed_at: mailerLiteDate(),
          ...(ip !== "unknown" && { ip_address: ip }),
          ...(groupId && { groups: [groupId] }),
        }),
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Błąd API MailerLite:", response.status, errorData);

      return {
        error: "Wystąpił błąd podczas zapisu. Być może jesteś już na liście.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Błąd serwera (newsletter):", error);
    return { error: GENERIC_ERROR };
  }
}
