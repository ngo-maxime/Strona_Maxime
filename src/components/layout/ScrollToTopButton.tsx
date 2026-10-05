"use client";

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="group hover:border-arylideYellow hover:bg-arylideYellow flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-500"
      aria-label="Wróć na górę"
    >
      <svg
        className="group-hover:text-raisinBlack h-5 w-5 text-white transition-transform duration-500 group-hover:-translate-y-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <title>Strzałka powrotu w górę</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    </button>
  );
}
