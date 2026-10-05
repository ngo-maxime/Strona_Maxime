# Zmiany

## Etap 6 – wydajność mobilna (po pomiarze Lighthouse na produkcji)

- CSS ponownie wbudowany w HTML (`inlineCss`): na telefonie osobny plik blokował stronę do ~1,7 s.
- Animacja wejścia Hero startuje od 1% krycia (wizualnie bez zmian) z `animation-fill-mode: both` –
  LCP nie czeka na opóźnienie i koniec animacji.
- Nakładka Hero bez `mix-blend-multiply` (identyczne przyciemnienie, bez przeliczania przy każdej klatce wideo).
- Tło banera cookies bez `backdrop-blur` nad wideo (ciemniejsze o 10 pp.).
- Wideo w tle startuje dopiero po pełnym załadowaniu strony.

## Etap 5 – sygnet i grafiki

- Nowy kwadratowy sygnet „M” (kolor marki #EFCB6F): `icon.svg` (z 10 KB metadanych → 1,7 KB),
  `favicon.ico` 16/32/48 px, `apple-icon.png`, ikony PWA 192/512 + osobna wersja maskable.
  PNG zoptymalizowane 3–5× bez widocznej różnicy.
- Nowy obraz do udostępnień `og-image.jpg`: logo + „Z pasji do muzyki.” na przyciemnionym kadrze z koncertu.
- Bez zmian (dostarczone pliki były oryginałami lub cięższymi wersjami już zoptymalizowanych):
  wideo, plakat, grafiki dekoracyjne, logo.

## Etap 5 – sygnet i ikony, opinie z Google w polityce prywatności

- Nowy favicon: sygnet „M” jako SVG (1,8 KB – usunięty osadzony manifest C2PA, który stanowił 82% pliku)
  + `favicon.ico` 16/32/48 dla starszych przeglądarek + ikona iOS.
- Ikony aplikacji (192, 512, maskable) zoptymalizowane: 63 KB → 15 KB, wizualnie identyczne.
- `logo-schema.png` 32 KB → 11 KB.
- Polityka prywatności: sekcja „Opinie z Google” (źródło danych – art. 14 RODO, zakres, podstawa,
  okres przechowywania, sprzeciw) oraz zdanie o opiniach przekazanych bezpośrednio.
- Bez zmian (dostarczone pliki były cięższymi wersjami już używanych): wideo, plakat, logo, grafiki dekoracyjne.

## Etap 4 – wydarzenia, opinie, „use client”, audyt końcowy

- **Wydarzenia**: filtr miesięcy przyklejony do ekranu (komputer: kolumna, telefon: pasek pod menu),
  dyskretny filtr lat (ponowne kliknięcie roku = wszystkie lata), miesiące bez wydarzeń wygaszone,
  nadchodzące (najbliższe pierwsze) wyraźnie oddzielone od archiwum (ostatnie pierwsze).
- **Logo** (menu, menu mobilne, stopka) zawsze prowadzi do Hero; na stronie głównej płynnie przewija na górę.
  Kliknięcie bieżącej pozycji menu również wraca na górę; pozycja „Wydarzenia” podświetla się także na podstronie wydarzenia.
- **Opinie**: usunięta podstrona `/opinie` (przekierowanie 308 → `/#opinie`), 3 opinie w kodzie,
  przycisk „Dodaj swoją opinię lub przeczytaj więcej” prowadzi do wizytówki Google (gdy ustawiony link).
- **Sanity**: zdjęcia sekcji „O nas” (strona główna i podstrona) z punktem kadrowania (hotspot).
- **„use client” ograniczone**: `CmsImage` (wszystkie zdjęcia), siatka galerii i `OfferStats` renderują się
  na serwerze; po stronie klienta zostały tylko `Lightbox` i `Counter`.
- **JSON-LD**: każda podstrona ma typ strony (AboutPage / ContactPage / CollectionPage / WebPage),
  strony zbiorcze – listę elementów (ItemList).
- **Opisy meta** podstron szczegółowych zawsze zawierają datę i miejsce.
- **Hero / O nas**: `min-h-svh` zamiast `min-h-screen` (bez skakania na telefonach z paskiem adresu).
- Wyłączone `inlineCss` – Next.js dublował CSS w HTML (+30 KB gzip na każdej podstronie).
- Audyt automatyczny wszystkich podstron: 0 problemów (tytuły, opisy, canonical, Open Graph, h1,
  kolejność nagłówków, etykiety pól, nazwy linków i przycisków, zduplikowane ID, JSON-LD).

## Etap 3 – poprawki po Lighthouse

- **Brak `<title>` na stronie głównej** (błąd w `pageMetadata`) – naprawione. Dodatkowo metadane
  zawsze w `<head>` (`htmlLimitedBots`), także dla podglądów linków w komunikatorach.
- **CSS wbudowany w HTML** (`inlineCss`) – brak pliku blokującego renderowanie.
- **Kontrast**: ogromne napisy dekoracyjne w tle przeniesione do pseudo-elementu CSS
  (wygląd bez zmian, nie są już tekstem dla czytników ani audytów).
- **Plakat Hero**: osobny pionowy kadr na telefon (art direction `<picture>`), jakość 60,
  preload z media query – telefon pobiera tylko swoją wersję i obraz nie jest rozmyty.
- **Wideo na telefon**: pionowy kadr 608×1080 (0,36 MB) zamiast poziomego 1280×720.
- **Cache mediów**: rok (`immutable`) – patrz README „Media w /public”.
- **`browserslist`**: nowoczesne przeglądarki (te same, których wymaga Tailwind CSS 4).
- **Animacje wejścia**: IntersectionObserver + odsłonięcie reszty na końcu strony (bez forced reflow).
- Usunięty nieużywany `preconnect`.
- **Sanity**: liczby na stronie, dane rejestrowe (KRS/NIP/REGON) i PDF-y dokumentów edytowalne w Studio.
  „Lata na scenie” liczone automatycznie od 2022.
- **Regulamin** uzupełniony o elementy wymagane przez art. 8 UŚUDE: usługi elektroniczne,
  zawieranie i rozwiązywanie umów, wymagania techniczne, zakaz treści bezprawnych, reklamacje.
- Porządek w strukturze: `components/navbar` i `components/footer` → `components/layout`,
  `gallery/slug/PhotoGrid` → `gallery/PhotoGrid`.

## Etap 2 – wydajność, SEO, fundacja, polityka prywatności

### Wyniki (build produkcyjny, te same dane testowe)
| | Przed | Po |
|---|---|---|
| JavaScript na stronę (gzip) | 203–206 KB | 149–152 KB (−26%) |
| Podstrony wydarzeń / artykułów / albumów | renderowane przy każdym wejściu | statyczne z CDN |
| Logo | 63 KB (PNG w SVG) | 18 KB, wektor |
| Font odręczny | 165 KB | 32 KB (podzbiór znaków PL) |
| Favicon | 93 KB, prostokątny | 2,5 KB + ikony PWA |
| Grafiki SVG | 48 KB | 34 KB |

### Wydajność
- Usunięte Sanity Live → strony statyczne (ISR) + webhook `/api/revalidate` (+ awaryjnie co 10 min).
- FadeIn bez komponentów klienckich (jeden skrypt, IntersectionObserver + MutationObserver).
- Zdjęcia z Sanity przez CDN Sanity (`CmsImage`), preconnect do `cdn.sanity.io`.
- Usunięte zależności: js-cookie, @sanity/image-url; usunięty podwójny poster wideo.
- Usunięta obsługa `prefers-reduced-motion` (na życzenie).

### SEO
- Domena `https://www.maxime.com.pl` (wcześniej canonical wskazywał na vercel.app).
- `noindex` dla `*.vercel.app`, `/studio`, strony 404.
- Tytuły/opisy/Open Graph dla każdej podstrony (`pageMetadata`).
- Schema.org: NGO + MusicGroup (adres, rok założenia 2022, logo, kontakt), WebSite, MusicEvent,
  NewsArticle, ImageGallery, Service (oferta), BreadcrumbList.
- Sitemap z obrazami, manifest PWA, weryfikacja Google Search Console / Bing przez zmienne.
- Google Analytics 4 (tylko po zgodzie) + Vercel Analytics i Speed Insights.

### Treści
- Wszędzie „Fundacja Maxime”; „Est. 2022”; oś czasu od 2022.
- Nowa polityka prywatności (RODO + Prawo komunikacji elektronicznej).
- Przyciski PDF pokazują się dopiero po dodaniu plików do `public/docs/`.
- Opinie: 3 opinie widzów na sztywno (`src/data/reviews.ts`), usunięty formularz, API i schemat opinii w Sanity.
- Regulamin: dodane zdanie o fotografowaniu wydarzeń (odsyłacz do polityki prywatności).

### Do uzupełnienia
- KRS / NIP / REGON w `src/lib/site.ts`.
- Poprawne linki społecznościowe w Sanity (obecnie wszystkie prowadzą na Facebooka, także „Wesprzyj nas”/Patronite).
- Zmienne środowiskowe i webhook – patrz README.
- Weryfikacja polityki prywatności przez prawnika przed publikacją.

## Etap 1 – audyt (poprzednia wersja)
Bezpieczeństwo formularzy (escapowanie HTML, honeypot, limity), nagłówki bezpieczeństwa,
strefa czasowa Europe/Warsaw, poprawki dostępności, kompresja wideo (8,4 MB → 0,9 MB),
naprawione błędy (niewidoczne długie artykuły, obrazy w artykułach, kolejność opinii).
