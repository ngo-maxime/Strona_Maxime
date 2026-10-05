// src/sanity/lib/fetch.ts
//
// Pobieranie danych z Sanity z cache Next.js (ISR).
// Każda strona jest generowana statycznie i serwowana z CDN Vercel – bez czekania na CMS.
//
// Odświeżanie:
//  • natychmiast po publikacji w Studio – webhook Sanity → /api/revalidate (patrz README),
//  • awaryjnie co REVALIDATE_SECONDS, nawet jeśli webhook nie jest skonfigurowany.
import type { QueryParams } from "next-sanity";
import { client } from "./client";

export const SANITY_TAG = "sanity";
export const REVALIDATE_SECONDS = 600;

export async function sanityFetch<
  // biome-ignore lint/suspicious/noExplicitAny: wyniki GROQ nie są typowane (brak typegen)
  T = any,
>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<{ data: T }> {
  const data = await client.fetch<T>(query, params, {
    next: { revalidate: REVALIDATE_SECONDS, tags: [SANITY_TAG, ...tags] },
  });
  return { data };
}
