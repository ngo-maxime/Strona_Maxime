"use client";

// Powiększenie zdjęć galerii. Siatkę miniatur renderuje serwer (PhotoGrid),
// a tutaj jedynie przechwytujemy kliknięcia (delegacja zdarzeń) i pokazujemy okno.
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "@/components/ui/CmsImage";
import type { GalleryPhoto } from "./PhotoGrid";

export default function Lightbox({
  photos,
  albumTitle = "",
  children,
}: {
  photos: GalleryPhoto[];
  albumTitle?: string;
  children: ReactNode;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const total = photos.length;
  const altFor = (index: number) =>
    photos[index]?.alt ||
    `${albumTitle ? `${albumTitle} – ` : ""}zdjęcie ${index + 1} z ${total}`;

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);
  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  // Kliknięcie w miniaturę (przyciski z atrybutem data-lightbox-index)
  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const button = (e.target as HTMLElement).closest<HTMLElement>(
      "[data-lightbox-index]",
    );
    if (!button) return;
    triggerRef.current = button;
    setCurrentIndex(Number(button.dataset.lightboxIndex));
    setLightboxOpen(true);
  };

  // Klawiatura, blokada przewijania, fokus (otwarcie → „Zamknij”, zamknięcie → miniatura)
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [lightboxOpen, nextImage, prevImage, closeLightbox]);

  // Gesty przesunięcia na telefonach
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) (delta < 0 ? nextImage : prevImage)();
    touchStartX.current = null;
  };

  const prevIndex = currentIndex === 0 ? total - 1 : currentIndex - 1;
  const nextIndex = (currentIndex + 1) % total;

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: delegacja kliknięć – właściwe elementy interaktywne to przyciski miniatur */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: przyciski miniatur obsługują klawiaturę natywnie (Enter/Spacja wywołują click) */}
      <div onClick={handleGridClick}>{children}</div>

      {/* LIGHTBOX OVERLAY */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={altFor(currentIndex)}
          className="bg-raisinBlack/95 fixed inset-0 z-100 flex items-center justify-center backdrop-blur-md transition-opacity"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            className="absolute inset-0 m-0 h-full w-full cursor-default appearance-none border-none bg-transparent p-0 outline-none"
            onClick={closeLightbox}
            tabIndex={-1}
            aria-hidden="true"
          />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeLightbox}
            aria-label="Zamknij"
            className="hover:bg-arylideYellow hover:text-raisinBlack absolute top-6 right-6 z-110 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white transition-all"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div
            aria-live="polite"
            className="font-montserrat absolute top-8 left-6 z-110 text-[0.7rem] font-bold tracking-[0.3em] text-white/50 uppercase"
          >
            {currentIndex + 1} <span className="mx-2 text-white/20">/</span>{" "}
            {total}
          </div>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                aria-label="Poprzednie zdjęcie"
                className="hover:bg-arylideYellow hover:text-raisinBlack absolute top-1/2 left-4 z-110 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-white transition-all md:flex"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label="Następne zdjęcie"
                className="hover:bg-arylideYellow hover:text-raisinBlack absolute top-1/2 right-4 z-110 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-white transition-all md:flex"
              >
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          <div className="pointer-events-none relative z-10 flex h-full max-h-[85vh] w-full max-w-[90vw] items-center justify-center">
            <Image
              key={photos[currentIndex].url}
              src={photos[currentIndex].url}
              alt={altFor(currentIndex)}
              fill
              className="pointer-events-auto object-contain select-none"
              sizes="90vw"
              placeholder={photos[currentIndex].lqip ? "blur" : "empty"}
              blurDataURL={photos[currentIndex].lqip ?? undefined}
              loading="eager"
            />
          </div>

          {/* Wstępne pobranie sąsiednich zdjęć – natychmiastowe przełączanie */}
          {total > 1 && (
            <div aria-hidden="true" className="hidden">
              {[prevIndex, nextIndex].map((i) => (
                <Image
                  key={`preload-${photos[i].url}`}
                  src={photos[i].url}
                  alt=""
                  width={10}
                  height={10}
                  sizes="90vw"
                  loading="eager"
                />
              ))}
            </div>
          )}

          {total > 1 && (
            <div className="absolute right-0 bottom-6 left-0 z-110 flex justify-center gap-6 md:hidden">
              <button
                type="button"
                onClick={prevImage}
                aria-label="Poprzednie zdjęcie"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextImage}
                aria-label="Następne zdjęcie"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
