const TECHS = [
  { icon: "python",     path: "/assets/icons/python.svg" },
  { icon: "arduino",    path: "/assets/icons/arduino.svg" },
  { icon: "react",      path: "/assets/icons/react.svg" },
  { icon: "flutter",    path: "/assets/icons/flutter.svg" },
  { icon: "nodejs",     path: "/assets/icons/nodejs.svg" },
  { icon: "tailwind",   path: "/assets/icons/tailwindcss.svg" },
  { icon: "postgresql", path: "/assets/icons/postgresql.svg" },
  { icon: "docker",     path: "/assets/icons/docker.svg" },
  { icon: "railway",    path: "/assets/icons/railway.svg" },
  { icon: "supabase",   path: "/assets/icons/supabase.svg" },
  { icon: "nginx",      path: "/assets/icons/nginx.svg" },
];

export const TechComponent = () => (
  <div className="flex flex-wrap justify-center gap-6">
    {TECHS.map(tech => (
      <div key={tech.icon} className="group flex flex-col items-center gap-3 cursor-default">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:brightness-125"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <img src={tech.path} alt={tech.icon} className="w-6 h-6 object-contain" />
        </div>
        <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors duration-200 font-medium capitalize">
          {tech.icon}
        </span>
      </div>
    ))}
  </div>
);
