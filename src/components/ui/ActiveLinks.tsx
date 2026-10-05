"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

type ActiveLinksProps = {
  links: { name: string; path: string }[];
  variant?: "header" | "footer" | "mobile";
  onMobileClick?: () => void;
  isMobileMenuOpen?: boolean;
};

export default function ActiveLinks({
  links,
  variant = "header",
  onMobileClick,
  isMobileMenuOpen,
}: ActiveLinksProps) {
  const pathname = usePathname();

  // Podświetlenie także na podstronach sekcji (np. /wydarzenia/koncert → „Wydarzenia”)
  const isActivePath = (path: string) =>
    pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));

  // Kliknięcie w bieżącą stronę: płynny powrót na górę (sam <Link> nic by nie zrobił)
  const handleClick =
    (path: string, extra?: () => void) =>
    (e: MouseEvent<HTMLAnchorElement>) => {
      extra?.();
      if (pathname === path) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

  return (
    <>
      {links.map((link, i) => {
        const isActive = isActivePath(link.path);
        const current = isActive ? ("page" as const) : undefined;

        if (variant === "footer") {
          return (
            <li key={link.name}>
              <Link
                href={link.path}
                aria-current={current}
                onClick={handleClick(link.path)}
                className="group flex items-center gap-3"
              >
                <span
                  aria-hidden="true"
                  className={`bg-arylideYellow block h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? "scale-100 opacity-100"
                      : "scale-0 opacity-0 group-hover:scale-50 group-hover:opacity-50"
                  }`}
                />
                <span
                  className={`font-montserrat text-sm tracking-widest uppercase transition-all duration-300 ${
                    isActive
                      ? "text-arylideYellow translate-x-1 font-bold"
                      : "font-medium text-white/70 group-hover:translate-x-2 group-hover:text-white"
                  }`}
                >
                  {link.name}
                </span>
              </Link>
            </li>
          );
        }

        if (variant === "mobile") {
          return (
            <li
              key={link.name}
              className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isMobileMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "translate-x-12 opacity-0"
              }`}
              style={{ transitionDelay: `${150 + i * 75}ms` }}
            >
              <Link
                href={link.path}
                aria-current={current}
                onClick={handleClick(link.path, onMobileClick)}
                className={`group flex items-center gap-4 text-3xl leading-tight tracking-wide transition-all duration-300 ${
                  isActive
                    ? "text-arylideYellow font-medium translate-x-2" // Wyróżnienie aktywnej strony
                    : "text-white font-light hover:translate-x-2 hover:text-white/80"
                }`}
              >
                {/* Optyczny wskaźnik dla aktywnej strony (kropka) */}
                <span
                  aria-hidden="true"
                  className={`bg-arylideYellow block rounded-full transition-all duration-300 ${
                    isActive ? "h-2.5 w-2.5 opacity-100" : "h-0 w-0 opacity-0"
                  }`}
                />
                {link.name}
              </Link>
            </li>
          );
        }

        // Domyślnie Header
        return (
          <li key={link.name}>
            <Link
              href={link.path}
              aria-current={current}
              onClick={handleClick(link.path)}
              className={`group font-montserrat relative block py-2 text-[0.75rem] font-medium whitespace-nowrap uppercase transition-colors lg:text-[0.65rem] lg:tracking-widest xl:text-[0.8rem] xl:tracking-[0.15em] ${
                isActive
                  ? "text-arylideYellow"
                  : "hover:text-arylideYellow text-white"
              }`}
            >
              {link.name}
              <span
                aria-hidden="true"
                className={`bg-arylideYellow absolute -bottom-1 left-1/2 h-0.5 -translate-x-1/2 transition-all duration-300 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          </li>
        );
      })}
    </>
  );
}
