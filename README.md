# Fundacja Maxime – strona www.maxime.com.pl

Next.js 16 (App Router) + Sanity CMS + Tailwind CSS 4, hosting Vercel.

## Uruchomienie lokalne

```bash
pnpm install
cp .env.example .env.local   # uzupełnij wartości
pnpm dev                      # http://localhost:3000, panel CMS: /studio
```

Przydatne: `pnpm typecheck`, `pnpm lint`, `pnpm build`.

## Wdrożenie – lista kontrolna

1. **Zmienne środowiskowe** z `.env.example` ustaw w Vercel → Settings → Environment Variables.
2. **Domena**: w Vercel → Domains ustaw `www.maxime.com.pl` jako główną, a `maxime.com.pl`
   jako przekierowanie 308 na `www`. Adresy `*.vercel.app` są automatycznie wyłączone z indeksowania.
3. **Webhook Sanity** (natychmiastowa aktualizacja treści po publikacji):
   sanity.io/manage → projekt → API → Webhooks → *Create webhook*
   - URL: `https://www.maxime.com.pl/api/revalidate`
   - Dataset: `production`, Trigger on: Create, Update, Delete, Filter: puste
   - HTTP method: `POST`, Secret: ta sama wartość co `SANITY_REVALIDATE_SECRET`

   Bez webhooka strona i tak odświeży treści maksymalnie po 10 minutach.
4. **Google Search Console**: dodaj usługę „Prefiks URL” `https://www.maxime.com.pl`, wybierz
   weryfikację *Tag HTML*, wartość `content` wklej do `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`,
   zrób redeploy i kliknij „Zweryfikuj”. Następnie: Mapy witryn → `sitemap.xml`.
   (Alternatywa: weryfikacja domeny rekordem DNS TXT – obejmuje wszystkie subdomeny.)
5. **Google Analytics 4**: utwórz usługę i strumień danych „Sieć”, identyfikator `G-…` wpisz w
   `NEXT_PUBLIC_GA_ID`. W Administracja → Zbieranie danych → Przechowywanie danych ustaw
   **14 miesięcy** (tak opisuje polityka prywatności).
6. **Profil Firmy w Google** (wizytówka): adres i nazwa identyczne jak na stronie
   (ul. Henryka Sienkiewicza 6A, 41-300 Dąbrowa Górnicza), w polu „witryna” – `https://www.maxime.com.pl`.
   Link „Poproś o opinie” wpisz w `NEXT_PUBLIC_GOOGLE_REVIEW_URL`.
7. **Vercel Analytics i Speed Insights**: włącz w zakładkach *Analytics* i *Speed Insights* projektu.

## Gdzie co zmieniać

| Co | Gdzie |
|---|---|
| KRS, NIP, REGON | Sanity Studio → Ustawienia strony → Dane rejestrowe |
| Liczby na stronie (wydarzenia, koncerty, członkowie, lokalizacje) | Sanity Studio → Ustawienia strony → Liczby na stronie („lata na scenie” liczą się same od 2022) |
| PDF polityki / regulaminu | Sanity Studio → Ustawienia strony → Dokumenty do pobrania (przycisk pojawi się sam) |
| Adres siedziby, rok założenia | `src/lib/site.ts` → `ORGANIZATION` |
| Opinie widzów (sekcja na stronie głównej) | `src/data/reviews.ts` |
| Zdjęcia w sekcjach „O nas” (strona główna i podstrona) | Sanity Studio → Ustawienia strony → Zdjęcia sekcji „O nas” (z punktem kadrowania) |
| Treść polityki prywatności | `src/app/(user)/polityka-prywatnosci/page.tsx` (zaktualizuj `LAST_UPDATE`) |
| Linki społecznościowe, kontakt w stopce | Sanity Studio → Ustawienia strony |

## Architektura w skrócie

- **Wszystkie podstrony są statyczne (ISR)** – HTML serwowany z CDN Vercel. Dane z Sanity:
  `src/sanity/lib/fetch.ts` (cache z tagiem `sanity`), odświeżanie: `src/app/api/revalidate`.
