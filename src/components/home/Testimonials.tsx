// src/components/home/Testimonials.tsx

import Link from "next/link";
import { defineQuery } from "next-sanity";
import FadeIn from "@/components/ui/FadeIn";
import { sanityFetch } from "@/sanity/lib/live";

const REVIEWS_QUERY = defineQuery(`
  *[_type == "review" && approved == true && featured == true][0...3] | order(_createdAt desc) {
    _id,
    name,
    role,
    text
  }
`);

export default async function Testimonials() {
  const { data: fetchedReviews } = await sanityFetch({ query: REVIEWS_QUERY });

  // Łączymy to co przyszło z bazy z defaultowymi, bierzemy równe 3
  const displayReviews = [...fetchedReviews].slice(0, 3);

  // Konfiguracja stylów asymetrycznego widoku dla dokładnie 3 kart
  const cardConfigs = [
    {
      wrapperClass: "relative z-10 lg:col-span-6 lg:col-start-1",
      cardClass:
        "group bg-raisinBlack relative overflow-hidden p-10 shadow-2xl transition-all duration-700 hover:-translate-y-4 lg:p-14",
      quoteColor: "text-arylideYellow",
      textColor: "text-white",
      lineColor: "bg-arylideYellow",
      nameColor: "text-white",
      roleColor: "text-white/50",
      delay: "400ms",
    },
    {
      wrapperClass:
        "relative z-20 lg:col-span-7 lg:col-start-6 lg:-mt-24 lg:-ml-12",
      cardClass:
        "group relative overflow-hidden border border-white/60 bg-white/40 p-10 shadow-[0_30px_60px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-700 hover:-translate-y-4 hover:bg-white/50 lg:p-14",
      quoteColor: "text-oxfordBlue",
      textColor: "text-raisinBlack",
      lineColor: "bg-oxfordBlue",
      nameColor: "text-raisinBlack",
      roleColor: "text-raisinBlack/60",
      delay: "600ms",
    },
    {
      wrapperClass: "relative z-30 lg:col-span-6 lg:col-start-3 lg:-mt-16",
      cardClass:
        "group bg-oxfordBlue relative overflow-hidden p-10 shadow-2xl transition-all duration-700 hover:-translate-y-4 lg:p-14",
      quoteColor: "text-white",
      textColor: "text-white",
      lineColor: "bg-philippineSilver",
      nameColor: "text-white",
      roleColor: "text-white/50",
      delay: "800ms",
    },
  ];

  return (
    <section className="bg-philippineSilver relative z-10 w-full overflow-hidden py-32 lg:py-48">
      {/* --- GŁĘBIA W TLE --- */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 w-full -translate-x-1/2 -translate-y-1/2 text-center select-none">
        <span className="font-youngest text-[30vw] leading-none whitespace-nowrap text-white/30">
          Recenzje
        </span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
        {/* --- NAGŁÓWEK SEKCJI --- */}
        <div className="mb-20 flex flex-col items-start lg:mb-32">
          <FadeIn>
            <div className="mb-6 flex items-center gap-4">
              <div className="bg-raisinBlack h-px w-16" />
              <span className="font-montserrat text-raisinBlack text-[0.65rem] font-bold tracking-[0.4em] uppercase">
                Głosy publiczności
              </span>
            </div>
          </FadeIn>

          <FadeIn delay="200ms">
            <h2 className="font-montserrat text-raisinBlack text-5xl leading-[1.1] font-bold lg:text-[5.5rem]">
              Oklaski, które <br />
              <span className="font-youngest relative top-4 inline-block -rotate-2 text-6xl font-normal text-white drop-shadow-sm lg:text-[7.5rem]">
                nie milkną
              </span>
            </h2>
          </FadeIn>
        </div>

        {/* --- ASYMETRYCZNY KOLAŻ KART --- */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-0">
          {displayReviews.map((review, index) => {
            const config = cardConfigs[index];
            return (
              <FadeIn
                key={review._id}
                delay={config.delay}
                className={config.wrapperClass}
              >
                <div className={config.cardClass}>
                  <div className="absolute -top-8 -right-4 opacity-10 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 group-hover:opacity-20">
                    <span
                      className={`font-youngest text-[12rem] ${config.quoteColor}`}
                    >
                      "
                    </span>
                  </div>
                  <p
                    className={`font-montserrat relative z-10 mb-10 text-lg leading-relaxed font-light ${config.textColor} lg:text-xl`}
                  >
                    {review.text}
                  </p>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className={`${config.lineColor} h-px w-8`} />
                    <div>
                      <h4
                        className={`font-montserrat text-sm font-bold ${config.nameColor}`}
                      >
                        {review.name}
                      </h4>
                      <span
                        className={`font-montserrat text-[0.65rem] tracking-widest uppercase ${config.roleColor}`}
                      >
                        {review.role}
                      </span>
                    </div>
                  </div>
                  {/* Dekoracyjna wjeżdżająca linia w ostatniej karcie - można ją zachować uwarunkowaną */}
                  {index === 2 && (
                    <div className="bg-arylideYellow absolute bottom-0 left-0 h-1 w-0 transition-all duration-700 group-hover:w-full" />
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* PRZYCISK PROWADZĄCY DO FORMULARZA OPINII */}
        <div className="mt-24 flex justify-center lg:mt-32">
          <FadeIn delay="400ms">
            <Link
              href="/opinie"
              className="group border-raisinBlack font-montserrat text-raisinBlack hover:bg-raisinBlack relative inline-flex items-center justify-center gap-4 rounded-full border bg-transparent px-10 py-5 text-[0.65rem] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:text-white"
            >
              Dodaj swoją opinię lub przeczytaj więcej
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
