"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AgencyOrbCanvas = dynamic(() => import("./AgencyOrbCanvas"), {
  ssr: false,
});

type Props = { className?: string };

/**
 * Visuel signature de la section Agence : sphère de points qu'on peut
 * attraper à la souris (rotation manuelle, pas d'OrbitControls — la molette
 * doit continuer à faire défiler la page), qui apparaît en douceur avec le
 * scroll et se met en pause dès qu'elle quitte l'écran.
 */
export default function AgencyOrb({ className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const rotationRef = useRef({ x: 0, y: 0 });
  const progressRef = useRef({ value: 0 });
  const drag = useRef({ active: false, x: 0, y: 0 });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Entrée liée au scroll : un ScrollTrigger écrit dans un ref plutôt que
     dans du state React, pour que useFrame lise une valeur fraîche à 60fps
     sans jamais redéclencher de rendu React. */
  useLayoutEffect(() => {
    if (reduced) {
      progressRef.current.value = 1;
      return;
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 90%",
        end: "top 40%",
        scrub: 0.4,
        onUpdate: (self) => {
          progressRef.current.value = self.progress;
        },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      drag.current = { active: true, x: e.clientX, y: e.clientY };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
      rotationRef.current.y += dx * 0.006;
      rotationRef.current.x = gsap.utils.clamp(
        -0.6,
        0.6,
        rotationRef.current.x + dy * 0.006,
      );
    };
    const onUp = () => {
      drag.current.active = false;
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [reduced]);

  return (
    <div
      ref={root}
      className={`relative aspect-square w-full select-none ${
        reduced ? "" : "cursor-grab active:cursor-grabbing"
      } ${className}`}
    >
      {/* Halo statique : socle visuel, et seul rendu si reduced-motion */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,rgba(107,63,212,0.16)_0%,rgba(242,146,31,0.08)_50%,transparent_75%)]" />

      {!reduced && inView && (
        <AgencyOrbCanvas
          rotationRef={rotationRef}
          progressRef={progressRef}
          className="absolute inset-0 h-full w-full touch-none"
        />
      )}
    </div>
  );
}
