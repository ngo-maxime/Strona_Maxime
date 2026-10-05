// src/app/(user)/page.tsx
import About from "@/components/home/About";
import CallToAction from "@/components/home/CallToAction";
import Hero from "@/components/home/Hero";
import LatestUpdates from "@/components/home/LatestUpdates";
import Testimonials from "@/components/home/Testimonials";
import Values from "@/components/home/Values";
import JsonLd from "@/components/seo/JsonLd";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  pageJsonLd,
  pageMetadata,
} from "@/lib/site";

// Strona w całości statyczna (ISR) – Suspense nie jest potrzebny, HTML trafia z CDN od razu kompletny
export const metadata = pageMetadata({ path: "/" });

export default function HomePage() {
  return (
    <div className="bg-raisinBlack flex min-h-screen flex-col">
      <JsonLd
        data={pageJsonLd({
          name: DEFAULT_TITLE,
          description: DEFAULT_DESCRIPTION,
          path: "/",
        })}
      />
      <Hero />
      <About />
      <Testimonials />
      <LatestUpdates />
      <Values />
      <CallToAction />
    </div>
  );
}
