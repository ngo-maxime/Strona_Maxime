// src/app/(user)/oferta/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/contact/ContactForm"; // <-- Twój istniejący formularz
import OfferStats from "@/components/offer/OfferStats";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Oferta Koncertowa i Współpraca",
  description:
    "Z nami każde wydarzenie to sukces. Pełna orkiestra symfoniczna, składy kameralne, widowiska plenerowe i gale biznesowe z Fundacją Maxime.",
  alternates: {
    canonical: "/oferta",
  },
};

const mainCategories = [
  {
    id: "gale-i-biznes",
    badge: "Prestiż & Elegancja",
    title: "Gale, Jubileusze & Biznes",
    description:
      "Uroczyste gale firmowe, bankiety, wręczenia nagród oraz spotkania VIP. Zapewniamy oprawę na najwyższym poziomie artystycznym, która podkreśla rangę i klasę wydarzenia.",
    features: [
      "Kwartety smyczkowe i orkiestrowe składy kameralne",
      "Muzyka filmowa, musicalowa i standardy estradowe",
      "Elastyczność scenariuszowa i dopasowany dress code",
    ],
  },
  {
    id: "koncerty-i-plenery",
    badge: "Wielka Scena",
    title: "Koncerty Symfoniczne & Dni Miast",
    description:
      "Monumentalne widowiska plenerowe dla samorządów, domów kultury i festiwali. Pełen skład Orkiestry Maxime pod batutą dyrygenta gromadzi i porywa wielotysięczną widownię.",
    features: [
      "Ponad 40 instrumentalistów na scenie",
      "Polska klasyka, hity filmowe i autorskie programy",
      "Kompleksowa koordynacja repertuarowa i techniczna",
    ],
  },
  {
    id: "uroczystosci-prywatne",
    badge: "Intymny Klimat",
    title: "Uroczystości Prywatne & Recitale",
    description:
      "Ekskluzywne przyjęcia, prywatne recitale oraz ceremonie. Szlachetne brzmienie instrumentów akustycznych na żywo buduje niepowtarzalne emocje i wspomnienia.",
    features: [
      "Duety, tria oraz kwartety smyczkowe / dęte",
      "Indywidualnie dobrana playlista i dedykacje",
      "Niepowtarzalna akustyka żywych instrumentów",
    ],
  },
  {
    id: "aranzacje-specjalne",
    badge: "Brzmienie Na Miarę",
    title: "Aranżacje & Dedykowana Produkcja",
    description:
      "Nasz zespół kompozytorów tworzy unikalne partytury na życzenie. Przekładamy współczesne przeboje muzyki rozrywkowej czy rockowej na potężne instrumentarium orkiestry.",
    features: [
      "Indywidualna orkiestracja i nuty na zamówienie",
      "Współpraca z zaproszonymi wokalistami i solistami",
      "Realizacja nagrań studyjnych i projektów cross-genre",
    ],
  },
];

