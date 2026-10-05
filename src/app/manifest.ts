import type { MetadataRoute } from "next";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Maxime",
    description: DEFAULT_DESCRIPTION,
    lang: "pl",
    start_url: "/",
    display: "standalone",
    background_color: "#262626",
    theme_color: "#262626",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        // Wersja z marginesem bezpieczeństwa – Android przycina ją do koła/kształtu ikony
        src: "/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