- **Animacje wejścia** (`FadeIn`) bez Reacta po stronie klienta – jeden skrypt w `app/layout.tsx`.
- **Zdjęcia z CMS** (`components/ui/CmsImage`) skalowane przez CDN Sanity (AVIF/WebP).
- **SEO**: `pageMetadata()` i `breadcrumbJsonLd()` w `src/lib/site.ts`, dane strukturalne
  organizacji w `app/(user)/layout.tsx`, `sitemap.ts`, `robots.ts`, `manifest.ts`.
- **Zgody cookies**: `components/cookies/CookieBanner.tsx` + Google Consent Mode v2;
  GA4 ładowany wyłącznie po zgodzie (`components/analytics/ConsentAnalytics.tsx`).

## Media w /public

| Plik | Parametry | Użycie |
|---|---|---|
| `bg-video.mp4` | 1920×1080, 30 fps, H.264, bez dźwięku, 0,9 MB | wideo w tle – komputer |
| `bg-video-mobile.mp4` | 608×1080 (pionowy kadr), 30 fps, 0,36 MB | wideo w tle – telefon |
| `video-poster.webp` / `video-poster-mobile.webp` | 1920×1080 / 608×1080 | pierwsza klatka (LCP), wersje dobierane przez `<picture>` |
| `og-image.jpg` | 1200×630, 69 KB – logo + hasło na kadrze z koncertu | podgląd linku w social media |
| `icon-192.png`, `icon-512.png`, `icon-maskable.png` | sygnet „M” | ikony aplikacji (PWA, Android) |
| `src/app/icon.svg`, `favicon.ico`, `apple-icon.png` | sygnet „M” (SVG 1,7 KB) | ikona w karcie przeglądarki, iPhone |
| `logo.svg` | wektor, biały | menu, stopka |
| `logo-schema.png` | 660×266, ciemne logo na białym | dane strukturalne Google |
| `icon-192.png`, `icon-512.png`, `icon-maskable.png` | sygnet „M”, 32 kolory | ikony aplikacji (manifest, Android) |
| `src/app/icon.svg` / `favicon.ico` / `apple-icon.png` | sygnet „M” | favicon (SVG + zapas ICO), ikona iOS |

**Ważne:** media z `/public` są cache'owane w przeglądarkach na rok. Podmieniając plik,
**zmień jego nazwę** (np. `bg-video-2027.mp4`) i zaktualizuj odwołanie w kodzie.

Zdjęcia w Sanity: wgrywaj JPG (nie PNG) o dłuższym boku ok. 2500–3000 px. Strona i tak
serwuje je w AVIF/WebP w rozmiarze dopasowanym do ekranu.

## Struktura

```
src/
  app/            trasy (strony), sitemap, robots, manifest, API (revalidate)
  components/
    layout/       Navbar, Footer, HomeLink (logo → Hero), przycisk „do góry”
    home/ news/ events/ gallery/ offer/ contact/ newsletter/   sekcje stron
    cookies/ analytics/ legal/ seo/ ui/                         elementy wspólne
  data/           nawigacja, opinie
  lib/            konfiguracja serwisu i SEO, daty, zgody, bezpieczeństwo formularzy
  sanity/         klient, pobieranie z cache, schematy CMS
```

## Komponenty klienckie („use client”)

Tylko tam, gdzie potrzebna jest interakcja: formularze, baner cookies i popup, menu mobilne,
filtr wydarzeń, „Załaduj więcej” w aktualnościach, powiększenie zdjęć (`Lightbox`),
licznik w Ofercie (`Counter`), wideo w tle, analityka. Cała reszta – w tym wszystkie zdjęcia
(`CmsImage`), siatka galerii i animacje wejścia (`FadeIn`) – renderuje się na serwerze.

## Usunięcie starych opinii z bazy Sanity

Typ „Opinia” nie istnieje już w Studio, ale dokumenty mogą zostać w bazie. Aby je usunąć
(PowerShell, w folderze projektu):

```
pnpm sanity documents query "*[_type == 'review']._id"
pnpm sanity documents delete ID1 ID2 ID3
```
