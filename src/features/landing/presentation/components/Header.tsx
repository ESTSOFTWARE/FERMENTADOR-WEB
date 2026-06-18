import { useState } from 'react'
import { Link }     from 'react-router-dom'
import { cn }       from '../../../../lib/utils'
import { useUserAuth }  from '../../../../core/hooks/userAuth'
import { useCartStore } from '../../../../core/store/useCartStore'

const navLinks = [
  { label: 'Inicio',         href: '/' },
  { label: 'App móvil',      href: '/#app' },

  // { label: 'Justificación',  href: '/#justificacion' },
  { label: 'Objetivos',      href: '/#objetivos' },
  { label: 'Negocio',        href: '/#negocio' },
  { label: 'Equipo',         href: '/#equipo' },
  { label: 'Componentes',    href: '/products' },
]

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout }        = useUserAuth()
  const { openCart, totalItems } = useCartStore()
  const cartCount               = totalItems()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className={cn(
        'mx-auto max-w-7xl rounded-2xl border border-white/10',
        'bg-white/5 backdrop-blur-md shadow-lg shadow-black/20',
        'px-6 py-3 flex items-center justify-between',
      )}>
        <div className="flex items-center gap-3">
          <img src="/assets/logo.svg" alt="Nich-Ká Logo" className="h-8 w-8 object-contain" />
          <span className="text-white font-semibold text-lg tracking-wide">Nich-Ká</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href}
              className="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop — botones condicionales */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {/* Carrito con badge */}
              <button onClick={openCart} className="relative p-2 text-neutral-400 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 text-black text-[10px] font-bold flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
              <Link to="/overview"
                className={cn('text-sm font-medium px-4 py-2 rounded-xl', 'bg-white text-black hover:bg-neutral-200 transition-colors duration-200')}>
                Ir al dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-neutral-300 hover:text-white transition-colors duration-200">
                Iniciar sesión
              </Link>
              <Link to="/register"
                className={cn('text-sm font-medium px-4 py-2 rounded-xl', 'bg-white text-black hover:bg-neutral-200 transition-colors duration-200')}>
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(p => !p)} aria-label="Toggle menu">
          <span className={cn('block h-0.5 w-6 bg-white transition-all duration-300', menuOpen && 'translate-y-2 rotate-45')} />
          <span className={cn('block h-0.5 w-6 bg-white transition-all duration-300', menuOpen && 'opacity-0')} />
          <span className={cn('block h-0.5 w-6 bg-white transition-all duration-300', menuOpen && '-translate-y-2 -rotate-45')} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        'md:hidden mx-auto max-w-7xl mt-2 rounded-2xl border border-white/10',
        'bg-white/5 backdrop-blur-md overflow-hidden transition-all duration-300',
        menuOpen ? 'max-h-96 py-4' : 'max-h-0 py-0',
      )}>
        <nav className="flex flex-col px-6 gap-4">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href}
              className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <hr className="border-white/10" />
          {user ? (
            <>
              <Link to="/overview" onClick={() => setMenuOpen(false)}
                className="text-sm font-medium px-4 py-2 rounded-xl bg-white text-black text-center hover:bg-neutral-200 transition-colors">
                Ir al dashboard
              </Link>
              <button onClick={() => { logout(); setMenuOpen(false) }}
                className="text-sm text-neutral-300 hover:text-white transition-colors text-left">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="text-sm text-neutral-300 hover:text-white transition-colors">
                Iniciar sesión
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="text-sm font-medium px-4 py-2 rounded-xl bg-white text-black text-center hover:bg-neutral-200 transition-colors">
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
