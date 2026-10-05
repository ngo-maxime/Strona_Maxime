"use client";

import { OPEN_SETTINGS_EVENT } from "@/lib/consent";

export default function CookieManagerButton() {
  // Otwiera panel ustawień cookies bez przeładowania strony i bez kasowania dotychczasowych zgód
  const openSettings = () => {
    window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
  };

  return (
    <button
      onClick={openSettings}
      type="button"
      className="font-montserrat text-[0.65rem] font-medium tracking-widest text-white/30 uppercase transition-colors hover:text-white"
    >
      Zarządzaj Cookies
    </button>
  );
}
