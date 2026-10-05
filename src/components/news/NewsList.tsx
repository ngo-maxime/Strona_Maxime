// src/app/(user)/aktualnosci/NewsList.tsx
"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { NewsProps } from "@/app/(user)/aktualnosci/page"; // Importujemy typ z głównego pliku
import Image from "@/components/ui/CmsImage";
import FadeIn from "@/components/ui/FadeIn";

export default function NewsList({
  regularPosts,
}: {
  regularPosts: NewsProps[];
}) {
  const archiveRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(5);

  const displayedPosts = regularPosts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < regularPosts.length;
  const canCollapse = visibleCount > 5;

  const handleLoadMore = () => setVisibleCount((prev) => prev + 5);

  const handleCollapse = () => {
    setVisibleCount(5);
    if (archiveRef.current) {
      const yOffset = -100;
      const y =
        archiveRef.current.getBoundingClientRect().top +
        window.scrollY +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (!regularPosts || regularPosts.length === 0) return null;

  return (
    <section className="relative z-10 w-full px-6 py-20 lg:px-12 lg:py-32">
      <div className="mx-auto w-full max-w-7xl" ref={archiveRef}>
        <FadeIn>
          <div className="mb-16 flex items-center justify-between lg:mb-24">
            <h3 className="font-youngest text-4xl text-white lg:text-6xl">
              Wcześniejsze wpisy
            </h3>
            <span className="font-montserrat hidden text-[0.65rem] font-bold tracking-[0.3em] text-white/30 uppercase md:block">
              Wyświetlono {displayedPosts.length} z {regularPosts.length}
            </span>
          </div>
        </FadeIn>

        <div
          id="news-archive-list"
          className="flex flex-col border-t border-white/10"
        >
          {displayedPosts.map((post) => (
            <FadeIn key={post.id}>
              <Link
                href={`/aktualnosci/${post.id}`}
                className="group relative flex flex-col items-start gap-8 border-b border-white/10 px-4 py-12 transition-all duration-500 hover:bg-white/2 md:flex-row md:items-center lg:gap-8 lg:px-10 lg:py-16"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-0 z-0 -translate-y-1/2 opacity-0 transition-all duration-700 select-none group-hover:translate-x-10 group-hover:opacity-[0.03] lg:left-[10%]"
                >
                  <span className="font-montserrat text-[15rem] leading-none font-black text-white">
                    {post.date}
                  </span>
                </div>

                <div className="relative z-10 flex w-full shrink-0 flex-row items-center gap-6 md:w-32 md:flex-col md:items-start md:gap-1 lg:w-48 xl:w-64">
                  <span className="font-montserrat group-hover:text-arylideYellow text-5xl font-black text-white transition-colors duration-500 lg:text-6xl">
                    {post.date}
                  </span>
                  <div className="flex flex-col md:mt-2">
                    <span className="font-youngest text-philippineSilver text-2xl transition-colors duration-500 group-hover:text-white">
                      {post.month}
                    </span>
                    <span className="font-montserrat text-[0.6rem] font-bold tracking-[0.2em] text-white/30 uppercase">
                      {post.year}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex w-full flex-col md:flex-1">
                  <h4 className="font-montserrat mb-4 text-2xl leading-tight font-bold text-white transition-colors duration-300 group-hover:text-white lg:text-3xl">
                    {post.title}
                  </h4>
                  <p className="font-montserrat text-sm leading-relaxed font-light text-white/50 transition-colors duration-300 group-hover:text-white/70 lg:text-base">
                    {post.excerpt}
                  </p>
                </div>

                <div className="relative z-10 mt-6 flex w-full shrink-0 items-center justify-between gap-6 md:mt-0 md:w-auto md:justify-end lg:gap-8">
                  <div className="bg-raisinBlack hidden h-24 w-36 shrink-0 overflow-hidden rounded-lg lg:block xl:h-32 xl:w-48">
                    <div className="relative h-full w-full scale-110 opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100">
                      <Image
                        src={post.image}
                        alt=""
                        fill
                        sizes="192px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="group-hover:border-arylideYellow group-hover:bg-arylideYellow group-hover:text-raisinBlack flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-500 lg:h-16 lg:w-16">
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 lg:h-5 lg:w-5"
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
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-16 flex flex-wrap items-center justify-center gap-4 lg:mt-24">
          {hasMorePosts && (
            <button
              type="button"
              onClick={handleLoadMore}
              aria-controls="news-archive-list"
              className="group font-montserrat hover:border-arylideYellow hover:text-arylideYellow relative inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-transparent px-8 py-4 text-[0.65rem] font-bold tracking-[0.2em] text-white uppercase transition-all duration-500"
            >
              Załaduj starsze wpisy
              <svg
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}

          {canCollapse && (
            <button
              type="button"
              onClick={handleCollapse}
              className="group font-montserrat relative inline-flex items-center justify-center gap-3 rounded-full border border-transparent bg-white/5 px-8 py-4 text-[0.65rem] font-bold tracking-[0.2em] text-white/60 uppercase transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              Zwiń listę
              <svg
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
