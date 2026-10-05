import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ConsentAnalytics from "@/components/analytics/ConsentAnalytics";
import GoogleConsent from "@/components/cookies/GoogleConsent";
import { FADE_IN_SCRIPT } from "@/components/ui/FadeIn";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/site";

export const viewport: Viewport = {
  themeColor: "#262626", // bg-raisinBlack
  colorScheme: "dark",
};

// Weryfikacja Google Search Console / Bing Webmaster Tools (metoda „tag HTML”)
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "music",
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} – ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  ...((googleVerification || bingVerification) && {
    verification: {
      ...(googleVerification && { google: googleVerification }),
      ...(bingVerification && {
        other: { "msvalidate.01": bingVerification },
      }),
    },
  }),
};

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});

// Czcionka odręczna – przycięta do znaków łacińskich i polskich (165 KB → 32 KB)
const fontYoungest = localFont({
  src: "../fonts/the-youngest-script.woff2",
  variable: "--font-youngest",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" data-scroll-behavior="smooth">
      <head>
        {/* Bez JavaScriptu treść animowana przez FadeIn jest od razu widoczna (roboty, czytniki) */}
        <noscript>
          <style>{`[data-fade]{opacity:1!important;translate:none!important;scale:none!important}`}</style>
        </noscript>
      </head>
      <body
        className={`${montserrat.variable} ${fontYoungest.variable} bg-raisinBlack font-montserrat selection:bg-arylideYellow selection:text-raisinBlack text-white antialiased`}
      >
        {/* Domyślny stan zgód Google Consent Mode v2 (wszystko „denied” do decyzji użytkownika) */}
        <GoogleConsent />
        {children}
        {/* Animacje wejścia sterowane jednym lekkim skryptem zamiast setek komponentów React */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: statyczny skrypt, bez danych użytkownika
          dangerouslySetInnerHTML={{ __html: FADE_IN_SCRIPT }}
        />
        <ConsentAnalytics />
      </body>
    </html>
  );
}
