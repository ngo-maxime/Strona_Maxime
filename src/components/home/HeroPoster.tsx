// Plakat (pierwsza klatka) sekcji Hero – element LCP strony głównej.
// Art direction: telefon pobiera pionowy kadr 608×1080, komputer poziomy 1920×1080.
// Obie wersje są wstępnie ładowane (preload z media query), więc przeglądarka
// pobiera od razu właściwą – i tylko jedną.
import { getImageProps } from "next/image";
import { preload } from "react-dom";

const MOBILE_QUERY = "(max-width: 767px)";
const DESKTOP_QUERY = "(min-width: 768px)";

export default function HeroPoster() {
  const common = {
    alt: "Muzycy na scenie",
    sizes: "100vw",
    quality: 60, // tło pod ciemnymi nakładkami – niższa jakość jest niezauważalna
  };

  const {
    props: { srcSet: desktopSrcSet, src: desktopSrc },
  } = getImageProps({
    ...common,
    src: "/video-poster.webp",
    width: 1920,
    height: 1080,
  });

  const { props: mobileProps } = getImageProps({
    ...common,
    src: "/video-poster-mobile.webp",
    width: 608,
    height: 1080,
    loading: "eager",
    fetchPriority: "high",
  });

  preload(mobileProps.src, {
    as: "image",
    imageSrcSet: mobileProps.srcSet,
    imageSizes: "100vw",
    media: MOBILE_QUERY,
    fetchPriority: "high",
  });
  preload(desktopSrc, {
    as: "image",
    imageSrcSet: desktopSrcSet,
    imageSizes: "100vw",
    media: DESKTOP_QUERY,
    fetchPriority: "high",
  });

  const { style: _style, width: _w, height: _h, ...imgProps } = mobileProps;

  return (
    <picture>
      <source media={DESKTOP_QUERY} srcSet={desktopSrcSet} sizes="100vw" />
      <img
        {...imgProps}
        alt={common.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  );
}
