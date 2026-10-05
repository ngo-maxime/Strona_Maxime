"use client";

// Licznik animowany od 0 do wartości docelowej, gdy pojawi się na ekranie.
// Czytniki ekranu i roboty od razu dostają prawdziwą wartość (sr-only).
import { useEffect, useRef, useState } from "react";

export default function Counter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;

    const run = () => {
      const duration = 2000;
      let start: number | null = null;
      const step = (t: number) => {
        if (start === null) start = t;
        const progress = Math.min((t - start) / duration, 1);
        // Płynne zwolnienie pod koniec (easeOutExpo)
        const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
        setCount(Math.floor(eased * target));
        if (progress < 1) frame = requestAnimationFrame(step);
        else setCount(target);
      };
      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return (
    <>
      <span className="sr-only">
        {target}
        {suffix}
      </span>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {count}
        <span className="text-arylideYellow ml-0.5">{suffix}</span>
      </span>
    </>
  );
}
