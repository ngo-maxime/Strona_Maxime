"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ActiveLinks from "@/components/ui/ActiveLinks";
import { mainLinks } from "@/data/navigation";

// Odbiera tylko gotowego stringa z url, a nie cały kontekst Sanity
export default function NavbarInteractive({
  patroniteUrl,
}: {
  patroniteUrl: string;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="animate-slide-down fixed top-0 right-0 left-0 z-100 flex justify-center px-4 pt-4 lg:px-6 lg:pt-6">
        <nav
          className={`flex w-full items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? "bg-raisinBlack/85 max-w-7xl rounded-full border border-white/10 px-8 py-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl"
              : "max-w-7xl rounded-none border-transparent bg-transparent px-0 py-2"
          }`}
        >
          <Link href="/" className="flex shrink-0 items-center lg:mr-4 xl:mr-8">
            <Image
              src="/logo.svg"
              alt="Maxime Logo"
              width={160}
              height={55}
              priority
              className="h-10 w-auto brightness-0 invert lg:h-10 xl:h-14"
            />
          </Link>

          <ul className="hidden grow justify-center lg:flex lg:gap-2.5 xl:gap-6 2xl:gap-8">
            <ActiveLinks links={mainLinks} variant="header" />
          </ul>

          <div className="hidden shrink-0 lg:ml-4 lg:block xl:ml-8">
            <Link
              href={patroniteUrl}
              target="_blank"
              className="group border-arylideYellow font-montserrat text-arylideYellow hover:bg-arylideYellow hover:text-raisinBlack relative flex items-center justify-center rounded-full border bg-transparent px-8 py-3 text-[0.7rem] font-bold uppercase transition-all duration-500 lg:px-5 lg:py-2 lg:text-[0.65rem] lg:tracking-[0.15em] xl:px-8 xl:py-3 xl:text-[0.7rem] xl:tracking-[0.2em]"
            >
              Wesprzyj nas
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 lg:hidden"
            aria-label="Otwórz menu"
          >
            <span className="h-0.5 w-6 bg-white" />
            <span className="h-0.5 w-4 bg-white" />
          </button>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-110 flex justify-end transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Zamknij menu"
          className={`bg-raisinBlack/60 absolute inset-0 backdrop-blur-sm transition-opacity duration-700 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`bg-raisinBlack relative flex h-full w-full max-w-sm flex-col justify-between border-l border-white/10 p-8 shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[80%] ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <Image
              src="/logo.svg"
              alt="Maxime Logo"
              width={180}
              height={60}
              className="h-12 w-auto brightness-0 invert"
            />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl text-white"
              aria-label="Zamknij menu"
            >
              ✕
            </button>
          </div>

          <ul className="flex flex-col gap-6 pt-12">
            <ActiveLinks
              links={mainLinks}
              variant="mobile"
              isMobileMenuOpen={isMobileMenuOpen}
              onMobileClick={() => setIsMobileMenuOpen(false)}
            />
          </ul>

          <div className="mt-auto pb-8">
            <Link
              href={patroniteUrl}
              target="_blank"
              className="bg-arylideYellow font-montserrat text-raisinBlack flex w-full items-center justify-center rounded-full py-5 text-xs font-bold tracking-[0.2em] uppercase"
            >
              Wesprzyj nas
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
