import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Ustawienia Główne",
  type: "document",
  fields: [
    defineField({
      name: "contact",
      title: "Dane kontaktowe",
      type: "object",
      fields: [
        defineField({
          name: "address",
          title: "Adres fizyczny",
          type: "text",
          rows: 3,
        }),
        defineField({ name: "email", title: "Adres e-mail", type: "string" }),
        defineField({ name: "phone", title: "Numer telefonu", type: "string" }),
      ],
    }),
    defineField({
      name: "socials",
      title: "Media społecznościowe",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platforma",
              type: "string",
              options: {
                list: [
                  "Facebook",
                  "Instagram",
                  "YouTube",
                  "LinkedIn",
                  "Patronite",
                  "TikTok",
                  "X (Twitter)",
                  "Inne",
                ],
              },
            }),
            defineField({
              name: "url",
              title: "Link URL",
              type: "url",
              // ZMIENIONO: Walidacja wymagająca poprawnego linku (http/https)
              validation: (rule) =>
                rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "author",
      title: "Wykonanie strony",
      type: "object",
      fields: [
        defineField({
          name: "name",
          title: "Imię i nazwisko / Nazwa firmy",
          type: "string",
        }),
        defineField({
          name: "url",
          title: "Link do portfolio / social mediów",
          type: "url",
          // ZMIENIONO: Walidacja wymagająca poprawnego linku (http/https)
          validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
        }),
      ],
    }),
    defineField({
      name: "media",
      title: "Zdjęcia sekcji „O nas”",
      description:
        "Zalecane: JPG, dłuższy bok 2000–3000 px. Punkt kadrowania (hotspot) wyznacza, co zostaje w kadrze.",
      type: "object",
      options: { collapsible: true },
      fields: [
        defineField({
          name: "homeAboutImage",
          title: "Strona główna – sekcja „Sztuka, która łączy pokolenia”",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Opis zdjęcia", type: "string" }),
          ],
        }),
        defineField({
          name: "aboutPageImage",
          title: "Podstrona „O nas” – zdjęcie przy historii",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Opis zdjęcia", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Liczby na stronie",
      description:
        "Wyświetlane na stronie głównej i w Ofercie. „Lata na scenie” liczą się automatycznie od 2022 roku.",
      type: "object",
      options: { collapsible: true },
      fields: [
        defineField({
          name: "events",
          title: "Wydarzenia (strona główna)",
          type: "number",
          initialValue: 50,
          validation: (rule) => rule.min(0).integer(),
        }),
        defineField({
          name: "concerts",
          title: "Zagrane koncerty (Oferta)",
          type: "number",
          initialValue: 60,
          validation: (rule) => rule.min(0).integer(),
        }),
        defineField({
          name: "members",
          title: "Członkowie orkiestry (Oferta)",
          type: "number",
          initialValue: 45,
          validation: (rule) => rule.min(0).integer(),
        }),
        defineField({
          name: "locations",
          title: "Lokalizacje (Oferta)",
          type: "number",
          initialValue: 20,
          validation: (rule) => rule.min(0).integer(),
        }),
      ],
    }),
    defineField({
      name: "legal",
      title: "Dane rejestrowe fundacji",
      description:
        "Pojawiają się w polityce prywatności, regulaminie i danych dla Google. Puste pola są ukrywane.",
      type: "object",
      options: { collapsible: true },
      fields: [
        defineField({ name: "krs", title: "KRS", type: "string" }),
        defineField({ name: "nip", title: "NIP", type: "string" }),
        defineField({ name: "regon", title: "REGON", type: "string" }),
      ],
    }),
    defineField({
      name: "documents",
      title: "Dokumenty do pobrania (PDF)",
      description:
        "Po dodaniu pliku na stronie pojawi się przycisk „Pobierz pełną wersję prawną (PDF)”.",
      type: "object",
      options: { collapsible: true },
      fields: [
        defineField({
          name: "privacyPdf",
          title: "Polityka prywatności (PDF)",
          type: "file",
          options: { accept: "application/pdf" },
        }),
        defineField({
          name: "termsPdf",
          title: "Regulamin (PDF)",
          type: "file",
          options: { accept: "application/pdf" },
        }),
      ],
    }),
  ],
});
