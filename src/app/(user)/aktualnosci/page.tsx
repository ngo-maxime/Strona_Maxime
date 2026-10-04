// src/app/(user)/aktualnosci/page.tsx

import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import NewsList from "@/components/news/NewsList";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import FadeIn from "@/components/ui/FadeIn";
import { sanityFetch } from "@/sanity/lib/live";

export interface NewsProps {
  id: string;
  date: string;
  month: string;
  year: string;
  title: string;
  excerpt: string;
  image: string;
}

const NEWS_QUERY = defineQuery(`
  *[_type == "news"] | order(publishedAt desc) {
    "id": slug.current,
    title,
    excerpt,
    publishedAt,
    "image": image.asset->url
  }
`);

const monthsPlGenitive = [
  "Stycznia",
  "Lutego",
  "Marca",
  "Kwietnia",
  "Maja",
  "Czerwca",
  "Lipca",
  "Sierpnia",
  "Września",
  "Października",
  "Listopada",
  "Grudnia",
];

function formatNewsData(rawNews: any): NewsProps {
  const d = rawNews.publishedAt ? new Date(rawNews.publishedAt) : new Date();

  return {
    id: rawNews.id,
    title: rawNews.title || "Bez tytułu",
    excerpt: rawNews.excerpt || "",
    image: rawNews.image || "/video-poster.webp",
    date: String(d.getDate()).padStart(2, "0"),
    month: monthsPlGenitive[d.getMonth()],
    year: String(d.getFullYear()),
  };
}

