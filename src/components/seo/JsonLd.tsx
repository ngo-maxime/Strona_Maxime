import { jsonLdString } from "@/lib/site";

/** Dane strukturalne Schema.org renderowane po stronie serwera (zero JS w przeglądarce). */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: dane escapowane w jsonLdString
      dangerouslySetInnerHTML={{ __html: jsonLdString(data) }}
    />
  );
}
