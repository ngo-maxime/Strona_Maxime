import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { defineQuery } from "next-sanity";
import JsonLd from "@/components/seo/JsonLd";
import Image from "@/components/ui/CmsImage";
import FadeIn from "@/components/ui/FadeIn";
import PortableLink from "@/components/ui/PortableLink";
import { getWarsawParts, MONTHS_GENITIVE, MONTHS_NOMINATIVE } from "@/lib/date";
import {
  breadcrumbJsonLd,
  ORGANIZATION,
  ORGANIZATION_ID,
  pageMetadata,
  SITE_NAME,
  SITE_URL,
  sanityOgImage,
  truncate,
} from "@/lib/site";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";

const EVENT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "event" && slug.current == $slug][0] {
    "id": slug.current,
    title,
    subtitle,
    date,
    location,
    address,
    "image": image.asset->url,
    ticketType,
    ticketPrice,
    hasTicketLink,
    ticketLink,
    hasTicketsAvailable,
    description,
    program,
    guestArtists
  }
`);

const EVENT_META_QUERY = defineQuery(`
  *[_type == "event" && slug.current == $slug][0] {
    title,
    subtitle,
    location,
    "image": image.asset->url,
    date,
    "plain": pt::text(description)
  }
`);

const EVENT_SLUGS_QUERY = defineQuery(
  `*[_type == "event" && defined(slug.current)].slug.current`,
);

const portableTextComponents: PortableTextComponents = {
  marks: { link: PortableLink },
};

type Props = { params: Promise<{ slug: string }> };

// Prerender znanych wydarzeń przy buildzie (szybszy TTFB); nowe renderują się na żądanie
export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(EVENT_SLUGS_QUERY);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: EVENT_META_QUERY,
    params: { slug },
  });
  if (!data) return {};

  // Opis zawsze zawiera datę i miejsce (ważne dla wyszukiwań typu „koncert + miasto”)
  const w = data.date ? getWarsawParts(data.date) : null;
  const when = w
    ? `${w.day} ${MONTHS_GENITIVE[w.monthIndex].toLowerCase()} ${w.year}`
    : "";
  const lead = [data.title, when, data.location].filter(Boolean).join(" – ");

  return pageMetadata({
    title: data.title,
    description: truncate(
      [lead, data.subtitle, data.plain].filter(Boolean).join(". "),
    ),
    path: `/wydarzenia/${slug}`,
    image: sanityOgImage(data.image),
  });
}

export default async function EventDetailPage({ params }: Props) {
  const resolvedParams = await params;

  const { data: eventRaw } = await sanityFetch({
    query: EVENT_BY_SLUG_QUERY,
    params: { slug: resolvedParams.slug },
  });

  if (!eventRaw) {
    notFound();
  }

  const d = eventRaw.date ? new Date(eventRaw.date) : new Date();
  const isPastEvent = d < new Date(); // Sprawdzamy czy koncert już minął

  // Data i godzina w strefie Europe/Warsaw (serwer działa w UTC)
  const w = getWarsawParts(d);
  const day = String(w.day).padStart(2, "0");
  const month = MONTHS_NOMINATIVE[w.monthIndex];
  const year = String(w.year);
  const time = `${w.hours}:${w.minutes}`;

  // Dane strukturalne wydarzenia – szansa na wyświetlenie w Google jako „Wydarzenie”
  const eventUrl = `${SITE_URL}/wydarzenia/${resolvedParams.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: eventRaw.title,
    startDate: eventRaw.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: eventUrl,
    ...(eventRaw.image && { image: [eventRaw.image] }),
    description: eventRaw.subtitle || eventRaw.title,
    location: {
      "@type": "Place",
      name: eventRaw.location || SITE_NAME,
      address: eventRaw.address || {
        "@type": "PostalAddress",
        addressLocality: ORGANIZATION.address.city,
        addressCountry: ORGANIZATION.address.country,
      },
    },
    organizer: { "@id": ORGANIZATION_ID },
    performer: [
      { "@type": "MusicGroup", name: SITE_NAME, url: SITE_URL },
      ...(eventRaw.guestArtists ?? [])
        .filter((a: { name?: string }) => a?.name)
        .map((a: { name: string }) => ({ "@type": "Person", name: a.name })),
    ],
    ...(eventRaw.hasTicketLink &&
      eventRaw.ticketLink && {
        offers: {
          "@type": "Offer",
          url: eventRaw.ticketLink,
          availability: eventRaw.hasTicketsAvailable
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
          ...(eventRaw.ticketType === "darmowe" && {
            price: 0,
            priceCurrency: "PLN",
          }),
          // „od 50 PLN” / „120 zł” → 50 / 120
          ...(eventRaw.ticketType === "platne" &&
            /\d/.test(eventRaw.ticketPrice ?? "") && {
              price: Number(
                String(eventRaw.ticketPrice)
                  .match(/\d+(?:[.,]\d+)?/)?.[0]
                  .replace(",", "."),
              ),
              priceCurrency: "PLN",
            }),
        },
      }),
    ...(eventRaw.ticketType === "darmowe" && { isAccessibleForFree: true }),
  };

  const hasLink = eventRaw.hasTicketLink && eventRaw.ticketLink;

  // --- LOGIKA PRZYCISKÓW BILETOWYCH ---
  const renderTicketButton = () => {
    // 0. Wydarzenie się odbyło
    if (isPastEvent) {
      return (
        <div className="font-montserrat flex w-full cursor-default items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-4 text-center text-[0.65rem] leading-snug font-bold tracking-widest text-white/30 uppercase sm:px-8 sm:text-xs sm:tracking-[0.2em]">
          Wydarzenie archiwalne
        </div>
      );
    }

    // 1. Brak miejsc (Wyprzedane)
    if (!eventRaw.hasTicketsAvailable) {
      return (
        <div className="font-montserrat flex w-full cursor-not-allowed items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-4 text-center text-[0.65rem] leading-snug font-bold tracking-widest text-white/30 uppercase sm:px-8 sm:text-xs sm:tracking-[0.2em]">
          Brak miejsc (Wyprzedane)
        </div>
      );
    }

    // 2. DARMO WEJŚCIÓWKI
    if (eventRaw.ticketType === "darmowe") {
      if (!hasLink) {
        return (
          <div className="font-montserrat flex w-full cursor-default items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-4 text-center text-[0.65rem] leading-snug font-bold tracking-widest text-white uppercase sm:px-8 sm:text-xs sm:tracking-[0.2em]">
            Zapraszamy
          </div>
        );
      } else {
        return (
          <a
            href={eventRaw.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-arylideYellow font-montserrat text-raisinBlack relative flex w-full items-center justify-center overflow-hidden rounded-full px-4 py-4 text-center text-[0.65rem] leading-snug font-bold tracking-widest uppercase transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_0_30px_-10px_rgba(239,203,111,0.6)] sm:px-8 sm:py-5 sm:text-xs sm:tracking-[0.2em]"
          >
            <span className="relative z-10">Wybierz sobie miejsce</span>
            <div className="absolute inset-0 z-0 h-full w-full -translate-x-full rounded-full bg-white/30 transition-transform duration-700 ease-out group-hover:translate-x-0" />
          </a>
        );
      }
    }

    // 3. PŁATNE WYDARZENIA
    else {
      if (!hasLink) {
        return (
          <div className="font-montserrat flex w-full cursor-not-allowed items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-4 text-center text-[0.65rem] leading-snug font-bold tracking-widest text-white/30 uppercase sm:px-8 sm:text-xs sm:tracking-[0.2em]">
            Bilety wkrótce
          </div>
        );
      } else {
        return (
          <a
            href={eventRaw.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-oxfordBlue font-montserrat relative flex w-full items-center justify-center overflow-hidden rounded-full px-4 py-4 text-center text-[0.65rem] leading-snug font-bold tracking-widest text-white uppercase transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_0_30px_-10px_rgba(0,28,72,0.6)] sm:px-8 sm:py-5 sm:text-xs sm:tracking-[0.2em]"
          >
            <span className="group-hover:text-arylideYellow relative z-10 transition-colors">
              Kup bilet
            </span>
            <div className="bg-raisinBlack absolute inset-0 z-0 h-full w-full -translate-x-full rounded-full transition-transform duration-700 ease-out group-hover:translate-x-0" />
          </a>
        );
      }
    }
  };

  // --- OPIS POD PRZYCISKIEM ---
  const getTicketSubtext = () => {
    if (isPastEvent) return "To wydarzenie już się odbyło";

    if (!eventRaw.hasTicketsAvailable)
      return "Dziękujemy za ogromne zainteresowanie";

    if (eventRaw.ticketType === "darmowe") {
      if (!hasLink) return "* Wstęp wolny, nie wymaga rezerwacji";
      return "* Liczba darmowych wejściówek jest ograniczona";
    } else {
      if (!hasLink)
        return "Śledź nasze kanały, by nie przegapić startu sprzedaży";
      return "* Bezpieczna płatność u operatora online";
    }
  };

  return (
    <div className="bg-raisinBlack selection:bg-arylideYellow selection:text-raisinBlack relative min-h-screen w-full">
      <JsonLd data={jsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Wydarzenia", path: "/wydarzenia" },
          { name: eventRaw.title, path: `/wydarzenia/${resolvedParams.slug}` },
        ])}
      />
      <section className="relative flex min-h-[85vh] w-full flex-col justify-end overflow-hidden pt-32 pb-12 lg:pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src={eventRaw.image || "/video-poster.webp"}
            alt={eventRaw.title}
            fill
            preload
            fetchPriority="high"
            sizes="100vw"
            className="object-cover opacity-60 transition-transform duration-2000 ease-out hover:scale-105"
          />
          <div className="from-raisinBlack via-raisinBlack/60 absolute inset-0 bg-linear-to-t to-transparent" />
          <div className="from-raisinBlack absolute inset-0 bg-linear-to-r via-transparent to-transparent opacity-80" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 -left-10 z-0 opacity-20 mix-blend-overlay select-none"
        >
          <span
            aria-hidden="true"
            data-deco={day}
            className="font-montserrat text-[30vw] leading-none font-black text-white lg:text-[25vw] before:content-[attr(data-deco)]"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
          <FadeIn>
            <Link
              href="/wydarzenia"
              className="group font-montserrat hover:text-arylideYellow mb-12 inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-white/50 uppercase transition-colors lg:mb-20"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Wróć do kalendarium
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <FadeIn delay="300ms">
                <h1 className="font-montserrat text-5xl leading-[1.05] font-black tracking-tight text-white md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem]">
                  {eventRaw.title}
                </h1>
                {eventRaw.subtitle && (
                  <span className="font-youngest mt-4 block text-4xl text-white/80 md:text-5xl lg:mt-6 lg:text-6xl">
                    {eventRaw.subtitle}
                  </span>
                )}
              </FadeIn>
            </div>
            <div className="hidden lg:col-span-4 lg:flex lg:flex-col lg:items-end lg:justify-end lg:pb-4">
              <FadeIn delay="500ms" className="text-right">
                <span className="font-montserrat text-6xl font-black text-white xl:text-7xl">
                  {day}
                </span>
                <span className="font-youngest text-arylideYellow block text-4xl xl:text-5xl">
                  {month}
                </span>
                <span className="font-montserrat mt-3 block text-xs font-bold tracking-[0.3em] text-white/40 uppercase xl:text-sm">
                  {year}
                </span>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-raisinBlack relative z-20 w-full py-16 lg:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12 lg:gap-20">
            <div className="relative flex flex-col gap-10 rounded-3xl border border-white/5 bg-white/2 p-8 shadow-2xl backdrop-blur-md lg:sticky lg:top-32 lg:col-span-4 lg:p-10">
              <FadeIn delay="200ms">
                <div className="flex flex-col gap-8">
                  <div>
                    <span className="font-montserrat mb-2 block text-[0.6rem] font-bold tracking-[0.3em] text-white/40 uppercase">
                      Kiedy
                    </span>
                    <time dateTime={eventRaw.date}>
                      <span className="font-montserrat block text-xl font-medium text-white">
                        {day} {month} {year}
                      </span>
                      <span className="font-youngest text-arylideYellow block text-2xl">
                        Godz. {time}
                      </span>
                    </time>
                  </div>
                  <div>
                    <span className="font-montserrat mb-2 block text-[0.6rem] font-bold tracking-[0.3em] text-white/40 uppercase">
                      Gdzie
                    </span>
                    <p className="font-montserrat text-xl font-medium text-white">
                      {eventRaw.location}
                    </p>
                    {eventRaw.address && (
                      <p className="font-montserrat mt-1 text-sm font-light text-white/60">
                        {eventRaw.address}
                      </p>
                    )}
                  </div>

                  {eventRaw.ticketType === "platne" && eventRaw.ticketPrice && (
                    <div>
                      <span className="font-montserrat mb-2 block text-[0.6rem] font-bold tracking-[0.3em] text-white/40 uppercase">
                        Cena Biletu
                      </span>
                      <p className="font-montserrat text-arylideYellow text-xl font-bold">
                        {eventRaw.ticketPrice}
                      </p>
                    </div>
                  )}

                  <div className="my-2 h-px w-full bg-white/10" />
                  <div className="flex flex-col gap-3">
                    {renderTicketButton()}
                    <span className="font-montserrat text-center text-[0.55rem] tracking-widest text-white/30 uppercase">
                      {getTicketSubtext()}
                    </span>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="flex flex-col gap-16 lg:col-span-8 lg:pt-4">
              <FadeIn delay="300ms">
                <div className="prose prose-invert prose-lg font-montserrat marker:text-arylideYellow prose-strong:font-bold prose-strong:text-white max-w-none leading-relaxed font-light tracking-wide text-white/70">
                  {eventRaw.description ? (
                    <PortableText
                      value={eventRaw.description}
                      components={portableTextComponents}
                    />
                  ) : (
                    <p>Szczegóły wkrótce...</p>
                  )}
                </div>
              </FadeIn>

              {eventRaw.program && eventRaw.program.length > 0 && (
                <FadeIn delay="400ms">
                  <h2 className="font-youngest mb-8 text-4xl text-white">
                    Repertuar
                  </h2>
                  <ul className="flex flex-col">
                    {eventRaw.program.map((item: string, index: number) => (
                      <li
                        key={index}
                        className="group hover:border-arylideYellow/50 relative border-t border-white/10 py-5 transition-colors"
                      >
                        <div className="absolute top-0 left-0 h-full w-0 bg-linear-to-r from-white/5 to-transparent transition-all duration-500 group-hover:w-full" />
                        <div className="relative z-10 flex items-start gap-4">
                          <span className="font-montserrat text-arylideYellow mt-1 text-xs font-bold">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="font-montserrat text-lg font-medium text-white/90 transition-colors group-hover:text-white">
                            {item}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </FadeIn>
              )}

              {eventRaw.guestArtists && eventRaw.guestArtists.length > 0 && (
                <FadeIn delay="500ms">
                  <h2 className="font-youngest mb-8 text-4xl text-white">
                    Gościnnie wystąpią
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {eventRaw.guestArtists.map(
                      (artist: { name: string; role?: string }) => (
                        <div
                          key={artist.name}
                          className="group flex flex-col rounded-2xl bg-[#1f1f1f] p-6 transition-all duration-500 hover:-translate-y-1 hover:bg-[#2a2a2a]"
                        >
                          <span className="font-montserrat group-hover:text-arylideYellow text-xl font-bold text-white transition-colors">
                            {artist.name}
                          </span>
                          <span className="font-montserrat mt-1 text-xs font-medium tracking-widest text-white/40 uppercase">
                            {artist.role}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-oxfordBlue relative z-10 w-full overflow-hidden py-24 text-center lg:py-32">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
          <span
            aria-hidden="true"
            data-deco="Maxime"
            className="font-youngest text-[20vw] whitespace-nowrap text-white before:content-[attr(data-deco)]"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <FadeIn>
            <h2 className="font-montserrat text-3xl leading-tight font-bold text-white md:text-4xl lg:text-5xl">
              Masz pytania dotyczące <br className="hidden sm:block" /> tego
              wydarzenia?
            </h2>
          </FadeIn>
          <FadeIn
            delay="200ms"
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/kontakt"
              className="group bg-arylideYellow font-montserrat text-raisinBlack relative inline-flex items-center justify-center gap-4 rounded-full px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:scale-105"
            >
              Napisz do nas
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
