// src/app/(user)/regulamin/page.tsx
import Link from "next/link";
import PdfDownload from "@/components/legal/PdfDownload";
import JsonLd from "@/components/seo/JsonLd";
import FadeIn from "@/components/ui/FadeIn";
import { ORGANIZATION, pageJsonLd, pageMetadata } from "@/lib/site";
import { getOrganization, getSiteSettings } from "@/sanity/lib/settings";

// 2. Zamieniamy na async Server Component
export const metadata = pageMetadata({
  title: "Regulamin",
  description:
    "Zapoznaj się z zasadami obowiązującymi na wydarzeniach Fundacji Maxime oraz w sferze cyfrowej.",
  path: "/regulamin",
});

export default async function TermsPage() {
  // Dane kontaktowe z CMS (wspólne zapytanie z menu i stopką), awaryjnie z konfiguracji serwisu
  const [settings, org] = await Promise.all([
    getSiteSettings(),
    getOrganization(),
  ]);
  const { address } = ORGANIZATION;
  const registry = [
    org.krs && `KRS: ${org.krs}`,
    org.nip && `NIP: ${org.nip}`,
    org.regon && `REGON: ${org.regon}`,
  ].filter(Boolean);
  const contact = {
    email: settings.contact?.email || ORGANIZATION.email,
    address:
      settings.contact?.address ||
      `${address.street}, ${address.postalCode} ${address.city}`,
  };

  // Tablica sekcji zostaje wewnątrz, żeby miała dostęp do zmiennej "contact"
  const sections = [
    {
      id: "01",
      title: "Postanowienia Ogólne",
      content: (
        <>
          <p className="mb-6">
            Niniejszy Regulamin określa zasady korzystania z serwisu
            internetowego oraz zasady uczestnictwa w wydarzeniach organizowanych
            przez <strong>Fundację Maxime</strong>.
          </p>
          <p className="mb-6">
            Dane Fundacji: <br />
            Siedziba:{" "}
            <span className="font-medium text-white">
              {/* Bezpieczne użycie replace w razie gdyby address był pusty */}
              {(contact.address || "").replace("\n", ", ")}
            </span>
            <br />
            {registry.length > 0 && (
              <>
                {registry.join(", ")}
                <br />
              </>
            )}
            Kontakt e-mail:{" "}
            <a
              href={`mailto:${contact.email}`}
              className="text-arylideYellow hover:underline"
            >
              {contact.email}
            </a>
          </p>
          <p>
            Korzystanie z witryny internetowej, zapis do Newslettera oraz zakup
            i rezerwacja biletów oznaczają pełną akceptację niniejszego
            Regulaminu.
          </p>
        </>
      ),
    },
    {
      id: "02",
      title: "Rezerwacja i Bilety",
      content: (
        <>
          <p className="mb-6">
            Uczestnictwo w naszych wydarzeniach może wymagać posiadania ważnego
            biletu lub darmowej wejściówki.
          </p>
          <ul className="mb-6 flex flex-col gap-4 border-l border-white/10 pl-6">
            <li className="relative">
              <span className="bg-arylideYellow absolute top-2 -left-[1.9rem] h-1.5 w-1.5 rounded-full" />
              <strong>Zewnętrzni operatorzy:</strong> Sprzedaż biletów na
              wydarzenia płatne (tzw. Gale i Koncerty Główne) może być
              realizowana za pośrednictwem zewnętrznych operatorów systemów
              biletowych. W takim przypadku obowiązuje również regulamin
              operatora.
            </li>
            <li className="relative">
              <span className="bg-arylideYellow absolute top-2 -left-[1.9rem] h-1.5 w-1.5 rounded-full" />
              <strong>Darmowe wejściówki:</strong> Rezerwacja wejściówek
              darmowych realizowana przez formularz kontaktowy wymaga podania
              poprawnych danych osobowych. Pula miejsc jest ograniczona, a
              Fundacja zastrzega sobie prawo do weryfikacji tożsamości
              uczestnika przed wejściem na salę.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "03",
      title: "Zasady Uczestnictwa w Koncertach",
      content: (
        <>
          <p className="mb-6">
            Szacunek do sztuki i artystów to nasz priorytet. W trosce o komfort
            wszystkich słuchaczy oraz muzyków Fundacji Maxime, prosimy o
            przestrzeganie poniższych zasad:
          </p>
          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="border border-white/10 bg-white/5 p-6">
              <h3 className="text-arylideYellow mb-2 text-sm font-bold tracking-widest uppercase">
                Punktualność
              </h3>
              <p className="text-sm font-light text-white/70">
                Osoby spóźnione będą wpuszczane na widownię wyłącznie podczas
                przerw między utworami.
              </p>
            </div>
            <div className="border border-white/10 bg-white/5 p-6">
              <h3 className="text-arylideYellow mb-2 text-sm font-bold tracking-widest uppercase">
                Elektronika
              </h3>
              <p className="text-sm font-light text-white/70">
                Prosimy o bezwzględne wyciszenie telefonów komórkowych oraz
                powiadomień dźwiękowych na czas trwania spektaklu.
              </p>
            </div>
            <div className="border border-white/10 bg-white/5 p-6">
              <h3 className="text-arylideYellow mb-2 text-sm font-bold tracking-widest uppercase">
                Fotografowanie
              </h3>
              <p className="text-sm font-light text-white/70">
                Robienie zdjęć z użyciem lampy błyskowej (flesza) oraz
                nagrywanie profesjonalnym sprzętem audio-video bez akredytacji
                jest zakazane.
              </p>
            </div>
            <div className="border border-white/10 bg-white/5 p-6">
              <h3 className="text-arylideYellow mb-2 text-sm font-bold tracking-widest uppercase">
                Prawa autorskie
              </h3>
              <p className="text-sm font-light text-white/70">
                Wykonywane utwory oraz aranżacje stanowią własność intelektualną
                twórców i podlegają ochronie prawnej.
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm font-light text-white/60">
            Wydarzenia są fotografowane i nagrywane w celu dokumentowania i
            promocji działalności Fundacji. Szczegóły, w tym możliwość sprzeciwu
            wobec publikacji zdjęć, opisuje{" "}
            <Link
              href="/polityka-prywatnosci"
              className="text-arylideYellow hover:underline"
            >
              Polityka prywatności
            </Link>
            .
          </p>
        </>
      ),
    },
    {
      id: "04",
      title: "Własność Intelektualna i Galeria",
      content: (
        <>
          <p className="mb-6">
            Wszelkie materiały udostępniane na tej stronie, w tym fotografie w
            dziale <strong>Galeria</strong>, teksty, logotypy, nazwa "Fundacja
            Maxime" oraz aranżacje graficzne podlegają ochronie praw autorskich.
          </p>
          <p className="mb-6">
            Ich kopiowanie, powielanie, modyfikacja lub wykorzystywanie w celach
            komercyjnych bez pisemnej zgody (tzw. <em>Press Pack</em> dostępny
            po kontakcie) jest zabronione. W celu nawiązania współpracy
            medialnej zachęcamy do wizyty w zakładce Kontakt.
          </p>
        </>
      ),
    },
    {
      id: "05",
      title: "Usługi Elektroniczne",
      content: (
        <>
          <p className="mb-6">
            Za pośrednictwem serwisu Fundacja nieodpłatnie świadczy drogą
            elektroniczną następujące usługi: udostępnianie treści serwisu,
            formularz kontaktowy oraz Newsletter.
          </p>
          <ul className="mb-6 flex flex-col gap-4 border-l border-white/10 pl-6">
            <li className="relative">
              <span className="bg-arylideYellow absolute top-2 -left-[1.9rem] h-1.5 w-1.5 rounded-full" />
              <strong>Formularz kontaktowy:</strong> umowa zawierana jest z
              chwilą wysłania wiadomości i wygasa po udzieleniu odpowiedzi.
            </li>
            <li className="relative">
              <span className="bg-arylideYellow absolute top-2 -left-[1.9rem] h-1.5 w-1.5 rounded-full" />
              <strong>Newsletter:</strong> umowa zawierana jest na czas
              nieokreślony z chwilą potwierdzenia zapisu linkiem wysłanym na
              podany adres e-mail. Możesz ją rozwiązać w każdej chwili, bez
              podania przyczyny – klikając „wypisz się” w wiadomości lub pisząc
              do nas.
            </li>
          </ul>
          <p className="mb-6">
            <strong>Wymagania techniczne:</strong> urządzenie z dostępem do
            Internetu, aktualna wersja przeglądarki (np. Chrome, Edge, Firefox,
            Safari) z włączoną obsługą JavaScript i plików cookies, a w
            przypadku Newslettera – aktywny adres e-mail.
          </p>
          <p className="mb-6">
            Zabronione jest dostarczanie za pośrednictwem serwisu treści o
            charakterze bezprawnym, w tym naruszających dobra osobiste lub prawa
            osób trzecich.
          </p>
          <p>
            Korzystanie z Internetu wiąże się z typowymi zagrożeniami (np.
            złośliwe oprogramowanie, wyłudzanie danych). Zalecamy korzystanie z
            aktualnego oprogramowania i ochrony antywirusowej. Zasady
            przetwarzania danych osobowych opisuje{" "}
            <Link
              href="/polityka-prywatnosci"
              className="text-arylideYellow hover:underline"
            >
              Polityka prywatności
            </Link>
            .
          </p>
        </>
      ),
    },
    {
      id: "06",
      title: "Reklamacje",
      content: (
        <>
          <p className="mb-6">
            Reklamacje dotyczące usług elektronicznych oraz wydarzeń
            organizowanych bezpośrednio przez Fundację można składać na adres{" "}
            <a
              href={`mailto:${contact.email}`}
              className="text-arylideYellow hover:underline"
            >
              {contact.email}
            </a>{" "}
            lub listownie na adres siedziby. Reklamacja powinna zawierać dane
            kontaktowe oraz opis problemu.
          </p>
          <p className="mb-6">
            Odpowiedzi udzielamy w ciągu 14 dni od otrzymania reklamacji – w
            takiej formie, w jakiej została złożona, chyba że wskażesz inną.
          </p>
          <p>
            Reklamacje biletów kupionych u zewnętrznych operatorów rozpatruje
            operator zgodnie ze swoim regulaminem.
          </p>
        </>
      ),
    },
    {
      id: "07",
      title: "Postanowienia Końcowe",
      content: (
        <>
          <p className="mb-6">
            Fundacja zastrzega sobie prawo do wprowadzania zmian w Regulaminie z
            ważnych przyczyn prawnych lub organizacyjnych. O wszelkich zmianach
            w procesach biletowych czy działaniu Newslettera poinformujemy drogą
            mailową.
          </p>
          <p>
            W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają
            odpowiednie przepisy prawa polskiego.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="bg-raisinBlack selection:bg-arylideYellow selection:text-raisinBlack relative min-h-screen w-full overflow-x-hidden">
      <JsonLd
        data={pageJsonLd({
          type: "WebPage",
          name: "Regulamin",
          description:
            "Zapoznaj się z zasadami obowiązującymi na wydarzeniach Fundacji Maxime oraz w sferze cyfrowej.",
          path: "/regulamin",
          crumb: "Regulamin",
        })}
      />
      {/* ============================================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================================ */}
      <section className="relative flex min-h-[50vh] w-full flex-col justify-end overflow-hidden px-6 pt-40 pb-16 lg:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-0 z-0 -translate-y-1/2 opacity-[0.02] mix-blend-overlay select-none"
        >
          <span
            aria-hidden="true"
            data-deco="TERMS"
            className="font-montserrat text-[20vw] leading-none font-black whitespace-nowrap text-white before:content-[attr(data-deco)]"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <FadeIn>
            <div className="mb-6 flex items-center gap-4">
              <div className="bg-arylideYellow h-px w-12" />
              <span className="font-montserrat text-arylideYellow text-[0.65rem] font-bold tracking-[0.4em] uppercase">
                Dokument prawny
              </span>
            </div>
          </FadeIn>
          <FadeIn delay="200ms">
            <h1 className="font-montserrat mb-6 text-5xl leading-[1.05] font-black tracking-tight text-white sm:text-6xl md:text-7xl">
              Regulamin <br />
              <span className="font-youngest text-arylideYellow relative top-2 inline-block -rotate-2 text-6xl font-normal sm:text-7xl md:text-8xl">
                Fundacji.
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay="400ms">
            <p className="font-montserrat mt-8 max-w-2xl text-base leading-relaxed font-light text-white/70">
              Nasza przestrzeń to miejsce, w którym bezkompromisowa sztuka
              spotyka się ze wzajemnym szacunkiem. Zapoznaj się z zasadami
              obowiązującymi na naszych wydarzeniach oraz w sferze cyfrowej.
            </p>
            <p className="font-montserrat mt-4 text-xs font-bold tracking-widest text-white/40 uppercase">
              Ostatnia aktualizacja: Styczeń 2026
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* TREŚĆ - EDITORIAL ZIG-ZAG LAYOUT */}
      {/* ============================================================================ */}
      <section className="relative z-20 w-full border-t border-white/5 bg-[#1c1c1c] px-6 py-16 lg:px-12 lg:py-32">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-24 lg:gap-32">
            {sections.map((section, index) => (
              <FadeIn key={section.id} delay={`${(index % 3) * 100}ms`}>
                <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
                  {/* OGROMNY NUMER W TLE (Tylko na Desktopie) */}
                  <div
                    aria-hidden="true"
                    data-deco={section.id}
                    className="font-montserrat pointer-events-none absolute top-0 -left-12 hidden text-[12rem] leading-none font-black text-white/2 select-none lg:block before:content-[attr(data-deco)]"
                  />

                  {/* LEWA KOLUMNA: Sticky Nagłówek */}
                  <div className="relative z-10 lg:col-span-4">
                    <div className="lg:sticky lg:top-40">
                      <div className="mb-4 flex items-end gap-4">
                        <span className="font-youngest text-arylideYellow text-4xl">
                          {section.id}.
                        </span>
                        <h2 className="font-montserrat text-2xl leading-tight font-bold text-white md:text-3xl">
                          {section.title}
                        </h2>
                      </div>
                      <div className="mt-6 hidden h-px w-full bg-white/10 lg:block" />
                    </div>
                  </div>

                  {/* PRAWA KOLUMNA: Treść (Prose) */}
                  <div className="relative z-10 lg:col-span-8 lg:pt-2">
                    <div className="font-montserrat text-base leading-loose font-light text-white/80">
                      {section.content}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Przycisk PDF – widoczny dopiero po dodaniu pliku public/docs/regulamin.pdf */}
          <PdfDownload
            file="regulamin.pdf"
            url={settings.termsPdf}
            note="Dokument ten obejmuje m.in. klauzule dotyczące rezygnacji, procedury reklamacyjne oraz szczegółowe dane rejestrowe i wymogi techniczne."
          />
        </div>
      </section>

      {/* ============================================================================ */}
      {/* CTA NA DOLE */}
      {/* ============================================================================ */}
      <section className="bg-arylideYellow relative z-10 w-full py-24 text-center lg:py-32">
        <FadeIn>
          <span className="font-youngest text-oxfordBlue text-4xl md:text-5xl">
            Sztuka czeka
          </span>
        </FadeIn>
        <FadeIn delay="200ms" className="mt-6">
          <h2 className="font-montserrat text-raisinBlack text-3xl leading-tight font-black md:text-4xl">
            Znasz już zasady gry.
          </h2>
        </FadeIn>
        <FadeIn delay="400ms" className="mt-12 flex justify-center">
          <Link
            href="/wydarzenia"
            className="group border-raisinBlack bg-raisinBlack font-montserrat text-arylideYellow relative inline-flex items-center justify-center gap-4 rounded-full border px-10 py-5 text-[0.7rem] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_-10px_rgba(38,38,38,0.6)]"
          >
            Sprawdź nadchodzące wydarzenia
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
