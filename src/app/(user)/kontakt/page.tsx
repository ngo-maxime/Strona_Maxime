// BRAK "use client"! To teraz Server Component
import Image from "next/image";
import ContactForm from "@/components/contact/ContactForm";
import CopyableContact from "@/components/contact/CopyableContact"; // <-- Nasz nowy interaktywny przycisk
import JsonLd from "@/components/seo/JsonLd";
import FadeIn from "@/components/ui/FadeIn";
import { getSocialIcon } from "@/data/navigation";
import { ORGANIZATION, pageJsonLd, pageMetadata } from "@/lib/site";
import { getSiteSettings } from "@/sanity/lib/settings";

export const metadata = pageMetadata({
  title: "Kontakt",
  description:
    "Skontaktuj się z Fundacją Maxime z Dąbrowy Górniczej – współpraca, oprawa muzyczna wydarzeń, bilety, dołączenie do orkiestry. Odezwij się do nas!",
  path: "/kontakt",
});

export default async function ContactPage() {
  // Ustawienia z Sanity (to samo zapytanie co menu i stopka – wykonywane raz na render)
  const settings = await getSiteSettings();
  const { address } = ORGANIZATION;
  const contact = {
    email: settings.contact?.email || ORGANIZATION.email,
    phone: settings.contact?.phone || ORGANIZATION.phone,
    address:
      settings.contact?.address ||
      `${address.street}\n${address.postalCode} ${address.city}`,
  };
  const socials = settings.socials || [];

  return (
    <div className="bg-raisinBlack selection:bg-arylideYellow selection:text-raisinBlack relative min-h-screen w-full overflow-hidden">
      <JsonLd
        data={pageJsonLd({
          type: "ContactPage",
          name: "Kontakt",
          description:
            "Skontaktuj się z Fundacją Maxime z Dąbrowy Górniczej – współpraca, oprawa muzyczna wydarzeń, bilety, dołączenie do orkiestry. Odezwij się do nas!",
          path: "/kontakt",
          crumb: "Kontakt",
        })}
      />
      {/* TŁO */}
      <div className="pointer-events-none fixed -top-64 -right-64 z-0 h-200 w-200 opacity-3 lg:-top-40 lg:-right-40 lg:h-300 lg:w-300">
        <Image
          src="/Asset-2.svg"
          alt=""
          fill
          sizes="1200px"
          className="animate-[spin_120s_linear_infinite] object-contain brightness-0 invert"
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 flex min-h-[70vh] w-full flex-col justify-end px-6 pt-40 pb-24 lg:min-h-[85vh] lg:px-12 lg:pb-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-0 z-0 -translate-y-1/2 opacity-2 mix-blend-overlay select-none"
        >
          <span
            aria-hidden="true"
            data-deco="KONTAKT"
            className="font-montserrat text-[25vw] leading-none font-black whitespace-nowrap text-white before:content-[attr(data-deco)]"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-9">
              <FadeIn>
                <div className="mb-6 flex items-center gap-4">
                  <div className="bg-arylideYellow h-px w-12" />
                  <span className="font-montserrat text-arylideYellow text-[0.65rem] font-bold tracking-[0.4em] uppercase">
                    Relacja
                  </span>
                </div>
              </FadeIn>
              <FadeIn delay="200ms">
                <h1 className="font-montserrat text-5xl leading-[1.05] font-black tracking-tight text-white md:text-7xl lg:text-[7.5rem]">
                  Zacznijmy od <br />
                  <span className="font-youngest text-philippineSilver relative top-2 inline-block -rotate-2 text-6xl font-normal md:text-8xl lg:text-[10rem]">
                    pierwszego
                  </span>{" "}
                  telefonu
                </h1>
              </FadeIn>
              <FadeIn delay="400ms">
                <p className="font-montserrat mt-12 max-w-2xl text-base leading-relaxed font-light text-white/70 md:text-lg lg:mt-20">
                  Niezależnie od tego, czy chcesz zorganizować wspólne
                  wydarzenie, dołączyć do zespołu, czy po prostu porozmawiać o
                  muzyce – odezwij się do nas.
                </p>
              </FadeIn>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 hidden h-24 w-px -translate-x-1/2 overflow-hidden bg-white/10 md:block">
          <div className="animate-scroll-line bg-arylideYellow absolute top-0 left-0 h-full w-full" />
        </div>
      </section>

      {/* SEKCJA KONTAKTOWA */}
      <section className="relative z-20 w-full border-t border-white/10 bg-[#1c1c1c] px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24">
            <div className="lg:col-span-4">
              <FadeIn>
                <h2 className="font-youngest text-arylideYellow text-4xl md:text-5xl lg:text-6xl">
                  Nasze namiary
                </h2>
                <p className="font-montserrat mt-8 max-w-xs text-sm leading-relaxed font-light text-white/50">
                  Kliknij w adres e-mail lub numer telefonu, aby natychmiast
                  skopiować je do schowka.
                </p>
              </FadeIn>
            </div>

            <div className="flex flex-col gap-16 lg:col-span-8">
              {/* EMAIL */}
              <FadeIn
                delay="200ms"
                className="group relative border-b border-white/10 pb-8"
              >
                <span className="font-montserrat mb-4 block text-[1rem] font-bold tracking-[0.4em] text-white/30 uppercase">
                  Biuro
                </span>

                {/* OTO NASZ NOWY KOMPONENT */}
                <CopyableContact value={contact.email} isPhone={false} />

                <div className="bg-arylideYellow absolute bottom-0 left-0 h-px w-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
              </FadeIn>

              {/* TELEFON */}
              <FadeIn
                delay="300ms"
                className="group relative border-b border-white/10 pb-8"
              >
                {/* OTO NASZ NOWY KOMPONENT (isPhone={true} podmienia tylko klase rozmiaru zeby zachowac proporcje) */}
                <CopyableContact value={contact.phone} isPhone={true} />

                <div className="bg-arylideYellow absolute bottom-0 left-0 h-px w-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />

      {/* SOCIAL MEDIA */}
      <section className="relative z-10 w-full bg-[#141414] py-24 text-center lg:py-32">
        <FadeIn>
          <span className="font-youngest text-3xl text-white/40 md:text-4xl">
            Śledź naszą podróż na żywo
          </span>
        </FadeIn>
        <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-4 px-6 md:gap-8">
          {socials.map(
            (social: { platform: string; url: string }, index: number) => (
              <FadeIn key={social.platform} delay={`${index * 150}ms`}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="group font-montserrat hover:border-arylideYellow hover:bg-arylideYellow hover:text-raisinBlack flex items-center gap-3 rounded-full border border-white/10 bg-transparent px-8 py-4 text-sm font-bold tracking-widest text-white uppercase transition-all duration-500 hover:-translate-y-1 md:px-10 md:py-5 md:text-base"
                >
                  <div
                    aria-hidden="true"
                    className="scale-125 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
                  >
                    {getSocialIcon(social.platform)}
                  </div>
                  <span className="hidden sm:block">{social.platform}</span>
                </a>
              </FadeIn>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
