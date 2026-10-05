// src/app/(user)/layout.tsx

import CookieBanner from "@/components/cookies/CookieBanner";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import NewsletterPopup from "@/components/newsletter/NewsletterPopup";
import JsonLd from "@/components/seo/JsonLd";
import {
  DEFAULT_DESCRIPTION,
  ORGANIZATION,
  ORGANIZATION_ID,
  SITE_NAME,
  SITE_URL,
  WEBSITE_ID,
} from "@/lib/site";
import { getOrganization, getSiteSettings } from "@/sanity/lib/settings";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, org] = await Promise.all([
    getSiteSettings(),
    getOrganization(),
  ]);

  // Unikalne linki społecznościowe z CMS (sameAs łączy profile z organizacją w Google)
  const sameAs = Array.from(
    new Set((settings.socials ?? []).map((s) => s.url).filter(Boolean)),
  );
  const email = settings.contact?.email || ORGANIZATION.email;
  const phone = settings.contact?.phone || ORGANIZATION.phone;

  // Dane strukturalne: organizacja (Knowledge Panel, lokalne wyniki) + witryna (nazwa w wynikach)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["NGO", "MusicGroup"],
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        legalName: ORGANIZATION.legalName,
        alternateName: "Maxime",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo-schema.png`,
          width: 660,
          height: 266,
        },
        image: `${SITE_URL}/og-image.jpg`,
        description: DEFAULT_DESCRIPTION,
        foundingDate: ORGANIZATION.foundingYear,
        email,
        telephone: phone.replace(/\s+/g, ""),
        address: {
          "@type": "PostalAddress",
          streetAddress: ORGANIZATION.address.street,
          postalCode: ORGANIZATION.address.postalCode,
          addressLocality: ORGANIZATION.address.city,
          addressRegion: ORGANIZATION.address.region,
          addressCountry: ORGANIZATION.address.country,
        },
        areaServed: { "@type": "Country", name: "Polska" },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email,
          telephone: phone.replace(/\s+/g, ""),
          availableLanguage: ["pl"],
        },
        ...(org.nip ? { taxID: org.nip } : {}),
        ...(org.krs
          ? {
              identifier: {
                "@type": "PropertyValue",
                propertyID: "KRS",
                value: org.krs,
              },
            }
          : {}),
        ...(sameAs.length > 0 && { sameAs }),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: ["Maxime", "Orkiestra Maxime"],
        inLanguage: "pl-PL",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Link „przejdź do treści” – widoczny tylko przy nawigacji klawiaturą */}
      <a
        href="#main-content"
        className="bg-arylideYellow text-raisinBlack fixed top-4 left-4 z-[10000] -translate-y-24 rounded-full px-6 py-3 text-xs font-bold tracking-widest uppercase transition-transform focus:translate-y-0"
      >
        Przejdź do treści
      </a>

      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </main>

      <Footer />

      {/* Wyskakujące okienka umieszczamy na samym dole (z najwyższym z-index) */}
      <NewsletterPopup />
      <CookieBanner />
    </>
  );
}
