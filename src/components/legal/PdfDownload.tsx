import FadeIn from "@/components/ui/FadeIn";

// Przycisk pobierania pojawia się dopiero, gdy dokument istnieje:
//  1) plik wgrany w Sanity (Ustawienia strony → Dokumenty do pobrania) – zalecane,
//  2) albo plik w public/docs/ (lista wyliczana podczas builda w next.config.ts).
const AVAILABLE = (process.env.NEXT_PUBLIC_LEGAL_PDFS || "")
  .split(",")
  .filter(Boolean);

export default function PdfDownload({
  file,
  url,
  note,
}: {
  file: string;
  /** Adres pliku z Sanity (ma pierwszeństwo przed public/docs) */
  url?: string;
  note: string;
}) {
  const href = url
    ? `${url}?dl=${encodeURIComponent(file)}`
    : AVAILABLE.includes(file)
      ? `/docs/${file}`
      : null;
  if (!href) return null;

  return (
    <div className="mt-20 flex justify-center border-t border-white/10 pt-16 lg:mt-32 lg:pt-24">
      <FadeIn className="flex flex-col items-center text-center">
        <span className="font-montserrat mb-6 block text-[0.65rem] font-bold tracking-[0.4em] text-white/40 uppercase">
          Wymogi formalne
        </span>
        <a
          href={href}
          target="_blank"
          rel="noopener"
          className="group font-montserrat hover:border-arylideYellow hover:bg-arylideYellow hover:text-raisinBlack flex items-center gap-4 rounded-full border border-white/20 bg-transparent px-8 py-4 text-[0.7rem] font-bold tracking-[0.2em] text-white uppercase transition-all duration-500"
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
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          <span>Pobierz pełną wersję prawną (PDF)</span>
        </a>
        <p className="font-montserrat mt-6 max-w-sm text-xs font-light text-white/50">
          {note}
        </p>
      </FadeIn>
    </div>
  );
}
