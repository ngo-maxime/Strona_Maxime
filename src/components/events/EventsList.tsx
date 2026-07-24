"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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

export default function EventsList({
  eventsData,
}: {
  eventsData: EventProps[];
}) {
  const [activeMonth, setActiveMonth] = useState("Wszystkie");

  // Filtrujemy według miesiąca
  const filteredEvents =
    activeMonth === "Wszystkie"
      ? eventsData
      : eventsData.filter((event) => event.month === activeMonth);

  // ZMIENIONO: Rozdzielamy wydarzenia na nadchodzące i minione z dedykowanym sortowaniem
  const upcomingEvents = filteredEvents
    .filter((event) => !event.isPast)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Najbliższe jako pierwsze

  const pastEvents = filteredEvents
    .filter((event) => event.isPast)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Ostatnie minione jako pierwsze

  return (
    <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12 lg:gap-8">
      {/* --- MENU FILTROWANIA --- */}
      <div className="relative lg:col-span-3">
        <div className="lg:sticky lg:top-40">
          <FadeIn>
            <h2 className="font-youngest text-raisinBlack mb-8 text-5xl">
              Wybierz miesiąc
            </h2>
            <ul className="hide-scrollbar flex overflow-x-auto pt-2 pb-6 lg:flex-col lg:gap-4 lg:overflow-visible lg:pb-0">
              <li className="mr-6 shrink-0 lg:mr-0">
                <button
                  type="button"
                  onClick={() => setActiveMonth("Wszystkie")}
                  className="group flex flex-col items-start"
                >
                  <span
                    className={`font-montserrat text-sm tracking-widest uppercase transition-colors duration-300 ${activeMonth === "Wszystkie" ? "text-oxfordBlue font-bold" : "text-raisinBlack/40 group-hover:text-raisinBlack font-medium"}`}
                  >
                    Wszystkie
                  </span>
                  <div
                    className={`bg-oxfordBlue mt-2 h-0.5 transition-all duration-500 ${activeMonth === "Wszystkie" ? "w-full" : "w-0 group-hover:w-6"}`}
                  />
                </button>
              </li>
              {allMonths.map((month) => (
                <li key={month} className="mr-6 shrink-0 lg:mr-0">
                  <button
                    type="button"
                    onClick={() => setActiveMonth(month)}
                    className="group flex flex-col items-start"
                  >
                    <span
                      className={`font-montserrat text-sm tracking-widest uppercase transition-colors duration-300 ${activeMonth === month ? "text-oxfordBlue font-bold" : "text-raisinBlack/40 group-hover:text-raisinBlack font-medium"}`}
                    >
                      {month}
                    </span>
                    <div
                      className={`bg-oxfordBlue mt-2 h-0.5 transition-all duration-500 ${activeMonth === month ? "w-full" : "w-0 group-hover:w-6"}`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>

      {/* --- WYNIKI FILTROWANIA --- */}
      <div className="lg:col-span-9">
        <div className="flex flex-col">
          {/* =================================================== */}
          {/* --- SEKCE 1: NADCHODZĄCE WYDARZENIA --- */}
          {/* =================================================== */}
          {upcomingEvents.length > 0 && (
            <div className="mb-8">
              <FadeIn>
                <div className="mb-6 flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
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
                          alt={`Plakat ${event.title}`}
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
                            className="group/btn bg-raisinBlack font-montserrat group-hover:bg-arylideYellow group-hover:text-oxfordBlue relative flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-[0.65rem] font-bold tracking-[0.2em] text-white uppercase transition-all duration-500 hover:scale-105 md:inline-flex md:w-auto"
                          >
                            Zobacz więcej
                            <svg
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
            <div className={upcomingEvents.length > 0 ? "mt-16" : ""}>
              <FadeIn>
                <div className="mb-6 flex items-center gap-2">
                  <span className="bg-raisinBlack/30 h-2 w-2 rounded-full"></span>
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
                          alt={`Plakat ${event.title}`}
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
                            className="font-montserrat border-raisinBlack/20 hover:bg-raisinBlack text-raisinBlack/60 relative flex w-full items-center justify-center gap-3 rounded-full border px-8 py-4 text-[0.65rem] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:text-white md:inline-flex md:w-auto"
                          >
                            Szczegóły
                            <svg
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
