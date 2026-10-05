// Zamiennik next/image działający jako komponent SERWEROWY (bez "use client"):
//  • HTML <img> z pełnym srcset/sizes generowany na serwerze – zero JS w przeglądarce,
//  • zdjęcia z Sanity (cdn.sanity.io) skalowane i konwertowane (AVIF/WebP) przez CDN Sanity,
//  • pliki lokalne (/public) – standardowa optymalizacja Next.js,
//  • preload (obraz LCP) realizowany przez ReactDOM.preload.
// Może być też importowany w komponentach klienckich – działa tak samo.
import { getImageProps, type ImageLoader, type ImageProps } from "next/image";
import { preload as preloadResource } from "react-dom";

const SANITY_CDN = "https://cdn.sanity.io/";

const sanityLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
};

export default function CmsImage({ preload, ...props }: ImageProps) {
  const isSanity =
    typeof props.src === "string" && props.src.startsWith(SANITY_CDN);

  const { props: img } = getImageProps({
    ...props,
    preload,
    loader: isSanity ? sanityLoader : undefined,
  });

  if (preload) {
    preloadResource(img.src, {
      as: "image",
      imageSrcSet: img.srcSet,
      imageSizes: img.sizes,
      fetchPriority: "high",
    });
  }

  // biome-ignore lint/a11y/useAltText: alt jest w props przekazanych przez getImageProps
  // biome-ignore lint/performance/noImgElement: <img> generowany przez getImageProps (to jest optymalizacja next/image)
  return <img {...img} />;
}
