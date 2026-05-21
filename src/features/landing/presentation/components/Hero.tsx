import { cn } from "../../../../lib/utils";
import { Spotlight } from "./ui/Spotlight";
import Text3DFlip from "../../../../components/ui/text-3d-flip";
import { BioreactorVisual } from "./bioreactor/BioreactorVisual";
import { useHeroViewModel } from "../viewmodels/useHeroViewModel";

const STATS = [
  { value: "4–10",    label: "Rango pH" },
  { value: "15–45°C", label: "Temperatura" },
  { value: "100 g/L", label: "Sustrato máx." },
];

const Hero = () => {
  const { containerRef, rotX, rotY, mounted, mousePos, handleMouseMove, handleMouseLeave } =
    useHeroViewModel();

  return (
    <section
      className="relative flex min-h-screen w-full overflow-hidden bg-bg antialiased items-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 select-none bg-size-[40px_40px]",
          "bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)]"
        )}
      />

      <div
        className="pointer-events-none absolute inset-0 transition-all duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(74,222,128,0.04), transparent 60%)`,
        }}
      />

      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32 flex flex-col md:flex-row items-center justify-between gap-16">
        <div
          className={cn(
            "flex-1 flex flex-col gap-8 text-left transition-all duration-1000 ease-out",
            mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          )}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-green-500/80 font-medium">
            Fermentación inteligente del grano de café
          </p>

          <h1 className="flex flex-col gap-1 text-6xl md:text-7xl font-black leading-[0.95] tracking-tighter">
            <Text3DFlip
              className="bg-transparent justify-start"
              textClassName="bg-transparent bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent"
              flipTextClassName="bg-transparent bg-linear-to-b from-white/50 to-white/20 bg-clip-text text-transparent"
              rotateDirection="top"
              staggerDuration={0.03}
              staggerFrom="first"
              transition={{ type: "spring", damping: 25, stiffness: 160 }}
            >
              Fermentador
            </Text3DFlip>
            <Text3DFlip
              className="bg-transparent justify-start"
              textClassName="bg-transparent bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent"
              flipTextClassName="bg-transparent bg-linear-to-b from-white/50 to-white/20 bg-clip-text text-transparent"
              rotateDirection="top"
              staggerDuration={0.03}
              staggerFrom="first"
              transition={{ type: "spring", damping: 30, stiffness: 160 }}
            >
              de café
            </Text3DFlip>
            <Text3DFlip
              className="bg-transparent justify-start mt-2"
              textClassName="bg-transparent bg-linear-to-r from-green-600 via-green-500 to-green-700 bg-clip-text text-transparent"
              flipTextClassName="bg-transparent bg-linear-to-r from-green-700 via-green-600 to-green-800 bg-clip-text text-transparent"
              rotateDirection="top"
              staggerDuration={0.03}
              staggerFrom="first"
              transition={{ type: "spring", damping: 20, stiffness: 140 }}
            >
              accesible.
            </Text3DFlip>
          </h1>

          <p className="max-w-sm text-sm text-neutral-500 leading-relaxed border-l-2 border-green-500/30 pl-4">
            Un sistema automatizado que optimiza y controla la fermentación del café para obtener perfiles de sabor únicos y consistentes.
          </p>

          <div className="flex items-center gap-4">
            <button className="group relative flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-green-400 hover:shadow-[0_0_24px_rgba(74,222,128,0.4)]">
              Empezar ahora
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-black px-4 py-2.5"
            >
              <img src="/assets/icons/googleplay.svg" alt="" aria-hidden="true" className="h-5 w-5 shrink-0" />
              <span className="flex flex-col leading-none">
                <span className="text-[9px] font-medium uppercase tracking-wider text-white/50">Get it on</span>
                <span className="text-sm font-semibold text-white">Google Play</span>
              </span>
            </a>
          </div>

          <div className="flex items-center gap-8 pt-2 border-t border-white/5">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-xl font-black text-white">{value}</span>
                <span className="text-xs text-neutral-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={containerRef}
          className={cn(
            "flex-1 flex items-center justify-center relative transition-all duration-[1200ms] ease-out",
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
          style={{ perspective: "1200px" }}
        >
          <BioreactorVisual rotX={rotX} rotY={rotY} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
