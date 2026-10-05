// src/app/(user)/aktualnosci/[slug]/page.tsx
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { defineQuery } from "next-sanity";
import JsonLd from "@/components/seo/JsonLd";
import Image from "@/components/ui/CmsImage";
import FadeIn from "@/components/ui/FadeIn";
import PortableLink from "@/components/ui/PortableLink";
import { getWarsawParts, MONTHS_GENITIVE } from "@/lib/date";
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

// USUNIĘTO: category, author z zapytania
const ARTICLE_QUERY = defineQuery(`
  *[_type == "news" && slug.current == $slug][0] {
    title,
    subtitle,
    readTime,
    publishedAt,
    "image": image.asset->url,
    "updatedAt": _updatedAt,
    // Obrazy w treści muszą mieć rozwiązane assety – inaczej value.asset.url było puste
    content[]{
      ...,
      _type == "image" => {
        ...,
        "asset": asset->{ url, metadata { lqip, dimensions { width, height } } }
      }
    }
  }
`);

const ARTICLE_META_QUERY = defineQuery(`
  *[_type == "news" && slug.current == $slug][0] {
    title, subtitle, excerpt, publishedAt, _updatedAt, "image": image.asset->url
  }
`);

const NEWS_SLUGS_QUERY = defineQuery(
  `*[_type == "news" && defined(slug.current)].slug.current`,
);

// USUNIĘTO: category
const RELATED_QUERY = defineQuery(`
  *[_type == "news" && slug.current != $slug] | order(publishedAt desc)[0...2] {
    "id": slug.current,
    title,
    "image": image.asset->url
  }
`);

const portableTextComponents: PortableTextComponents = {
  marks: { link: PortableLink },
  types: {
    image: ({ value }) => {
      if (!value?.asset?.url) return null;
      return (
        <figure className="my-16 grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="bg-raisinBlack relative aspect-video w-full overflow-hidden">
              <Image
                src={value.asset.url}
                alt={value.alt || ""}
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                placeholder={value.asset.metadata?.lqip ? "blur" : "empty"}
                blurDataURL={value.asset.metadata?.lqip}
                className="object-cover opacity-80 mix-blend-luminosity transition-all duration-1000 hover:mix-blend-normal"
              />
            </div>
          </div>
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-16 mb-6 text-3xl font-bold text-white">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-12 mb-4 text-2xl font-bold text-white">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mb-8 leading-loose font-light text-white/70">{children}</p>
    ),
    blockquote: ({ children }) => (
      <div className="relative my-20 py-10">
        <div className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-white/5" />
        <div
          aria-hidden="true"
          className="font-youngest pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] text-white/3"
        >
          "
        </div>
        <blockquote className="relative z-10 px-4 text-center md:px-12">
          <div className="font-youngest text-arylideYellow mb-6 text-4xl leading-tight md:text-5xl lg:text-6xl">
            {children}
          </div>
        </blockquote>
      </div>
    ),
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(NEWS_SLUGS_QUERY);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: ARTICLE_META_QUERY,
    params: { slug },
  });
  if (!data) return {};

  return pageMetadata({
    title: data.title,
    description: truncate(
      [data.excerpt || data.subtitle, "Aktualności Fundacji Maxime"]
        .filter(Boolean)
        .join(" – "),
    ),
    path: `/aktualnosci/${slug}`,
    image: sanityOgImage(data.image),
    type: "article",
    publishedTime: data.publishedAt,
    modifiedTime: data._updatedAt,
  });
}

