import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { client } from "@/sanity/lib/client";
import { SANITY_TAG } from "@/sanity/lib/fetch";

// Mapa strony generowana z treści Sanity; odświeżana razem z treścią (webhook) lub co godzinę.
export const revalidate = 3600;

const SITEMAP_QUERY = `{
  "events": *[_type == "event" && defined(slug.current)]{ "slug": slug.current, _updatedAt, "image": image.asset->url },
  "news": *[_type == "news" && defined(slug.current)]{ "slug": slug.current, _updatedAt, "image": image.asset->url },
  "galleries": *[_type == "gallery" && defined(slug.current)]{
    "slug": slug.current, _updatedAt,
    "image": coverImage.asset->url,
    "photos": photos[0...20].asset->url
  }
}`;

type Entry = {
  slug: string;
  _updatedAt: string;
  image?: string;
  photos?: string[];
};

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/wydarzenia", priority: 0.9, changeFrequency: "weekly" },
  { path: "/oferta", priority: 0.9, changeFrequency: "monthly" },
  { path: "/o-nas", priority: 0.8, changeFrequency: "monthly" },
  { path: "/aktualnosci", priority: 0.8, changeFrequency: "weekly" },
  { path: "/galeria", priority: 0.7, changeFrequency: "monthly" },
  { path: "/kontakt", priority: 0.7, changeFrequency: "yearly" },
  { path: "/regulamin", priority: 0.2, changeFrequency: "yearly" },
  { path: "/polityka-prywatnosci", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let latest = new Date(0);
  let dynamic: MetadataRoute.Sitemap = [];

  try {
    const data = await client.fetch<{
      events: Entry[];
      news: Entry[];
      galleries: Entry[];
    }>(SITEMAP_QUERY, {}, { next: { revalidate, tags: [SANITY_TAG] } });

    const map = (items: Entry[], base: string, priority: number) =>
      (items ?? []).map((item) => {
        const modified = new Date(item._updatedAt);
        if (modified > latest) latest = modified;
        const images = [item.image, ...(item.photos ?? [])].filter(
          (u): u is string => Boolean(u),
        );
        return {
          url: `${SITE_URL}${base}/${item.slug}`,
          lastModified: modified,
          priority,
          // Sitemap obrazów – zdjęcia szybciej trafiają do Grafiki Google
          ...(images.length > 0 && { images }),
        };
      });

    dynamic = [
      ...map(data.events, "/wydarzenia", 0.8),
      ...map(data.news, "/aktualnosci", 0.7),
      ...map(data.galleries, "/galeria", 0.6),
    ];
  } catch (error) {
    console.error("Sitemap: nie udało się pobrać danych z Sanity", error);
  }

  const lastModified = latest.getTime() > 0 ? latest : new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, ...rest }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      ...rest,
    }),
  );

  return [...staticEntries, ...dynamic];
}
