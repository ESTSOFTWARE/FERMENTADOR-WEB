import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg",
  {
    variants: {
      gradient: {
        orange: "bg-gradient-to-br from-orange-100 to-amber-200/50",
        gray:   "bg-gradient-to-br from-slate-100 to-slate-200/50",
        purple: "bg-gradient-to-br from-purple-100 to-indigo-200/50",
        green:  "bg-gradient-to-br from-emerald-100 to-teal-200/50",
      },
    },
    defaultVariants: {
      gradient: "gray",
    },
  }
);

export interface GradientCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  badgeText: string;
  badgeColor: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  icon: React.ReactNode;
}

const cardAnimation = {
  rest:  { scale: 1, y: 0 },
  hover: { scale: 1.03, y: -4 },
};

const iconAnimation = {
  rest:  { scale: 1, rotate: 0, opacity: 0.82 },
  hover: { scale: 1.06, rotate: 6, opacity: 1 },
};

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  (
    { className, gradient, badgeText, badgeColor, title, description, ctaText, ctaHref, icon, ...props },
    ref
  ) => (
    <motion.div
      variants={cardAnimation}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="h-full"
      ref={ref}
    >
      <div className={cn(cardVariants({ gradient }), className)} {...props}>
        {/* Decorative icon — fixed size, bottom-right, low opacity */}
        <motion.div
          variants={iconAnimation}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="pointer-events-none absolute -bottom-14 -right-14 size-80 [&_svg]:size-full"
        >
          {icon}
        </motion.div>

        <div className="z-10 flex flex-col h-full">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-background/50 px-3 py-1 text-sm font-medium text-foreground/80 backdrop-blur-sm w-fit">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: badgeColor }} />
            {badgeText}
          </div>

          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-foreground/70 max-w-xs">{description}</p>
          </div>

          <Link
            to={ctaHref}
            className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            {ctaText}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
);
GradientCard.displayName = "GradientCard";

// eslint-disable-next-line react-refresh/only-export-components
export { GradientCard, cardVariants };
