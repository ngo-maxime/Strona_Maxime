import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nie znaleziono strony",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="bg-raisinBlack relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-24 text-center">
      <span
        aria-hidden="true"
        data-deco="404"
        className="font-montserrat pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] leading-none font-black text-white/[0.03] select-none before:content-[attr(data-deco)]"
      />
      <p className="font-youngest text-arylideYellow relative text-5xl md:text-6xl">
        Cisza…
      </p>
      <h1 className="font-montserrat relative mt-6 text-3xl font-bold text-white md:text-5xl">
        Nie znaleziono strony
      </h1>
      <div className="relative mt-12 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="bg-arylideYellow font-montserrat text-raisinBlack rounded-full px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-transform hover:scale-[1.03]"
        >
          Strona główna
        </Link>
        <Link
          href="/wydarzenia"
          className="font-montserrat hover:border-arylideYellow hover:text-arylideYellow rounded-full border border-white/20 px-10 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase transition-colors"
        >
          Zobacz wydarzenia
        </Link>
      </div>
    </div>
  );
}
