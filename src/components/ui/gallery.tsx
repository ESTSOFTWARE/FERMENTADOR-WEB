import { useState, useEffect, type ReactNode } from "react";
import { motion, useMotionValue } from "motion/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Direction = "left" | "right";

export interface GalleryPhoto {
  id: number;
  order: number;
  x: string;
  y: string;
  zIndex: number;
  direction: Direction;
  src: string;
}

// Fotos por defecto (reemplázalas por las tuyas desde quien use el componente).
const DEFAULT_PHOTOS: GalleryPhoto[] = [
  { id: 1, order: 0, x: "-320px", y: "15px", zIndex: 50, direction: "left",  src: "assets/experiences/one.jpeg" },
  { id: 2, order: 1, x: "-160px", y: "32px", zIndex: 40, direction: "left",  src: "assets/experiences/two.jpeg" },
  { id: 3, order: 2, x: "0px",    y: "8px",  zIndex: 30, direction: "right", src: "assets/experiences/three.jpeg" },
  { id: 4, order: 3, x: "160px",  y: "22px", zIndex: 20, direction: "right", src: "assets/experiences/four.jpeg" },
  { id: 5, order: 4, x: "320px",  y: "44px", zIndex: 10, direction: "left",  src: "assets/experiences/five.jpeg" },
];

interface PhotoGalleryProps {
  animationDelay?: number;
  eyebrow?: string;
  title?: ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  photos?: GalleryPhoto[];
}

export const PhotoGallery = ({
  animationDelay = 0.5,
  eyebrow = "Una galería de momentos",
  title = "Nuestras historias",
  buttonText,
  onButtonClick,
  photos = DEFAULT_PHOTOS,
}: PhotoGalleryProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => setIsVisible(true), animationDelay * 1000);
    const animationTimer = setTimeout(() => setIsLoaded(true), (animationDelay + 0.4) * 1000);
    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, [animationDelay]);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const photoVariants = {
    hidden: () => ({ x: 0, y: 0, rotate: 0, scale: 1 }),
    visible: (custom: { x: string; y: string; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.15,
      },
    }),
  };

  return (
    <div className="mt-40 relative">
      <div className="absolute inset-0 max-md:hidden top-[200px] -z-10 h-[300px] w-full bg-transparent bg-[linear-gradient(to_right,#a8a29e_1px,transparent_1px),linear-gradient(to_bottom,#a8a29e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-10 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <p className="lg:text-md my-2 text-center text-xs font-light uppercase tracking-widest text-white/50">
        {eyebrow}
      </p>
      <h3 className="z-20 mx-auto max-w-4xl py-3 text-center text-5xl md:text-7xl font-extrabold tracking-tight text-white">
        {title}
      </h3>
      <div className="relative mb-8 h-[350px] w-full items-center justify-center lg:flex">
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="relative h-[220px] w-[220px]">
              {[...photos].reverse().map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex }}
                  variants={photoVariants}
                  custom={{ x: photo.x, y: photo.y, order: photo.order }}
                >
                  <Photo
                    width={220}
                    height={220}
                    src={photo.src}
                    alt="Foto de experiencia"
                    direction={photo.direction}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      {buttonText && (
        <div className="flex w-full justify-center">
          <Button
            onClick={onButtonClick}
            className="rounded-full bg-[#0F8E4D] px-7 text-white hover:bg-[#0F8E4D]/90"
          >
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
};

function getRandomNumberInRange(min: number, max: number): number {
  if (min >= max) {
    throw new Error("Min value should be less than max value");
  }
  return Math.random() * (max - min) + min;
}

export const Photo = ({
  src,
  alt,
  className,
  direction,
  width,
  height,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
}) => {
  const [rotation] = useState<number>(
    () => getRandomNumberInRange(1, 4) * (direction === "left" ? -1 : 1),
  );
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  function handleMouse(event: {
    currentTarget: { getBoundingClientRect: () => DOMRect };
    clientX: number;
    clientY: number;
  }) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const resetMouse = () => {
    x.set(200);
    y.set(200);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.2, zIndex: 9999 }}
      whileHover={{ scale: 1.1, rotateZ: 2 * (direction === "left" ? -1 : 1), zIndex: 9999 }}
      whileDrag={{ scale: 1.1, zIndex: 9999 }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width,
        height,
        perspective: 400,
        zIndex: 1,
        willChange: "transform",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className={cn(className, "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing")}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      draggable={false}
      tabIndex={0}
      {...props}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-sm">
        <img
          className="absolute inset-0 h-full w-full rounded-3xl object-cover"
          src={src}
          alt={alt}
          draggable={false}
        />
      </div>
    </motion.div>
  );
};
