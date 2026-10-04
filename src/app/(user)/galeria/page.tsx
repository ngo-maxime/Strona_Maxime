// src/app/(user)/galeria/page.tsx

import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import FadeIn from "@/components/ui/FadeIn";
import { sanityFetch } from "@/sanity/lib/live";

export interface AlbumProps {
  id: string;
  title: string;
  count: number;
  year: string;
  image: string;
}

const GALLERY_QUERY = defineQuery(`
  *[_type == "gallery"] | order(date desc) {
    "id": slug.current,
    title,
    date,
    "image": coverImage.asset->url,
    "count": count(photos)
  }
`);

function formatAlbumData(rawAlbum: any): AlbumProps {
  const d = rawAlbum.date ? new Date(rawAlbum.date) : new Date();

  return {
    id: rawAlbum.id,
    title: rawAlbum.title || "Bez tytułu",
    count: rawAlbum.count || 0,
    year: String(d.getFullYear()),
    image: rawAlbum.image || "/video-poster.webp",
  };
}

// Główny i jedyny komponent strony (Server Component)
export default async function GalleryPage() {
  const { data } = await sanityFetch({ query: GALLERY_QUERY });
  const albumsData = data.map(formatAlbumData);

  return (
    <main className="bg-raisinBlack selection:bg-arylideYellow selection:text-raisinBlack relative min-h-screen w-full overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative z-10 flex min-h-[65vh] w-full flex-col justify-center px-6 pt-32 lg:px-12 lg:pt-40">
        <div className="pointer-events-none absolute top-10 -left-32 z-0 h-150 w-150 opacity-[0.03] lg:-top-10 lg:-left-20 lg:h-250 lg:w-250">
          <Image
            src="/Asset-2.svg"
            alt=""
            fill
            priority
            className="object-contain brightness-0 invert"
          />
        </div>
        <div className="pointer-events-none absolute top-1/2 right-0 z-0 translate-x-[10%] -translate-y-1/2 opacity-[0.02] mix-blend-overlay select-none">
          <span className="font-montserrat text-[22vw] leading-none font-black whitespace-nowrap text-white">
            GALERIA
          </span>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <FadeIn delay="100ms">
            <div className="mb-6 flex items-center gap-4">
              <div className="bg-arylideYellow h-px w-12" />
              <span className="font-montserrat text-arylideYellow text-[0.65rem] font-bold tracking-[0.4em] uppercase">
                Nasze portfolio
              </span>
            </div>
          </FadeIn>
          <FadeIn delay="300ms">
            <h1 className="font-montserrat text-5xl leading-[1.05] font-bold tracking-tight text-white md:text-7xl lg:text-[7rem]">
              Zatrzymane <br />
              <span className="font-youngest text-arylideYellow relative top-4 inline-block -rotate-2 text-6xl font-normal md:text-8xl lg:top-8 lg:text-[10rem]">
                w kadrze
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay="500ms" className="mt-12 max-w-xl lg:mt-24">
            <p className="font-montserrat text-lg leading-relaxed font-light tracking-wide text-white/70">
              Muzyka to ulotna sztuka zanikająca wraz z wyciszeniem ostatniego
              akordu. Fotografia pozwala nam zatrzymać ten moment w czasie.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ASYMETRYCZNA SIATKA ALBUMÓW */}
      <section className="relative z-10 w-full px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8 lg:gap-12">
            {albumsData.map((album: AlbumProps, index: number) => {
              const isLarge = index % 4 === 0 || index % 4 === 3;
              const colSpanClass = isLarge ? "md:col-span-8" : "md:col-span-4";

              return (
                <FadeIn
                  key={album.id}
                  delay={`${(index % 2) * 200}ms`}
                  className={`${colSpanClass} relative`}
                >
                  <Link
                    href={`/galeria/${album.id}`}
                    className="group bg-raisinBlack relative block h-100 w-full overflow-hidden md:h-125 lg:h-162.5"
                  >
                    <Image
                      src={album.image}
                      alt={album.title}
                      fill
                      className="object-cover opacity-70 transition-transform duration-1500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="from-raisinBlack via-raisinBlack/40 absolute inset-0 bg-linear-to-t to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-60" />

                    <div className="absolute top-6 right-6 overflow-hidden">
                      <span className="font-montserrat block text-xl font-black text-white mix-blend-overlay transition-transform duration-700 group-hover:-translate-y-full">
                        {album.year}
                      </span>
                      <span className="font-montserrat text-arylideYellow absolute top-0 left-0 block translate-y-full text-xl font-black transition-transform duration-700 group-hover:translate-y-0">
                        {album.year}
                      </span>
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-end p-8 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:p-12">
                      <div className="translate-y-8 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                        <div className="mb-4 flex items-center gap-4">
                          <span className="font-montserrat text-arylideYellow text-[0.55rem] font-bold tracking-[0.3em] uppercase">
                            Zdjęć: {album.count}
                          </span>
                        </div>

                        <h3 className="font-montserrat mb-6 text-2xl leading-tight font-bold text-white md:text-3xl lg:text-4xl">
                          {album.title}
                        </h3>

                        <div className="flex items-center gap-3 opacity-0 transition-all duration-700 group-hover:opacity-100">
                          <span className="font-montserrat text-[0.65rem] font-bold tracking-[0.2em] text-white uppercase">
                            Otwórz galerię
                          </span>
                          <div className="bg-arylideYellow text-raisinBlack flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-500 group-hover:translate-x-2">
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 5l7 7m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>

          {albumsData.length === 0 && (
            <FadeIn className="py-32 text-center">
              <span className="font-youngest text-4xl text-white/20">
                Brak albumów w portfolio.
              </span>
            </FadeIn>
          )}
        </div>
      </section>

      {/* CTA PRESS PACK */}
      <section className="bg-oxfordBlue relative z-10 w-full overflow-hidden py-24 text-center lg:py-32">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(239,203,111,0.08)_0%,transparent_70%)]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <FadeIn>
            <span className="font-youngest text-arylideYellow text-4xl md:text-5xl">
              Twój udział
            </span>
          </FadeIn>
          <FadeIn delay="200ms" className="mt-6">
            <h2 className="font-montserrat text-3xl leading-tight font-bold text-white md:text-5xl">
              Chcesz dołączyć do Maxime <br className="hidden md:block" />
              by tworzyć emocje?
            </h2>
          </FadeIn>
          <FadeIn
            delay="400ms"
            className="mx-auto mt-8 max-w-2xl font-light text-white/60"
          >
            <p>
              Szukamy kreatywnych osób chętnych do współpracy. Napisz nam, w
              czym jesteś najlepszy, i zostań z nami na dłużej.
            </p>
          </FadeIn>
          <FadeIn delay="600ms" className="mt-12 flex justify-center">
            <Link
              href="/kontakt"
              className="group font-montserrat hover:border-arylideYellow hover:text-arylideYellow relative inline-flex items-center justify-center gap-4 rounded-full border border-white/20 bg-transparent px-10 py-5 text-[0.7rem] font-bold tracking-[0.2em] text-white uppercase transition-all duration-500"
            >
              Napisz do Nas
              <svg
                className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
