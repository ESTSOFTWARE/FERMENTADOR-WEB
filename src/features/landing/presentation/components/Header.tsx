import { useState } from "react";
import { cn } from "../../../../lib/utils";

const navLinks = [
  { label: "Inicio",       href: "/" },
  { label: "Problema",    href: "/#planteamiento" },
  { label: "Justificación", href: "/#justificacion" },
  { label: "Objetivos",   href: "/#objetivos" },
  { label: "Alcances",    href: "/#alcances" },
  { label: "Negocio",     href: "/#negocio" },
  // { label: "Características", href: "/#features" },
  // { label: "¿Cómo funciona?", href: "/#how-it-works" },
  // { label: "Blog",            href: "/#blog" },
  // { label: "Equipo",          href: "/#equipo" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div
        className={cn(
          "mx-auto max-w-7xl rounded-2xl border border-white/10",
          "bg-white/5 backdrop-blur-md shadow-lg shadow-black/20",
          "px-6 py-3 flex items-center justify-between"
        )}
      >
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo.svg"
            alt="Nich-Ká Logo"
            className="h-8 w-8 object-contain"
          />
          <span className="text-white font-semibold text-lg tracking-wide">
            Nich-Ká
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="/login"
            className="text-sm text-neutral-300 hover:text-white transition-colors duration-200"
          >
            Iniciar sesión
          </a>
          <a
            href="/register"
            className={cn(
              "text-sm font-medium px-4 py-2 rounded-xl",
              "bg-white text-black hover:bg-neutral-200 transition-colors duration-200"
            )}
          >
            Registrarse
          </a>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              "block h-0.5 w-6 bg-white transition-all duration-300",
              menuOpen && "translate-y-2 rotate-45"
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-6 bg-white transition-all duration-300",
              menuOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-6 bg-white transition-all duration-300",
              menuOpen && "-translate-y-2 -rotate-45"
            )}
          />
        </button>
      </div>

      <div
        className={cn(
          "md:hidden mx-auto max-w-7xl mt-2 rounded-2xl border border-white/10",
          "bg-white/5 backdrop-blur-md overflow-hidden transition-all duration-300",
          menuOpen ? "max-h-96 py-4" : "max-h-0 py-0"
        )}
      >
        <nav className="flex flex-col px-6 gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <hr className="border-white/10" />
          <a href="/login" className="text-sm text-neutral-300 hover:text-white transition-colors">
            Iniciar sesión
          </a>
          <a
            href="/register"
            className="text-sm font-medium px-4 py-2 rounded-xl bg-white text-black text-center hover:bg-neutral-200 transition-colors"
          >
            Registrarse
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;