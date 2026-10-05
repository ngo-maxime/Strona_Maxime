// src/actions/sendEmail.ts
"use server";

import { Resend } from "resend";
import {
  escapeHtml,
  field,
  getClientIp,
  HONEYPOT_FIELD,
  isValidEmail,
  rateLimit,
  singleLine,
} from "@/lib/security";

const ALLOWED_SUBJECTS = [
  "Współpraca",
  "Bilety i Wydarzenia",
  "Dla Prasy",
  "Dołączenie do zespołu",
  "Inne",
];

const REQUIRED_ERROR = "Wszystkie podstawowe pola są wymagane.";
const GENERIC_ERROR = "Wystąpił nieoczekiwany błąd serwera.";

export async function sendEmail(formData: FormData) {
  // Honeypot – bot dostaje „sukces”, ale wiadomość nie jest wysyłana
  if (field(formData, HONEYPOT_FIELD, 200)) return { success: true };

  // Pobieramy dane z formularza (z limitami długości)
  const name = singleLine(field(formData, "name", 120));
  const email = singleLine(field(formData, "email", 254));
  const message = field(formData, "message", 5000);
  const rawCategory = field(formData, "subjectCategory", 60);
  const customSubject = singleLine(field(formData, "customSubject", 150));

  const subjectCategory = ALLOWED_SUBJECTS.includes(rawCategory)
    ? rawCategory
    : "Inne";

  const finalSubject =
    subjectCategory === "Inne" && customSubject
      ? `Inne: ${customSubject}`
      : subjectCategory;

  // Walidacja na backendzie
  if (!name || !email || !message || !isValidEmail(email)) {
    return { error: REQUIRED_ERROR };
  }

  const ip = await getClientIp();
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return { error: GENERIC_ERROR };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Brak zmiennej środowiskowej RESEND_API_KEY");
    return { error: GENERIC_ERROR };
  }

  const resend = new Resend(apiKey);

  // Wszystkie dane użytkownika są escapowane – brak możliwości wstrzyknięcia HTML do maila
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    subject: escapeHtml(finalSubject),
    message: escapeHtml(message),
  };

  try {
    const { error } = await resend.emails.send({
      // Na darmowym koncie Resend wysyłka z onboarding@resend.dev.
      // Po weryfikacji własnej domeny ustaw CONTACT_FROM_EMAIL (np. "Strona Maxime <formularz@twojadomena.pl>").
      from:
        process.env.CONTACT_FROM_EMAIL ||
        "Strona Maxime <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || "f.w9@interia.pl"],
      subject: `[Maxime Web] Nowa wiadomość: ${finalSubject}`,
      replyTo: email,
      text: `Od: ${name} (${email})\nTemat: ${finalSubject}\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; color: #111;">
          <h2>Nowa wiadomość ze strony internetowej Maxime</h2>
          <p><strong>Od:</strong> ${safe.name} (${safe.email})</p>
          <p><strong>Temat:</strong> ${safe.subject}</p>
          <hr />
          <p style="white-space: pre-wrap; font-size: 16px;">${safe.message}</p>
        </div>
      `,
    });

    if (error) {
      // Szczegóły błędu tylko w logach – użytkownik nie widzi wewnętrznych komunikatów API
      console.error("Błąd Resend:", error);
      return { error: GENERIC_ERROR };
    }

    return { success: true };
  } catch (err) {
    console.error("Błąd serwera (formularz kontaktowy):", err);
    return { error: GENERIC_ERROR };
  }
}
