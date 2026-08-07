"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Props = {
  value: string;
  className?: string;
  as?: "p" | "dd" | "dt";
};

/**
 * Anime la partie numérique d'une statistique à l'entrée en viewport, en
 * conservant le texte autour (« Sous 4 h », « 40+ », « −38 % »). Si aucun
 * nombre n'est trouvé, la valeur s'affiche simplement telle quelle.
 */
export default function CountUp({ value, className = "", as = "p" }: Props) {
  // Marqueur de taille nulle : évite le casse-tête de typer un ref sur une
  // balise dynamique (p | dd), tout en donnant à IntersectionObserver une
  // position réelle dans la mise en page.
  const marker = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/^(\D*)(\d+)(.*)$/);
    const el = marker.current;
    if (!match || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const [, prefix, digits, suffix] = match;
    const target = parseInt(digits, 10);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const proxy = { n: 0 };
        gsap.to(proxy, {
          n: target,
          duration: 1.3,
          ease: "power2.out",
          onUpdate: () => setDisplay(`${prefix}${Math.round(proxy.n)}${suffix}`),
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  const Tag = as;
  return (
    <Tag className={className}>
      <span ref={marker} aria-hidden />
      {display}
    </Tag>
  );
}
