import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../../../lib/utils";
import Scales from "../../../../components/ui/scales";
import Text3DFlip from "../../../../components/ui/text-3d-flip";
import { TechComponent } from "./ui/TechComponent";

type ContactType = "github" | "linkedin" | "web" | "whatsapp" | "facebook";

type ContactLink = {
  type: ContactType;
  url: string;
};

type TeamMember = {
  name: string;
  role: string;
  initials: string;
  photo: string;
  color: string;
  bg: string;
  links?: ContactLink[];
};

const CONTACT_ICONS: Record<ContactType, string> = {
  github:   "/assets/icons/github.svg",
  linkedin: "/assets/icons/linkedin.svg",
  whatsapp: "/assets/icons/whatsapp.svg",
  facebook: "/assets/icons/facebook.svg",
  web:      "/assets/icons/web.svg",
};

const TEAM: TeamMember[] = [
  {
    name: "Ameth Toledo",
    role: "FullStack & IoT",
    initials: "AT",
    photo: "/assets/devs/amethdev.png",
    color: "#4ade80",
    bg: "from-emerald-950 to-emerald-800",
    links: [
      { type: "github", url: "https://github.com/Ameth-Toledo" },
      { type: "web", url: "https://www.amethdev.com/" },
      { type: "linkedin", url: "https://www.linkedin.com/in/ameth-de-jes%C3%BAs-m%C3%A9ndez-toledo/" },
      { type: "whatsapp", url: "https://wa.me/529613037813" },
    ],
  },
  {
    name: "Victor Pérez",
    role: "FullStack Developer",
    initials: "VP",
    photo: "/assets/devs/fabriciodev.png",
    color: "#38bdf8",
    bg: "from-sky-950 to-sky-800",
    links: [
      { type: "github",   url: "https://github.com/FabricioPRZ" },
      { type: "web",      url: "https://fabricio-prz-dev.vercel.app/" },
      { type: "linkedin", url: "https://linkedin.com/in/fabricio-prz" },
      { type: "whatsapp", url: "https://wa.me/529619009651" }
    ],
  },
  {
    name: "Melissa Corral",
    role: "Frontend Developer",
    initials: "MC",
    photo: "/assets/devs/melissadev.png",
    color: "#f472b6",
    bg: "from-pink-950 to-pink-800",
    links: [
      { type: "github",   url: "https://github.com/MelissaZarate08" },
      { type: "web",      url: "https://melissazarate08.github.io/Portafolio-KMCZ/" },
      { type: "linkedin", url: "https://www.linkedin.com/in/karla-melissa-corral-z%C3%A1rate-274b5529b" },
    ],
  }
];

const ContactIcon = ({ link }: { link: ContactLink }) => (
  <a
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    title={link.type}
    className="w-9 h-9 flex items-center justify-center"
  >
    <img
      src={CONTACT_ICONS[link.type]}
      alt={link.type}
      className="w-5 h-5 object-contain"
      style={{ filter: "brightness(0) invert(1)", opacity: 0.6 }}
    />
  </a>
);

const MemberCard = ({ member }: { member: TeamMember }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col gap-5 items-start w-full max-w-[300px]">
      <div className="relative w-full" style={{ height: 300 }}>
        <div className="absolute -inset-y-[30%] -left-7 h-[160%] w-6 mask-t-from-90% mask-b-from-90% z-10">
          <Scales size={7} className="rounded-lg" color={member.color} />
        </div>
        <div className="absolute -inset-y-[30%] -right-7 h-[160%] w-6 mask-t-from-90% mask-b-from-90% z-10">
          <Scales size={7} className="rounded-lg" color={member.color} />
        </div>
        <div className="absolute -inset-x-[30%] -top-7 h-6 w-[160%] mask-r-from-90% mask-l-from-90% z-10">
          <Scales size={7} className="rounded-lg" color={member.color} />
        </div>
        <div className="absolute -inset-x-[30%] -bottom-7 h-6 w-[160%] mask-r-from-90% mask-l-from-90% z-10">
          <Scales size={7} className="rounded-lg" color={member.color} />
        </div>

        <div
          className={cn(
            "relative z-20 w-full h-full rounded-xl overflow-hidden flex items-center justify-center",
            `bg-gradient-to-br ${member.bg}`
          )}
          style={{ border: `1px solid ${member.color}20` }}
        >
          {!imgError ? (
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover object-top"
              onError={() => setImgError(true)}
            />
          ) : (
            <>
              <span
                className="absolute text-[7rem] font-black leading-none select-none pointer-events-none"
                style={{ color: `${member.color}12` }}
              >
                {member.initials}
              </span>
              <div
                className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black"
                style={{
                  background: `${member.color}18`,
                  border: `2px solid ${member.color}40`,
                  color: member.color,
                }}
              >
                {member.initials}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2 w-full">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-black text-white tracking-tight">{member.name}</h3>
          <p className="text-xs font-medium" style={{ color: `${member.color}90` }}>{member.role}</p>
        </div>

        {member.links && member.links.length > 0 && (
          <div className="flex items-center gap-1">
            {member.links.map((link) => (
              <ContactIcon key={link.type} link={link} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Equipment = () => (
  <section id="team" className="relative w-full overflow-hidden bg-bg">
    <div
      className="pointer-events-none absolute inset-0 select-none bg-size-[40px_40px]"
      style={{
        backgroundImage:
          "linear-gradient(to right,#111 1px,transparent 1px),linear-gradient(to bottom,#111 1px,transparent 1px)",
      }}
    />
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(15,142,77,0.07), transparent)",
      }}
    />

    <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:py-28 flex flex-col gap-16 sm:gap-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-green-500/70 font-medium">
            El equipo
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[0.95] tracking-tighter">
            <Text3DFlip
              className="bg-transparent justify-start"
              textClassName="bg-transparent bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent"
              flipTextClassName="bg-transparent bg-linear-to-b from-white/50 to-white/20 bg-clip-text text-transparent"
              rotateDirection="top"
              staggerDuration={0.03}
              staggerFrom="first"
              transition={{ type: "spring", damping: 25, stiffness: 160 }}
            >
              Quiénes somos
            </Text3DFlip>
          </h2>
          <div className="w-12 h-1 rounded-full bg-green-500/40 mt-1" />
        </motion.div>

        <div className="flex flex-col items-end gap-4">
          <TechComponent />
          <p className="max-w-sm text-neutral-500 text-sm leading-relaxed md:text-right">
            Ingenieros en software apasionados por la biotecnología, la sostenibilidad y la automatización inteligente.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-8 gap-y-14">
        {TEAM.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <MemberCard member={member} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Equipment;