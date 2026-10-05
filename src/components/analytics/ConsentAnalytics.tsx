"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { useEffect, useState } from "react";
import {
  CONSENT_EVENT,
  type CookieConsentState,
  readConsent,
} from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Analityka:
 *  • Vercel Web Analytics + Speed Insights – bez plików cookies i bez identyfikatorów
 *    użytkownika, więc działają zawsze (statystyki odwiedzin i Core Web Vitals),
 *  • Google Analytics 4 – ładowany WYŁĄCZNIE po zgodzie na pliki „Analityczne”
 *    (art. 399 Prawa komunikacji elektronicznej). Ustaw NEXT_PUBLIC_GA_ID=G-XXXXXXX.
 */
export default function ConsentAnalytics() {
  const [gaAllowed, setGaAllowed] = useState(false);

  useEffect(() => {
    setGaAllowed(Boolean(readConsent()?.analytics));
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<CookieConsentState>).detail;
      setGaAllowed(Boolean(detail?.analytics));
    };
    window.addEventListener(CONSENT_EVENT, onUpdate);
    return () => window.removeEventListener(CONSENT_EVENT, onUpdate);
  }, []);

  return (
    <>
      <Analytics />
      <SpeedInsights />
      {GA_ID && gaAllowed && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-config" strategy="afterInteractive">
            {`gtag('consent','update',{analytics_storage:'granted'});gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
    </>
  );
}
