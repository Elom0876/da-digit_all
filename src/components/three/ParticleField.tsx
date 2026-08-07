"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ParticleFieldCanvas = dynamic(() => import("./ParticleFieldCanvas"), {
  ssr: false,
});

type Props = { className?: string };

/**
 * Fond de particules borné à sa section (pas un canvas global permanent).
 * Le rendu Three.js ne tourne que si la section est visible et si
 * l'utilisateur n'a pas demandé de réduire les animations — sinon on
 * n'y installe même pas le Canvas.
 */
export default function ParticleField({ className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Halo statique : visible immédiatement, et seul rendu si reduced-motion. */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(107,63,212,0.14)_0%,rgba(242,146,31,0.08)_45%,transparent_75%)]" />

      {!reduced && inView && (
        <ParticleFieldCanvas className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}
