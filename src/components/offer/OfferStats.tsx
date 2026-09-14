// src/components/oferta/OfferStats.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import FadeIn from "@/components/ui/FadeIn";

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
    label: "Zagranym koncertów",
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
    label: "Miast i festiwali",
    sublabel: "Dni miast, amfiteatry i gale",
  },
];

function Counter({
  target,
  suffix = "",
  shouldStart,
}: {
  target: number;
  suffix?: string;
  shouldStart: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    const duration = 2000; // 2 sekundy animacji
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Płynne zwolnienie pod koniec (easeOutExpo)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeOut * target);

      setCount(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    window.requestAnimationFrame(step);
  }, [shouldStart, target]);

  return (
    <span className="tabular-nums">
      {count}
      <span className="text-arylideYellow ml-0.5">{suffix}</span>
    </span>
  );
}

export default function OfferStats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-20 w-full border-y border-white/10 bg-black/40 py-16 backdrop-blur-md lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {statsData.map((stat, idx) => (
            <FadeIn key={stat.label} delay={`${idx * 150}ms`}>
              <div className="group flex flex-col">
                <span className="font-montserrat text-4xl leading-none font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  <Counter
                    target={stat.value}
                    suffix={stat.suffix}
                    shouldStart={isVisible}
                  />
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
