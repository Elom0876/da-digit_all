"use client";

import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "violet" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Rend un <Link> Next au lieu d'un <button>. */
  href?: string;
  /** Icône affichée après le libellé (flèche, chevron…). */
  trailing?: ReactNode;
  /** Coupe la dissolution en pixels au survol. */
  quiet?: boolean;
  className?: string;
};

type Props = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-orange text-white shadow-[0_10px_30px_-12px_rgba(242,146,31,0.85)] hover:shadow-[0_16px_40px_-14px_rgba(242,146,31,0.95)]",
  violet:
    "bg-ink text-canvas shadow-[0_10px_30px_-14px_rgba(36,27,75,0.9)] hover:bg-violet",
  outline:
    "bg-transparent text-ink ring-1 ring-inset ring-hairline hover:ring-violet hover:text-violet",
  ghost: "bg-transparent text-muted hover:text-ink",
};

const PIXEL_TINT: Record<Variant, string> = {
  primary: "bg-white",
  violet: "bg-orange",
  outline: "bg-orange",
  ghost: "bg-orange",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8125rem] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-[3.25rem] px-7 text-[0.9375rem] gap-2.5",
};

/**
 * La signature du bouton reprend le motif du logo : au survol, une petite
 * cascade de carrés se matérialise dans le coin haut-droit, comme si le
 * libellé commençait à se pixelliser. Six carrés, décalés dans le temps —
 * assez pour être remarqué une fois, assez discret pour ne pas fatiguer.
 */
const PIXELS = [
  { top: 6, right: 6, size: 3, delay: 0 },
  { top: 6, right: 12, size: 3, delay: 40 },
  { top: 12, right: 6, size: 3, delay: 80 },
  { top: 12, right: 15, size: 2, delay: 130 },
  { top: 18, right: 9, size: 2, delay: 180 },
  { top: 18, right: 16, size: 2, delay: 230 },
];

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    href,
    trailing,
    quiet = false,
    className = "",
    ...rest
  },
  ref,
) {
  const classes = [
    "group relative inline-flex select-none items-center justify-center overflow-hidden",
    "rounded-full font-medium tracking-[-0.01em] whitespace-nowrap",
    "transition-[transform,box-shadow,background-color,color,box-shadow] duration-300 ease-[var(--ease-device)]",
    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985]",
    "disabled:pointer-events-none disabled:opacity-45",
    "motion-reduce:transform-none motion-reduce:transition-none",
    SIZES[size],
    VARIANTS[variant],
    className,
  ].join(" ");

  const inner = (
    <>
      {/* Reflet diagonal qui balaie le bouton au survol */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.35)_50%,transparent_65%)] transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden"
      />

      {!quiet &&
        PIXELS.map((p, i) => (
          <span
            key={i}
            aria-hidden
            className={`pointer-events-none absolute scale-0 opacity-0 transition-all duration-300 ease-[var(--ease-device)] group-hover:scale-100 group-hover:opacity-90 motion-reduce:hidden ${PIXEL_TINT[variant]}`}
            style={{
              top: p.top,
              right: p.right,
              width: p.size,
              height: p.size,
              transitionDelay: `${p.delay}ms`,
            }}
          />
        ))}

      <span className="relative z-10 flex items-center gap-[inherit]">
        {children}
        {trailing && (
          <span className="transition-transform duration-300 ease-[var(--ease-device)] group-hover:translate-x-0.5 motion-reduce:transform-none">
            {trailing}
          </span>
        )}
      </span>
    </>
  );

  if (href) {
    const external = /^https?:\/\//.test(href);
    return external ? (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button ref={ref} className={classes} {...rest}>
      {inner}
    </button>
  );
});

export default Button;
