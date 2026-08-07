"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Couche d'atmosphère fixe, posée derrière tout le site.
 *
 * Trois halos très diffus (orange / violet / bleu) dérivent lentement sur
 * un fond blanc cassé. Par-dessus, une grille de pixels reprend le motif
 * de dissolution du logo DA Digit All : elle est masquée en radial pour
 * ne rester lisible qu'au centre, là où flottent les appareils.
 *
 * Rien ici ne doit attirer l'œil : le fond met en valeur, il ne raconte pas.
 */
export default function AmbientBackground() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const halos = self.selector!(".halo") as HTMLElement[];

        halos.forEach((halo, i) => {
          gsap.to(halo, {
            xPercent: gsap.utils.random(-14, 14),
            yPercent: gsap.utils.random(-12, 12),
            scale: gsap.utils.random(0.9, 1.15),
            duration: gsap.utils.random(18, 26),
            delay: i * 1.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });

        // Les traits de liaison se dessinent puis s'effacent, en boucle décalée.
        gsap.to(self.selector!(".link-path"), {
          strokeDashoffset: 0,
          duration: 6,
          ease: "power1.inOut",
          stagger: { each: 1.2, repeat: -1, yoyo: true },
          repeat: -1,
          yoyo: true,
        });
      });

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas"
    >
      {/* Base lumineuse : le blanc cassé se réchauffe vers le bas */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#ffffff_0%,var(--color-canvas)_45%,var(--color-sand)_140%)]" />

      {/* Halos */}
      <div className="halo absolute -top-[22vh] left-[-10vw] h-[70vw] w-[70vw] max-h-[820px] max-w-[820px] rounded-full bg-[radial-gradient(circle,rgba(242,146,31,0.30)_0%,rgba(242,146,31,0)_62%)] blur-[60px]" />
      <div className="halo absolute top-[18vh] right-[-16vw] h-[68vw] w-[68vw] max-h-[860px] max-w-[860px] rounded-full bg-[radial-gradient(circle,rgba(107,63,212,0.24)_0%,rgba(107,63,212,0)_64%)] blur-[70px]" />
      <div className="halo absolute bottom-[-28vh] left-[22vw] h-[60vw] w-[60vw] max-h-[760px] max-w-[760px] rounded-full bg-[radial-gradient(circle,rgba(46,107,230,0.18)_0%,rgba(46,107,230,0)_66%)] blur-[80px]" />

      {/* Grille de pixels — écho direct au motif du logo */}
      <svg
        className="absolute inset-0 h-full w-full"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="da-pixels"
            width="34"
            height="34"
            patternUnits="userSpaceOnUse"
          >
            <rect
              width="3"
              height="3"
              x="0"
              y="0"
              fill="var(--color-ink)"
              opacity="0.55"
            />
          </pattern>
          <radialGradient id="da-pixel-mask" cx="50%" cy="42%" r="58%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="55%" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="da-fade">
            <rect width="100%" height="100%" fill="url(#da-pixel-mask)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#da-pixels)"
          mask="url(#da-fade)"
        />
      </svg>

      {/* Lignes de connexion : trois courbes hairline, presque subliminales */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="var(--color-violet)" strokeWidth="1" opacity="0.14">
          <path
            className="link-path"
            d="M-40 640 C 300 640, 380 300, 720 300 S 1180 520, 1500 470"
            strokeDasharray="1800"
            strokeDashoffset="1800"
          />
          <path
            className="link-path"
            d="M-40 220 C 260 220, 420 610, 760 610 S 1220 240, 1500 300"
            strokeDasharray="1800"
            strokeDashoffset="1800"
          />
        </g>
        <path
          className="link-path"
          d="M-40 830 C 340 830, 520 120, 900 120 S 1300 700, 1500 700"
          stroke="var(--color-orange)"
          strokeWidth="1"
          opacity="0.16"
          strokeDasharray="1800"
          strokeDashoffset="1800"
        />
      </svg>

      {/* Grain : casse le côté « dégradé plastique » des halos */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Voile bas pour asseoir le contenu */}
      <div className="absolute inset-x-0 bottom-0 h-[26vh] bg-gradient-to-b from-transparent to-[rgba(241,231,217,0.65)]" />
    </div>
  );
}
