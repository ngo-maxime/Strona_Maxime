// src/components/ui/FadeIn.tsx
//
// Animacja wejścia bez React-owego stanu i bez hydracji:
//  • komponent renderuje zwykły <div data-fade>,
//  • jeden globalny skrypt (FADE_IN_SCRIPT w app/layout.tsx) dodaje atrybut data-visible,
//    gdy element wjeżdża w ekran,
//  • MutationObserver obsługuje elementy dodane później (nawigacja, filtry, „Załaduj więcej”).
// Efekt wizualny identyczny jak wcześniej, ale treść pojawia się zaraz po wczytaniu HTML
// (nie czeka na załadowanie Reacta), a strona nie wysyła kilkudziesięciu komponentów klienckich.
import type { ReactNode } from "react";

export default function FadeIn({
  children,
  delay = "0ms",
  className = "",
}: {
  children: ReactNode;
  delay?: string;
  className?: string;
}) {
  return (
    <div
      data-fade=""
      // Atrybut data-visible dopisuje skrypt przed hydracją – to zamierzone
      suppressHydrationWarning
      className={`${className} translate-y-12 scale-[0.98] opacity-0 transition-[opacity,translate,scale] duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:scale-100 data-visible:opacity-100`}
      style={delay !== "0ms" ? { transitionDelay: delay } : undefined}
    >
      {children}
    </div>
  );
}

// Skrypt odsłaniający elementy [data-fade]:
//  • IntersectionObserver – zero odczytów geometrii podczas ładowania (brak „forced reflow”),
//  • po dojściu do końca strony odsłania wszystko, co zostało (np. pasek copyright w stopce
//    z overflow-hidden, którego przesunięty element obserwator mógłby nie zgłosić),
//  • MutationObserver obsługuje elementy dodane później (nawigacja, filtry, „Załaduj więcej”).
export const FADE_IN_SCRIPT = `(function(){var S="[data-fade]:not([data-visible])",d=document,f=0;function v(e){e.setAttribute("data-visible","")}function all(){d.querySelectorAll(S).forEach(v)}if(!("IntersectionObserver" in window)){all();new MutationObserver(all).observe(d.documentElement,{childList:true,subtree:true});return}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){v(e.target);io.unobserve(e.target)}})});function scan(n){if(n.matches&&n.matches(S))io.observe(n);if(n.querySelectorAll)n.querySelectorAll(S).forEach(function(e){io.observe(e)})}function end(){f=0;var el=d.documentElement;if(innerHeight+scrollY>=el.scrollHeight-8)all()}scan(d);addEventListener("scroll",function(){if(!f)f=requestAnimationFrame(end)},{passive:true});addEventListener("load",end);new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)scan(n)})})}).observe(d.documentElement,{childList:true,subtree:true})})();`;
