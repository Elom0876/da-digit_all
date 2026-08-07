"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

type Props = {
  children: ReactNode;
  className?: string;
  /** Amplitude maximale de l'inclinaison, en degrés. */
  max?: number;
};

/**
 * Carte qui s'incline vers le pointeur, comme le regard qui tourne autour
 * du laptop dans le parcours. Même mécanique : deux variables CSS pilotées
 * par gsap.quickTo, lues par une transform rotateX/rotateY sur le conteneur.
 */
export default function TiltCard({ children, className = "", max = 8 }: Props) {
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = card.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const rxTo = gsap.quickTo(el, "--rx", { duration: 0.5, ease: "power3.out" });
    const ryTo = gsap.quickTo(el, "--ry", { duration: 0.5, ease: "power3.out" });
    const glowXTo = gsap.quickTo(el, "--glow-x", { duration: 0.4, ease: "power2.out" });
    const glowYTo = gsap.quickTo(el, "--glow-y", { duration: 0.4, ease: "power2.out" });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      rxTo((0.5 - py) * max * 2);
      ryTo((px - 0.5) * max * 2);
      glowXTo(px * 100);
      glowYTo(py * 100);
    };

    const onLeave = () => {
      rxTo(0);
      ryTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div
      ref={card}
      className={`group [perspective:1200px] ${className}`}
      style={{ "--rx": 0, "--ry": 0, "--glow-x": 50, "--glow-y": 50 } as React.CSSProperties}
    >
      <div
        className="relative h-full [transform-style:preserve-3d] transition-transform duration-300 ease-[var(--ease-device)] motion-reduce:transform-none"
        style={{
          transform:
            "rotateX(calc(var(--rx) * 1deg)) rotateY(calc(var(--ry) * 1deg))",
        }}
      >
        {/* Lueur qui suit le pointeur, très discrète */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-[var(--radius-card)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(320px circle at calc(var(--glow-x) * 1%) calc(var(--glow-y) * 1%), rgba(242,146,31,0.10), transparent 60%)",
          }}
        />
        {children}
      </div>
    </div>
  );
}
