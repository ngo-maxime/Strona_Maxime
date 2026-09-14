export const copyrightText = `© ${new Date().getFullYear()} Stowarzyszenie Maxime. Wszelkie prawa zastrzeżone.`;

export const mainLinks = [
  { name: "Strona główna", path: "/" },
  { name: "O nas", path: "/o-nas" },
  { name: "Oferta", path: "/oferta" }, // <-- DOKŁADNIE TUTAJ
  { name: "Wydarzenia", path: "/wydarzenia" },
  { name: "Aktualności", path: "/aktualnosci" },
  { name: "Galeria", path: "/galeria" },
  { name: "Kontakt", path: "/kontakt" },
];

export const legalLinks = [
  { name: "Regulamin", path: "/regulamin" },
  { name: "Polityka prywatności", path: "/polityka-prywatnosci" },
];

// ---------------------------------------------------------
// MAPER IKON (Bez fallbacków!)
// ---------------------------------------------------------
export const getSocialIcon = (platform: string) => {
  // Zabezpieczenie na wypadek, gdyby z Sanity przyszło undefined / null
  if (!platform) return null;

  const iconClass = "h-[1.15rem] w-[1.15rem]";

  // .toLowerCase() sprawia, że wpis w Sanity ignoruje wielkość liter
  // (np. "Facebook", "facebook", "FACEBOOK" zadziałają tak samo)
  switch (platform.toLowerCase()) {
    case "facebook":
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <title>Facebook</title>
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <title>Instagram</title>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
          />
        </svg>
      );
    case "youtube":
      return (
        // ZMIENIONO: Dodano zmienną iconClass zamiast wpisanej z palca wartości
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <title>YouTube</title>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.872.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <title>LinkedIn</title>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          />
        </svg>
      );
    case "patronite":
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <title>Patronite</title>
          <path d="M7 3h6.5c3.5 0 6.5 2.5 6.5 6.5S17 16 13.5 16H11v5H7V3zm4 9h2.5c1.4 0 2.5-1.1 2.5-2.5S14.9 7 13.5 7H11v5z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <title>TikTok</title>
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-.71 4.46-2.18 6.08-1.58 1.76-4.07 2.63-6.42 2.15-2.29-.48-4.16-2.12-4.97-4.29-.82-2.22-.51-4.83 1.11-6.68 1.5-1.72 3.86-2.52 6.05-2.16v4.06c-1.02-.27-2.15-.17-3.02.43-.87.61-1.34 1.66-1.25 2.7.09 1.05.74 2.01 1.66 2.44 1.1.52 2.45.39 3.39-.36.94-.74 1.4-1.92 1.42-3.11.05-5.94.02-11.88.02-17.82h.11z" />
        </svg>
      );
    case "x":
    case "twitter":
    case "x (twitter)":
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <title>X / Twitter</title>
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      );
    default:
      // BRAK FALLBACKU!
      // Zwracamy null. Jeśli widzisz puste miejsce zamiast ikony na stronie,
      // oznacza to, że nazwa platformy w Sanity ma literówkę lub nie ma jej na liście.
      return null;
  }
};
