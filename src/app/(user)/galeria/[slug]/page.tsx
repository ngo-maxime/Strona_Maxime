// src/app/(user)/galeria/[slug]/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { defineQuery } from "next-sanity";
import PhotoGrid, { type GalleryPhoto } from "@/components/gallery/PhotoGrid";
import JsonLd from "@/components/seo/JsonLd";
import Image from "@/components/ui/CmsImage";
import FadeIn from "@/components/ui/FadeIn";
import { MONTHS_GENITIVE, parsePlainDate } from "@/lib/date";
import {
  breadcrumbJsonLd,
  ORGANIZATION_ID,
  pageMetadata,
  SITE_URL,
  sanityOgImage,
  truncate,
} from "@/lib/site";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";

const ALBUM_QUERY = defineQuery(`
  *[_type == "gallery" && slug.current == $slug][0] {
    "id": slug.current,
    title,
    date,
    location,
    photographer,
    description,
    "coverImage": coverImage.asset->url,
    "coverLqip": coverImage.asset->metadata.lqip,
    // Adres + opis + miniaturka LQIP (rozmyty podgląd podczas ładowania)
    "photos": photos[defined(asset)]{
      "url": asset->url,
      alt,
      "lqip": asset->metadata.lqip
    }
  }
`);

const ALBUM_META_QUERY = defineQuery(`
  *[_type == "gallery" && slug.current == $slug][0] {
    title, description, location, date, "image": coverImage.asset->url
  }
`);

const GALLERY_SLUGS_QUERY = defineQuery(
  `*[_type == "gallery" && defined(slug.current)].slug.current`,
);

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(GALLERY_SLUGS_QUERY);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: ALBUM_META_QUERY,
    params: { slug },
  });
  if (!data) return {};

  return pageMetadata({
    title: `${data.title} – galeria zdjęć`,
    description: truncate(
      [
        `${data.title} – galeria zdjęć z koncertu Fundacji Maxime`,
        [data.location, data.date?.slice(0, 4)].filter(Boolean).join(", "),
        data.description,
      ]
        .filter(Boolean)
        .join(". "),
    ),
    path: `/galeria/${slug}`,
    image: sanityOgImage(data.image),
    imageAlt: data.title,
  });
}

const NEXT_ALBUM_QUERY = defineQuery(`
  *[_type == "gallery" && slug.current != $slug] | order(date desc)[0] {
    "id": slug.current,
    title,
    "image": coverImage.asset->url
  }
`);