export default function OfertaPage() {
  return (
    <main className="bg-raisinBlack selection:bg-arylideYellow selection:text-raisinBlack relative min-h-screen w-full overflow-x-hidden">
      {/* ============================================================== */}
      {/* 1. HERO W STYLU XTRAINING + MAXIME */}
      {/* ============================================================== */}
      <section className="relative z-10 flex min-h-[70vh] w-full flex-col justify-center px-6 pt-36 pb-20 lg:px-12 lg:pt-44">
        {/* Dekoracyjne elementy tła */}
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
            OFERTA
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
              Koncerty, które <br />
              <span className="font-youngest text-arylideYellow relative top-3 inline-block -rotate-2 text-6xl font-normal md:text-8xl lg:top-6 lg:text-[10rem]">
                tworzą wspomnienia.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay="400ms" className="mt-10 max-w-2xl lg:mt-20">
            <p className="font-montserrat text-base leading-relaxed font-light tracking-wide text-white/70 sm:text-lg">
              Witaj w Maxime – Twoim partnerze w organizacji niezrównanych
              wrażeń muzycznych. Łączymy pasję młodych wirtuozów z
              bezkompromisowym profesjonalizmem, dostarczając oprawę od
              kameralnych bankietów po monumentalne symfonie.
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
              href="#formaty"
              className="font-montserrat hover:border-arylideYellow hover:text-arylideYellow flex items-center rounded-full border border-white/20 bg-transparent px-8 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase transition-all duration-300"
            >
              Zobacz formaty
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. ANIMOWANE LICZNIKI (OD 0 DO TARGETU) */}
      {/* ============================================================== */}
      <OfferStats />

      {/* ============================================================== */}
      {/* 3. CZTERY FILARY OFERTY (KAFELKI W STYLU XTRAINING) */}
      {/* ============================================================== */}
      <section
        id="formaty"
        className="relative z-20 w-full px-6 py-24 lg:px-12 lg:py-36"
      >
        <div className="mx-auto w-full max-w-7xl">
          <FadeIn>
            <div className="mb-16 flex flex-col items-start lg:mb-24">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-arylideYellow h-1 w-12" />
                <span className="font-youngest text-arylideYellow text-3xl lg:text-4xl">
                  Zakres możliwości
                </span>
              </div>
              <h2 className="font-montserrat text-3xl font-black text-white sm:text-5xl lg:text-6xl">
                Profesjonalna oprawa z Maxime.
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {mainCategories.map((item, idx) => (
              <FadeIn key={item.id} delay={`${idx * 150}ms`}>
                <div className="group hover:border-arylideYellow/40 relative flex h-full flex-col justify-between overflow-hidden border border-white/10 bg-white/2 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:bg-white/4 sm:p-12">
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <span className="font-montserrat text-arylideYellow border-arylideYellow/30 rounded-full border bg-white/5 px-3.5 py-1.5 text-[0.6rem] font-bold tracking-widest uppercase">
                        {item.badge}
                      </span>
                      <span className="font-montserrat text-2xl font-black text-white/20">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="font-montserrat group-hover:text-arylideYellow mb-4 text-2xl font-bold text-white transition-colors sm:text-3xl">
                      {item.title}
                    </h3>

                    <p className="font-montserrat mb-8 text-sm leading-relaxed font-light text-white/70">
                      {item.description}
                    </p>

                    <ul className="mb-8 flex flex-col gap-3">
                      {item.features.map((feat) => (
                        <li
                          key={feat}
                          className="font-montserrat flex items-center gap-3 text-xs text-white/85"
                        >
                          <span className="bg-arylideYellow h-1.5 w-1.5 rounded-full" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="#formularz-kontaktowy"
                    className="font-montserrat group/link text-arylideYellow inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
                  >
                    <span>Skonsultuj ten format</span>
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
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. MODUŁ SEZONOWY: SEZON LETNI VS SEZON ZIMOWY */}
      {/* ============================================================== */}
      <section className="relative z-20 w-full bg-[#1e1e1e] py-24 lg:py-36">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
          <FadeIn>
            <div className="mb-16 text-center">
              <span className="font-youngest text-arylideYellow text-3xl md:text-4xl">
                Elastyczność przez cały rok
              </span>
              <h2 className="font-montserrat mt-2 text-3xl font-black text-white sm:text-5xl">
                Maxime na każdą porę roku.
              </h2>
              <p className="font-montserrat mx-auto mt-4 max-w-2xl text-sm leading-relaxed font-light text-white/60 sm:text-base">
                Dostosowujemy instrumentarium, nagłośnienie i repertuar do
                warunków scenicznych oraz klimatu panującego za oknem.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* SEZON LETNI */}
            <FadeIn delay="200ms">
              <div className="bg-raisinBlack/80 relative flex h-full flex-col justify-between border border-white/10 p-8 transition-all duration-500 hover:border-white/30 sm:p-12">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="bg-arylideYellow h-2.5 w-2.5 rounded-full" />
                    <span className="font-montserrat text-arylideYellow text-xs font-bold tracking-widest uppercase">
                      Wiosna & Lato
                    </span>
                  </div>
                  <h3 className="font-montserrat mb-4 text-2xl font-bold text-white sm:text-3xl">
                    Sezon Plenerowy & Festiwalowy
                  </h3>
                  <p className="font-montserrat text-sm leading-relaxed font-light text-white/70">
                    Ciepłe miesiące to czas na wielkie koncerty pod gwiazdami:
                    amfiteatry, parki miejskie, rynki i sceny plenerowe.
                    Żywiołowa muzyka filmowa, polskie przeboje symfonicznie i
                    energia, która porywa publiczność w każdym wieku.
                  </p>
                </div>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <span className="font-montserrat text-xs font-semibold text-white/50">
                    Rekomendowane: Dni Miast, Festiwale Plenerowe, Pikniki
                    Kultury
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* SEZON ZIMOWY */}
            <FadeIn delay="400ms">
              <div className="bg-oxfordBlue/30 relative flex h-full flex-col justify-between border border-white/10 p-8 transition-all duration-500 hover:border-white/30 sm:p-12">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    <span className="font-montserrat text-xs font-bold tracking-widest text-white uppercase">
                      Jesień & Zima
                    </span>
                  </div>
                  <h3 className="font-montserrat mb-4 text-2xl font-bold text-white sm:text-3xl">
                    Sezon Galowy & Koncerty Kolędowe
                  </h3>
                  <p className="font-montserrat text-sm leading-relaxed font-light text-white/70">
                    Elegancka atmosfera sal koncertowych, teatrów i przestrzeni
                    pałacowych. Tradycyjne i nowoczesne aranżacje kolęd,
                    uroczyste gale noworoczne, karnawałowe oraz podsumowania
                    roku dla samorządów i biznesu.
                  </p>
                </div>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <span className="font-montserrat text-xs font-semibold text-white/50">
                    Rekomendowane: Koncerty Świąteczne, Noworoczne, Jubileusze
                    Firmowe
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. TWÓJ ISTNIEJĄCY FORMULARZ KONTAKTOWY (Z KOTWICĄ) */}
      {/* ============================================================== */}
      <div id="formularz-kontaktowy">
        <ContactForm />
      </div>
    </main>
  );
}
