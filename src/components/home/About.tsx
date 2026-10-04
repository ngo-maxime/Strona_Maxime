// src/components/home/About.tsx
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";

export default function About() {
  return (
    <section className="bg-raisinBlack relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden py-24 xl:py-32">
      {/* 1. ULTRA DELIKATNE TŁO */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 w-full -translate-x-1/2 -translate-y-1/2 text-center select-none">
        <FadeIn delay="0ms">
          <span className="font-youngest text-[20vw] whitespace-nowrap text-white/2">
            Maxime
          </span>
        </FadeIn>
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.03]">
        <FadeIn delay="100ms" className="absolute -top-10 -left-20 h-160 w-160">
          <Image
            src="/Asset-1.svg"
            alt=""
            fill
            className="object-contain brightness-0 invert"
          />
        </FadeIn>
      </div>

      {/* 2. GŁÓWNY KONTENER */}
      <div className="relative z-10 w-full max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 md:gap-20 xl:grid-cols-12 xl:gap-20">
          {/* LEWA STRONA: Zdjęcie + Statystyki */}
          <div className="relative w-full md:mx-auto md:max-w-137.5 xl:col-span-5 xl:mx-0 xl:max-w-none">
            <FadeIn delay="200ms">
              {/* ZMIANA: Dodano border-white/10 oraz shadow-2xl do głównego kontenera */}
              <div className="group bg-raisinBlack relative aspect-3/4 w-full overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 h-full w-full">
                  <Image
                    src="/video-poster.webp"
                    alt="Muzycy Stowarzyszenia Maxime"
                    fill
                    className="object-cover transition-transform duration-1500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                </div>

                {/* NOWOŚĆ: Delikatne, kinowe obramowanie wewnętrzne (passe-partout) */}
                {/* Animuje się w przeciwnym kierunku do zdjęcia, dając niesamowitą głębię */}
                <div className="group-hover:border-arylideYellow/60 pointer-events-none absolute inset-5 z-10 border border-white/20 opacity-60 transition-all duration-1500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[0.96] group-hover:opacity-100 sm:inset-6" />

                <div className="bg-raisinBlack/20 absolute inset-0 transition-colors duration-700 group-hover:bg-transparent" />
              </div>
            </FadeIn>

            <FadeIn
              delay="400ms"
              className="bg-raisinBlack absolute -right-4 -bottom-6 z-20 flex border border-white/5 p-6 shadow-xl sm:-right-8 lg:-right-10 lg:-bottom-8 lg:p-8 xl:-right-12 xl:-bottom-8"
            >
              <div className="flex flex-col items-start border-r border-white/5 pr-6 lg:pr-8 xl:pr-10">
                <span className="font-montserrat text-3xl font-light tracking-tight text-white lg:text-4xl">
                  4
                  <span className="text-arylideYellow relative -top-2 ml-0.5 text-2xl font-light lg:text-3xl">
                    +
                  </span>
                </span>
                <span className="font-montserrat mt-2 text-[0.55rem] font-medium tracking-[0.3em] text-white/40 uppercase">
                  Lat na scenie
                </span>
              </div>
              <div className="flex flex-col items-start pl-6 lg:pl-8 xl:pl-10">
                <span className="font-montserrat text-3xl font-light tracking-tight text-white lg:text-4xl">
                  50
                  <span className="text-arylideYellow relative -top-2 ml-0.5 text-2xl font-light lg:text-3xl">
                    +
                  </span>
                </span>
                <span className="font-montserrat mt-2 text-[0.55rem] font-medium tracking-[0.3em] text-white/40 uppercase">
                  Wydarzeń
                </span>
              </div>
            </FadeIn>
          </div>

          {/* PRAWA STRONA: Treść */}
          <div className="flex flex-col pt-12 md:mx-auto md:max-w-137.5 xl:col-span-6 xl:col-start-7 xl:mx-0 xl:max-w-none xl:pt-0">
            <FadeIn delay="300ms">
              <div className="mb-10 flex items-center gap-6">
                <div className="relative h-px w-12 overflow-hidden bg-white/5">
                  <div className="bg-arylideYellow absolute inset-0 w-full origin-left transition-transform duration-1000" />
                </div>
                <span className="font-youngest text-arylideYellow text-3xl lg:text-4xl">
                  Z pasji do muzyki
                </span>
              </div>
            </FadeIn>

            <FadeIn delay="500ms">
              <h2 className="font-montserrat mb-12 text-[2.75rem] leading-[1.1] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Sztuka, która{" "}
                <span className="text-philippineSilver font-light italic">
                  łączy
                </span>
                <br />
                <span className="font-youngest text-arylideYellow relative -top-2 block text-[5rem] leading-none font-normal lg:text-[6.5rem] xl:text-[7rem]">
                  pokolenia
                </span>
              </h2>
            </FadeIn>

            <FadeIn delay="700ms">
              <p className="font-montserrat mb-14 max-w-xl text-base leading-[1.8] font-light tracking-wide text-white/60">
                Maxime to przestrzeń, w której radość z wykonywania muzyki łączy
                się z zaangażowaniem i jakością
              </p>
            </FadeIn>

            <FadeIn delay="900ms">
              <div className="flex">
                <Link
                  href="/o-nas"
                  className="group font-montserrat hover:border-arylideYellow hover:text-arylideYellow relative inline-flex items-center justify-center gap-4 rounded-full border border-white/10 bg-transparent px-10 py-4 text-[0.78rem] font-bold tracking-[0.2em] text-white uppercase transition-all duration-500 sm:text-[1rem]"
                >
                  <span>Poznaj naszą historię</span>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