export default async function NewsArticlePage({ params }: Props) {
  const resolvedParams = await params;

  const [articleRes, relatedRes] = await Promise.all([
    sanityFetch({
      query: ARTICLE_QUERY,
      params: { slug: resolvedParams.slug },
    }),
    sanityFetch({
      query: RELATED_QUERY,
      params: { slug: resolvedParams.slug },
    }),
  ]);

  const article = articleRes.data;
  const relatedPosts = relatedRes.data;

  if (!article) notFound();

  const d = getWarsawParts(article.publishedAt ?? new Date());
  const formattedDate = `${d.day} ${MONTHS_GENITIVE[d.monthIndex]} ${d.year}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    ...(article.image && { image: [article.image] }),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    mainEntityOfPage: `${SITE_URL}/aktualnosci/${resolvedParams.slug}`,
    ...(article.excerpt && { description: article.excerpt }),
    inLanguage: "pl-PL",
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };

  return (
    <div className="bg-raisinBlack selection:bg-arylideYellow selection:text-raisinBlack relative min-h-screen w-full">
      <JsonLd data={jsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Aktualności", path: "/aktualnosci" },
          { name: article.title, path: `/aktualnosci/${resolvedParams.slug}` },
        ])}
      />
      {/* Pasek postępu czytania (keyframes scroll-progress dodane w globals.css) */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 z-120 h-1 w-full bg-white/5"
      >
        <div
          className="bg-arylideYellow h-full w-0 animate-[scroll-progress_linear_both]"
          style={{ animationTimeline: "scroll()" }}
        />
      </div>

      <section className="relative flex min-h-[75vh] w-full flex-col justify-end overflow-hidden px-6 pt-40 pb-16 lg:px-12">
        <div className="absolute inset-0 z-0">
          <Image
            src={article.image || "/video-poster.webp"}
            alt=""
            fill
            preload
            fetchPriority="high"
            sizes="100vw"
            className="scale-105 object-cover opacity-50"
          />
          <div className="from-raisinBlack via-raisinBlack/80 absolute inset-0 bg-linear-to-t to-transparent" />
          <div className="from-raisinBlack/90 via-raisinBlack/40 absolute inset-0 bg-linear-to-r to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-4xl">
          <FadeIn>
            <Link
              href="/aktualnosci"
              className="group font-montserrat hover:text-arylideYellow mb-12 inline-flex items-center gap-3 text-[0.65rem] font-bold tracking-[0.3em] text-white/50 uppercase transition-colors lg:mb-16"
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
              Powrót do Aktualności
            </Link>
          </FadeIn>

          <FadeIn delay="100ms">
            <div className="font-montserrat text-arylideYellow mb-6 flex flex-wrap items-center gap-4 text-[0.65rem] font-bold tracking-[0.3em] uppercase">
              {/* USUNIĘTO KATEGORIĘ (został tylko czas czytania, jako gładki element interfejsu) */}
              {article.readTime ? (
                <span className="text-white/50">
                  {article.readTime} min czytania
                </span>
              ) : null}
            </div>
          </FadeIn>

          <FadeIn delay="300ms">
            <h1 className="font-montserrat mb-6 text-4xl leading-[1.05] font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="font-youngest text-3xl text-white/80 md:text-4xl">
                {article.subtitle}
              </p>
            )}
          </FadeIn>

          <FadeIn delay="500ms">
            <div className="mt-12 flex items-center gap-6 border-t border-white/10 pt-8">
              {/* USUNIĘTO BLOK AUTORA */}
              <div className="flex flex-col">
                <span className="font-montserrat mb-1 text-[0.6rem] font-bold tracking-[0.3em] text-white/40 uppercase">
                  Data publikacji
                </span>
                <time
                  dateTime={article.publishedAt}
                  className="font-montserrat text-sm font-medium text-white"
                >
                  {formattedDate}
                </time>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* TREŚĆ ARTYKUŁU */}
      <section className="relative z-20 w-full px-6 py-16 lg:py-24">
        <div className="pointer-events-none absolute top-32 left-0 z-0 h-150 w-150 -translate-x-1/2 opacity-[0.03]">
          <Image
            src="/Asset-1.svg"
            alt=""
            fill
            sizes="600px"
            className="object-contain brightness-0 invert"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-3xl">
          <FadeIn delay="200ms">
            <article className="font-montserrat text-white">
              <PortableText
                value={article.content}
                components={portableTextComponents}
              />
            </article>
          </FadeIn>
        </div>
      </section>

      {/* CZYTAJ DALEJ */}
      {relatedPosts?.length > 0 && (
        <section className="relative z-10 w-full bg-[#1c1c1c] py-24 lg:py-32">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
            <FadeIn>
              <div className="mb-16 flex items-center gap-6 lg:mb-24">
                <div className="bg-arylideYellow h-px w-16" />
                <h2 className="font-youngest text-4xl text-white lg:text-5xl">
                  Czytaj dalej
                </h2>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
              {relatedPosts.map(
                (
                  post: { id: string; title: string; image?: string },
                  i: number,
                ) => (
                  <FadeIn key={post.id} delay={`${i * 200}ms`}>
                    <Link
                      href={`/aktualnosci/${post.id}`}
                      className="group flex flex-col overflow-hidden border border-white/5 bg-[#222222] transition-all duration-500 hover:-translate-y-2 hover:border-white/10 hover:shadow-2xl"
                    >
                      <div className="relative aspect-video w-full overflow-hidden">
                        <Image
                          src={post.image || "/video-poster.webp"}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 600px"
                          className="object-cover opacity-70 transition-transform duration-2000 group-hover:scale-105 group-hover:opacity-100"
                        />
                        {/* USUNIĘTO KATEGORIĘ Z TEGO MIEJSCA W ZDJĘCIU */}
                      </div>
                      <div className="flex grow flex-col justify-between p-8 lg:p-10">
                        <h3 className="font-montserrat group-hover:text-arylideYellow mb-8 text-xl leading-tight font-bold text-white transition-colors lg:text-2xl">
                          {post.title}
                        </h3>
                      </div>
                    </Link>
                  </FadeIn>
                ),
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
