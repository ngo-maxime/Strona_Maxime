"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Image from "@/components/ui/CmsImage";
import FadeIn from "@/components/ui/FadeIn";

export interface EventProps {
  id: string;
  day: string;
  month: string;
  year: string;
  title: string;
  location: string;
  time: string;
  image: string;
  date: string; // DODANO: Potrzebne do precyzyjnego sortowania w sekcjach
  isPast?: boolean;
}

const allMonths = [
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

type FiltersProps = {
  years: string[];
  activeYear: string | null;
  onYear: (year: string | null) => void;
  activeMonth: string;
  onMonth: (month: string) => void;
  monthsWithEvents: Set<string>;
  compact?: boolean;
};

// Filtry: dyskretny wybór roku (kliknięcie aktywnego roku = wszystkie lata) + miesiące.
// Miesiące bez wydarzeń w wybranym roku są przygaszone i nieaktywne.
function Filters({
  years,
  activeYear,
  onYear,
  activeMonth,
  onMonth,
  monthsWithEvents,
  compact = false,
}: FiltersProps) {
  return (
    <>
      {years.length > 1 && (
        <ul
          aria-label="Filtr lat"
          className={`flex flex-wrap gap-x-4 gap-y-2 ${compact ? "mb-3" : "mb-8"}`}
        >
          {years.map((year) => {
            const active = activeYear === year;
            return (
              <li key={year}>
                <button
                  type="button"
                  onClick={() => onYear(active ? null : year)}
                  aria-pressed={active}
                  className={`font-montserrat rounded-full border px-3 py-1 text-[0.65rem] tracking-[0.2em] transition-colors duration-300 ${
                    active
                      ? "border-oxfordBlue bg-oxfordBlue font-bold text-white"
                      : "border-raisinBlack/15 text-raisinBlack/50 hover:border-raisinBlack/40 hover:text-raisinBlack font-medium"
                  }`}
                >
                  {year}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <ul
        aria-label="Filtr miesięcy"
        className={`hide-scrollbar flex overflow-x-auto ${
          compact
            ? "pb-3"
            : "pt-2 pb-6 lg:flex-col lg:gap-4 lg:overflow-visible lg:pb-0"
        }`}
      >
        {["Wszystkie", ...allMonths].map((month) => {
          const active = activeMonth === month;
          const disabled =
            month !== "Wszystkie" && !monthsWithEvents.has(month);
          return (
            <li key={month} className="mr-6 shrink-0 lg:mr-0">
              <button
                type="button"
                onClick={() => onMonth(month)}
                aria-pressed={active}
                disabled={disabled}
                className="group flex flex-col items-start disabled:cursor-default"
              >
                <span
                  className={`font-montserrat text-sm tracking-widest uppercase transition-colors duration-300 ${
                    active
                      ? "text-oxfordBlue font-bold"
                      : disabled
                        ? "text-raisinBlack/15 font-medium"
                        : "text-raisinBlack/40 group-hover:text-raisinBlack font-medium"
                  }`}
                >
                  {month}
                </span>
                <div
                  className={`bg-oxfordBlue mt-2 h-0.5 transition-all duration-500 ${
                    active ? "w-full" : disabled ? "w-0" : "w-0 group-hover:w-6"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function EventsList({
  eventsData,
}: {
  eventsData: EventProps[];
}) {
  const [activeMonth, setActiveMonth] = useState("Wszystkie");
  const [activeYear, setActiveYear] = useState<string | null>(null);

  // Lata obecne w danych (od najnowszego)
  const years = useMemo(
    () =>
      Array.from(new Set(eventsData.map((e) => e.year))).sort(
        (a, b) => Number(b) - Number(a),
      ),
    [eventsData],
  );

  // Miesiące, w których są wydarzenia (w wybranym roku lub we wszystkich latach)
  const monthsWithEvents = useMemo(
    () =>
      new Set(
        eventsData
          .filter((e) => !activeYear || e.year === activeYear)
          .map((e) => e.month),
      ),
    [eventsData, activeYear],
  );

  const handleYear = (year: string | null) => {
    setActiveYear(year);
    // Wybrany miesiąc nie istnieje w nowym roku → pokazujemy cały rok
    const stillValid = eventsData.some(
      (e) => (!year || e.year === year) && e.month === activeMonth,
    );
    if (activeMonth !== "Wszystkie" && !stillValid) setActiveMonth("Wszystkie");
  };

  const handleMonth = (month: string) => {
    setActiveMonth(month);
    // Po zmianie filtra na telefonie wracamy na początek listy (pasek filtrów jest przyklejony)
    const list = document.getElementById("lista-wydarzen");
    if (list && list.getBoundingClientRect().top < 0) {
      list.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filteredEvents = eventsData.filter(
    (event) =>
      (!activeYear || event.year === activeYear) &&
      (activeMonth === "Wszystkie" || event.month === activeMonth),
  );

  // Nadchodzące: najbliższe pierwsze. Archiwum: ostatnie minione pierwsze.
  const upcomingEvents = filteredEvents
    .filter((event) => !event.isPast)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = filteredEvents
    .filter((event) => event.isPast)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filterProps = {
    years,
    activeYear,
    onYear: handleYear,
    activeMonth,
    onMonth: handleMonth,
    monthsWithEvents,
  };

  return (
    <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
      {/* --- MENU FILTROWANIA (komputer: przyklejone do ekranu podczas przewijania) --- */}
      {/* self-stretch: kolumna ma wysokość listy, więc element sticky ma po czym „jechać” */}
      <div className="relative lg:col-span-3 lg:self-stretch">
        <div className="lg:sticky lg:top-40">
          <FadeIn>
            <h2 className="font-youngest text-raisinBlack mb-8 text-5xl">
              Wybierz miesiąc
            </h2>
            <div className="hidden lg:block">
              <Filters {...filterProps} />
            </div>
          </FadeIn>
        </div>
      </div>

      {/* --- WYNIKI FILTROWANIA --- */}
      <div
        id="lista-wydarzen"
        className="-mt-12 scroll-mt-28 lg:col-span-9 lg:mt-0"
      >
        {/* --- FILTRY NA TELEFONIE: przyklejony pasek pod menu --- */}
        <div className="sticky top-24 z-30 -mx-6 mb-8 border-raisinBlack/10 border-b bg-[#F4F4F5]/95 px-6 pt-3 backdrop-blur-md lg:hidden">
          <Filters {...filterProps} compact />
        </div>

        <div className="flex flex-col">
          {/* =================================================== */}
          {/* --- SEKCE 1: NADCHODZĄCE WYDARZENIA --- */}
          {/* =================================================== */}
          {upcomingEvents.length > 0 && (
            <div className="mb-8">
              <FadeIn>
                <div className="mb-6 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="relative flex h-2.5 w-2.5"
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  </span>
                  <h3 className="font-montserrat text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase">
                    Nadchodzące koncerty ({upcomingEvents.length})
                  </h3>
                </div>
              </FadeIn>

              <div className="border-raisinBlack/10 flex flex-col border-t">
                {upcomingEvents.map((event, index) => (
                  <FadeIn key={event.id} delay={`${index * 150}ms`}>
                    <div className="group border-raisinBlack/10 relative overflow-hidden border-b px-4 py-8 transition-colors lg:px-10 lg:py-12">
                      <div className="bg-oxfordBlue absolute inset-0 z-0 origin-bottom scale-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />

                      <div className="pointer-events-none absolute top-1/2 right-[5%] z-10 h-32 w-24 translate-x-8 -translate-y-1/2 scale-50 rotate-12 overflow-hidden rounded-md opacity-0 shadow-2xl transition-all duration-600 ease-out group-hover:translate-x-0 group-hover:scale-100 group-hover:-rotate-3 group-hover:opacity-100 md:h-40 md:w-28 lg:right-[20%]">
                        <Image
                          src={event.image || "/video-poster.webp"}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 96px, 112px"
                        />
                      </div>

                      <div className="relative z-20 flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
                        <div className="flex items-center gap-6 md:w-[25%] lg:w-1/4 lg:pr-6 xl:pr-0">
                          <span className="font-montserrat text-raisinBlack text-6xl leading-none font-black tracking-tighter transition-colors duration-500 group-hover:text-white lg:text-7xl">
                            {event.day}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-youngest text-oxfordBlue group-hover:text-arylideYellow mb-1 text-3xl transition-colors duration-500">
                              {event.month}
                            </span>
                            <span className="font-montserrat text-raisinBlack/40 text-[0.65rem] font-bold tracking-widest uppercase transition-colors duration-500 group-hover:text-white/50">
                              {event.year}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col md:w-[45%] lg:w-[42%] lg:pl-10 xl:w-2/4 xl:pl-0">
                          <h3 className="font-montserrat text-raisinBlack mb-2 text-2xl leading-tight font-bold transition-colors duration-500 group-hover:text-white lg:text-4xl">
                            {event.title}
                          </h3>
                          <span className="font-montserrat text-raisinBlack/60 text-[0.65rem] font-semibold tracking-widest uppercase transition-colors duration-500 group-hover:text-white/70">
                            {event.location} • {event.time}
                          </span>
                        </div>

                        <div className="flex w-full items-center md:w-[30%] md:justify-end lg:w-1/4">
                          <Link
                            href={`/wydarzenia/${event.id}`}
                            aria-label={`Zobacz więcej: ${event.title}`}
                            className="group/btn bg-raisinBlack font-montserrat group-hover:bg-arylideYellow group-hover:text-oxfordBlue relative flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-[0.65rem] font-bold tracking-[0.2em] text-white uppercase transition-all duration-500 hover:scale-105 md:inline-flex md:w-auto"
                          >
                            Zobacz więcej
                            <svg
                              aria-hidden="true"
                              className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 5l7 7m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}

          {/* =================================================== */}
          {/* --- SEKCE 2: MINIONE WYDARZENIA (ARCHIWUM) --- */}
          {/* =================================================== */}
          {pastEvents.length > 0 && (
            <div
              className={
                upcomingEvents.length > 0
                  ? "border-raisinBlack/15 mt-24 border-t-2 border-dashed pt-12 lg:mt-32 lg:pt-16"
                  : ""
              }
            >
              <FadeIn>
                <div className="mb-6 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="bg-raisinBlack/30 h-2 w-2 rounded-full"
                  />
                  <h3 className="font-montserrat text-raisinBlack/40 text-xs font-bold tracking-[0.2em] uppercase">
                    Archiwum koncertów ({pastEvents.length})
                  </h3>
                </div>
              </FadeIn>

              <div className="border-raisinBlack/10 flex flex-col border-t">
                {pastEvents.map((event, index) => (
                  <FadeIn key={event.id} delay={`${index * 100}ms`}>
                    {/* ZMIENIONO: Przezroczystość na 50% dla uśpionego wyglądu, wraca do 100% po najechaniu myszką */}
                    <div className="group border-raisinBlack/10 relative overflow-hidden border-b px-4 py-8 opacity-50 transition-all duration-500 hover:opacity-100 lg:px-10 lg:py-12">
                      {/* Delikatne, szare podświetlenie tła zamiast ostrego niebieskiego */}
                      <div className="bg-raisinBlack/5 absolute inset-0 z-0 origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100" />

                      {/* Plakat minionego wydarzenia staje się kolorowy z czarno-białego */}
                      <div className="pointer-events-none absolute top-1/2 right-[5%] z-10 h-32 w-24 translate-x-8 -translate-y-1/2 scale-50 rotate-12 overflow-hidden rounded-md opacity-0 shadow-2xl transition-all duration-600 ease-out group-hover:translate-x-0 group-hover:scale-100 group-hover:-rotate-3 group-hover:opacity-100 md:h-40 md:w-28 lg:right-[20%]">
                        <Image
                          src={event.image || "/video-poster.webp"}
                          alt=""
                          fill
                          className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                          sizes="(max-width: 768px) 96px, 112px"
                        />
                      </div>

                      <div className="relative z-20 flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
                        <div className="flex items-center gap-6 md:w-[25%] lg:w-1/4 lg:pr-6 xl:pr-0">
                          <span className="font-montserrat text-raisinBlack/40 group-hover:text-raisinBlack text-6xl leading-none font-black tracking-tighter transition-colors duration-500 lg:text-7xl">
                            {event.day}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-youngest text-raisinBlack/50 group-hover:text-oxfordBlue mb-1 text-3xl transition-colors duration-500">
                              {event.month}
                            </span>
                            <span className="font-montserrat text-raisinBlack/30 text-[0.65rem] font-bold tracking-widest uppercase transition-colors duration-500">
                              {event.year}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col md:w-[45%] lg:w-[42%] lg:pl-10 xl:w-2/4 xl:pl-0">
                          <h3 className="font-montserrat text-raisinBlack/70 group-hover:text-raisinBlack mb-2 text-2xl leading-tight font-bold transition-colors duration-500 lg:text-4xl">
                            {event.title}
                          </h3>
                          <span className="font-montserrat text-raisinBlack/40 text-[0.65rem] font-semibold tracking-widest uppercase">
                            {event.location} • {event.time}
                          </span>
                        </div>

                        <div className="flex w-full items-center md:w-[30%] md:justify-end lg:w-1/4">
                          {/* Subtelniejszy przycisk w ramce dla sekcji archiwalnej */}
                          <Link
                            href={`/wydarzenia/${event.id}`}
                            aria-label={`Szczegóły: ${event.title}`}
                            className="font-montserrat border-raisinBlack/20 hover:bg-raisinBlack text-raisinBlack/60 relative flex w-full items-center justify-center gap-3 rounded-full border px-8 py-4 text-[0.65rem] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:text-white md:inline-flex md:w-auto"
                          >
                            Szczegóły
                            <svg
                              aria-hidden="true"
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 5l7 7m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Jeśli brak jakichkolwiek koncertów w danym filtrze */}
        {filteredEvents.length === 0 && (
          <div className="py-20 text-center">
            <FadeIn>
              <span className="font-youngest text-raisinBlack/30 text-4xl">
                Obecnie nie ma wydarzeń w tym miesiącu.
              </span>
            </FadeIn>
          </div>
        )}
      </div>
    </div>
  );
}
