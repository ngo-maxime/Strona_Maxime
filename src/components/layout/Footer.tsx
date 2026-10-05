import Image from "next/image";
import Link from "next/link";
import CookieManagerButton from "@/components/cookies/CookieManagerButton";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import ActiveLinks from "@/components/ui/ActiveLinks";
import FadeIn from "@/components/ui/FadeIn";
import {
  copyrightText,
  getSocialIcon,
  legalLinks,
  mainLinks,
} from "@/data/navigation";
import { getSiteSettings } from "@/sanity/lib/settings";
import HomeLink from "./HomeLink";

export default async function Footer() {
  // Ustawienia z Sanity (współdzielone z Navbarem – jedno zapytanie na render).
  // Brakujące pola w CMS ukrywają dany element zamiast wywracać całą stronę.
  const { contact = {}, socials = [], author = {} } = await getSiteSettings();

  const footerLinks = mainLinks;

  return (
    <footer className="bg-raisinBlack relative z-50 w-full overflow-hidden pt-24 lg:pt-32">
      <div className="pointer-events-none absolute -bottom-2 left-1/2 z-0 w-full -translate-x-1/2 text-center opacity-[0.03] select-none sm:-bottom-4 lg:-bottom-10">
        <span
          aria-hidden="true"
          data-deco="MAXIME"
          className="font-montserrat block w-full text-[20vw] leading-none font-black text-white md:text-[22vw] lg:text-[22vw] before:content-[attr(data-deco)]"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 border-b border-white/10 pb-16 lg:grid-cols-12 lg:gap-12 lg:pb-24">
          <div className="flex flex-col items-start lg:col-span-4">
            <FadeIn>
              <HomeLink className="mb-8 block">
                <Image
                  src="/logo.svg"
                  alt="Maxime Logo"
                  width={160}
                  height={55}
                  className="h-10 w-auto lg:h-12"
                />
              </HomeLink>
              <span className="font-youngest text-arylideYellow mb-12 block text-4xl">
                Z pasji do muzyki.
              </span>

              <div className="flex flex-col gap-6">
                <div className="group flex flex-col">
                  <p>
                    Odkryj z nami maksymalną jakość, maksymalne zaangażowanie
                    oraz maksymalną radość z muzyki.
                  </p>
                </div>

                <div className="group flex flex-col">
                  <span className="font-montserrat mb-1 text-[0.6rem] font-bold tracking-[0.3em] text-white/40 uppercase">
                    Kontakt
                  </span>
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="font-montserrat hover:text-arylideYellow text-sm font-light text-white/80 transition-colors"
                    >
                      {contact.email}
                    </a>
                  )}
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                      className="font-montserrat hover:text-arylideYellow mt-1 text-sm font-light text-white/80 transition-colors"
                    >
                      {contact.phone}
                    </a>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="flex flex-col lg:col-span-3 lg:col-start-6">
            <FadeIn delay="200ms">
              <span className="font-montserrat mb-8 block text-[0.65rem] font-bold tracking-[0.4em] text-white/30 uppercase">
                Eksploruj
              </span>
              <ul className="flex flex-col gap-4">
                <ActiveLinks links={footerLinks} variant="footer" />
              </ul>
            </FadeIn>
          </div>

          <div className="flex flex-col lg:col-span-4">
            <FadeIn delay="400ms">
              <span className="font-montserrat mb-8 block text-[0.65rem] font-bold tracking-[0.4em] text-white/30 uppercase">
                Newsletter
              </span>
              <p className="font-montserrat mb-6 text-sm leading-relaxed font-light text-white/60">
                Bądź na bieżąco z nadchodzącymi wydarzeniami.
              </p>

              <NewsletterForm variant="dark" />

              <div className="mt-16">
                <span className="font-montserrat mb-6 block text-[0.65rem] font-bold tracking-[0.4em] text-white/30 uppercase">
                  Media społecznościowe
                </span>
                <ul className="flex flex-wrap gap-4">
                  {socials.map((social: { platform: string; url: string }) => (
                    <li key={social.platform}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group hover:border-arylideYellow hover:bg-arylideYellow hover:text-raisinBlack flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:-translate-y-1"
                        aria-label={social.platform}
                      >
                        {getSocialIcon(social.platform)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-8 py-8 lg:flex-row lg:gap-0">
          <FadeIn
            delay="600ms"
            className="flex flex-col items-center gap-4 lg:items-start lg:gap-2"
          >
            <span className="font-montserrat text-xs font-light text-white/40">
              {copyrightText}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className="font-montserrat text-[0.65rem] font-medium tracking-widest text-white/30 uppercase transition-colors hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
              <CookieManagerButton />
            </div>
          </FadeIn>

          <FadeIn delay="800ms" className="flex items-center gap-8">
            {author.name && (
              <span className="font-montserrat text-xs font-light text-white/40">
                Wykonanie:{" "}
                {author.url ? (
                  <a
                    href={author.url}
                    target="_blank"
                    rel="noopener"
                    className="hover:text-arylideYellow font-medium text-white transition-colors"
                  >
                    {author.name}
                  </a>
                ) : (
                  <span className="font-medium text-white">{author.name}</span>
                )}
              </span>
            )}

            <ScrollToTopButton />
          </FadeIn>
        </div>
      </div>
    </footer>
  );
}
