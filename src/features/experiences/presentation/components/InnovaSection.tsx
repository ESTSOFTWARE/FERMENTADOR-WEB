import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const LEAD =
  "Hace unos días tuvimos la oportunidad de llevar una idea en la que hemos trabajado con mucha dedicación a un espacio donde la innovación y el conocimiento se encuentran.";

const ROWS = [
  {
    img: "assets/experiences/one.jpeg",
    title: "ExpoCiencias 2026",
    desc: 'Participamos en ExpoCiencias 2026, realizada por la Universidad del País Innova, donde presentamos "Nich-Ká: Sistema de fermentación inteligente para la enseñanza de la biotecnología".',
  },
  {
    img: "assets/experiences/four.jpeg",
    title: "La idea",
    desc: "La tecnología puede transformar la manera en que aprendemos. A través de un sistema que integra IoT, Machine Learning, Procesamiento de Lenguaje Natural y una aplicación móvil, hacemos la enseñanza de la biotecnología más accesible, interactiva y comprensible.",
  },
  {
    img: "assets/experiences/three.jpeg",
    title: "Lo que nos motiva",
    desc: "Innovar no consiste solo en desarrollar nuevas tecnologías, sino en crear mejores experiencias de aprendizaje que acerquen el conocimiento a más personas. ExpoCiencias nos permitió compartir el trabajo y recibir retroalimentación de otros proyectos.",
  },
  {
    img: "assets/experiences/two.jpeg",
    title: "El reconocimiento",
    desc: 'Nos llena de orgullo que el esfuerzo haya sido reconocido con el primer lugar en la categoría "Tecnologías de la Información". Un diploma puede ser papel y un trofeo madera, pero lo que representan son meses de investigación, pruebas, errores, aprendizaje, desvelos y trabajo en equipo.',
  },
];

const TEAM = [
  "Víctor Fabricio Pérez Constantino",
  "Ameth de Jesús Méndez Toledo",
  "Karla Melissa Corral Zárate",
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] as const },
};

// Sección Innova — fondo negro, texto a la izquierda, filas en zigzag.
const InnovaSection = () => {
  return (
    <section className="relative w-full bg-[#0A0A0B]">
      <div className="mx-auto max-w-7xl px-6 py-28 flex flex-col gap-20">
        {/* Encabezado */}
        <motion.div {...fadeUp} className="flex flex-col gap-4 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "#0F8E4D" }}>
            ExpoCiencias 2026 · Universidad del País Innova
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.95]">
            Obtuvimos el <span style={{ color: "#0F8E4D" }}>primer lugar</span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed mt-2">{LEAD}</p>
        </motion.div>

        {/* Filas en zigzag */}
        <div className="flex flex-col gap-16 md:gap-24">
          {ROWS.map((row, i) => {
            const reverse = i % 2 === 1;
            return (
              <motion.div
                key={row.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                className={cn(
                  "flex flex-col gap-8 md:items-center",
                  reverse ? "md:flex-row-reverse" : "md:flex-row",
                )}
              >
                {/* Foto (gris → color al pasar el cursor) */}
                <div className="md:w-1/2 aspect-[4/3] overflow-hidden rounded-3xl border border-white/15" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <img
                    src={row.img}
                    alt={row.title}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition duration-700 ease-in-out hover:grayscale-0 hover:scale-[1.03]"
                  />
                </div>

                {/* Texto */}
                <div className="md:w-1/2 flex flex-col gap-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{row.title}</h3>
                  <p className="text-white/55 text-base md:text-lg leading-relaxed">{row.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cierre: agradecimientos, equipo y asesor */}
        <motion.div {...fadeUp} className="flex flex-col gap-8">
          <p className="text-white/55 text-base md:text-lg leading-relaxed">
            Agradecemos a la Universidad del País Innova y a la Universidad Politécnica de Chiapas
            por impulsar espacios donde estudiantes e investigadores pueden compartir sus propuestas,
            aprender unos de otros y seguir construyendo soluciones con impacto.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "#0F8E4D" }}>
                Equipo de trabajo
              </span>
              <ul className="flex flex-col gap-1.5">
                {TEAM.map((name) => (
                  <li key={name} className="text-white/80 text-base">{name}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "#0F8E4D" }}>
                Asesor
              </span>
              <p className="text-white/80 text-base">Dr. Alonso Guadalupe Hernández Mendoza</p>
            </div>
          </div>

          <p className="text-white/70 text-lg leading-relaxed pt-2">
            Seguimos convencidos de que la ingeniería, la inteligencia artificial y la biotecnología
            pueden converger para transformar no solo la forma en que resolvemos problemas, sino
            también la forma en que aprendemos.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default InnovaSection;
