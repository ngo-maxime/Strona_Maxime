"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { subscribeToNewsletter } from "@/actions/subscribe";
import Honeypot from "@/components/ui/Honeypot";

export const NEWSLETTER_SUBSCRIBED_KEY = "maxime_newsletter_subscribed";

interface NewsletterFormProps {
  variant?: "dark" | "light";
  className?: string;
}

export default function NewsletterForm({
  variant = "dark",
  className = "",
}: NewsletterFormProps) {
  const isDark = variant === "dark";
  // Unikalne id – na jednej stronie bywa kilka formularzy (stopka + popup + sekcja)
  const consentId = `rodo_${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const response = await subscribeToNewsletter(formData);

    if (response.error) {
      setStatus("error");
      setMessage(response.error);
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("success");
      try {
        // Po zapisie nie pokazujemy już popupu newslettera
        localStorage.setItem(NEWSLETTER_SUBSCRIBED_KEY, "1");
      } catch {}
      // Zmieniony komunikat - Double Opt-in
      setMessage(
        "Prawie gotowe! Sprawdź swoją skrzynkę e-mail i kliknij w link, aby potwierdzić zapis.",
      );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {status === "success" ? (
        <div
          role="status"
          className={`animate-fade-in-up flex flex-col items-center justify-center p-4 text-center transition-all ${isDark ? "text-white" : "text-raisinBlack"}`}
        >
          <div className="bg-arylideYellow text-raisinBlack mb-3 flex h-12 w-12 items-center justify-center rounded-full">
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>
          <p className="font-montserrat max-w-70 text-sm leading-relaxed font-bold">
            {message}
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="group relative flex w-full flex-col"
        >
          <Honeypot />
          {/* POLE INPUT I PRZYCISK */}
          <div className="relative flex w-full items-end">
            <div
              className={`relative w-full transition-colors duration-500 ${
                isDark
                  ? "focus-within:border-arylideYellow border-b border-white/20 pb-3 hover:border-white/50"
                  : "border-raisinBlack/20 hover:border-raisinBlack/50 focus-within:border-raisinBlack border-b-2 pb-4"
              } ${status === "error" ? "border-red-400!" : ""}`}
            >
              <input
                type="email"
                name="email"
                placeholder="Twój adres e-mail"
                aria-label="Twój adres e-mail"
                autoComplete="email"
                inputMode="email"
                maxLength={254}
                aria-invalid={status === "error" || undefined}
                required
                disabled={status === "loading"}
                className={`font-montserrat w-full bg-transparent outline-none placeholder:font-light disabled:opacity-50 ${
                  isDark
                    ? "text-sm font-medium text-white placeholder:text-white/30"
                    : "text-raisinBlack placeholder:text-raisinBlack/40 text-xl font-bold lg:text-2xl"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              aria-label="Zapisz się"
              className={`absolute right-0 flex items-center justify-center transition-all duration-500 disabled:opacity-50 disabled:hover:scale-100 ${
                isDark
                  ? "hover:text-arylideYellow bottom-2 text-white/50"
                  : "bg-raisinBlack text-arylideYellow hover:bg-oxfordBlue bottom-3 h-12 w-12 rounded-full shadow-xl hover:scale-110 hover:text-white"
              }`}
            >
              {status === "loading" ? (
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className={`${isDark ? "h-5 w-5 transition-transform duration-300 group-focus-within:translate-x-1" : "h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={isDark ? 2 : 2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={
                      isDark
                        ? "M14 5l7 7m0 0l-4 4m4-4H3"
                        : "M14 5l7 7m0 0l-7 7m7-7H3"
                    }
                  />
                </svg>
              )}
            </button>
          </div>

          {/* BŁĄD SYSTEMU */}
          {status === "error" && message && (
            <span
              role="alert"
              className="font-montserrat mt-3 text-[0.65rem] font-bold text-red-400"
            >
              {message}
            </span>
          )}

          {/* CHECKBOX ZGODNY Z RODO / UŚUDE / PT */}
          <div className="mt-6 flex items-start gap-3">
            {/* ZMIANA 1: Zmieniono div na <label> z htmlFor. Teraz kwadracik reaguje na kliknięcia */}
            <label
              htmlFor={consentId}
              className="relative mt-[0.15rem] flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center"
            >
              <input
                type="checkbox"
                required
                name="rodo_consent"
                id={consentId}
                disabled={status === "loading"}
                className="peer sr-only"
              />
              <div
                className={`h-4 w-4 rounded-sm border transition-all duration-300 ${
                  isDark
                    ? "peer-checked:border-arylideYellow peer-checked:bg-arylideYellow peer-focus-visible:ring-arylideYellow/50 border-white/30 peer-focus-visible:ring-2"
                    : "border-raisinBlack/30 peer-checked:border-raisinBlack peer-checked:bg-raisinBlack peer-focus-visible:ring-raisinBlack/50 peer-focus-visible:ring-2"
                }`}
              />
              <svg
                aria-hidden="true"
                className={`absolute h-3 w-3 opacity-0 transition-opacity duration-300 peer-checked:opacity-100 ${
                  isDark ? "text-oxfordBlue" : "text-arylideYellow"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </label>

            {/* ZMIANA 2: Treść prawna wydzielona, by kliknięcie w link nie wywoływało checkboxa */}
            <div
              className={`font-montserrat text-left text-[0.55rem] leading-[1.6] tracking-widest uppercase transition-colors sm:text-[0.6rem] ${
                isDark ? "text-white/40" : "text-raisinBlack/50"
              }`}
            >
              <label
                htmlFor={consentId}
                className={`cursor-pointer transition-colors ${
                  isDark ? "hover:text-white/60" : "hover:text-raisinBlack/70"
                }`}
              >
                Wyrażam zgodę na otrzymywanie informacji handlowych (Newsletter)
                drogą elektroniczną od Fundacji Maxime. Zapoznałem/am się z{" "}
              </label>
              <Link
                href="/polityka-prywatnosci"
                className={`font-bold transition-colors ${
                  isDark
                    ? "hover:text-arylideYellow text-white/70"
                    : "text-raisinBlack hover:text-oxfordBlue"
                }`}
              >
                Polityką Prywatności
              </Link>
              .
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
