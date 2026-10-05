// Formatowanie dat zawsze w strefie Europe/Warsaw.
// Serwery Vercel działają w UTC – bez tego godziny wydarzeń byłyby przesunięte o 1–2 h,
// a wydarzenia o północy mogły trafiać na zły dzień.
const TIME_ZONE = "Europe/Warsaw";

const partsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export interface WarsawDateParts {
  day: number;
  monthIndex: number;
  year: number;
  hours: string;
  minutes: string;
}

export function getWarsawParts(input: string | Date): WarsawDateParts {
  const date = typeof input === "string" ? new Date(input) : input;
  const parts = Object.fromEntries(
    partsFormatter.formatToParts(date).map((p) => [p.type, p.value]),
  );
  return {
    day: Number(parts.day),
    monthIndex: Number(parts.month) - 1,
    year: Number(parts.year),
    hours: parts.hour,
    minutes: parts.minute,
  };
}

/** Data samodzielna (np. pole Sanity typu `date` "2025-06-14") – bez przesunięć strefy. */
export function parsePlainDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return { day: d, monthIndex: m - 1, year: y };
}

export const MONTHS_NOMINATIVE = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];

export const MONTHS_GENITIVE = [
  "Stycznia",
  "Lutego",
  "Marca",
  "Kwietnia",
  "Maja",
  "Czerwca",
  "Lipca",
  "Sierpnia",
  "Września",
  "Października",
  "Listopada",
  "Grudnia",
];

export const MONTHS_SHORT = [
  "STY",
  "LUT",
  "MAR",
  "KWI",
  "MAJ",
  "CZE",
  "LIP",
  "SIE",
  "WRZ",
  "PAŹ",
  "LIS",
  "GRU",
];
