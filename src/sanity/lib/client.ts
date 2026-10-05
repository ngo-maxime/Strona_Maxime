// src/sanity/lib/client.ts
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Strony są statyczne (ISR) i odświeżane webhookiem – zapytania trafiają do Sanity
  // rzadko, więc pobieramy zawsze najświeższe dane prosto z API (bez opóźnień CDN).
  useCdn: false,
  perspective: "published",
});
