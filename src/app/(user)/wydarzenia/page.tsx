import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import EventsList, { type EventProps } from "@/components/events/EventsList";
import JsonLd from "@/components/seo/JsonLd";
import FadeIn from "@/components/ui/FadeIn";
import { getWarsawParts, MONTHS_NOMINATIVE } from "@/lib/date";
import { pageJsonLd, pageMetadata } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";

export const metadata = pageMetadata({
  title: "Koncerty i wydarzenia",
  description:
    "Sprawdź harmonogram naszych nadchodzących oraz minionych koncertów. Dołącz do nas na żywo i stań się częścią widowiska.",
  path: "/wydarzenia",
});

// Pobieramy wszystkie wydarzenia
const EVENTS_QUERY = defineQuery(`
  *[_type == "event"] | order(date desc) {
    "id": slug.current,
    title,
    date,
    location,
    "image": image.asset->url
  }
`);

interface RawEvent {
  id: string;
  title?: string;
  date?: string;
  location?: string;
  image?: string;
}

function formatEventData(rawEvent: RawEvent): EventProps {
  const d = rawEvent.date ? new Date(rawEvent.date) : new Date();
  const now = new Date();
  // Dzień/miesiąc/godzina w strefie Europe/Warsaw (serwer działa w UTC)
  const w = getWarsawParts(d);

  return {
    id: rawEvent.id,
    title: rawEvent.title || "Bez tytułu",
    location: rawEvent.location || "Miejsce do ustalenia",
    image: rawEvent.image || "/video-poster.webp",
    day: String(w.day).padStart(2, "0"),
    month: MONTHS_NOMINATIVE[w.monthIndex],
    year: String(w.year),
    time: `${w.hours}:${w.minutes}`,
    date: rawEvent.date ?? d.toISOString(), // Pełna data do sortowania po stronie klienta
    isPast: d < now,
  };
}

export default async function EventsPage() {
  const { data } = await sanityFetch({
    query: EVENTS_QUERY,
  });

  const formattedEvents = (data ?? []).map(formatEventData);

  return (
    <div className="bg-raisinBlack selection:bg-arylideYellow selection:text-raisinBlack relative min-h-screen w-full">
      <JsonLd
        data={pageJsonLd({
          type: "CollectionPage",
          name: "Koncerty i wydarzenia",
          description:
            "Sprawdź harmonogram naszych nadchodzących oraz minionych koncertów. Dołącz do nas na żywo i stań się częścią widowiska.",
          path: "/wydarzenia",
          crumb: "Wydarzenia",
          items: formattedEvents.map((e: { title: string; id: string }) => ({
            name: e.title,
            path: `/wydarzenia/${e.id}`,
          })),
        })}
      />
      {/* --- HERO SECTION --- */}
      <section className="relative z-10 flex min-h-[60vh] w-full flex-col justify-center overflow-hidden px-6 pt-32 lg:px-12 lg:pt-40">
        <div className="pointer-events-none absolute top-20 -right-20 z-0 h-160 w-160 opacity-5 lg:top-0 lg:h-240 lg:w-240">
          <Image
            src="/Asset-1.svg"
            alt=""
            fill
            sizes="960px"
            className="object-contain brightness-0 invert"
          />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <FadeIn delay="100ms">
            <span className="font-montserrat text-arylideYellow mb-6 block text-[0.65rem] font-bold tracking-[0.4em] uppercase">
              Kalendarium
            </span>
          </FadeIn>
          <FadeIn delay="300ms">
            <h1 className="font-montserrat text-5xl leading-[1.05] font-bold tracking-tight text-white md:text-7xl lg:text-[7rem]">
              Scena jest <br />
              <span className="font-youngest text-arylideYellow relative top-4 mb-4 inline-block -rotate-2 text-6xl font-normal md:mb-0 md:text-8xl lg:top-8 lg:text-[10rem]">
                nasza
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay="500ms" className="mt-7 max-w-xl lg:mt-19">
            <p className="font-montserrat mb-5 text-lg leading-relaxed font-light tracking-wide text-white/70">
              Sprawdź harmonogram naszych nadchodzących oraz minionych
              koncertów. Dołącz do nas na żywo i stań się częścią widowiska, o
              którym mówi się jeszcze długo po opadnięciu kurtyny.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* --- LISTA WYDARZEŃ --- */}
      <section className="relative z-20 w-full rounded-t-[3rem] bg-[#F4F4F5] py-24 lg:rounded-t-[5rem] lg:py-40">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
          <EventsList eventsData={formattedEvents} />
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="bg-raisinBlack relative z-10 w-full py-32 text-center lg:py-40">
        <FadeIn>
          <span className="font-youngest text-arylideYellow text-4xl md:text-5xl">
            Dla organizatorów
          </span>
        </FadeIn>
        <FadeIn delay="200ms" className="mt-6">
          <h2 className="font-montserrat text-3xl leading-tight font-bold text-white md:text-5xl lg:text-6xl">
            Chcesz zaprosić nas <br /> na swoje wydarzenie?
          </h2>
        </FadeIn>
        <FadeIn delay="400ms" className="mt-12">
          <Link
            href="/kontakt"
            className="group font-montserrat hover:border-arylideYellow hover:text-arylideYellow inline-flex items-center justify-center gap-4 rounded-full border border-white/20 bg-transparent px-12 py-5 text-[0.7rem] font-bold tracking-[0.2em] text-white uppercase transition-all duration-500"
          >
            Skontaktuj się z nami
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