export default async function GalleryAlbumPage({ params }: Props) {
  const resolvedParams = await params;

  const [albumRes, nextAlbumRes] = await Promise.all([
    sanityFetch({ query: ALBUM_QUERY, params: { slug: resolvedParams.slug } }),
    sanityFetch({
      query: NEXT_ALBUM_QUERY,
      params: { slug: resolvedParams.slug },
    }),
  ]);

  const album = albumRes.data;
  const nextAlbum = nextAlbumRes.data;

  if (!album) notFound();

  // Pole `date` w Sanity to czysta data (bez godziny) – parsujemy ją bez przesunięć strefy
  const d = album.date ? parsePlainDate(album.date) : null;
  const formattedDate = d
    ? `${d.day} ${MONTHS_GENITIVE[d.monthIndex]} ${d.year}`
    : "";
  const photos: GalleryPhoto[] = (album.photos ?? []).filter(
    (p: GalleryPhoto) => p?.url,
  );
  // Dane strukturalne galerii – zdjęcia mogą pojawiać się w Grafice Google z opisem i źródłem
  const galleryJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: album.title,
    url: `${SITE_URL}/galeria/${resolvedParams.slug}`,
    ...(album.description && { description: album.description }),
    ...(album.date && { datePublished: album.date }),
    author: { "@id": ORGANIZATION_ID },
    image: photos.slice(0, 30).map((p) => ({
      "@type": "ImageObject",
      contentUrl: p.url,
      ...(p.alt && { caption: p.alt }),
      creditText: "Fundacja Maxime",
      copyrightNotice: "Fundacja Maxime",
    })),
  };

  return (
    <div className="bg-raisinBlack selection:bg-arylideYellow selection:text-raisinBlack relative min-h-screen w-full overflow-x-hidden">
      <JsonLd data={galleryJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Galeria", path: "/galeria" },
          { name: album.title, path: `/galeria/${resolvedParams.slug}` },
        ])}
      />
      {/* KINOWY HERO SECTION ALBUMU (Renderowany na serwerze!) */}
      <section className="relative flex min-h-[85vh] w-full flex-col justify-end overflow-hidden px-6 pt-40 pb-16 lg:px-12">
        <div className="absolute inset-0 z-0">
          <Image
            src={album.coverImage || "/video-poster.webp"}
            alt=""
            fill
            preload
            fetchPriority="high"
            sizes="100vw"
            placeholder={album.coverLqip ? "blur" : "empty"}
            blurDataURL={album.coverLqip ?? undefined}
            className="scale-100 object-cover opacity-60 transition-transform duration-3000 ease-out hover:scale-105"
          />
          <div className="from-raisinBlack via-raisinBlack/60 absolute inset-0 bg-linear-to-t to-transparent" />
          <div className="from-raisinBlack absolute inset-0 bg-linear-to-r via-transparent to-transparent opacity-80" />
        </div>

        {d && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 -left-10 z-0 opacity-10 mix-blend-overlay select-none"
          >
            <span
              aria-hidden="true"
              data-deco={d.year}
              className="font-montserrat text-[25vw] leading-none font-black text-white lg:text-[20vw] before:content-[attr(data-deco)]"
            />
          </div>
        )}

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <FadeIn>
            <Link
              href="/galeria"
              className="group font-montserrat hover:text-arylideYellow mb-12 inline-flex items-center gap-3 text-[0.65rem] font-bold tracking-[0.3em] text-white/50 uppercase transition-colors lg:mb-20"
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
              Powrót do portfolio
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <FadeIn delay="300ms">
                <h1 className="font-montserrat text-5xl leading-[1.05] font-black tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[6rem]">
                  {album.title}
                </h1>
              </FadeIn>
            </div>

            <div className="text-left lg:col-span-4 lg:flex lg:flex-col lg:items-end lg:justify-end lg:pb-4 lg:text-right">
              <FadeIn delay="500ms">
                {formattedDate && (
                  <time
                    dateTime={album.date}
                    className="font-youngest text-arylideYellow mb-2 block text-3xl md:text-4xl"
                  >
                    {formattedDate}
                  </time>
                )}
                <p className="font-montserrat text-sm font-medium text-white/80">
                  {album.location}
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* OPIS ALBUMU I METADANE (Renderowane na serwerze!) */}
      <section className="bg-raisinBlack relative z-20 w-full border-b border-white/5 px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-12">
            <div className="md:col-span-7 lg:col-span-8">
              <FadeIn>
                <p className="font-montserrat text-lg leading-relaxed font-light text-white/70 md:text-xl">
                  {album.description}
                </p>
              </FadeIn>
            </div>
            <div className="flex flex-col gap-8 md:col-span-5 md:pl-12 lg:col-span-4 lg:border-l lg:border-white/10 lg:pl-16">
              <FadeIn delay="200ms">
                <span className="font-montserrat mb-2 block text-[0.6rem] font-bold tracking-[0.3em] text-white/30 uppercase">
                  Fotografia
                </span>
                <span className="font-montserrat text-base font-medium text-white">
                  {album.photographer}
                </span>
              </FadeIn>
              <FadeIn delay="400ms">
                <span className="font-montserrat mb-2 block text-[0.6rem] font-bold tracking-[0.3em] text-white/30 uppercase">
                  Liczba kadrów
                </span>
                <span className="font-montserrat text-base font-medium text-white">
                  {photos.length} zdjęć
                </span>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* SIATKA ZDJĘĆ Z LIGHTBOXEM (Komponent Kliencki) */}
      <PhotoGrid photos={photos} albumTitle={album.title} />

      {/* NASTĘPNY ALBUM CTA (Renderowane na serwerze!) */}
      {nextAlbum && (
        <section className="group relative z-20 block h-[60vh] w-full overflow-hidden lg:h-[70vh]">
          <Link
            href={`/galeria/${nextAlbum.id}`}
            className="absolute inset-0 block h-full w-full"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={nextAlbum.image || "/video-poster.webp"}
                alt=""
                fill
                sizes="100vw"
                className="scale-100 object-cover opacity-50 transition-transform duration-3000 ease-out group-hover:scale-105"
              />
              <div className="bg-oxfordBlue/60 group-hover:bg-oxfordBlue/80 absolute inset-0 transition-colors duration-700" />
            </div>
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
              <FadeIn>
                <span className="font-montserrat text-arylideYellow mb-6 block text-[0.65rem] font-bold tracking-[0.4em] uppercase">
                  Zobacz następny album
                </span>
              </FadeIn>
              <FadeIn delay="200ms">
                <h2 className="font-montserrat mb-4 text-4xl leading-tight font-black text-white transition-transform duration-700 group-hover:-translate-y-2 sm:text-5xl md:text-6xl lg:text-7xl">
                  {nextAlbum.title}
                </h2>
              </FadeIn>
            </div>
            <div className="bg-raisinBlack/50 absolute bottom-0 left-0 h-2 w-full">
              <div className="bg-arylideYellow h-full w-0 transition-all duration-1500 ease-out group-hover:w-full" />
            </div>
          </Link>
        </section>
      )}
    </div>
  );
}
