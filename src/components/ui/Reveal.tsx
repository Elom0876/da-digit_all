"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  /** Sélecteur des enfants à révéler en stagger. À défaut, révèle le conteneur entier. */
  targets?: string;
  stagger?: number;
  y?: number;
  delay?: number;
  className?: string;
};

/**
 * Fade + translateY à l'entrée en viewport, factorisé pour les sections
 * ajoutées après le parcours — même grammaire de mouvement (ease, distances)
 * que le reste du site, sans dupliquer le boilerplate GSAP dans chacune.
 */
export default function Reveal({
  children,
  targets,
  stagger = 0.08,
  y = 24,
  delay = 0,
  className = "",
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const els = targets
          ? (self.selector!(targets) as HTMLElement[])
          : [root.current];

        gsap.set(els, { autoAlpha: 0, y });

        gsap.to(els, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          stagger,
          scrollTrigger: {
            trigger: root.current,
            start: "top 82%",
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const els = targets ? (self.selector!(targets) as HTMLElement[]) : [root.current];
        gsap.set(els, { autoAlpha: 1, y: 0 });
      });

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [targets, stagger, y, delay]);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
