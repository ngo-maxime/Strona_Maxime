// Wspólne pobieranie ustawień globalnych (stopka, nawigacja, dane strukturalne).
// `cache()` sprawia, że w ramach jednego renderu zapytanie wykonuje się tylko raz.
import { defineQuery } from "next-sanity";
import { cache } from "react";
import { ORGANIZATION } from "@/lib/site";
import { sanityFetch } from "./fetch";

const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    contact { address, email, phone },
    socials[] { platform, url },
    author { name, url },
    stats { events, concerts, members, locations },
    legal { krs, nip, regon },
    "homeAboutImage": media.homeAboutImage{ "url": asset->url, alt, hotspot, "lqip": asset->metadata.lqip },
    "aboutPageImage": media.aboutPageImage{ "url": asset->url, alt, hotspot, "lqip": asset->metadata.lqip },
    "privacyPdf": documents.privacyPdf.asset->url,
    "termsPdf": documents.termsPdf.asset->url
  }
`);

export interface CmsImageData {
  url?: string;
  alt?: string;
  lqip?: string;
  hotspot?: { x?: number; y?: number };
}

/** Punkt kadrowania z Sanity → CSS object-position (dla zdjęć z object-cover). */
export function hotspotPosition(image?: CmsImageData) {
  const h = image?.hotspot;
  if (typeof h?.x !== "number" || typeof h?.y !== "number") return undefined;
  return `${Math.round(h.x * 100)}% ${Math.round(h.y * 100)}%`;
}

export interface SiteSettings {
  contact?: { address?: string; email?: string; phone?: string };
  socials?: { platform: string; url: string }[];
  author?: { name?: string; url?: string };
  stats?: {
    events?: number;
    concerts?: number;
    members?: number;
    locations?: number;
  };
  legal?: { krs?: string; nip?: string; regon?: string };
  homeAboutImage?: CmsImageData;
  aboutPageImage?: CmsImageData;
  privacyPdf?: string;
  termsPdf?: string;
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const { data } = await sanityFetch({
      query: SITE_SETTINGS_QUERY,
    });
    // Sanity zwraca null dla niewypełnionych pól (np. nowo dodanych w Studio).
    // Zamieniamy null na brak pola, żeby działały wartości domyślne w komponentach.
    return withoutNulls(data) as SiteSettings;
  } catch (error) {
    // Brak połączenia z CMS nie może wyłączyć całej strony
    console.error("Nie udało się pobrać siteSettings z Sanity:", error);
    return {};
  }
});

/** Dane fundacji: konfiguracja w kodzie + dane rejestrowe z Sanity (Sanity ma pierwszeństwo). */
export async function getOrganization() {
  const settings = await getSiteSettings();
  return {
    ...ORGANIZATION,
    krs: settings.legal?.krs || ORGANIZATION.krs,
    nip: settings.legal?.nip || ORGANIZATION.nip,
    regon: settings.legal?.regon || ORGANIZATION.regon,
    email: settings.contact?.email || ORGANIZATION.email,
    phone: settings.contact?.phone || ORGANIZATION.phone,
  };
}

/** Lata działalności liczone automatycznie od roku założenia (2022). */
export function yearsOnStage() {
  return Math.max(
    1,
    new Date().getFullYear() - Number(ORGANIZATION.foundingYear),
  );
}

/** Rekurencyjnie usuwa pola o wartości null (obiekty i tablice). */
function withoutNulls(value: unknown): unknown {
  if (value === null || value === undefined) return {};
  if (Array.isArray(value)) {
    return value
      .filter((v) => v !== null)
      .map((v) => (typeof v === "object" ? withoutNulls(v) : v));
  }
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== null)
        .map(([k, v]) => [k, typeof v === "object" ? withoutNulls(v) : v]),
    );
  }
  return value;
}