export default async function NewsPage() {
  const { data } = await sanityFetch({ query: NEWS_QUERY });
  const formattedNews = data.map(formatNewsData);

  if (!formattedNews || formattedNews.length === 0) {
    return (
      <main className="bg-raisinBlack flex min-h-screen items-center justify-center pt-32">
        <h1 className="font-youngest text-4xl text-white">Brak aktualności.</h1>
      </main>
    );
  }

  const featuredPost = formattedNews[0];
  const regularPosts = formattedNews.slice(1);

  return (
    <main className="bg-raisinBlack selection:bg-arylideYellow selection:text-raisinBlack relative min-h-screen w-full overflow-x-hidden">
      {/* HERO SECTION (Renderowane na Serwerze) */}
      <section className="relative z-10 flex min-h-[60vh] w-full flex-col justify-center px-6 pt-32 lg:px-12 lg:pt-40">
        <div className="pointer-events-none absolute top-20 -right-20 z-0 h-150 w-150 opacity-5 lg:-top-20 lg:-right-32 lg:h-225 lg:w-225 xl:h-275 xl:w-275">
          <Image
            src="/Asset-1.svg"
            alt=""
            fill
            className="object-contain brightness-0 invert"
          />
        </div>
        <div className="pointer-events-none absolute top-1/2 left-0 z-0 -translate-y-1/2 opacity-[0.02] mix-blend-overlay select-none">
          <span className="font-montserrat text-[25vw] leading-none font-black whitespace-nowrap text-white">
            AKTUALNOŚCI
          </span>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <FadeIn delay="100ms">
            <div className="mb-6 flex items-center gap-4">
              <div className="bg-arylideYellow h-px w-12" />
              <span className="font-montserrat text-arylideYellow text-[0.65rem] font-bold tracking-[0.4em] uppercase">
                Aktualności - Sprawdź co nowego u nas!
              </span>
            </div>
          </FadeIn>
          <FadeIn delay="300ms">
            <h1 className="font-montserrat text-5xl leading-[1.05] font-bold tracking-tight text-white md:text-7xl lg:text-[7rem]">
              Pulsujący <br />
              <span className="font-youngest text-arylideYellow relative top-4 inline-block -rotate-2 text-6xl font-normal md:text-8xl lg:top-8 lg:text-[10rem]">
                rytm
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay="500ms" className="mt-12 max-w-xl lg:mt-24">
            <p className="font-montserrat text-lg leading-relaxed font-light tracking-wide text-white/70">
              Zanurz się w świecie Maxime i bądź na bieżąco z każdym naszym
              ruchem.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* WYRÓŻNIONY ARTYKUŁ (Renderowane na Serwerze) */}
      <section className="relative z-20 w-full px-6 py-20 lg:px-12 lg:py-32">
        <div className="mx-auto w-full max-w-7xl">
          <div className="relative flex flex-col items-center xl:block">
            <FadeIn className="relative w-full xl:w-[70%]">
              <Link
                href={`/aktualnosci/${featuredPost.id}`}
                className="group relative block aspect-4/3 w-full overflow-hidden bg-[#1a1a1a] xl:aspect-16/10"
              >
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  priority
                  className="object-cover opacity-80 transition-transform duration-2000 ease-out group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="bg-oxfordBlue/20 absolute inset-0 mix-blend-multiply transition-colors duration-700 group-hover:bg-transparent" />
                <div className="bg-arylideYellow font-montserrat text-raisinBlack absolute top-6 left-6 px-4 py-2 text-[0.6rem] font-bold tracking-[0.3em] uppercase">
                  Najnowszy wpis
                </div>
              </Link>
            </FadeIn>

            <FadeIn
              delay="300ms"
              className="bg-oxfordBlue/95 relative -mt-20 w-[90%] border border-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-12 xl:absolute xl:right-0 xl:-bottom-12 xl:mt-0 xl:w-[50%] xl:p-16"
            >
              <div className="mb-6 flex items-end gap-6">
                <span className="font-montserrat text-6xl leading-none font-black text-white lg:text-7xl">
                  {featuredPost.date}
                </span>
                <div className="flex flex-col pb-1">
                  <span className="font-youngest text-arylideYellow text-2xl">
                    {featuredPost.month}
                  </span>
                  <span className="font-montserrat text-[0.6rem] font-bold tracking-widest text-white/40 uppercase">
                    {featuredPost.year}
                  </span>
                </div>
              </div>

              <div className="mb-6 h-px w-full bg-white/10" />

              <Link href={`/aktualnosci/${featuredPost.id}`}>
                <h2 className="font-montserrat hover:text-arylideYellow mb-6 text-2xl leading-tight font-bold text-white transition-colors duration-300 lg:text-4xl">
                  {featuredPost.title}
                </h2>
              </Link>

              <p className="font-montserrat mb-8 text-sm leading-relaxed font-light text-white/60 lg:text-base lg:leading-loose">
                {featuredPost.excerpt}
              </p>

              <Link
                href={`/aktualnosci/${featuredPost.id}`}
                className="group font-montserrat hover:text-arylideYellow flex items-center gap-4 text-xs font-bold tracking-[0.2em] text-white uppercase transition-colors"
              >
                Czytaj artykuł
                <div className="group-hover:border-arylideYellow group-hover:bg-arylideYellow group-hover:text-raisinBlack relative flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-all duration-300">
                  <svg
                    className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
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
                </div>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* LISTA STARSZYCH POSTÓW (Komponent Kliencki z paginacją) */}
      <NewsList regularPosts={regularPosts} />

      {/* SEKCJA NEWSLETTER (Renderowane na Serwerze) */}
      <section className="bg-arylideYellow relative z-10 w-full overflow-hidden py-24 lg:py-32">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-10">
          <Image src="/Asset-2.svg" alt="" fill className="object-contain" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <span className="font-youngest text-oxfordBlue text-4xl md:text-5xl">
              Nie przegap żadnego dźwięku.
            </span>
          </FadeIn>
          <FadeIn delay="200ms" className="mt-6">
            <h2 className="font-montserrat text-raisinBlack text-3xl leading-tight font-black md:text-5xl lg:text-6xl">
              Dołącz do naszego <br className="hidden md:block" />
              ekskluzywnego newslettera.
            </h2>
          </FadeIn>
          <FadeIn delay="300ms" className="mx-auto mt-6 max-w-xl">
            <p className="font-montserrat text-raisinBlack/70 text-sm leading-relaxed font-medium md:text-base">
              Zapisz się, aby jako pierwszy otrzymywać informacje o
              nadchodzących koncertach.
            </p>
          </FadeIn>
          <FadeIn
            delay="500ms"
            className="mt-12 flex flex-col items-center justify-center"
          >
            <NewsletterForm variant="light" className="max-w-lg" />
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
