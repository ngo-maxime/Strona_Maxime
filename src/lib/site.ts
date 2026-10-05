import type { Metadata } from "next";

// ---------------------------------------------------------------------------
// Konfiguracja serwisu – jedno źródło prawdy dla SEO, danych strukturalnych,
// sitemap i dokumentów prawnych.
// ---------------------------------------------------------------------------

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.maxime.com.pl"
).replace(/\/$/, "");

export const SITE_NAME = "Fundacja Maxime";
export const SITE_TAGLINE = "Z pasji do muzyki";
export const DEFAULT_TITLE = `${SITE_NAME} | ${SITE_TAGLINE}`;
export const DEFAULT_DESCRIPTION =
  "Odkryj z nami piękno dźwięków. Talent, ambicja i profesjonalizm, które tworzą niezapomniane emocje. Jesteśmy orkiestrą i Fundacją Maxime z Dąbrowy Górniczej.";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

/**
 * Dane rejestrowe fundacji. Puste pola nie są wyświetlane.
 * Po wpisie do KRS uzupełnij numery – pojawią się w polityce prywatności,
 * regulaminie i danych strukturalnych Google.
 */
export const ORGANIZATION = {
  name: SITE_NAME,
  legalName: "Fundacja Maxime",
  foundingYear: "2022",
  krs: "" as string,
  nip: "" as string,
  regon: "" as string,
  email: "kontakt@maxime.com.pl",
  phone: "+48 784 762 553",
  address: {
    street: "ul. Henryka Sienkiewicza 6A",
    postalCode: "41-300",
    city: "Dąbrowa Górnicza",
    region: "śląskie",
    country: "PL",
  },
} as const;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Bezpieczne osadzenie JSON-LD w <script> (blokuje wstrzyknięcie `</script>` z treści CMS). */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Skraca tekst do długości odpowiedniej dla meta description. */
export function truncate(text: string | undefined | null, max = 160) {
  if (!text) return undefined;
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

/** Obraz z Sanity przycięty do formatu Open Graph (1200×630, JPG – najlepiej obsługiwany przez social media). */
export function sanityOgImage(url?: string | null) {
  if (!url) return undefined;
  return `${url}?w=1200&h=630&fit=crop&fm=jpg&q=80`;
}

interface PageMetaInput {
  title?: string;
  /** Tytuł bez doklejania „| Fundacja Maxime” */
  absoluteTitle?: boolean;
  description?: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

/**
 * Pełne metadane podstrony: tytuł, opis, canonical, Open Graph i Twitter.
 * (Next.js nie scala zagnieżdżonych obiektów openGraph – bez tego każda podstrona
 * udostępniona na Facebooku miałaby tytuł i opis strony głównej.)
 */
export function pageMetadata({
  title,
  absoluteTitle,
  description = DEFAULT_DESCRIPTION,
  path,
  image,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex,
}: PageMetaInput): Metadata {
  const fullTitle = !title
    ? DEFAULT_TITLE
    : absoluteTitle
      ? title
      : `${title} | ${SITE_NAME}`;
  const images = [
    {
      url: image || DEFAULT_OG_IMAGE,
      width: 1200,
      height: 630,
      alt: imageAlt || title || `${SITE_NAME} – ${SITE_TAGLINE}`,
    },
  ];

  return {
    // Bez tytułu → domyślny z layoutu. Klucz z wartością undefined NADPISAŁBY go pustym!
    title: title
      ? absoluteTitle
        ? { absolute: title }
        : title
      : { absolute: DEFAULT_TITLE },
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "pl_PL",
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
      images,
      ...(type === "article" && { publishedTime, modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.map((i) => i.url),
    },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}

/** Okruszki (BreadcrumbList) – Google pokazuje je zamiast surowego URL w wynikach. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Strona główna", path: "/" }, ...items].map(
      (item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
      }),
    ),
  };
}

type PageType = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";

/**
 * JSON-LD podstrony: typ strony (WebPage / AboutPage / ContactPage / CollectionPage)
 * powiązany z witryną i organizacją, okruszki oraz opcjonalnie lista elementów (ItemList).
 */
export function pageJsonLd({
  type = "WebPage",
  name,
  description,
  path,
  crumb,
  items,
}: {
  type?: PageType;
  name: string;
  description?: string;
  path: string;
  /** Nazwa w okruszkach (pomiń dla strony głównej) */
  crumb?: string;
  /** Elementy listy (np. wydarzenia na /wydarzenia) */
  items?: { name: string; path: string }[];
}) {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const breadcrumb = crumb
    ? {
        ...breadcrumbJsonLd([{ name: crumb, path }]),
        "@id": `${url}#breadcrumb`,
      }
    : null;
  if (breadcrumb) delete (breadcrumb as { "@context"?: string })["@context"];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${url}#webpage`,
        url,
        name,
        ...(description && { description }),
        inLanguage: "pl-PL",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORGANIZATION_ID },
        ...(breadcrumb && { breadcrumb: { "@id": `${url}#breadcrumb` } }),
        ...(items &&
          items.length > 0 && {
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: items.length,
              itemListElement: items.slice(0, 50).map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                url: `${SITE_URL}${item.path}`,
              })),
            },
          }),
      },
      ...(breadcrumb ? [breadcrumb] : []),
    ],
  };
}
