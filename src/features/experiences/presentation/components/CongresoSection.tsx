import { motion } from "motion/react";

// Fotos del evento — public/assets/experiences/
const PHOTOS = [
  "assets/experiences/congreso_one.jpg",
  "assets/experiences/congreso_two.jpg",
  "assets/experiences/congreso_three.jpg",
];

const LEAD =
  "En Nich-ká tuvimos la oportunidad de participar en la Feria Juventud Chiapaneca realizada el pasado 21 de abril, un espacio que reunió proyectos e iniciativas enfocadas en la innovación y el desarrollo de Chiapas.";

const PARAGRAPHS = [
  "Durante el evento presentamos nuestro bioreactor automatizado para el monitoreo y control de la fermentación del café, una solución que integra inteligencia artificial mediante un algoritmo genético dinámico para optimizar los parámetros del proceso en tiempo real.",
  "Con este desarrollo buscamos contribuir a la mejora de la calidad del café, impulsar la tecnificación de procesos tradicionales y generar herramientas que permitan a los productores tomar decisiones basadas en datos, fortaleciendo la competitividad del sector cafetalero.",
  "Nuestra participación en este tipo de espacios nos permite compartir avances, intercambiar ideas y recibir retroalimentación valiosa que nos ayuda a seguir perfeccionando la propuesta.",
  "Agradecemos a los organizadores de la Feria Juventud Chiapaneca por impulsar espacios donde la juventud, la tecnología y la innovación convergen para generar soluciones con impacto. También agradecemos a todas las personas que se acercaron a conocer el proyecto, compartir sus opiniones y enriquecer la conversación sobre el futuro del café y la agricultura de precisión.",
  "Seguimos trabajando para transformar el conocimiento y la tecnología en soluciones que generen valor para el campo y para quienes forman parte de él.",
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] as const },
};

// Sección: participación en la Feria Juventud Chiapaneca.
const CongresoSection = () => {
  return (
    <section className="relative w-full bg-[#0A0A0B]">
      <div className="mx-auto max-w-7xl px-6 py-28 flex flex-col gap-14">
        {/* Encabezado */}
        <motion.div {...fadeUp} className="flex flex-col gap-4 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "#0F8E4D" }}>
            Participación · 21 de abril
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.95]">
            Feria Juventud <span style={{ color: "#0F8E4D" }}>Chiapaneca</span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed mt-2">
            {LEAD}
          </p>
        </motion.div>

        {/* Galería del evento (gris → color al pasar el cursor) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PHOTOS.map((src, i) => (
            <motion.div
              key={src}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="aspect-[3/4] overflow-hidden rounded-3xl border border-white/15"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <img
                src={src}
                alt={`Feria Juventud Chiapaneca ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover grayscale transition duration-700 ease-in-out hover:grayscale-0 hover:scale-[1.03]"
              />
            </motion.div>
          ))}
        </div>

        {/* Texto */}
        <motion.div {...fadeUp} className="flex flex-col gap-5">
          {PARAGRAPHS.map((p) => (
            <p key={p.slice(0, 24)} className="text-white/55 text-base md:text-lg leading-relaxed">
              {p}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CongresoSection;
