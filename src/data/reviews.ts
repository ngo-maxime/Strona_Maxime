// Opinie widzów wyświetlane na stronie głównej (sekcja „Głosy publiczności”, 3 pierwsze).
//
// Jak dodać opinię z wizytówki Google:
//   skopiuj treść, imię (lub inicjały) i ocenę, dopisz obiekt na początku listy
//   i ustaw source: "google". Kolejność w tablicy = kolejność na stronie.
//
// Link „wystaw opinię” z panelu Profilu Firmy w Google (Poproś o opinie → skopiuj link)
// Publikację opinii z Google opisuje Polityka prywatności (sekcja „Opinie z Google”).
// Przenoś tylko imię lub inicjały autora – tak jak w wizytówce.
// ustaw w zmiennej NEXT_PUBLIC_GOOGLE_REVIEW_URL – pod opiniami pojawi się przycisk
// „Dodaj swoją opinię lub przeczytaj więcej” prowadzący do wizytówki.

export interface Review {
  id: string;
  name: string;
  role: string;
  /** Ocena w gwiazdkach – opcjonalna (przy opiniach z Google wpisz ocenę z wizytówki) */
  rating?: 1 | 2 | 3 | 4 | 5;
  text: string;
  source?: "google" | "strona";
}

export const reviews: Review[] = [
  {
    id: "magda",
    name: "Magda",
    role: "Widz",
    text: "Cudowny koncert! Wspaniała orkiestra, chórki, wokaliści petarda! Z przyjemnością wezmę udział w kolejnym wydarzeniu :)",
  },
  {
    id: "slawomir",
    name: "Sławomir",
    role: "Widz",
    text: "Bardzo dobrze spędzony czas",
  },
  {
    id: "beata-l",
    name: "Beata L.",
    role: "Widz",
    text: "Świetny wieczór, piękny koncert szkoda że taki krótki bo czas mija szybko jak się słucha tak fajnych utworów w świetnym wykonaniu.",
  },
];

export const GOOGLE_REVIEW_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "";
