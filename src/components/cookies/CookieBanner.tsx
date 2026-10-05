"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CONSENT_COOKIE,
  CONSENT_EVENT,
  CONSENT_MAX_AGE_DAYS,
  CONSENT_VERSION,
  type CookieConsentState,
  OPEN_SETTINGS_EVENT,
  readConsent,
  removeAnalyticsCookies,
  setCookie,
} from "@/lib/consent";

export type { CookieConsentState };

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // Na stronach prawnych nie zasłaniamy treści – użytkownik musi móc przeczytać politykę przed decyzją
  const isLegalPage =
    pathname === "/polityka-prywatnosci" || pathname === "/regulamin";

  const [preferences, setPreferences] = useState<CookieConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false,
  });

  // 1. Funkcja przeniesiona wyżej i owinięta w useCallback
  const updateConsentMode = useCallback(
    (consentSettings: CookieConsentState) => {
      const w = window as GtagWindow;
      if (typeof w.gtag === "function") {
        w.gtag("consent", "update", {
          analytics_storage: consentSettings.analytics ? "granted" : "denied",
          ad_storage: consentSettings.marketing ? "granted" : "denied",
          ad_user_data: consentSettings.marketing ? "granted" : "denied",
          ad_personalization: consentSettings.marketing ? "granted" : "denied",
          personalization_storage: consentSettings.personalization
            ? "granted"
            : "denied",
        });
      }
      // Emitowanie eventu dla innych skryptów w Next.js
      window.dispatchEvent(
        new CustomEvent(CONSENT_EVENT, { detail: consentSettings }),
      );
    },
    [],
  );

  // 2. useEffect teraz bez błędu wywołuje i zależy od updateConsentMode
  useEffect(() => {
    const saved = readConsent();

    if (!saved) {
      setShowBanner(true);
    } else {
      setPreferences(saved);
      updateConsentMode(saved);
    }

    // Ponowne otwarcie ustawień ze stopki („Zarządzaj Cookies”) bez przeładowania strony
    const openSettings = () => {
      setShowBanner(true);
      setShowPreferences(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings);
  }, [updateConsentMode]);

  // Fokus na oknie zgód (dostępność klawiaturowa / czytniki ekranu)
  useEffect(() => {
    if (showBanner || showPreferences) {
      dialogRef.current
        ?.querySelector<HTMLElement>("button, input:not([disabled])")
        ?.focus({ preventScroll: true });
    }
  }, [showBanner, showPreferences]);

  const saveConsent = (settings: CookieConsentState) => {
    const consentSettings: CookieConsentState = {
      ...settings,
      necessary: true,
      date: new Date().toISOString(),
      version: CONSENT_VERSION,
    };

    setCookie(
      CONSENT_COOKIE,
      JSON.stringify(consentSettings),
      CONSENT_MAX_AGE_DAYS,
    );

    // Wycofanie zgody na analitykę → usuwamy już zapisane ciasteczka Google Analytics
    if (!consentSettings.analytics) removeAnalyticsCookies();

    setPreferences(consentSettings);
    setShowBanner(false);
    setShowPreferences(false);
    updateConsentMode(consentSettings);
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    });
  };

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    });
  };

  // „Wróć”: przed pierwszą decyzją wraca do szybkiego wyboru,
  // po ponownym otwarciu ze stopki po prostu zamyka okno
  const handleBack = () => {
    setShowPreferences(false);
    if (readConsent()) setShowBanner(false);
  };

  const saveCustom = () => {
    saveConsent(preferences);
  };

  if (!showBanner && !showPreferences) return null;

  return (
    <>
      {/* Ciemne tło maskujące (overlay) */}
      {!isLegalPage && (
        // Bez backdrop-blur: rozmywanie całego ekranu nad odtwarzanym wideo było
        // najcięższą operacją graficzną na telefonach. Ciemniejsze tło daje podobny efekt.
        <div className="fixed inset-0 z-9998 bg-black/70 transition-opacity" />
      )}

      {/* Kontener główny banera */}
      <div className="fixed bottom-0 left-0 right-0 z-9999 flex justify-center p-4 sm:bottom-6 sm:p-0">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal={!isLegalPage}
          aria-labelledby="cookie-banner-title"
          className="font-montserrat bg-raisinBlack w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50 sm:mx-6 text-white animate-fade-in-up"
        >
          {!showPreferences ? (
            // WIDOK 1: SZYBKI WYBÓR
            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between lg:p-8">
              <div className="flex-1">
                <h2
                  id="cookie-banner-title"
                  className="text-arylideYellow mb-3 text-xl font-bold tracking-wide"
                >
                  Twoja prywatność, Twoje zasady
                </h2>
                <p className="text-sm leading-relaxed text-white/70">
                  Używamy plików cookie, aby optymalizować naszą stronę,
                  analizować ruch i dostarczać Ci jak najlepsze doświadczenia
                  związane z Fundacją Maxime. Możesz zaakceptować wszystkie
                  zgody, odrzucić opcjonalne lub zarządzać nimi. Szczegóły
                  znajdziesz w{" "}
                  <Link
                    href="/polityka-prywatnosci"
                    className="text-arylideYellow font-bold underline transition-colors hover:text-white"
                  >
                    Polityce Prywatności
                  </Link>
                  .
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="rounded-full px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Dostosuj
                </button>
                <button
                  type="button"
                  onClick={rejectAll}
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold transition-colors hover:bg-white/10 hover:border-white/40"
                >
                  Odrzuć
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="bg-arylideYellow text-raisinBlack rounded-full px-6 py-3 text-sm font-bold shadow-lg shadow-yellow-500/20 transition-transform hover:scale-105 hover:bg-yellow-400"
                >
                  Akceptuj wszystkie
                </button>
              </div>
            </div>
          ) : (
            // WIDOK 2: ZAAWANSOWANE ZARZĄDZANIE
            <div className="flex max-h-[85vh] flex-col overflow-y-auto p-6 lg:p-8">
              <div className="mb-6">
                <h2
                  id="cookie-banner-title"
                  className="text-arylideYellow mb-2 text-2xl font-bold"
                >
                  Zarządzaj plikami cookie
                </h2>
                <p className="text-sm text-white/70">
                  Wybierz, w jaki sposób możemy wykorzystywać pliki cookie.
                  Zgoda na niektóre technologie jest dobrowolna.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {/* NIEZBĘDNE */}
                <label className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 opacity-60">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="mt-1 h-5 w-5 accent-gray-500"
                  />
                  <div>
                    <span className="block text-base font-bold text-white">
                      Niezbędne (Wymagane)
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-white/60">
                      Są konieczne do prawidłowego funkcjonowania strony (np.
                      zapisywanie Twoich ustawień prywatności). Nie można ich
                      wyłączyć.
                    </span>
                  </div>
                </label>

                {/* ANALITYKA */}
                <label className="group flex cursor-pointer items-start gap-4 rounded-xl border border-white/10 p-5 transition-colors hover:bg-white/5">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        analytics: e.target.checked,
                      })
                    }
                    className="accent-arylideYellow mt-1 h-5 w-5 cursor-pointer rounded bg-white/10 border-white/20"
                  />
                  <div>
                    <span className="block text-base font-bold text-white group-hover:text-arylideYellow transition-colors">
                      Analityczne
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-white/60">
                      Pozwalają nam analizować, jak odwiedzający korzystają ze
                      strony (np. Google Analytics), co pomaga nam ulepszać nasz
                      serwis i ofertę.
                    </span>
                  </div>
                </label>

                {/* MARKETING */}
                <label className="group flex cursor-pointer items-start gap-4 rounded-xl border border-white/10 p-5 transition-colors hover:bg-white/5">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        marketing: e.target.checked,
                      })
                    }
                    className="accent-arylideYellow mt-1 h-5 w-5 cursor-pointer rounded"
                  />
                  <div>
                    <span className="block text-base font-bold text-white group-hover:text-arylideYellow transition-colors">
                      Marketingowe
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-white/60">
                      Służą do śledzenia użytkowników na stronach internetowych.
                      Ich celem jest wyświetlanie reklam (np. Facebook Ads),
                      które są odpowiednie dla użytkownika.
                    </span>
                  </div>
                </label>
              </div>

              <div className="mt-8 flex flex-wrap-reverse justify-end gap-3 border-t border-white/10 pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-full px-6 py-3 text-sm font-bold text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Wróć
                </button>
                <button
                  type="button"
                  onClick={rejectAll}
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold transition-colors hover:bg-white/10"
                >
                  Tylko niezbędne
                </button>
                <button
                  type="button"
                  onClick={saveCustom}
                  className="bg-arylideYellow text-raisinBlack rounded-full px-8 py-3 text-sm font-bold shadow-lg shadow-yellow-500/20 transition-transform hover:scale-105 hover:bg-yellow-400"
                >
                  Zapisz ustawienia
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
