// src/app/(user)/polityka-prywatnosci/page.tsx
//
// Polityka prywatności Fundacji Maxime – zgodna z RODO (art. 13 i 14) oraz ustawą
// Prawo komunikacji elektronicznej (cookies – art. 399, marketing – art. 398).
// Przy zmianie narzędzi (np. dodaniu Meta Pixel) zaktualizuj sekcje „Odbiorcy” i „Cookies”
// oraz datę LAST_UPDATE.
import Link from "next/link";
import type { ReactNode } from "react";
import PdfDownload from "@/components/legal/PdfDownload";
import JsonLd from "@/components/seo/JsonLd";
import FadeIn from "@/components/ui/FadeIn";
import { pageJsonLd, pageMetadata } from "@/lib/site";
import { getOrganization, getSiteSettings } from "@/sanity/lib/settings";

const LAST_UPDATE = "Październik 2026";

export const metadata = pageMetadata({
  title: "Polityka prywatności",
  description:
    "Jak Fundacja Maxime chroni Twoje dane osobowe: administrator, cele i podstawy przetwarzania, odbiorcy, okresy przechowywania, Twoje prawa i pliki cookies.",
  path: "/polityka-prywatnosci",
});

// --- Drobne elementy typograficzne (spójne z dotychczasowym wyglądem) ---
function List({ children }: { children: ReactNode }) {
  return (
    <ul className="mb-6 flex flex-col gap-4 border-l border-white/10 pl-6">
      {children}
    </ul>
  );
}

function Item({ children }: { children: ReactNode }) {
  return (
    <li className="relative">
      <span className="bg-arylideYellow absolute top-2 -left-[1.9rem] h-1.5 w-1.5 rounded-full" />
      {children}
    </li>
  );
}

function Sub({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-arylideYellow mt-10 mb-4 text-sm font-bold tracking-widest uppercase first:mt-0">
      {children}
    </h3>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border border-white/10 bg-white/5 p-6">
      <h3 className="text-arylideYellow mb-2 text-sm font-bold tracking-widest uppercase">
        {title}
      </h3>
      <p className="text-sm font-light text-white/70">{children}</p>
    </div>
  );
}

const linkClass = "text-arylideYellow hover:underline";

