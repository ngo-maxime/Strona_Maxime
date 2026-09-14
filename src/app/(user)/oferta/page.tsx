// src/app/(user)/oferta/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/contact/ContactForm";
import OfferStats from "@/components/offer/OfferStats";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Oferta Eventowa | Fundacja i Orkiestra Maxime",
  description:
    "Kompleksowa oprawa muzyczna wydarzeń: eventy firmowe, imprezy okolicznościowe oraz wielkie koncerty plenerowe i Dni Miast. Projekty szyte na miarę.",
  alternates: {
    canonical: "/oferta",
  },
};

const eventTypes = [
  {
    number: "01",
    tag: "Biznes & Prestiż",
    title: "Eventy Firmowe i Biznesowe",
    subtitle: "Gale, bankiety, jubileusze firm, konferencje",
    description:
      "Muzyka, która buduje wizerunek marki i nadaje wydarzeniu najwyższą rangę. Realizujemy oprawę zarówno kameralnych spotkań VIP, uroczystych bankietów podsumowujących rok, jak i wielkich jubileuszy firmowych.",
    examples: [
      "Jubileusze i gale wręczenia nagród",
      "Bankiety biznesowe i spotkania zarządów",
      "Oprawa muzyczna premier produktów i konferencji",
      "Klimatyczne tło muzyczne lub widowiskowe show na scenie",
    ],
  },
  {
    number: "02",
    tag: "Emocje & Klimat",
    title: "Wydarzenia Okazjonalne i Prywatne",
    subtitle: "Rocznice, recitale, uroczystości okolicznościowe",
    description:
      "Wyjątkowe chwile wymagają unikalnej atmosfery. Zapewniamy szlachetne brzmienie żywych instrumentów, które tworzy intymny, wzruszający nastrój podczas prywatnych uroczystości i celebracji ważnych momentów.",
    examples: [
      "Ekskluzywne przyjęcia okolicznościowe i rocznice",
      "Kameralne recitale w pałacach i rezydencjach",
      "Uroczystości zaślubin i ceremonie oficjalne",
      "Repertuar dobierany pod indywidualne życzenie",
    ],
  },
  {
    number: "03",
    tag: "Wielka Skala",
    title: "Wydarzenia Masowe, Plenery & Dni Miast",
    subtitle: "Koncerty plenerowe, festiwale, rynki miejskie, amfiteatry",
    description:
      "Potężne brzmienie pełnego składu orkiestry symfonicznej, które gromadzi i porywa wielotysięczną widownię. Realizujemy widowiska rozrywkowe, patriotyczne i filmowe, które łączą pokolenia i są wizytówką każdego miasta.",
    examples: [
      "Dni Miast i samorządowe święta kultury",
      "Festiwale plenerowe i widowiska w amfiteatrach",
      "Koncerty tematyczne (muzyka filmowa, polskie przeboje, kolędy)",
      "Współpraca z uznanymi gwiazdami polskiej estrady",
    ],
  },
];

const howWeWork = [
  {
    step: "01",
    title: "Konsultacja i pomysł",
    desc: "Mówisz nam, jaki charakter ma Twój event, ile osób bierze w nim udział oraz jaki masz budżet. My proponujemy najlepszy kierunek.",
  },
  {
    step: "02",
    title: "Skład i repertuar na miarę",
    desc: "Nie narzucamy gotowych szablonów. Dobieramy skład – od 2 muzyków po 40-osobową orkiestrę – oraz piszemy dedykowane aranżacje.",
  },
  {
    step: "03",
    title: "Koordynacja techniczna",
    desc: "Bierzemy na siebie kwestie ridersów, prób, dyrygenta i logistyki artystycznej, współpracując bezpośrednio z Twoją ekipą techniczną.",
  },
  {
    step: "04",
    title: "Koncert na najwyższym poziomie",
    desc: "Zapewniamy widowisko, które zachwyca gości, zbiera owacje na stojąco i pozostaje w pamięci na lata.",
  },
];

