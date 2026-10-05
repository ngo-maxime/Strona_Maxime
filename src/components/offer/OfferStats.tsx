// src/components/offer/OfferStats.tsx
// Komponent serwerowy – po stronie klienta działa tylko licznik (Counter).
import FadeIn from "@/components/ui/FadeIn";
import Counter from "./Counter";

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
  sublabel: string;
}

const statsData: StatItem[] = [
  {
    value: 45,
    suffix: "+",
    label: "Członków orkiestry",
    sublabel: "Wybitni instrumentaliści i soliści",
  },
  {
    value: 60,
    suffix: "+",
    label: "Zagranych Koncertów",
    sublabel: "Na scenach w Polsce i za granicą",
  },
  {
    value: 100,
    suffix: "%",
    label: "Autorskich aranżacji",
    sublabel: "Dedykowane partytury na życzenie",
  },
  {
    value: 20,
    suffix: "+",
    label: "Lokalizacji",
    sublabel: "Dni miast, amfiteatry i gale",
  },
];

export interface OfferStatsValues {
  members?: number;
  concerts?: number;
  locations?: number;
}

export default function OfferStats({
  values,
}: {
  values?: OfferStatsValues | null;
}) {
  const v = values ?? {};
  // Liczby edytowalne w Sanity (Ustawienia strony → Liczby na stronie)
  // Kolejność jak w statsData: członkowie, koncerty, aranżacje (stałe 100%), lokalizacje
  const overrides = [v.members, v.concerts, undefined, v.locations];
  const data: StatItem[] = statsData.map((item, i) => {
    const override = overrides[i];
    return typeof override === "number" ? { ...item, value: override } : item;
  });

  return (
    <section className="relative z-20 w-full border-y border-white/10 bg-black/40 py-16 backdrop-blur-md lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {data.map((stat, idx) => (
            <FadeIn key={stat.label} delay={`${idx * 150}ms`}>
              <div className="group flex flex-col">
                <span className="font-montserrat text-4xl leading-none font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </span>
                <span className="font-montserrat text-arylideYellow mt-3 text-xs font-bold tracking-widest uppercase sm:text-sm">
                  {stat.label}
                </span>
                <span className="font-montserrat mt-1 text-[0.7rem] font-light text-white/50">
                  {stat.sublabel}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
