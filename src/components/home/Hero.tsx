// BRAK "use client"! To znowu jest super-szybki Server Component

import Link from "next/link";
import BackgroundVideo from "./BackgroundVideo";
import HeroPoster from "./HeroPoster";

export default function Hero() {
  return (
    <section className="bg-raisinBlack relative flex min-h-svh w-full items-center justify-center overflow-hidden">
      {/* TŁO WIDEO I NAKŁADKI */}
      <div className="absolute inset-0 h-full w-full">
        {/* Statyczny plakat (LCP) – osobny kadr dla telefonu i komputera */}
        <HeroPoster />

        {/* Dynamiczne wideo - ładuje się po stronie klienta */}
        <BackgroundVideo />

        <div className="bg-raisinBlack/30 absolute inset-0 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(38,38,38,0.85)_100%)]" />
        <div className="from-raisinBlack absolute inset-0 bg-linear-to-t via-transparent to-transparent opacity-95" />
      </div>

      {/* GŁÓWNA TREŚĆ */}
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center px-4 pt-12 pb-28 text-center sm:py-0">
        <h1
          className="animate-fade-in-up font-youngest mb-2 py-15 text-[4.2rem] leading-[0.85] text-white sm:text-[5.5rem] sm:leading-tight md:text-[8rem] lg:mb-4 lg:text-[11.5rem]"
          style={{
            textShadow:
              "0 10px 40px rgba(0,0,0,0.8), 0 0 120px rgba(255,255,255,0.15)",
          }}
        >
          Z pasji do muzyki
        </h1>

        <div
          className="animate-fade-in-up flex w-full max-w-[20rem] flex-col items-center justify-center gap-4 opacity-0 sm:w-auto sm:max-w-none sm:flex-row sm:gap-8"
          style={{ animationDelay: "300ms" }}
        >
          <Link
            href="/wydarzenia"
            className="group bg-arylideYellow font-montserrat text-raisinBlack relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-full px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_0_30px_-10px_rgba(239,203,111,0.6)] sm:w-auto sm:px-12"
          >
            <span className="relative z-10 flex items-center gap-3">
              Zobacz wydarzenia
              <svg
                className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
            <span className="absolute inset-0 z-0 h-full w-full -translate-x-full rounded-full bg-white/30 transition-transform duration-700 ease-out group-hover:translate-x-0" />
          </Link>

          <Link
            href="/kontakt"
            className="group font-montserrat hover:text-raisinBlack flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase backdrop-blur-xl transition-all duration-700 hover:scale-[1.03] hover:bg-white sm:w-auto sm:px-12"
          >
            Skontaktuj się
          </Link>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="animate-fade-in-up absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0 md:bottom-8 md:gap-3 [@media(max-height:600px)]:hidden md:[@media(max-height:800px)]:hidden lg:[@media(max-height:900px)]:hidden"
        style={{ animationDelay: "600ms" }}
      >
        <span className="font-montserrat text-[0.55rem] font-semibold tracking-[0.4em] text-white/50 uppercase">
          Odkryj
        </span>
        <div className="relative h-10 w-px overflow-hidden bg-white/10 md:h-16">
          <div className="animate-scroll-line bg-arylideYellow absolute top-0 left-0 h-full w-full" />
        </div>
      </div>
    </section>
  );
}