export default function OfertaPage() {
  return (
    <main className="bg-raisinBlack selection:bg-arylideYellow selection:text-raisinBlack relative min-h-screen w-full overflow-x-hidden">
      {/* ============================================================== */}
      {/* 1. HERO W STYLU AGENCJI EVENTOWEJ (MOCNY PRZEKAZ) */}
      {/* ============================================================== */}
      <section className="relative z-10 flex min-h-[70vh] w-full flex-col justify-center px-6 pt-36 pb-20 lg:px-12 lg:pt-44">
        {/* Znak wodny w tle */}
        <div className="pointer-events-none absolute top-10 -right-20 z-0 h-160 w-160 opacity-5 lg:-top-20 lg:-right-32 lg:h-225 lg:w-225">
          <Image
            src="/Asset-1.svg"
            alt=""
            fill
            className="object-contain brightness-0 invert"
          />
        </div>
        <div className="pointer-events-none absolute top-1/2 left-0 z-0 -translate-y-1/2 opacity-[0.02] mix-blend-overlay select-none">
          <span className="font-montserrat text-[24vw] leading-none font-black whitespace-nowrap text-white">
            EVENTY
          </span>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <FadeIn>
            <div className="mb-6 flex items-center gap-4">
              <div className="bg-arylideYellow h-px w-12" />
              <span className="font-montserrat text-arylideYellow text-[0.65rem] font-bold tracking-[0.4em] uppercase">
                Z Nami każde wydarzenie to sukces
              </span>
            </div>
          </FadeIn>

          <FadeIn delay="200ms">
            <h1 className="font-montserrat text-5xl leading-[1.05] font-black tracking-tight text-white md:text-7xl lg:text-[6.8rem]">
              Każde wydarzenie <br />
              <span className="font-youngest text-arylideYellow relative top-3 inline-block -rotate-2 text-6xl font-normal md:text-8xl lg:top-6 lg:text-[10rem]">
                szyte na miarę.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay="400ms" className="mt-10 max-w-2xl lg:mt-20">
            <p className="font-montserrat text-base leading-relaxed font-light tracking-wide text-white/70 sm:text-lg">
              Od kameralnych bankietów biznesowych, przez uroczystości
              okolicznościowe, aż po monumentalne koncerty plenerowe dla tysięcy
              mieszkańców. Zapewniamy profesjonalną oprawę muzyczną dostosowaną
              do skali Twojego wydarzenia.
            </p>
          </FadeIn>

          <FadeIn delay="600ms" className="mt-10 flex flex-wrap gap-4">
            <a
              href="#formularz-kontaktowy"
              className="group bg-arylideYellow font-montserrat text-raisinBlack flex items-center gap-3 rounded-full px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-white"
            >
              Zapytaj o termin
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
            <a
              href="#formaty-eventowe"
              className="font-montserrat hover:border-arylideYellow hover:text-arylideYellow flex items-center rounded-full border border-white/20 bg-transparent px-8 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase transition-all duration-300"
            >
              Poznaj możliwości
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. ANIMOWANE LICZNIKI (0 -> DOCELOWA WARTOŚĆ) */}
      {/* ============================================================== */}
      <OfferStats />

      {/* ============================================================== */}
      {/* 3. TRZY GŁÓWNE KATEGORIE WYDARZEŃ (W STYLU XTRAINING) */}
      {/* ============================================================== */}
      <section
        id="formaty-eventowe"
        className="relative z-20 w-full px-6 py-24 lg:px-12 lg:py-36"
      >
        <div className="mx-auto w-full max-w-7xl">
          <FadeIn>
            <div className="mb-16 flex flex-col items-start lg:mb-24">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-arylideYellow h-1 w-12" />
                <span className="font-youngest text-arylideYellow text-3xl lg:text-4xl">
                  Co możemy dla Ciebie zrealizować
                </span>
              </div>
              <h2 className="font-montserrat text-3xl font-black text-white sm:text-5xl lg:text-6xl">
                Obsługujemy wydarzenia na każdą skalę.
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {eventTypes.map((item, idx) => (
              <FadeIn key={item.number} delay={`${idx * 150}ms`}>
                <div className="group hover:border-arylideYellow/40 relative flex h-full flex-col justify-between border border-white/10 bg-white/2 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:bg-white/4 sm:p-10">
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <span className="font-montserrat text-arylideYellow border-arylideYellow/30 rounded-full border bg-white/5 px-3.5 py-1.5 text-[0.6rem] font-bold tracking-widest uppercase">
                        {item.tag}
                      </span>
                      <span className="font-montserrat text-2xl font-black text-white/20">
                        {item.number}
                      </span>
                    </div>

                    <h3 className="font-montserrat group-hover:text-arylideYellow mb-2 text-2xl font-bold text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-montserrat text-arylideYellow/80 mb-6 text-xs font-semibold tracking-wider uppercase">
                      {item.subtitle}
                    </p>

                    <p className="font-montserrat mb-8 text-sm leading-relaxed font-light text-white/70">
                      {item.description}
                    </p>

                    <div className="border-t border-white/10 pt-6">
                      <span className="font-montserrat mb-4 block text-[0.65rem] font-bold tracking-widest text-white/40 uppercase">
                        Przykładowe realizacje:
                      </span>
                      <ul className="flex flex-col gap-3">
                        {item.examples.map((ex) => (
                          <li
                            key={ex}
                            className="font-montserrat flex items-start text-xs leading-relaxed text-white/80"
                          >
                            {/* Kulka z wymuszonym stałym rozmiarem i bezpiecznym odstępem mr-3 */}
                            <span
                              aria-hidden="true"
                              className="bg-arylideYellow mt-1.5 mr-3 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                            />
                            <span className="flex-1">{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-10 pt-6">
                    <a
                      href="#formularz-kontaktowy"
                      className="font-montserrat group/link text-arylideYellow inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
                    >
                      <span>Porozmawiajmy o tym evencie</span>
                      <svg
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. FILOZOFIA: „BEZ SZTYWNYCH RAM – PEŁNA ELASTYCZNOŚĆ” */}
      {/* ============================================================== */}
      <section className="relative z-20 w-full bg-[#1e1e1e] py-24 lg:py-36">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
          <FadeIn>
            <div className="mb-20 text-center">
              <span className="font-youngest text-arylideYellow text-3xl md:text-4xl">
                Elastyczne podejście
              </span>
              <h2 className="font-montserrat mt-2 text-3xl font-black text-white sm:text-5xl">
                Nie mamy sztywnych ofert. Mamy rozwiązania.
              </h2>
              <p className="font-montserrat mx-auto mt-4 max-w-2xl text-sm leading-relaxed font-light text-white/60 sm:text-base">
                Wielkość składu muzycznego, gatunek utworów i oprawę techniczną
                dostosowujemy ściśle do założeń organizatora. Ty określasz cel –
                my zajmujemy się resztą.
              </p>
              <div className="bg-arylideYellow mx-auto mt-6 h-1 w-16" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howWeWork.map((item, i) => (
              <FadeIn key={item.step} delay={`${i * 150}ms`}>
                <div className="bg-raisinBlack/60 flex h-full flex-col justify-between border border-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-white/20">
                  <div>
                    <span className="font-montserrat text-arylideYellow mb-6 block text-4xl font-black">
                      {item.step}
                    </span>
                    <h4 className="font-montserrat mb-4 text-xl font-bold text-white">
                      {item.title}
                    </h4>
                    <p className="font-montserrat text-xs leading-relaxed font-light text-white/60 sm:text-sm">
                      {item.desc}
                    </p>
                  </div>
                  <div className="bg-arylideYellow/40 mt-8 h-0.5 w-8" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. TWÓJ ZINTEGROWANY FORMULARZ KONTAKTOWY */}
      {/* ============================================================== */}
      <div id="formularz-kontaktowy">
        <ContactForm />
      </div>
    </main>
  );
}
