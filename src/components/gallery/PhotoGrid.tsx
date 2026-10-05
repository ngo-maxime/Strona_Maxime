// src/components/gallery/PhotoGrid.tsx
import Image from "@/components/ui/CmsImage";
import FadeIn from "@/components/ui/FadeIn";
import Lightbox from "./Lightbox";

export interface GalleryPhoto {
  url: string;
  alt?: string | null;
  lqip?: string | null;
}

const SPAN_PATTERN = [
  "lg:col-span-2 lg:row-span-2 md:col-span-2",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-2 lg:row-span-1 md:col-span-2",
  "lg:col-span-1 lg:row-span-2",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-2 lg:row-span-2 md:col-span-2",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-2 lg:row-span-1 md:col-span-2",
  "lg:col-span-1 lg:row-span-1",
];

// Szerokość kafelka zależy od tego, czy zajmuje 1 czy 2 kolumny siatki
const sizesFor = (spanClass: string) =>
  spanClass.includes("col-span-2")
    ? "(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 700px"
    : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 350px";

// Komponent SERWEROWY: miniatury trafiają do przeglądarki jako gotowy HTML,
// a interakcję (powiększenie) obsługuje mały komponent kliencki Lightbox.
export default function PhotoGrid({
  photos,
  albumTitle = "",
}: {
  photos: GalleryPhoto[];
  albumTitle?: string;
}) {
  const total = photos?.length ?? 0;
  if (total === 0) return null;

  const altFor = (index: number) =>
    photos[index]?.alt ||
    `${albumTitle ? `${albumTitle} – ` : ""}zdjęcie ${index + 1} z ${total}`;

  return (
    <Lightbox photos={photos} albumTitle={albumTitle}>
      <section className="relative z-10 w-full bg-[#1c1c1c] px-4 py-16 md:px-6 lg:px-12 lg:py-32">
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-200 w-200 -translate-x-1/2 -translate-y-1/2 opacity-[0.02]">
          <Image
            src="/Asset-1.svg"
            alt=""
            fill
            sizes="800px"
            className="object-contain brightness-0 invert"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-350">
          <ul className="grid auto-rows-[300px] grid-cols-1 gap-4 md:auto-rows-[400px] md:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {photos.map((photo, index) => {
              const spanClass = SPAN_PATTERN[index % SPAN_PATTERN.length];

              return (
                <li
                  key={`${index}-${photo.url}`}
                  className={`relative ${spanClass}`}
                >
                  <FadeIn
                    delay={`${(index % 3) * 150}ms`}
                    className="relative h-full w-full"
                  >
                    <button
                      type="button"
                      data-lightbox-index={index}
                      aria-label={`Powiększ: ${altFor(index)}`}
                      aria-haspopup="dialog"
                      className="group bg-raisinBlack relative block h-full w-full cursor-zoom-in appearance-none overflow-hidden border-none p-0 text-left"
                    >
                      <span className="absolute inset-0 z-0">
                        <Image
                          src={photo.url}
                          alt=""
                          fill
                          sizes={sizesFor(spanClass)}
                          placeholder={photo.lqip ? "blur" : "empty"}
                          blurDataURL={photo.lqip ?? undefined}
                          className="object-cover opacity-80 transition-all duration-2000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:opacity-100"
                        />
                      </span>
                      <span className="bg-oxfordBlue/40 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <span className="border-arylideYellow/0 group-hover:border-arylideYellow/50 pointer-events-none absolute inset-4 scale-[1.05] border transition-all duration-500 group-hover:scale-100" />
                      <span className="pointer-events-none absolute inset-0 flex scale-50 items-center justify-center opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100">
                        <span className="bg-arylideYellow/90 text-raisinBlack flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm">
                          <svg
                            aria-hidden="true"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </span>
                      </span>
                    </button>
                  </FadeIn>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </Lightbox>
  );
}
