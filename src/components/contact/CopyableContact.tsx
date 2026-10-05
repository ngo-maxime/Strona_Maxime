"use client";

import { useState } from "react";

type CopyableContactProps = {
  value: string;
  isPhone?: boolean; // Pozwala dopasować klasy rozmiaru tekstu (telefon u Ciebie był trochę większy)
};

export default function CopyableContact({
  value,
  isPhone = false,
}: CopyableContactProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback dla starszych przeglądarek / kontekstu bez HTTPS
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  if (!value) return null;

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Kopiuj ${isPhone ? "numer telefonu" : "adres e-mail"}: ${value}`}
      className="hover:text-arylideYellow relative flex w-full items-center justify-between gap-4 text-left transition-colors duration-500"
    >
      <span
        className={`font-montserrat group-hover:text-arylideYellow font-light tracking-wide text-white transition-colors duration-500 ${
          isPhone
            ? "text-[6vw] whitespace-nowrap min-[450px]:text-3xl sm:text-4xl" // Style dla telefonu
            : "text-[5vw] break-all min-[450px]:text-2xl sm:text-3xl md:text-4xl" // Style dla emaila
        }`}
      >
        {value}
      </span>

      <span className="sr-only" aria-live="polite">
        {isCopied ? "Skopiowano!" : ""}
      </span>
      <div aria-hidden="true" className="h-8 shrink-0 overflow-hidden">
        <div
          className={`flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isCopied ? "-translate-y-8" : "translate-y-0"
          }`}
        >
          {/* Stan: Kopiuj */}
          <div className="group-hover:text-arylideYellow flex h-8 items-center justify-end gap-3 text-white transition-colors duration-500">
            <span className="font-montserrat hidden text-xs font-bold tracking-widest uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
              Kopiuj
            </span>
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
              />
            </svg>
          </div>
          {/* Stan: Skopiowano */}
          <div className="text-arylideYellow flex h-8 items-center justify-end gap-2">
            <span className="font-montserrat hidden text-xs font-bold tracking-widest uppercase sm:block">
              Skopiowano!
            </span>
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}
