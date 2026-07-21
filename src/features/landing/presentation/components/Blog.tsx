import { useState } from "react";
import { Ripple } from "../../../../components/ui/ripple";
import { motion } from "motion/react";

const POSTS = [
  {
    tag: "Casos de éxito",
    tagColor: "#4ade80",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    title: "Cómo un caficultor de Chiapas logró consistencia en su perfil de sabor",
    excerpt: "Con Fermest, este productor pasó de resultados inconsistentes a reproducir el mismo perfil de sabor en cada lote de fermentación.",
    date: "Mar 2025",
    readTime: "5 min",
  },
  {
    tag: "Guías",
    tagColor: "#fbbf24",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
    title: "pH y temperatura: los dos parámetros que definen tu café",
    excerpt: "Explicamos cómo pequeñas variaciones en estos valores durante la fermentación pueden transformar completamente el resultado en taza.",
    date: "Feb 2025",
    readTime: "7 min",
  },
  {
    tag: "Ciencia del café",
    tagColor: "#38bdf8",
    image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800&q=80",
    title: "Fermentación anaeróbica vs. lavado tradicional: ¿cuál da mejor resultado?",
    excerpt: "Comparamos ambos métodos y analizamos por qué el control automatizado de la fermentación anaeróbica está cambiando la industria.",
    date: "Ene 2025",
    readTime: "4 min",
  },
];

const BlogCard = ({ post }: { post: typeof POSTS[0] }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: "#0d0d0f",
        border: "1px solid rgba(255,255,255,0.08)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
        boxShadow: hovered ? "0 24px 48px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.2)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* image area */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
        />
        {/* gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,13,15,1) 0%, rgba(13,13,15,0.4) 50%, transparent 100%)" }} />

        {/* tag */}
        <div className="absolute top-4 left-4">
          <span
            className="text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.5)", color: post.tagColor, border: `1px solid ${post.tagColor}30` }}
          >
            {post.tag}
          </span>
        </div>

        {/* read time */}
        <div className="absolute top-4 right-4">
          <span className="text-[10px] text-white/50 px-2.5 py-1 rounded-full backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.4)" }}>
            {post.readTime} lectura
          </span>
        </div>
      </div>

      {/* content */}
      <div className="flex flex-col gap-4 p-6 flex-1">
        <h3 className="text-base font-black text-white leading-snug tracking-tight">
          {post.title}
        </h3>
        <p className="text-white/45 text-sm leading-relaxed flex-1">
          {post.excerpt}
        </p>

        {/* footer */}
        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-black"
              style={{ background: post.tagColor }}
            >
              F
            </div>
            <span className="text-white/30 text-xs">Equipo Fermest · {post.date}</span>
          </div>

          <span
            className="flex items-center gap-1.5 text-xs font-medium transition-all duration-200"
            style={{ color: hovered ? post.tagColor : "rgba(255,255,255,0.25)" }}
          >
            Leer
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: hovered ? "translateX(3px)" : "translateX(0)", transition: "transform 0.2s ease" }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

const Blog = () => (
  <section id="blog" className="relative w-full overflow-hidden" style={{ background: "#0F8E4D" }}>
    <Ripple className="absolute inset-0 z-0" mainCircleSize={500} mainCircleOpacity={0.3} numCircles={7} />
    <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-black/20" />

    <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:py-28 flex flex-col gap-10 sm:gap-14">

      {/* header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/60 font-medium">Nuestro blog</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter">
            Historias y consejos
          </h2>
          <div className="w-12 h-1 rounded-full bg-white/40" />
        </motion.div>
        <p className="max-w-xs text-white/50 text-sm leading-relaxed md:text-right">
          Casos de éxito, guías prácticas y ciencia detrás de la fermentación del café.
        </p>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {POSTS.map((post, i) => (
          <motion.div
            key={post.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.14, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <BlogCard post={post} />
          </motion.div>
        ))}
      </div>

    </div>
  </section>
);

export default Blog;
