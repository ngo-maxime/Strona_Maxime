"use client";

import Link from "next/link";
import { useEffect } from "react";

// Awaryjny ekran błędu (np. chwilowy brak połączenia z CMS) zamiast białej strony
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-raisinBlack flex min-h-[80vh] w-full flex-col items-center justify-center px-6 pt-32 pb-24 text-center">
      <h1 className="font-montserrat text-3xl font-bold text-white md:text-5xl">
        Coś poszło nie tak
      </h1>
      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="bg-arylideYellow font-montserrat text-raisinBlack rounded-full px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-transform hover:scale-[1.03]"
        >
          Spróbuj ponownie
        </button>
        <Link
          href="/"
          className="font-montserrat hover:border-arylideYellow hover:text-arylideYellow rounded-full border border-white/20 px-10 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase transition-colors"
        >
          Strona główna
        </Link>
      </div>
    </div>
  );
}
