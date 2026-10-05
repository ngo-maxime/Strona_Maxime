// src/components/home/Values.tsx
import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";

const valuesData = [
  {
    id: "01",
    title: "Talent",
    desc: "Odkrywamy i pielęgnujemy unikalne brzmienia. Tworzymy przestrzeń, w której naturalne predyspozycje zamieniają się w rzemiosło na najwyższym poziomie.",
    icon: "/Talent-Asset.svg",
    marginTop: "lg:mt-0",
  },
  {
    id: "02",
    title: "Ambicja",
    desc: "Przesuwamy granice własnych możliwości. Nie zadowalamy się przeciętnością, zawsze sięgamy po najtrudniejsze wyzwania sceniczne i projektowe.",
    icon: "/Ambition-Asset.svg",
    marginTop: "lg:mt-16",
  },
  {
    id: "03",
    title: "Profesjonalizm",
    desc: "Każdy detal ma znaczenie. Od pierwszej próby aż po wybrzmienie ostatniego akordu na scenie – pracujemy z bezkompromisowym rygorem.",
    icon: "/Professionalism-Asset.svg",
    marginTop: "lg:mt-32",
  },
];

export default function Values() {
  return (
    <section className="bg-oxfordBlue relative z-20 w-full overflow-hidden py-32 lg:py-48">
      {/* --- GŁĘBIA W TLE --- */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(239,203,111,0.04)_0%,transparent_70%)]" />
        <div
          aria-hidden="true"
          className="absolute top-10 left-0 w-full text-center opacity-[0.02] mix-blend-overlay"
        >
          <span
            aria-hidden="true"
            data-deco="Wartości"
            className="font-youngest text-[25vw] leading-none whitespace-nowrap text-white before:content-[attr(data-deco)]"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="mb-24 flex flex-col items-center text-center lg:mb-32">
          <FadeIn>
            <div className="mb-8 flex flex-col items-center gap-4">
              <span className="font-montserrat text-arylideYellow text-[0.65rem] font-bold tracking-[0.4em] uppercase">
                Co nas definiuje
              </span>
              <div className="from-arylideYellow h-16 w-px bg-linear-to-b to-transparent" />
            </div>
          </FadeIn>
          <FadeIn delay="200ms">
            <h2 className="font-montserrat text-5xl leading-tight font-bold text-white lg:text-7xl">
              Fundament naszej <br />
              <span className="font-youngest text-arylideYellow relative top-4 text-6xl leading-none font-normal lg:text-[7.5rem]">
                twórczości.
              </span>
            </h2>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          {valuesData.map((item, index) => (
            <FadeIn
              key={item.id}
              delay={`${400 + index * 200}ms`}
              className={item.marginTop}
            >
              <div className="group hover:border-arylideYellow/30 relative h-full w-full overflow-hidden rounded-3xl border border-white/5 bg-white/2 p-10 backdrop-blur-md transition-all duration-700 hover:-translate-y-4 hover:bg-white/4 hover:shadow-[0_20px_40px_-15px_rgba(239,203,111,0.15)]">
                <div
                  aria-hidden="true"
                  className="group-hover:text-arylideYellow absolute -top-10 -right-6 z-0 opacity-10 transition-transform duration-700 group-hover:-translate-x-4 group-hover:translate-y-4 group-hover:scale-110 group-hover:opacity-20"
                >
                  <span className="font-youngest mr-17.5 text-[10rem] text-white md:mr-11 md:text-[11rem]">
                    {item.id}
                  </span>
                </div>
                <div className="relative z-10 flex h-full flex-col">
                  <div className="group-hover:border-arylideYellow/50 group-hover:bg-arylideYellow/10 mb-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-transform duration-700 group-hover:scale-110">
                    <div className="relative h-25 w-25">
                      <Image
                        src={item.icon}
                        alt=""
                        fill
                        sizes="100px"
                        className="object-contain brightness-0 invert transition-all duration-500 group-hover:brightness-110"
                      />
                    </div>
                  </div>
                  <h3 className="font-montserrat group-hover:text-arylideYellow mb-4 text-3xl font-bold tracking-tight text-white transition-colors duration-500">
                    {item.title}
                  </h3>
                  <p className="font-montserrat text-sm leading-[1.8] font-light text-white/60 transition-colors duration-500 group-hover:text-white/80">
                    {item.desc}
                  </p>
                  <div className="group-hover:from-arylideYellow mt-12 h-px w-12 bg-white/10 transition-all duration-700 group-hover:w-full group-hover:bg-linear-to-r group-hover:to-transparent" />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
