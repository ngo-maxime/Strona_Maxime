"use client";

// Link do strony głównej (logo w menu, menu mobilnym i stopce).
// Zawsze prowadzi do sekcji Hero: z podstron – zwykła nawigacja (Next.js przewija na górę),
// na stronie głównej – płynne przewinięcie na samą górę (sam <Link> nic by nie zrobił).
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function HomeLink({
  children,
  className,
  ariaLabel = "Maxime – strona główna",
  onNavigate,
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  /** np. zamknięcie menu mobilnego */
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        if (pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          if (window.location.hash) history.replaceState(null, "", "/");
        }
      }}
    >
      {children}
    </Link>
  );
}
