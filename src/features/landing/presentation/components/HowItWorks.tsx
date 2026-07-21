import { cn } from "../../../../lib/utils";
import Text3DFlip from "../../../../components/ui/text-3d-flip";
import { SparklesCore } from "../../../../components/ui/sparkles";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";

const IconArrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const IconMicroscope = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18h8" /><path d="M3 22h18" />
    <path d="M14 22a7 7 0 1 0 0-14h-1" />
    <path d="M9 14H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1Z" />
    <path d="M9 5 8 4" />
  </svg>
);
const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const STEPS = [
  {
    Icon: IconArrow,
    tag: "Entrada",
    title: "Grano de café en cereza",
    description: "El productor carga el lote en el fermentador. El sistema registra el peso, variedad y condiciones iniciales del grano.",
    num: "01",
    offset: "md:mt-0",
    iconColor: "text-white",
    iconBg: "rgba(255,255,255,0.06)",
    iconBorder: "rgba(255,255,255,0.1)",
    cardBg: "rgba(255,255,255,0.03)",
    cardBorder: "rgba(255,255,255,0.07)",
  },
  {
    Icon: IconMicroscope,
    tag: "Proceso",
    title: "Fermentación controlada",
    description: "Sensores de pH y temperatura monitorean el proceso en tiempo real. La IA ajusta las condiciones automáticamente para el perfil deseado.",
    num: "02",
    offset: "md:mt-16",
    iconColor: "text-green-400",
    iconBg: "rgba(15,142,77,0.15)",
    iconBorder: "rgba(15,142,77,0.3)",
    cardBg: "rgba(15,142,77,0.07)",
    cardBorder: "rgba(15,142,77,0.22)",
  },
  {
    Icon: IconCheck,
    tag: "Salida",
    title: "Café con perfil único",
    description: "El grano fermentado obtiene características de sabor consistentes y reproducibles, listo para el lavado y secado.",
    num: "03",
    offset: "md:mt-32",
    iconColor: "text-white",
    iconBg: "rgba(255,255,255,0.06)",
    iconBorder: "rgba(255,255,255,0.1)",
    cardBg: "rgba(255,255,255,0.03)",
    cardBorder: "rgba(255,255,255,0.07)",
  },
];

const NODES = [
  { x: 0.10, y: 0.25, layer: 0 }, { x: 0.10, y: 0.5, layer: 0 }, { x: 0.10, y: 0.75, layer: 0 },
  { x: 0.34, y: 0.15, layer: 1 }, { x: 0.34, y: 0.38, layer: 1 }, { x: 0.34, y: 0.62, layer: 1 }, { x: 0.34, y: 0.85, layer: 1 },
  { x: 0.58, y: 0.15, layer: 2 }, { x: 0.58, y: 0.38, layer: 2 }, { x: 0.58, y: 0.62, layer: 2 }, { x: 0.58, y: 0.85, layer: 2 },
  { x: 0.88, y: 0.25, layer: 3 },
  { x: 0.88, y: 0.5,  layer: 3 },
  { x: 0.88, y: 0.75, layer: 3 },
];

const NODE_COLORS = [
  { fill: [125, 211, 252], glow: [56, 189, 248] },   
  { fill: [125, 211, 252], glow: [56, 189, 248] },
  { fill: [125, 211, 252], glow: [56, 189, 248] },
  { fill: [252, 211, 77],  glow: [234, 179, 8] },    
  { fill: [252, 211, 77],  glow: [234, 179, 8] },
  { fill: [252, 211, 77],  glow: [234, 179, 8] },
  { fill: [252, 211, 77],  glow: [234, 179, 8] },
  { fill: [74, 222, 128],  glow: [15, 142, 77] },   
  { fill: [74, 222, 128],  glow: [15, 142, 77] },
  { fill: [74, 222, 128],  glow: [15, 142, 77] },
  { fill: [74, 222, 128],  glow: [15, 142, 77] },
  { fill: [196, 181, 253], glow: [139, 92, 246] },   
  { fill: [196, 181, 253], glow: [139, 92, 246] },
  { fill: [196, 181, 253], glow: [139, 92, 246] },
];

const EDGES: [number, number][] = [
  [0,3],[0,4],[0,5],[1,3],[1,4],[1,5],[1,6],[2,4],[2,5],[2,6],
  [3,7],[3,8],[4,7],[4,8],[4,9],[5,8],[5,9],[5,10],[6,9],[6,10],
  [7,11],[7,12],[8,11],[8,12],[8,13],[9,11],[9,12],[9,13],[10,12],[10,13],
];

const NeuralNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let stopped = false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const pulses = EDGES.map(([a]) => ({
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      active: Math.random() > 0.4,
      color: NODE_COLORS[a].fill,
    }));

    const draw = (now: number) => {
      if (stopped) return;
      const W = canvas.getBoundingClientRect().width;
      const H = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, W, H);

      const nodePos = NODES.map(n => ({ x: n.x * W, y: n.y * H }));

      EDGES.forEach(([a, b], i) => {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1) { p.t = 0; p.active = Math.random() > 0.3; }

        const ax = nodePos[a].x, ay = nodePos[a].y;
        const bx = nodePos[b].x, by = nodePos[b].y;

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = `rgba(${p.color.join(",")},0.18)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (p.active) {
          const px = ax + (bx - ax) * p.t;
          const py = ay + (by - ay) * p.t;
          const g = ctx.createRadialGradient(px, py, 0, px, py, 10);
          g.addColorStop(0, `rgba(${p.color.join(",")},0.95)`);
          g.addColorStop(1, `rgba(${p.color.join(",")},0)`);
          ctx.beginPath();
          ctx.arc(px, py, 10, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }
      });

      nodePos.forEach((n, i) => {
        const nd = NODES[i];
        const c = NODE_COLORS[i];
        const isOutput = nd.layer === 3;
        const pulse = 0.7 + 0.3 * Math.sin(now / 800 + i * 1.3);
        const r = isOutput ? 8 : 5;

        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, isOutput ? 28 : 18);
        g.addColorStop(0, `rgba(${c.glow.join(",")},${0.35 * pulse})`);
        g.addColorStop(1, `rgba(${c.glow.join(",")},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, isOutput ? 28 : 18, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.fill.join(",")},${0.75 * pulse})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${c.fill.join(",")},${pulse})`;
        ctx.lineWidth = isOutput ? 2 : 1.5;
        ctx.stroke();

        if (isOutput) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 14, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${c.fill.join(",")},${0.35 * pulse})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 4]);
          ctx.stroke();
          ctx.setLineDash([]);

        }
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { stopped = true; cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

const GENERATING_STYLES = `
  .gl-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    width: auto;
    font-family: "Poppins", "Inter", sans-serif;
    font-size: 1.8em;
    font-weight: 600;
    user-select: none;
    color: #fff;
  }
  .gl-loader {
    position: absolute;
    top: 0; left: 0;
    height: 100%; width: 100%;
    z-index: 1;
    background-color: transparent;
    mask: repeating-linear-gradient(90deg, transparent 0, transparent 6px, black 7px, black 8px);
  }
  .gl-loader::after {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image:
      radial-gradient(circle at 50% 50%, #ff0 0%, transparent 50%),
      radial-gradient(circle at 45% 45%, #f00 0%, transparent 45%),
      radial-gradient(circle at 55% 55%, #0ff 0%, transparent 45%),
      radial-gradient(circle at 45% 55%, #0f0 0%, transparent 45%),
      radial-gradient(circle at 55% 45%, #00f 0%, transparent 45%);
    mask: radial-gradient(circle at 50% 50%, transparent 0%, transparent 10%, black 25%);
    animation: gl-transform 2s infinite alternate, gl-opacity 4s infinite;
    animation-timing-function: cubic-bezier(0.6, 0.8, 0.5, 1);
  }
  @keyframes gl-transform {
    0%   { transform: translate(-55%); }
    100% { transform: translate(55%); }
  }
  @keyframes gl-opacity {
    0%, 100% { opacity: 0; }
    15%       { opacity: 1; }
    65%       { opacity: 0; }
  }
  .gl-letter {
    display: inline-block;
    opacity: 0;
    animation: gl-letter-anim 4s infinite linear;
    z-index: 2;
  }
  .gl-letter:nth-child(1)  { animation-delay: 0.100s; }
  .gl-letter:nth-child(2)  { animation-delay: 0.205s; }
  .gl-letter:nth-child(3)  { animation-delay: 0.310s; }
  .gl-letter:nth-child(4)  { animation-delay: 0.415s; }
  .gl-letter:nth-child(5)  { animation-delay: 0.521s; }
  .gl-letter:nth-child(6)  { animation-delay: 0.626s; }
  .gl-letter:nth-child(7)  { animation-delay: 0.731s; }
  .gl-letter:nth-child(8)  { animation-delay: 0.837s; }
  .gl-letter:nth-child(9)  { animation-delay: 0.942s; }
  .gl-letter:nth-child(10) { animation-delay: 1.047s; }
  @keyframes gl-letter-anim {
    0%   { opacity: 0; }
    5%   { opacity: 1; text-shadow: 0 0 4px #fff; transform: scale(1.1) translateY(-2px); }
    20%  { opacity: 0.2; }
    100% { opacity: 0; }
  }
`;

const LETTERS = ["G","e","n","e","r","a","t","i","n","g"];

const GeneratingLoader = () => (
  <>
    <style>{GENERATING_STYLES}</style>
    <div className="gl-wrapper">
      {LETTERS.map((l, i) => (
        <span key={i} className="gl-letter">{l}</span>
      ))}
      <div className="gl-loader" />
    </div>
  </>
);

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative w-full overflow-hidden bg-bg">
      <div
        className="pointer-events-none absolute inset-0 select-none bg-size-[40px_40px]"
        style={{ backgroundImage: "linear-gradient(to right,#111 1px,transparent 1px),linear-gradient(to bottom,#111 1px,transparent 1px)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(15,142,77,0.08), transparent)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:py-28 flex flex-col gap-16 sm:gap-24">

        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-green-500/80 font-medium">El proceso</span>
          <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
            <Text3DFlip
              className="bg-transparent justify-start"
              textClassName="bg-transparent bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[0.95] tracking-tighter"
              flipTextClassName="bg-transparent bg-linear-to-b from-white/50 to-white/20 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[0.95] tracking-tighter"
              rotateDirection="top"
              staggerDuration={0.03}
              staggerFrom="first"
              transition={{ type: "spring", damping: 25, stiffness: 160 }}
            >
              ¿Cómo Funciona?
            </Text3DFlip>
            <div className="ml-auto hidden sm:block">
              <GeneratingLoader />
            </div>
          </div>
          <div className="w-12 h-1 rounded-full bg-green-500/40 mt-1" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
          {STEPS.map(({ Icon, tag, title, description, num, offset, iconColor, iconBg, iconBorder, cardBg, cardBorder }, i) => (
            <motion.div
              key={tag}
              className={cn("relative flex flex-col gap-6 p-8 rounded-2xl overflow-hidden", offset)}
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, backdropFilter: "blur(12px)" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.14, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", iconColor)}
                  style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
                >
                  <Icon />
                </div>
                <span className="text-xs uppercase tracking-[0.25em] font-medium text-white/40">{tag}</span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-black text-white leading-tight tracking-tight">{title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{description}</p>
              </div>
              <span className="text-[72px] font-black leading-none text-white/[0.04] absolute -bottom-2 right-4 select-none">
                {num}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs uppercase tracking-[0.3em] text-green-400/80 font-medium">Inteligencia artificial</span>
              <span
                className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium text-green-300"
                style={{ background: "rgba(15,142,77,0.18)", border: "1px solid rgba(15,142,77,0.35)" }}
              >
                Innovación
              </span>
            </div>
            <Text3DFlip
              className="bg-transparent justify-start"
              textClassName="bg-transparent bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight"
              flipTextClassName="bg-transparent bg-linear-to-b from-white/60 to-white/20 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight"
              rotateDirection="top"
              staggerDuration={0.025}
              staggerFrom="first"
              transition={{ type: "spring", damping: 25, stiffness: 160 }}
            >
              Algoritmo genético dinámico
            </Text3DFlip>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
              Implementamos IA para optimizar en tiempo real los parámetros de la fermentación del café.
              El algoritmo aprende de cada lote, ajustando pH y temperatura para reproducir
              o mejorar el perfil de sabor objetivo del productor.
            </p>
          </div>

          <div className="relative w-full flex flex-col md:flex-row items-stretch gap-4" style={{ height: 'auto' }}>
            <motion.div
              className="relative flex-1 min-h-[250px] md:min-h-[320px]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <NeuralNetwork />
              <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none">
                <SparklesCore
                  background="transparent"
                  minSize={0.4}
                  maxSize={1.2}
                  particleDensity={80}
                  className="w-full h-full"
                  particleColor="#4ade80"
                  speed={0.8}
                />
              </div>
            </motion.div>

            <div className="flex md:flex-col justify-around gap-3 md:gap-0 py-4 md:pl-4 shrink-0 md:w-52">
              {[
                { label: "pH óptimo",      sub: "Acidez ideal para el perfil", n: "01" },
                { label: "Temperatura",    sub: "°C — rango controlado",       n: "02" },
                { label: "Tiempo estimado", sub: "h — duración del lote",      n: "03" },
              ].map(({ label, sub, n }, i) => (
                <motion.div
                  key={label}
                  className="flex flex-col gap-0.5 rounded-xl px-3 py-2"
                  style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(196,181,253,0.18)", backdropFilter: "blur(8px)" }}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: i * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                  <span className="text-[9px] text-purple-400/50 font-mono">{n}</span>
                  <span className="text-sm font-black text-purple-200 leading-none">{label}</span>
                  <span className="text-[10px] text-purple-300/40">{sub}</span>
                </motion.div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
