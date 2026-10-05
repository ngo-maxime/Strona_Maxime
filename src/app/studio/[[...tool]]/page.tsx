/**
 * Sanity Studio (panel CMS) pod adresem /studio.
 * https://github.com/sanity-io/next-sanity
 */
// src/app/studio/[[...tool]]

import type { Metadata } from "next";
import { NextStudio, metadata as studioMetadata } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export { viewport } from "next-sanity/studio";

// Panel administracyjny nie może trafić do wyników wyszukiwania
export const metadata: Metadata = {
  ...studioMetadata,
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}
