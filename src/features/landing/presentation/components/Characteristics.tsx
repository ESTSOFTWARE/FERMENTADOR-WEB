const STATS = [
  { value: "70%",  label: "Del sabor del café depende del proceso de fermentación" },
  { value: "48h",  label: "Tiempo crítico donde los parámetros deben ser precisos" },
  { value: "3x",   label: "Más consistencia con monitoreo automatizado vs. manual" },
];

const OUTCOMES = [
  { icon: null, label: "Control de pH", svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/></svg> },
  { icon: null, label: "Temperatura",   svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg> },
  { icon: null, label: "Perfil de sabor", svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
];

import { Ripple } from "../../../../components/ui/ripple";
import { NodeServer } from "./ui/NodeServer";
import { motion } from "motion/react";

const Characteristics = () => {
  return (
    <section id="features" className="relative w-full overflow-hidden" style={{ background: "#0F8E4D" }}>
      <Ripple
        className="absolute inset-0 z-0"
        mainCircleSize={500}
        mainCircleOpacity={0.35}
        numCircles={7}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-black/20" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 flex flex-col gap-20">

        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            className="flex flex-col gap-6 max-w-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-white/60 font-medium">
              El problema
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter">
              ¿Por qué Nich-Ká?
            </h2>
            <div className="w-12 h-1 rounded-full bg-white/40" />
          </motion.div>
          <div className="flex items-center justify-center">
            <NodeServer />
          </div>
          <p className="max-w-md text-white/75 text-lg leading-relaxed md:pt-16">
            La fermentación del café es el paso más crítico y menos controlado del proceso.
            Pequeñas variaciones en temperatura o pH cambian radicalmente el perfil de sabor.
            Fermest lo automatiza.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={value}
              className="flex flex-col gap-3 rounded-2xl p-8 border border-white/15"
              style={{ background: "rgba(0,0,0,0.12)", backdropFilter: "blur(8px)" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.14, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <span className="text-6xl font-black text-white tracking-tighter">{value}</span>
              <span className="text-white/65 text-sm leading-relaxed">{label}</span>
            </motion.div>
          ))}
        </div>

        <div className="relative -mx-6 overflow-hidden" style={{ paddingTop: 56, paddingBottom: 56 }}>
          <div style={{ position: "absolute", top: 40, left: 0, right: 0, height: 2, background: "repeating-linear-gradient(to right, rgba(255,255,255,0.45) 0, rgba(255,255,255,0.45) 10px, transparent 10px, transparent 22px)" }} />
          <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, height: 2, background: "repeating-linear-gradient(to right, rgba(255,255,255,0.45) 0, rgba(255,255,255,0.45) 10px, transparent 10px, transparent 22px)" }} />

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="relative mx-10">
              {/* Líneas verticales — detrás de la card, cruzan toda la altura del wrapper */}
              <div style={{ position: "absolute", left: -16, top: -9999, bottom: -9999, width: 2, zIndex: 0, background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.45) 0, rgba(255,255,255,0.45) 10px, transparent 10px, transparent 22px)" }} />
              <div style={{ position: "absolute", right: -16, top: -9999, bottom: -9999, width: 2, zIndex: 0, background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.45) 0, rgba(255,255,255,0.45) 10px, transparent 10px, transparent 22px)" }} />

        <div
          className="relative flex flex-col md:flex-row items-stretch overflow-hidden rounded-tl-3xl rounded-br-3xl rounded-bl-3xl"
          style={{ background: "#0a0a0b", zIndex: 1 }}
        >
          <div className="flex flex-col justify-between gap-8 p-8 md:p-12 md:w-1/2">
            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "#0F8E4D" }}>
                La solución
              </span>
              <p className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
                Control total del proceso de fermentación, en tiempo real.
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Un sistema compacto, automatizado y accesible para pequeños
                y medianos productores de café.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {OUTCOMES.map(({ svg, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <span className="text-green-400">{svg}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative md:w-1/2 min-h-[220px] flex items-center justify-center p-8"
            style={{ borderLeft: "1.5px dashed rgba(255,255,255,0.4)", background: "rgba(15,142,77,0.06)" }}
          >
            <div className="relative flex items-center justify-center">
              <div
                className="absolute w-48 h-48 rounded-full blur-3xl opacity-30"
                style={{ background: "#0F8E4D" }}
              />
              <svg width="140" height="140" viewBox="0 0 140 140" className="relative z-10">
                <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(15,142,77,0.3)" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="70" cy="70" r="36" fill="none" stroke="rgba(15,142,77,0.5)" strokeWidth="1" />
                <circle cx="70" cy="70" r="18" fill="rgba(15,142,77,0.15)" stroke="rgba(15,142,77,0.6)" strokeWidth="1.5" />
                <circle cx="70" cy="70" r="5" fill="#0F8E4D" />
                <line x1="70" y1="52" x2="70" y2="34" stroke="rgba(15,142,77,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="70" y1="88" x2="70" y2="106" stroke="rgba(15,142,77,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="52" y1="70" x2="34" y2="70" stroke="rgba(15,142,77,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="88" y1="70" x2="106" y2="70" stroke="rgba(15,142,77,0.5)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            </div>
          </div>
        </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Characteristics;
