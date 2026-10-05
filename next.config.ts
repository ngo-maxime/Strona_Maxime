import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// Dokumenty prawne w PDF: przycisk „Pobierz PDF” pojawia się automatycznie,
// gdy plik trafi do public/docs/ (np. polityka-prywatnosci.pdf, regulamin.pdf).
const docsDir = path.join(process.cwd(), "public", "docs");
const legalPdfs = existsSync(docsDir)
  ? readdirSync(docsDir).filter((f) => f.toLowerCase().endsWith(".pdf"))
  : [];

// Nagłówki bezpieczeństwa dla całego serwisu.
// CSP ograniczona do dyrektyw, które nie kolidują z Next.js, Sanity Studio i Vercel Analytics.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy",
    value:
      "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_LEGAL_PDFS: legalPdfs.join(","),
  },
  // Metadane (<title>, description, Open Graph) zawsze w <head> – dla wszystkich klientów,
  // nie tylko rozpoznanych botów. Strony są statyczne, więc nie kosztuje to nic,
  // a Lighthouse, czytniki ekranu i podglądy linków (Messenger, LinkedIn) widzą tytuł od razu.
  htmlLimitedBots: /.*/,
  experimental: {
    // CSS wbudowany w HTML. Pomiar z produkcji (Lighthouse, telefon): osobny plik CSS
    // blokował wyświetlenie strony do ~1,7 s. Next.js dubluje CSS w danych RSC (+15 KB gzip),
    // ale na wolnych łączach brak dodatkowego zapytania wygrywa o ~1 s LCP.
    inlineCss: true,
    // Mniejsze paczki JS – importujemy tylko używane części bibliotek
    optimizePackageImports: ["@portabletext/react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Dozwolone poziomy jakości (Next.js 16 wymaga ich jawnego podania)
    qualities: [60, 75],
    // Zasoby Sanity mają adresy zależne od treści (hash) – można je długo cache'ować.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async redirects() {
    return [
      // Podstrona opinii została usunięta – stare linki prowadzą do sekcji opinii na stronie głównej
      { source: "/opinie", destination: "/#opinie", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Media z /public: cache na rok. UWAGA: podmieniając plik, zmień jego nazwę
        // (np. bg-video-2027.mp4) – inaczej powracający goście zobaczą starą wersję.
        source:
          "/:file((?!_next/|docs/).*\\.(?:mp4|webm|webp|jpg|jpeg|png|svg|woff2))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Adresy *.vercel.app (podglądy, domena techniczna) nie mogą konkurować w Google
        // z www.maxime.com.pl – duplikacja treści obniża pozycje.
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        // Panel CMS nie powinien być indeksowany
        source: "/studio/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
