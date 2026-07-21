import { motion } from 'motion/react'
import { HexagonPattern } from '../../../../components/ui/hexagon-pattern'
import { cn } from '../../../../lib/utils'

const PHONES = [
  { src: '/assets/login.png',    alt: 'Inicio de sesión', z: 10, x: -135, rotate: -8, scale: 0.86, delay: 0.15, float: 6.5 },
  { src: '/assets/overview.png', alt: 'Panel principal',  z: 30, x: 0,    rotate: 0,  scale: 1,    delay: 0.45, float: 8.5 },
  { src: '/assets/sensores.png', alt: 'Sensores en vivo', z: 20, x: 135,  rotate: 8,  scale: 0.86, delay: 0.75, float: 7.5 },
]

const Phone = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} style={{ width: 310 }} />
)

const AppPromo = () => (
  <section className="relative w-full overflow-hidden" style={{ background: '#0F8E4D' }}>

    <HexagonPattern
      hexagons={[[1,1],[4,4],[2,2],[3,4],[5,4],[8,2],[6,3],[8,5],[10,10],[12,3],[7,7],[3,8]]}
      className={cn(
        'absolute inset-0 z-0 [&_svg]:w-full [&_svg]:h-full',
        'mask-[radial-gradient(600px_circle_at_center,white,transparent)]',
      )}
      radius={36}
    />

    <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-black/20" />

    <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:py-28 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 sm:gap-16">

      <motion.div
        className="flex flex-col gap-6"
        initial={{ opacity: 0, x: -32 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      >
        <span className="text-[11px] font-semibold text-white/70 uppercase tracking-[0.3em]">
          App móvil
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
          Lleva Nich-Ká<br />en tu bolsillo
        </h2>
        <p className="text-white/85 text-base leading-relaxed max-w-md">
          Monitorea tus fermentaciones en tiempo real, únete a tus clases con un código
          y revisa los sensores desde donde estés — todo desde la app. Recibe alertas al
          instante, consulta el historial de cada lote y deja que la IA te recomiende los
          ajustes para lograr el mejor perfil de tu café.
        </p>

        <div className="flex flex-wrap gap-3 mt-2">
          <a
            href="https://play.google.com/store/apps/details?id=com.nichka.app"
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-black hover:bg-neutral-900 transition-colors"
          >
            <img src="/assets/icons/googleplay.svg" alt="" className="w-6 h-6"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <div className="text-left leading-tight">
              <p className="text-[10px] text-white/60 uppercase tracking-wide">Descárgala en</p>
              <p className="text-sm font-semibold text-white">Google Play</p>
            </div>
          </a>
        </div>
      </motion.div>

      <div className="relative h-[520px] flex items-center justify-center">
        {PHONES.map((p) => (
          <motion.div
            key={p.src}
            className="absolute"
            style={{ zIndex: p.z }}
            initial={{ opacity: 0, y: 90, rotate: p.rotate, scale: p.scale }}
            whileInView={{ opacity: 1, y: 0, x: p.x, rotate: p.rotate, scale: p.scale }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: p.delay }}
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: p.float, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Phone src={p.src} alt={p.alt} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

export default AppPromo
