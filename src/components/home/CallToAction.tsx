// BRAK "use client"! To jest teraz w 100% Server Component.
import Link from "next/link";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import FadeIn from "@/components/ui/FadeIn";

export default function CallToAction() {
  return (
    <section className="bg-arylideYellow relative z-40 w-full overflow-hidden py-32 lg:py-48">
      {/* ============================================================== */}
      {/* TŁO: GIGANTYCZNE, KONTUROWE NUTY MUZYCZNE */}
      {/* ============================================================== */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <svg
          className="text-raisinBlack absolute -top-10 -left-20 h-160 w-160 -rotate-12 opacity-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>

        <svg
          className="text-raisinBlack absolute top-1/4 -right-32 h-200 w-200 rotate-45 opacity-[0.07]"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 18V5l7-2v13m-7 2a3 3 0 11-6 0 3 3 0 016 0zm7-2a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-24 lg:grid-cols-12 lg:gap-16">
          {/* ============================================================== */}
          {/* LEWA STRONA: GŁÓWNE HASŁO I NEWSLETTER */}
          {/* ============================================================== */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <FadeIn>
              <div className="mb-8 flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="bg-raisinBlack h-2 w-2 animate-pulse rounded-full"
                />
                <span className="font-montserrat text-raisinBlack text-[0.65rem] font-bold tracking-[0.4em] uppercase">
                  Finałowy Akord
                </span>
              </div>

              <h2 className="font-montserrat text-raisinBlack mb-6 text-5xl leading-[1.05] font-black tracking-tighter lg:text-[5.5rem] xl:text-[6.5rem]">
                Nie przegap <br />
                ani jednego <br />
                <span className="font-youngest text-oxfordBlue relative top-2 inline-block text-6xl font-normal lg:top-4 lg:text-[7.5rem] xl:text-[8.5rem]">
                  dźwięku.
                </span>
              </h2>
            </FadeIn>

            <FadeIn delay="200ms">
              <p className="font-montserrat text-raisinBlack/70 mt-8 mb-16 max-w-md text-base leading-relaxed font-medium lg:text-lg">
                Dołącz do naszego zamkniętego grona. Informacje o zbliżających
                się wydarzeniach, trafią na Twoją skrzynkę.
              </p>
            </FadeIn>

            {/* HIGH-END NEWSLETTER INPUT (Został wyrenderowany w komponencie serwerowym!) */}
            <FadeIn delay="400ms">
              <NewsletterForm variant="light" className="max-w-lg" />
            </FadeIn>
          </div>

          {/* ============================================================== */}
          {/* PRAWA STRONA: GIGANTYCZNE PIGUŁY */}
          {/* ============================================================== */}
          <div className="flex w-full flex-col justify-center gap-6 md:mx-auto md:max-w-lg lg:col-span-6 lg:mx-0 lg:max-w-none lg:gap-8 lg:pl-8">
            {/* PRZYCISK 1 */}
            <FadeIn delay="400ms">
              <Link
                href="/wydarzenia"
                className="group bg-raisinBlack flex w-full items-center justify-between rounded-full p-4 pl-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] sm:pl-10 md:pl-8 lg:p-6 lg:pl-12"
              >
                <div className="flex flex-col items-start gap-1 sm:gap-2">
                  <span className="font-youngest text-arylideYellow text-3xl transition-transform duration-500 group-hover:-rotate-3 md:text-2xl lg:text-4xl">
                    Bilety
                  </span>
                  <h3 className="font-montserrat text-xl font-bold text-white transition-colors duration-500 sm:text-2xl md:text-xl lg:text-3xl">
                    Nadchodzące wydarzenia
                  </h3>
                </div>

                <div className="bg-oxfordBlue group-hover:bg-arylideYellow group-hover:text-raisinBlack flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-white transition-all duration-500 group-hover:scale-110 md:h-14 md:w-14 lg:h-24 lg:w-24">
                  <svg
                    className="h-6 w-6 transition-transform duration-500 group-hover:translate-x-1 md:h-5 md:w-5 lg:h-8 lg:w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </Link>
            </FadeIn>

            {/* PRZYCISK 2 */}
            <FadeIn delay="600ms">
              <Link
                href="/kontakt"
                className="group border-raisinBlack hover:bg-raisinBlack flex w-full items-center justify-between rounded-full border-2 bg-transparent p-4 pl-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl sm:pl-10 md:pl-8 lg:p-6 lg:pl-12"
              >
                <div className="flex flex-col items-start gap-1 sm:gap-2">
                  <span className="font-youngest text-oxfordBlue group-hover:text-arylideYellow text-3xl transition-colors duration-500 md:text-2xl lg:text-4xl">
                    Kontakt
                  </span>
                  <h3 className="font-montserrat text-raisinBlack text-xl font-bold transition-colors duration-500 group-hover:text-white sm:text-2xl md:text-xl lg:text-3xl">
                    Skontaktuj się z nami
                  </h3>
                </div>

                <div className="border-raisinBlack text-raisinBlack flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 group-hover:scale-110 group-hover:border-white group-hover:text-white md:h-14 md:w-14 lg:h-24 lg:w-24">
                  <svg
                    className="h-6 w-6 transition-transform duration-500 group-hover:translate-x-1 md:h-5 md:w-5 lg:h-8 lg:w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </Link>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
