import { useState } from "react";
import ContactChat from "./ContactChat";
import SupportChatModal from "../../../support-chat/presentation/components/SupportChatModal";
import { useUserAuth } from "../../../../core/hooks/userAuth";

const footerLinks: Record<string, { label: string; href: string; target?: string }[]> = {
  Páginas: [
    { label: "Inicio",               href: "#" },
    { label: "App móvil",            href: "#app" },
    { label: "Objetivos",            href: "#objetivos" },
    { label: "Negocio",              href: "#negocio" },
    { label: "Equipo",               href: "#team" },
    { label: "Experiencias",         href: "/experiences" },
  ],
  Redes: [
    { label: "Facebook",             href: "https://www.facebook.com/share/17AH5RJtvN/", target: "_blank" },
    { label: "Instagram",            href: "https://www.instagram.com/nich_ka_space?utm_source=qr&igsh=MTJvZHc4bmlpZ3k5", target: "_blank" },
    { label: "Tiktok",               href: "https://www.tiktok.com/@nich_ka_space?_r=1&_t=ZS-95hawcvOw6R", target: "_blank" },
    { label: "LinkedIn",             href: "https://www.linkedin.com/company/nich-k%C3%A1/about/", target: "_blank" },
  ],
  Legal: [
    { label: "Privacidad",           href: "/privacy" },
    { label: "Términos de uso",      href: "/terms" },
    { label: "Cookies",              href: "/cookies" },
  ],
  Cuenta: [
    { label: "Registrarse",          href: "/register" },
    { label: "Iniciar sesión",       href: "/login" },
    { label: "Olvidé mi contraseña", href: "/forgot-password" },
  ],
};

const Footer = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const { user } = useUserAuth();
  const isAdmin = user?.role === "admin";

  return (
    <footer className="relative w-full bg-bg overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px w-full bg-white/10" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-6 gap-12">
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo.svg"
              alt="Nich-ká Logo"
              className="h-8 w-8 object-contain rounded-lg"
            />
            <span className="text-white font-semibold text-lg tracking-wide">
              Nich-Ká
            </span>
          </div>
          <p className="text-neutral-500 text-sm leading-relaxed">
            © {new Date().getFullYear()} Nich-ká. <br />
            Todos los derechos reservados.
          </p>
        </div>

        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category} className="flex flex-col gap-4">
            <h3 className="text-white text-sm font-semibold">{category}</h3>
            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.target}
                    rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                    className="text-neutral-500 text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex flex-col gap-4">
          <h3 className="text-white text-sm font-semibold">Soporte</h3>
          <ul className="flex flex-col gap-3">
            <li>
              <button
                onClick={() => setChatOpen(true)}
                className="text-neutral-500 text-sm hover:text-white transition-colors duration-200 text-left"
              >
                Contactar soporte
              </button>
            </li>
          </ul>
        </div>

        {isAdmin
          ? <SupportChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
          : <ContactChat     open={chatOpen} onClose={() => setChatOpen(false)} />}
      </div>

      <div className="relative w-full select-none overflow-hidden h-40 md:h-56">
        <div className="mx-auto max-w-7xl px-6">
          <span
            className="absolute bottom-0 whitespace-nowrap font-black text-[clamp(5rem,18vw,14rem)] leading-none text-white/4 tracking-tight"
          >
            Nich-Ká
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;