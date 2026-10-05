// Ukryte pole-pułapka na boty spamujące formularze.
// Niewidoczne dla ludzi i czytników ekranu; boty zwykle wypełniają wszystkie pola.
export default function Honeypot() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
    >
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
