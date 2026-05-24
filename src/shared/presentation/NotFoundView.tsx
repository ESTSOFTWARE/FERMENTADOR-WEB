import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { Home } from 'lucide-react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  alpha: number
  color: string
}

const COLORS = ['#51A60B', '#0F8E4D', '#6ee7b7', '#a7f3d0', '#bbf7d0']

const NotFoundView = () => {
  const navigate = useNavigate()

  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const heroRef     = useRef<HTMLDivElement>(null)
  const code404Ref  = useRef<HTMLHeadingElement>(null)
  const titleRef    = useRef<HTMLParagraphElement>(null)
  const descRef     = useRef<HTMLParagraphElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const orbRef      = useRef<HTMLDivElement>(null)
  const headerRef   = useRef<HTMLElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    const particles: Particle[] = []

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 80; i++) {
      particles.push({
        x:     Math.random() * window.innerWidth,
        y:     Math.random() * window.innerHeight,
        vx:    (Math.random() - 0.5) * 0.4,
        vy:    (Math.random() - 0.5) * 0.4,
        r:     Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(headerRef.current, { y: -60, opacity: 0, duration: 0.8 })
        .from(orbRef.current,    { scale: 0.3, opacity: 0, duration: 1.2, ease: 'elastic.out(1,0.5)' }, '-=0.4')
        .from(code404Ref.current, { y: 40, opacity: 0, duration: 0.7 }, '-=0.8')
        .from(titleRef.current,   { y: 30, opacity: 0, duration: 0.6 }, '-=0.5')
        .from(descRef.current,    { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
        .from(ctaRef.current,     { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')

      gsap.to(orbRef.current, {
        y: '-=18',
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col"
      style={{ backgroundColor: '#0A0A0B' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(15,142,77,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(81,166,11,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      <main
        ref={heroRef}
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-20"
      >

        <div
          ref={orbRef}
          className="relative mt-10 mb-4"
          style={{ willChange: 'transform' }}
        >

          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(81,166,11,0.25) 0%, transparent 70%)',
              filter: 'blur(30px)',
              transform: 'scale(1.8)',
            }}
          />

          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: 120,
              height: 120,
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1.5px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow:
                '0 0 40px rgba(81,166,11,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >

            <svg
              width="50"
              height="50"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="40" cy="40" r="36" stroke="#51A60B" strokeWidth="2.5" strokeDasharray="6 4" />
              <circle cx="40" cy="40" r="26" fill="rgba(81,166,11,0.1)" />
              <path
                d="M40 22v22"
                stroke="#6ee7b7"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="40" cy="52" r="3" fill="#6ee7b7" />
            </svg>
          </div>
        </div>

        <h1
          ref={code404Ref}
          className="font-bold leading-none select-none"
          style={{
            fontSize: 'clamp(5rem, 16vw, 10rem)',
            background:
              'linear-gradient(135deg, #51A60B 0%, #0F8E4D 40%, #6ee7b7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            letterSpacing: '-0.04em',
          }}
        >
          404
        </h1>

        <p
          ref={titleRef}
          className="mt-4 text-white font-semibold"
          style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)' }}
        >
          ¡Ups! Parece que te has perdido.
        </p>

        <p
          ref={descRef}
          className="mt-4 text-neutral-400 max-w-lg leading-relaxed"
          style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}
        >
          Lo sentimos, la página que estás buscando no existe. Es posible que el
          enlace sea incorrecto, que la página haya cambiado de dirección o que
          haya sido eliminada.
          <br />
          <br />
          No te preocupes, puedes volver a nuestro contenido principal haciendo
          clic aquí:
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-col sm:flex-row items-center gap-4">

          <button
            id="btn-volver-inicio"
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-green-400 hover:shadow-[0_0_24px_rgba(74,222,128,0.4)] focus:outline-none"
          >
            <Home size={16} aria-hidden="true" />
            Volver a la página de inicio
          </button>
        </div>

        <div
          className="mt-20 w-px h-16 mx-auto"
          style={{
            background:
              'linear-gradient(to bottom, rgba(81,166,11,0.4), transparent)',
          }}
        />
      </main>
    </div>
  )
}

export default NotFoundView
