import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Filas en zigzag — public/assets/experiences/ (ingenieria_one.jpg … ingenieria_three.jpg)
const ROWS = [
  {
    img: "assets/experiences/ingenieria_one.jpeg",
    title: "Presentamos Nich-Ká",
    desc: 'Presentamos la ponencia "Arquitectura IoT aplicada a un fermentador automatizado para residuos agroindustriales" en el 5.º Congreso Internacional de Ciencias de la Ingeniería y Tecnología, organizado por la Facultad de Ciencias de la Ingeniería y Tecnología de la UABC y Grupo Código S.C., los días 15, 16 y 17 de abril de 2026 en Tijuana, Baja California.',
  },
  {
    img: "assets/experiences/ingenieria_two.jpeg",
    title: "Trabajo en equipo",
    desc: "Detrás de cada avance hay horas de trabajo en equipo: armando el prototipo, conectando sensores, escribiendo código y afinando cada detalle de Nich-Ká. Entre pruebas, errores y desvelos, fuimos puliendo la propuesta hasta dejarla lista para presentarla y defenderla ante el jurado. Cada integrante aportó desde su área para que todo funcionara como un solo sistema.",
  },
  {
    img: "assets/experiences/ingenieria_three.jpeg",
    title: "El bioreactor automatizado",
    desc: "Nuestro prototipo es una cámara construida con sensores y electrónica que monitorea variables como pH y temperatura, y regula la fermentación del café en tiempo real. Todo se conecta vía IoT a la plataforma, donde la inteligencia artificial ajusta los parámetros del proceso para lograr resultados más consistentes y trazables. De una caja de madera y cables nació una herramienta capaz de medir, aprender y mejorar cada lote.",
  },
];

// Sección: reconocimiento en el Congreso de Ciencias de la Ingeniería y Tecnología.
const CienciasSection = () => {
  return (
    <section className="relative w-full bg-[#0A0A0B]">
      <div className="mx-auto max-w-7xl px-6 py-28 flex flex-col gap-20">
        {/* Encabezado a la izquierda */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col gap-4"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "#0F8E4D" }}>
            Reconocimiento
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.95]">
            <span className="md:whitespace-nowrap">Congreso de Ciencias de la</span>{" "}
            <span className="block" style={{ color: "#0F8E4D" }}>Ingeniería y Tecnología</span>
          </h2>
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
      </div>
    </section>
  );
};

export default CienciasSection;
