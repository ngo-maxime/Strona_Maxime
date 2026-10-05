"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { sendEmail } from "@/actions/sendEmail"; // <-- Import Akcji Serwerowej
import FadeIn from "@/components/ui/FadeIn";
import Honeypot from "@/components/ui/Honeypot";

const subjects = [
  "Współpraca",
  "Bilety i Wydarzenia",
  "Dla Prasy",
  "Dołączenie do zespołu",
  "Inne",
];

export default function ContactForm() {
  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ids = {
    subject: `${uid}-subject`,
    custom: `${uid}-custom`,
    name: `${uid}-name`,
    email: `${uid}-email`,
    message: `${uid}-message`,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Pobieramy dane prosto z obiektu zdarzenia
    const formData = new FormData(e.currentTarget);
    // Ręcznie dołączamy temat wybrany z naszych customowych "przycisków"
    formData.append("subjectCategory", activeSubject);

    // Wywołanie akcji serwerowej (z obsługą błędu sieci)
    let response: { success?: boolean; error?: string };
    try {
      response = await sendEmail(formData);
    } catch {
      response = { error: "Wystąpił nieoczekiwany błąd serwera." };
    }

    setIsSubmitting(false);

    if (response.error) {
      setErrorMessage(response.error);
    } else {
      setIsSubmitted(true);
      // Reset po 5 sekundach (jeśli chcesz umożliwić ponowne wysłanie)
      setTimeout(() => {
        setIsSubmitted(false);
        setErrorMessage(null);
        // Opcjonalnie reset stanów jeśli trzeba
      }, 5000);
    }
  };

  return (
    <section className="bg-oxfordBlue relative z-10 w-full overflow-hidden px-6 py-24 lg:px-12 lg:py-40">
      <div className="pointer-events-none absolute top-1/2 left-[-10%] z-0 h-150 w-150 -translate-y-1/2 opacity-2">
        <Image
          src="/Asset-1.svg"
          alt=""
          fill
          sizes="600px"
          className="object-contain brightness-0 invert"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <FadeIn>
          <div className="mb-16 text-center lg:mb-24">
            <span className="font-montserrat text-arylideYellow mb-4 block text-[0.65rem] font-bold tracking-[0.4em] uppercase">
              Bezpośrednia wiadomość
            </span>
            <h2 className="font-montserrat text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl">
              Napisz do nas.
            </h2>
          </div>
        </FadeIn>

        <div className="relative rounded-3xl border border-white/10 bg-white/3 p-8 shadow-2xl backdrop-blur-md md:p-12 lg:p-16">
          {isSubmitted ? (
            <div
              role="status"
              className="animate-fade-in-up flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="bg-arylideYellow text-oxfordBlue mb-8 flex h-24 w-24 items-center justify-center rounded-full">
                <svg
                  aria-hidden="true"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h3 className="font-youngest mb-4 text-4xl text-white md:text-5xl">
                Dziękujemy za wiadomość!
              </h3>
              <p className="font-montserrat max-w-md font-light text-white/70">
                Twoja wiadomość trafiła w odpowiednie ręce. Odpowiemy
                najszybciej, jak to możliwe (zazwyczaj w ciągu 24 godzin).
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="relative flex flex-col gap-12"
              aria-busy={isSubmitting}
            >
              <Honeypot />
              <FadeIn delay="100ms">
                <span
                  id={ids.subject}
                  className="font-montserrat mb-4 block text-xs font-bold tracking-[0.2em] text-white/50 uppercase"
                >
                  01. W jakiej sprawie piszesz?
                </span>

                <div
                  className="flex flex-wrap gap-3"
                  role="group"
                  aria-labelledby={ids.subject}
                >
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => setActiveSubject(subject)}
                      aria-pressed={activeSubject === subject}
                      className={`font-montserrat rounded-full border px-6 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                        activeSubject === subject
                          ? "border-arylideYellow bg-arylideYellow text-raisinBlack"
                          : "border-white/20 bg-transparent text-white/60 hover:border-white/50 hover:text-white"
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>

                <div
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    activeSubject === "Inne"
                      ? "mt-6 grid-rows-[1fr] opacity-100"
                      : "mt-0 grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div
                    className="overflow-hidden"
                    inert={activeSubject !== "Inne"}
                  >
                    <div className="group relative">
                      {/* DODANO: name="customSubject" */}
                      <input
                        id={ids.custom}
                        type="text"
                        name="customSubject"
                        placeholder="Temat..."
                        aria-label="Temat..."
                        maxLength={150}
                        className="font-montserrat focus:border-arylideYellow w-full border-b border-white/20 bg-transparent py-3 text-lg font-light text-white transition-colors outline-none placeholder:text-white/20 md:text-xl"
                        required={activeSubject === "Inne"}
                      />
                      <div className="bg-arylideYellow absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-focus-within:w-full" />
                    </div>
                  </div>
                </div>
              </FadeIn>

              <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8">
                <FadeIn delay="200ms" className="group relative">
                  <label
                    htmlFor={ids.name}
                    className="font-montserrat group-focus-within:text-arylideYellow mb-2 block text-xs font-bold tracking-[0.2em] text-white/50 uppercase transition-colors"
                  >
                    02. Twoje Imię i Nazwisko
                  </label>
                  <input
                    id={ids.name}
                    type="text"
                    name="name"
                    autoComplete="name"
                    maxLength={120}
                    required
                    placeholder="Jan Kowalski"
                    className="font-montserrat focus:border-arylideYellow w-full border-b border-white/20 bg-transparent py-4 text-xl font-light text-white transition-colors outline-none placeholder:text-white/20 md:text-2xl"
                  />
                  <div className="bg-arylideYellow absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-focus-within:w-full" />
                </FadeIn>

                <FadeIn delay="300ms" className="group relative">
                  <label
                    htmlFor={ids.email}
                    className="font-montserrat group-focus-within:text-arylideYellow mb-2 block text-xs font-bold tracking-[0.2em] text-white/50 uppercase transition-colors"
                  >
                    03. Twój e-mail
                  </label>
                  <input
                    id={ids.email}
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    maxLength={254}
                    required
                    placeholder="jan@domena.pl"
                    className="font-montserrat focus:border-arylideYellow w-full border-b border-white/20 bg-transparent py-4 text-xl font-light text-white transition-colors outline-none placeholder:text-white/20 md:text-2xl"
                  />
                  <div className="bg-arylideYellow absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-focus-within:w-full" />
                </FadeIn>
              </div>

              <FadeIn delay="400ms" className="group relative">
                <label
                  htmlFor={ids.message}
                  className="font-montserrat group-focus-within:text-arylideYellow mb-4 block text-xs font-bold tracking-[0.2em] text-white/50 uppercase transition-colors"
                >
                  04. Treść wiadomości
                </label>
                <textarea
                  id={ids.message}
                  name="message"
                  maxLength={5000}
                  required
                  rows={4}
                  placeholder="Opisz nam szczegóły..."
                  className="font-montserrat focus:border-arylideYellow w-full resize-none border-b border-white/20 bg-transparent py-4 text-xl leading-relaxed font-light text-white transition-colors outline-none placeholder:text-white/20 md:text-2xl"
                />
                <div className="bg-arylideYellow absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-focus-within:w-full" />
              </FadeIn>

              {/* OBSŁUGA BŁĘDU */}
              {errorMessage && (
                <FadeIn className="text-center">
                  <span role="alert" className="text-sm font-bold text-red-400">
                    {errorMessage}
                  </span>
                </FadeIn>
              )}

              <FadeIn
                delay="500ms"
                className="mt-4 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end"
              >
                <span className="font-montserrat max-w-xs text-center text-[0.6rem] font-medium tracking-widest text-white/40 uppercase sm:text-left">
                  * Zgodnie z naszą{" "}
                  <Link
                    href="/polityka-prywatnosci"
                    className="underline underline-offset-2 transition-colors hover:text-white"
                  >
                    polityką prywatności
                  </Link>
                  , Twoje dane są bezpieczne i służą wyłącznie do kontaktu.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group bg-arylideYellow font-montserrat text-oxfordBlue relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-full px-10 py-5 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_0_40px_-10px_rgba(239,203,111,0.5)] disabled:opacity-70 disabled:hover:scale-100 sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
                    {!isSubmitting && (
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 5l7 7m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="absolute inset-0 z-0 h-full w-full -translate-x-full rounded-full bg-white/40 transition-transform duration-700 ease-out group-hover:translate-x-0" />
                </button>
              </FadeIn>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
