import NavbarInteractive from "@/components/layout/NavbarInteractive";
import { getSiteSettings } from "@/sanity/lib/settings";

export default async function Navbar() {
  const settings = await getSiteSettings();

  // Brak wpisu Patronite w CMS nie wywraca już całej strony – przycisk po prostu się nie pokaże
  const patroniteUrl = settings.socials?.find(
    (s) => s.platform?.toLowerCase() === "patronite",
  )?.url;

  return <NavbarInteractive patroniteUrl={patroniteUrl} />;
}
