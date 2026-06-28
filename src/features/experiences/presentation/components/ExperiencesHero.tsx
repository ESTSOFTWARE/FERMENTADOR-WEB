import { PhotoGallery } from "@/components/ui/gallery";
import { TwistingRibbon } from "@/components/ui/twisting-ribbon";

const ExperiencesHero = () => {
  return (
    <section className="relative w-full overflow-hidden pb-28" style={{ background: "#0a0a0b" }}>
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[110px] opacity-20 transform-gpu"
        style={{ background: "#0F8E4D", willChange: "transform" }}
      />
      <div className="relative z-10">
        <PhotoGallery
          eyebrow="Experiencias · Nich-Ká"
          title={<>Las experiencias de <span style={{ color: "#0F8E4D" }}>Nich-Ká</span> 2026</>}
        />
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-72 z-0"
        style={{
          maskImage: "linear-gradient(to top, black 35%, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black 35%, transparent)",
        }}
      >
        <TwistingRibbon className="!rounded-none h-full" segments={300} />
      </div>
    </section>
  );
};

export default ExperiencesHero;