export default async function PrivacyPolicyPage() {
  const [settings, org] = await Promise.all([
    getSiteSettings(),
    getOrganization(),
  ]);
  const { email, phone, address, krs, nip, regon } = org;
  const registry = [
    krs && `KRS: ${krs}`,
    nip && `NIP: ${nip}`,
    regon && `REGON: ${regon}`,
  ].filter(Boolean);

  const sections: { id: string; title: string; content: ReactNode }[] = [
    {
      id: "01",
      title: "Administrator Danych",
      content: (
        <>
          <p className="mb-6">
            Administratorem Twoich danych osobowych jest{" "}
            <strong>Fundacja Maxime</strong> z siedzibą pod adresem:{" "}
            <span className="font-medium text-white">
              {address.street}, {address.postalCode} {address.city}
            </span>
            {registry.length > 0 && <> ({registry.join(", ")})</>} – dalej
            „Fundacja” lub „my”.
          </p>
          <p className="mb-6">
            W sprawach dotyczących danych osobowych możesz skontaktować się z
            nami drogą elektroniczną:{" "}
            <a href={`mailto:${email}`} className={linkClass}>
              {email}
            </a>
            , telefonicznie: {phone} lub listownie na adres siedziby. Fundacja
            nie powołała Inspektora Ochrony Danych – wszystkie sprawy
            obsługujemy bezpośrednio.
          </p>
          <p>
            Niniejsza polityka dotyczy serwisu{" "}
            <span className="font-medium text-white">www.maxime.com.pl</span>,
            naszych formularzy, newslettera, profili w mediach społecznościowych
            oraz wydarzeń, które organizujemy.
          </p>
        </>
      ),
    },
    {
      id: "02",
      title: "Cele i Podstawy Prawne",
      content: (
        <>
          <p className="mb-6">
            Zbieramy wyłącznie dane niezbędne do konkretnego celu. Poniżej
            znajdziesz, co, po co i na jakiej podstawie przetwarzamy (przepisy
            RODO – rozporządzenia Parlamentu Europejskiego i Rady (UE)
            2016/679).
          </p>

          <Sub>Formularz kontaktowy i korespondencja</Sub>
          <List>
            <Item>
              <strong>Dane:</strong> imię i nazwisko, adres e-mail, temat i
              treść wiadomości, a przy kontakcie telefonicznym – numer telefonu.
            </Item>
            <Item>
              <strong>Cel i podstawa:</strong> odpowiedź na Twoje zapytanie –
              nasz prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO); gdy
              zapytanie dotyczy współpracy, występu lub zamówienia oprawy
              muzycznej – podjęcie działań przed zawarciem umowy i jej wykonanie
              (art. 6 ust. 1 lit. b RODO).
            </Item>
          </List>

          <Sub>Newsletter</Sub>
          <List>
            <Item>
              <strong>Dane:</strong> adres e-mail oraz informacje potwierdzające
              zapis (data, godzina i adres IP zapisu oraz potwierdzenia).
            </Item>
            <Item>
              <strong>Cel i podstawa:</strong> wysyłka informacji o koncertach,
              wydarzeniach i działalności Fundacji – Twoja zgoda (art. 6 ust. 1
              lit. a RODO w zw. z art. 398 ustawy Prawo komunikacji
              elektronicznej). Zapis wymaga potwierdzenia linkiem wysłanym na
              podany adres (double opt-in). Dane potwierdzające zapis
              przechowujemy, aby wykazać udzielenie zgody (art. 6 ust. 1 lit. f
              RODO).
            </Item>
            <Item>
              Zgodę możesz wycofać w każdej chwili – linkiem „wypisz się” w
              każdej wiadomości lub pisząc do nas. Wycofanie nie wpływa na
              zgodność z prawem wcześniejszej wysyłki.
            </Item>
          </List>

          <Sub>Wydarzenia i bilety</Sub>
          <List>
            <Item>
              Bilety na część wydarzeń sprzedają zewnętrzni operatorzy (np.
              serwisy biletowe lub organizatorzy obiektów). Są oni odrębnymi
              administratorami Twoich danych – zasady przetwarzania określają
              ich własne polityki prywatności.
            </Item>
            <Item>
              Jeżeli rezerwujesz wejściówkę bezpośrednio u nas, przetwarzamy
              dane potrzebne do rezerwacji (imię i nazwisko, kontakt) w celu jej
              realizacji (art. 6 ust. 1 lit. b RODO).
            </Item>
          </List>

          <Sub>Wizerunek podczas wydarzeń</Sub>
          <List>
            <Item>
              Nasze koncerty są fotografowane i nagrywane. Zdjęcia i nagrania
              publikujemy w Galerii, aktualnościach i mediach społecznościowych
              w celu dokumentowania i promowania działalności Fundacji (art. 6
              ust. 1 lit. f RODO).
            </Item>
            <Item>
              Wizerunek publiczności utrwalamy jako szczegół całości publicznej
              imprezy, co nie wymaga zgody (art. 81 ust. 2 pkt 2 ustawy o prawie
              autorskim i prawach pokrewnych). Wizerunek artystów i
              współpracowników publikujemy na podstawie zgody lub umowy.
            </Item>
            <Item>
              Jeśli nie chcesz, aby zdjęcie z Twoim udziałem było dostępne w
              serwisie – napisz do nas, a usuniemy je lub wykadrujemy.
            </Item>
          </List>

          <Sub>Media społecznościowe</Sub>
          <List>
            <Item>
              Prowadzimy profile m.in. w serwisach Facebook, Instagram, YouTube
              i TikTok. Przetwarzamy dane osób, które je obserwują, komentują
              lub piszą do nas wiadomości – w celu komunikacji i promocji
              działalności (art. 6 ust. 1 lit. f RODO). W zakresie statystyk
              fanpage’a Fundacja i Meta Platforms Ireland Ltd. są
              współadministratorami (art. 26 RODO).
            </Item>
            <Item>
              Operatorzy platform przetwarzają dane na własnych zasadach,
              opisanych w ich politykach prywatności.
            </Item>
          </List>

          <Sub>Opinie z Google</Sub>
          <List>
            <Item>
              Na stronie głównej prezentujemy wybrane opinie, które ich autorzy
              opublikowali publicznie w naszym Profilu Firmy w Google. Źródłem
              danych jest ten profil (art. 14 RODO) – nie pozyskujemy ich
              bezpośrednio od autorów.
            </Item>
            <Item>
              <strong>Dane:</strong> imię lub inicjały autora (w formie, w
              jakiej zostały opublikowane), treść opinii i ocena.
            </Item>
            <Item>
              <strong>Cel i podstawa:</strong> przedstawienie opinii o naszej
              działalności – nasz prawnie uzasadniony interes (art. 6 ust. 1
              lit. f RODO). Jeśli nie chcesz, aby Twoja opinia była widoczna na
              naszej stronie, napisz do nas – usuniemy ją niezwłocznie.
            </Item>
            <Item>
              Opinie przekazane nam bezpośrednio (np. wiadomością lub przez
              dawny formularz na stronie) publikujemy w tej samej formie – z
              imieniem lub inicjałami autora.
            </Item>
          </List>

          <Sub>Statystyki i działanie serwisu</Sub>
          <List>
            <Item>
              <strong>Vercel Web Analytics i Speed Insights</strong> – zbiorcze,
              anonimowe statystyki odwiedzin i szybkości działania strony. Nie
              używają plików cookies ani identyfikatorów pozwalających rozpoznać
              Cię między wizytami (art. 6 ust. 1 lit. f RODO – rozwój i jakość
              serwisu).
            </Item>
            <Item>
              <strong>Google Analytics 4</strong> – szczegółowe statystyki
              korzystania ze strony, uruchamiane wyłącznie po wyrażeniu zgody na
              pliki „Analityczne” w banerze cookies (art. 6 ust. 1 lit. a RODO w
              zw. z art. 399 ustawy Prawo komunikacji elektronicznej).
            </Item>
            <Item>
              <strong>Logi serwera</strong> – adres IP, data i godzina, rodzaj
              przeglądarki i odwiedzany adres są przetwarzane automatycznie
              przez dostawcę hostingu w celu zapewnienia bezpieczeństwa i
              ochrony przed nadużyciami (art. 6 ust. 1 lit. f RODO).
            </Item>
          </List>

          <Sub>Obowiązki prawne i roszczenia</Sub>
          <List>
            <Item>
              Dane z umów, darowizn i rozliczeń przetwarzamy w celu wypełnienia
              obowiązków wynikających z przepisów podatkowych i o rachunkowości
              (art. 6 ust. 1 lit. c RODO), a w razie potrzeby – w celu
              ustalenia, dochodzenia lub obrony roszczeń (art. 6 ust. 1 lit. f
              RODO).
            </Item>
          </List>
        </>
      ),
    },
    {
      id: "03",
      title: "Dobrowolność Podania Danych",
      content: (
        <p>
          Podanie danych jest dobrowolne, ale niezbędne do skorzystania z danej
          funkcji – bez adresu e-mail nie zapiszemy Cię do newslettera, a bez
          danych kontaktowych nie odpowiemy na wiadomość. W przypadku umów
          podanie danych jest warunkiem ich zawarcia. Nie podejmujemy decyzji
          opartych wyłącznie na zautomatyzowanym przetwarzaniu, w tym
          profilowaniu, które wywoływałyby wobec Ciebie skutki prawne lub w
          podobny sposób istotnie na Ciebie wpływały.
        </p>
      ),
    },
    {
      id: "04",
      title: "Odbiorcy Danych",
      content: (
        <>
          <p className="mb-6">
            Twoich danych nie sprzedajemy. Przekazujemy je wyłącznie zaufanym
            dostawcom usług (podmiotom przetwarzającym), z którymi łączą nas
            umowy powierzenia, i tylko w zakresie niezbędnym do działania
            serwisu:
          </p>
          <List>
            <Item>
              <strong>Vercel Inc.</strong> (USA) – hosting strony, logi serwera,
              Vercel Web Analytics i Speed Insights;
            </Item>
            <Item>
              <strong>Sanity AS</strong> (Norwegia) – system zarządzania treścią
              (m.in. zdjęcia publikowane w Galerii);
            </Item>
            <Item>
              <strong>Resend</strong> (Plus Five Five, Inc., USA) – doręczanie
              wiadomości z formularza kontaktowego;
            </Item>
            <Item>
              <strong>MailerLite</strong> – obsługa listy i wysyłka newslettera;
            </Item>
            <Item>
              <strong>Google Ireland Ltd.</strong> – Google Analytics 4 (tylko
              po wyrażeniu zgody);
            </Item>
            <Item>
              dostawcy poczty elektronicznej i usług IT, biuro rachunkowe oraz
              doradcy prawni – w zakresie niezbędnym do ich zadań.
            </Item>
          </List>
          <p>
            Dane możemy też udostępnić organom publicznym, gdy wymagają tego
            przepisy prawa.
          </p>
        </>
      ),
    },
    {
      id: "05",
      title: "Przekazywanie Danych poza EOG",
      content: (
        <p>
          Część dostawców (Vercel, Resend, Google) może przetwarzać dane w
          Stanach Zjednoczonych. Odbywa się to na podstawie decyzji Komisji
          Europejskiej z 10 lipca 2023 r. stwierdzającej odpowiedni stopień
          ochrony (EU-US Data Privacy Framework) – wobec podmiotów
          certyfikowanych – lub standardowych klauzul umownych zatwierdzonych
          przez Komisję Europejską (art. 46 ust. 2 lit. c RODO). Kopię
          zabezpieczeń możesz otrzymać, kontaktując się z nami.
        </p>
      ),
    },
    {
      id: "06",
      title: "Okres Przechowywania",
      content: (
        <List>
          <Item>
            <strong>Korespondencja:</strong> przez czas prowadzenia rozmowy, a
            następnie do 12 miesięcy; jeśli doszło do zawarcia umowy – do czasu
            przedawnienia roszczeń.
          </Item>
          <Item>
            <strong>Newsletter:</strong> do wycofania zgody; dowód zgody – do
            upływu okresu przedawnienia ewentualnych roszczeń.
          </Item>
          <Item>
            <strong>Umowy i rozliczenia:</strong> przez 5 lat od końca roku
            obrotowego (przepisy podatkowe i o rachunkowości).
          </Item>
          <Item>
            <strong>Zdjęcia i nagrania z wydarzeń:</strong> przez czas
            dokumentowania działalności Fundacji lub do skutecznego sprzeciwu.
          </Item>
          <Item>
            <strong>Opinie z Google:</strong> do czasu usunięcia opinii z
            Profilu Firmy w Google przez autora lub do skutecznego sprzeciwu.
          </Item>
          <Item>
            <strong>Google Analytics:</strong> 14 miesięcy; pliki cookies – do 2
            lat lub do wycofania zgody.
          </Item>
          <Item>
            <strong>Logi serwera:</strong> zgodnie z polityką dostawcy hostingu,
            zwykle nie dłużej niż kilkadziesiąt dni.
          </Item>
        </List>
      ),
    },
    {
      id: "07",
      title: "Twoje Prawa",
      content: (
        <>
          <p className="mb-6">
            W związku z przetwarzaniem danych przysługuje Ci prawo do:
          </p>
          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card title="Dostęp i sprostowanie">
              Informacji o przetwarzanych danych, ich kopii (art. 15) oraz
              poprawienia nieprawidłowych danych (art. 16).
            </Card>
            <Card title="Usunięcie">
              „Prawo do bycia zapomnianym” – usuniemy dane, gdy nie ma podstawy
              do ich dalszego przetwarzania (art. 17).
            </Card>
            <Card title="Ograniczenie i przenoszenie">
              Ograniczenia przetwarzania (art. 18) oraz otrzymania danych w
              ustrukturyzowanym formacie (art. 20).
            </Card>
            <Card title="Sprzeciw">
              Sprzeciwu wobec przetwarzania opartego na naszym prawnie
              uzasadnionym interesie, w tym wobec publikacji zdjęć lub opinii
              (art. 21).
            </Card>
            <Card title="Cofnięcie zgody">
              W dowolnym momencie – np. wypisując się z newslettera lub
              zmieniając ustawienia cookies (art. 7 ust. 3).
            </Card>
            <Card title="Skarga">
              Do Prezesa Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193
              Warszawa (art. 77).
            </Card>
          </div>
          <p>
            Aby skorzystać z praw, napisz na{" "}
            <a href={`mailto:${email}`} className={linkClass}>
              {email}
            </a>
            . Odpowiemy bez zbędnej zwłoki, nie później niż w ciągu miesiąca.
          </p>
        </>
      ),
    },
    {
      id: "08",
      title: "Pliki Cookies",
      content: (
        <>
          <p className="mb-6">
            Pliki cookies to małe pliki zapisywane na Twoim urządzeniu.
            Korzystamy z nich oszczędnie i – poza niezbędnymi – wyłącznie za
            Twoją zgodą wyrażoną w banerze cookies (art. 399 ustawy Prawo
            komunikacji elektronicznej).
          </p>
          <Sub>Niezbędne (zawsze aktywne)</Sub>
          <List>
            <Item>
              <strong>maxime_cookie_consent</strong> – zapamiętuje Twoje wybory
              dotyczące cookies; ważność 180 dni.
            </Item>
            <Item>
              Pamięć przeglądarki (localStorage):{" "}
              <strong>maxime_newsletter_closed</strong> i{" "}
              <strong>maxime_newsletter_subscribed</strong> – zapamiętują
              zamknięcie okna newslettera lub zapis, abyśmy nie wyświetlali go
              ponownie.
            </Item>
          </List>
          <Sub>Analityczne (za zgodą)</Sub>
          <List>
            <Item>
              <strong>_ga, _ga_*</strong> – Google Analytics 4: rozróżnianie
              użytkowników i sesji na potrzeby statystyk; ważność do 2 lat. Po
              wycofaniu zgody usuwamy je automatycznie.
            </Item>
          </List>
          <Sub>Marketingowe i personalizacja (za zgodą)</Sub>
          <List>
            <Item>
              Obecnie nie stosujemy cookies marketingowych ani
              personalizacyjnych. Jeżeli to się zmieni, zaktualizujemy tę
              politykę, a narzędzia uruchomimy wyłącznie po Twojej zgodzie.
            </Item>
          </List>
          <p>
            Ustawienia zmienisz w każdej chwili przyciskiem{" "}
            <strong>„Zarządzaj Cookies”</strong> w stopce strony lub w
            ustawieniach przeglądarki. Zablokowanie niezbędnych plików może
            ograniczyć działanie niektórych funkcji serwisu.
          </p>
        </>
      ),
    },
    {
      id: "09",
      title: "Linki Zewnętrzne",
      content: (
        <p>
          Serwis zawiera odnośniki do innych stron – m.in. serwisów biletowych,
          Patronite i mediów społecznościowych. Po przejściu na nie obowiązują
          zasady prywatności ich właścicieli; nie odpowiadamy za przetwarzanie
          danych w tych serwisach.
        </p>
      ),
    },
    {
      id: "10",
      title: "Bezpieczeństwo",
      content: (
        <p>
          Stosujemy środki techniczne i organizacyjne adekwatne do ryzyka:
          szyfrowane połączenie (HTTPS), ograniczony dostęp do danych,
          zabezpieczenia formularzy przed nadużyciami oraz zasadę minimalizacji
          – nie przechowujemy w serwisie danych, których nie potrzebujemy.
        </p>
      ),
    },
    {
      id: "11",
      title: "Zmiany Polityki",
      content: (
        <p>
          Politykę aktualizujemy, gdy zmieniają się przepisy lub sposób
          działania serwisu. Aktualna wersja jest zawsze dostępna na tej
          stronie, a data ostatniej zmiany widnieje na górze dokumentu. W
          sprawach nieuregulowanych zachęcamy do{" "}
          <Link href="/kontakt" className={linkClass}>
            kontaktu
          </Link>
          .
        </p>
      ),
    },
  ];

  return (
    <div className="bg-raisinBlack selection:bg-arylideYellow selection:text-raisinBlack relative min-h-screen w-full overflow-x-hidden">
      <JsonLd
        data={pageJsonLd({
          type: "WebPage",
          name: "Polityka prywatności",
          description:
            "Jak Fundacja Maxime chroni Twoje dane osobowe: administrator, cele i podstawy przetwarzania, odbiorcy, okresy przechowywania, Twoje prawa i pliki cookies.",
          path: "/polityka-prywatnosci",
          crumb: "Polityka prywatności",
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
            data-deco="PRIVACY"
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
              Polityka <br />
              <span className="font-youngest text-arylideYellow relative top-2 inline-block -rotate-2 text-6xl font-normal sm:text-7xl md:text-8xl">
                Prywatności.
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay="400ms">
            <p className="font-montserrat mt-8 max-w-2xl text-base leading-relaxed font-light text-white/70">
              Sztuka wymaga zaufania. Szanujemy Twoje dane tak samo, jak
              szanujemy naszą publiczność na widowni. Poniżej znajdziesz jasne i
              przejrzyste informacje o tym, jak dbamy o Twoją prywatność.
            </p>
            <p className="font-montserrat mt-4 text-xs font-bold tracking-widest text-white/40 uppercase">
              Ostatnia aktualizacja: {LAST_UPDATE}
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

          {/* Przycisk PDF – widoczny dopiero po dodaniu pliku public/docs/polityka-prywatnosci.pdf */}
          <PdfDownload
            file="polityka-prywatnosci.pdf"
            url={settings.privacyPdf}
            note="Dokument ten zawiera szczegółowe dane rejestrowe oraz wszystkie niezbędne klauzule informacyjne wymagane przez RODO."
          />
        </div>
      </section>

      {/* ============================================================================ */}
      {/* CTA NA DOLE */}
      {/* ============================================================================ */}
      <section className="bg-oxfordBlue relative z-10 w-full py-24 text-center lg:py-32">
        <FadeIn>
          <span className="font-youngest text-arylideYellow text-4xl md:text-5xl">
            Masz pytania?
          </span>
        </FadeIn>
        <FadeIn delay="200ms" className="mt-6">
          <h2 className="font-montserrat text-3xl leading-tight font-bold text-white md:text-4xl">
            Jesteśmy do Twojej dyspozycji.
          </h2>
        </FadeIn>
        <FadeIn delay="400ms" className="mt-12 flex justify-center">
          <Link
            href="/kontakt"
            className="group font-montserrat hover:border-arylideYellow hover:bg-arylideYellow hover:text-raisinBlack relative inline-flex items-center justify-center gap-4 rounded-full border border-white/20 bg-transparent px-10 py-5 text-[0.7rem] font-bold tracking-[0.2em] text-white uppercase transition-all duration-500"
          >
            Przejdź do formularza
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
