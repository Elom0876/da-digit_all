"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  /** Hauteur du site intérieur, en nombre d'écrans. */
  sitePages?: number;
  drive?: "auto" | "manual";
  /** Largeur de l'appareil, en CSS. */
  width?: string;
  /**
   * Opacité de l'appareil quand il est rabattu. À 0, il est totalement
   * invisible et se matérialise pendant l'ouverture — rien ne vient percuter
   * le titre d'accueil.
   */
  opaciteFermee?: number;
  /**
   * Part de l'ouverture pendant laquelle l'appareil finit d'apparaître.
   * À 0,55, il est pleinement opaque à mi-course, bien avant que le capot
   * n'ait fini sa montée.
   */
  seuilApparition?: number;
  static?: boolean;
  className?: string;
};

export type LaptopHandle = {
  /** 0 = capot rabattu, 1 = capot ouvert. */
  setProgress: (p: number) => void;
  /** 0 = haut du site, 1 = bas du site. */
  setSiteScroll: (p: number) => void;
};

/* Géométrie de la charnière.
 *
 * En CSS, un rotateX positif éloigne le bord supérieur de l'observateur.
 * Le clavier est posé à +76° : il part de la charnière et s'avance vers
 * l'observateur. Pour se rabattre DESSUS, le capot doit tourner dans le
 * même sens, donc vers l'avant — et comme il pointe vers le haut au repos,
 * son angle fermé vaut -(180 - 76) = -104°. C'est le seul angle qui rend
 * les deux plans coplanaires.
 *
 * Ouvert, +8° incline la dalle légèrement en arrière : l'écran regarde
 * l'observateur et un peu vers le haut, comme un portable posé sur un bureau.
 */
const ANGLE_BASE = 76;
const CLOSED = -(180 - ANGLE_BASE);
const OPEN = 8;

/* Inclinaison de la scène. Fermé, la caméra prend de la hauteur pour que
   l'objet rabattu se lise comme un volume et non comme un trait. Ouverte,
   elle redescend face à la dalle. */
const VUE_FERMEE = -20;
const VUE_OUVERTE = 4;

const Laptop = forwardRef<LaptopHandle, Props>(function Laptop(
  {
    children,
    sitePages = 5,
    drive = "auto",
    width = "min(92vw, 74vh, 900px)",
    opaciteFermee = 0,
    seuilApparition = 0.55,
    static: isStatic = false,
    className = "",
  },
  ref,
) {
  const root = useRef<HTMLDivElement>(null);
  const device = useRef<HTMLDivElement>(null);
  const lid = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);

  /* Toutes les valeurs animées vivent ici. On écrit des chaînes de transform
     complètes plutôt que des variables CSS arithmétiques : une seule variable
     mal formée invalide toute la propriété transform, et l'appareil se
     retrouve à plat sans que rien ne le signale. */
  const etat = useRef({ ouverture: 0, yaw: 0, tilt: VUE_OUVERTE });

  const composer = useCallback(() => {
    const { ouverture, yaw, tilt } = etat.current;

    // La caméra se redresse au même rythme que le capot.
    const vue = tilt + (VUE_FERMEE - VUE_OUVERTE) * (1 - ouverture);
    const recul = (1 - ouverture) * 0.06;

    if (device.current) {
      device.current.style.transform = `translateY(${-ouverture * 18}px) scale(${1 - recul}) rotateX(${vue}deg) rotateY(${yaw * ouverture}deg)`;

      const apparition = gsap.utils.clamp(0, 1, ouverture / seuilApparition);
      device.current.style.opacity = `${opaciteFermee + (1 - opaciteFermee) * apparition}`;
      // Invisible signifie aussi hors de portée du pointeur.
      device.current.style.visibility =
        apparition === 0 && opaciteFermee === 0 ? "hidden" : "visible";
    }
    if (lid.current) {
      lid.current.style.transform = `rotateX(${CLOSED + (OPEN - CLOSED) * ouverture}deg)`;
    }

    const wake = gsap.utils.clamp(0, 1, (ouverture - 0.55) / 0.35);
    if (veil.current) veil.current.style.opacity = `${1 - wake}`;
    if (glow.current) glow.current.style.opacity = `${wake}`;
    if (shadow.current) shadow.current.style.opacity = `${0.45 + wake * 0.35}`;
  }, [opaciteFermee, seuilApparition]);

  const setProgress = useCallback(
    (p: number) => {
      etat.current.ouverture = gsap.utils.clamp(0, 1, p);
      composer();
    },
    [composer],
  );

  const setSiteScroll = useCallback(
    (p: number) => {
      const el = page.current;
      if (!el) return;
      const v = gsap.utils.clamp(0, 1, p);
      /* Le pourcentage d'un translate se rapporte à la hauteur de l'élément
         lui-même — ici sitePages fois la dalle. Pour parcourir n-1 écrans il
         faut donc (n-1)/n de sa propre hauteur, pas (n-1) × 100 %. */
      el.style.transform = `translate3d(0, ${(-(sitePages - 1) / sitePages) * 100 * v}%, 0)`;
    },
    [sitePages],
  );

  useImperativeHandle(ref, () => ({ setProgress, setSiteScroll }), [
    setProgress,
    setSiteScroll,
  ]);

  useLayoutEffect(() => {
    composer();
    setSiteScroll(0);
  }, [composer, setSiteScroll]);

  /* Mode autonome. */
  useLayoutEffect(() => {
    if (drive === "manual") return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => setProgress(1));
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const proxy = { p: 0 };
        gsap.to(proxy, {
          p: 1,
          ease: "none",
          onUpdate: () => setProgress(proxy.p),
          scrollTrigger: {
            trigger: root.current,
            start: "top 88%",
            end: "top 32%",
            scrub: 0.6,
          },
        });
      });
      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [drive, setProgress]);

  /* Parallaxe souris. */
  useEffect(() => {
    if (isStatic) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const cible = { yaw: 0, tilt: 4 };
    const anim = gsap.to(etat.current, {
      duration: 0.9,
      ease: "power3.out",
      paused: true,
      onUpdate: composer,
    });

    const onMove = (e: PointerEvent) => {
      cible.yaw = -(e.clientX / window.innerWidth - 0.5) * 8;
      cible.tilt = 4 + (e.clientY / window.innerHeight - 0.5) * 3;
      gsap.to(etat.current, {
        yaw: cible.yaw,
        tilt: cible.tilt,
        duration: 0.9,
        ease: "power3.out",
        overwrite: "auto",
        onUpdate: composer,
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      anim.kill();
    };
  }, [isStatic, composer]);

  return (
    <div
      ref={root}
      className={`[perspective:2400px] ${className}`}
      style={{
        ["--lw" as string]: width,
        width: "var(--lw)",
        paddingBottom: "calc(var(--lw) * 0.16)",
      }}
    >
      {/* L'état rabattu est écrit ici, pas seulement appliqué par l'effet :
          le serveur peint déjà l'appareil invisible, sinon il apparaît une
          fraction de seconde avant que le JavaScript ne le masque. */}
      <div
        ref={device}
        className="relative w-full [transform-style:preserve-3d]"
        style={{
          transform: `rotateX(${VUE_FERMEE}deg)`,
          opacity: opaciteFermee,
          visibility: opaciteFermee === 0 ? "hidden" : "visible",
        }}
      >
        {/* ---------- CAPOT ---------- */}
        <div
          ref={lid}
          className="relative aspect-[16/10] w-full origin-bottom [transform-style:preserve-3d]"
          style={{ transform: `rotateX(${CLOSED}deg)` }}
        >
          {/* Face avant : cadre + dalle */}
          <div
            className="absolute inset-0 rounded-[var(--radius-device)] rounded-b-[6px] p-[1.1%] [backface-visibility:hidden]"
            style={{
              background:
                "linear-gradient(160deg,#2c2450 0%,#191233 46%,#241b4b 100%)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.08) inset, 0 30px 60px -30px rgba(36,27,75,0.55)",
            }}
          >
            <div className="absolute left-1/2 top-[0.9%] z-20 h-[1.6%] w-[8%] -translate-x-1/2 rounded-b-[6px] bg-[#120e26]">
              <span className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3a3160]" />
            </div>

            <div
              className="relative h-full w-full overflow-hidden rounded-[10px] bg-[#0d0a1c]"
              style={{
                containerType: "inline-size",
                fontSize: "clamp(5px, 1.55cqi, 15px)",
              }}
            >
              <div
                ref={page}
                className="absolute inset-x-0 top-0 will-change-transform"
                style={{ height: `${sitePages * 100}%` }}
              >
                {children}
              </div>

              <div
                ref={veil}
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,rgba(13,10,28,0.55)_0%,rgba(13,10,28,0.97)_100%)]"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(112deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.04)_22%,transparent_46%)] mix-blend-screen" />
            </div>
          </div>

          {/* Face arrière : coque, vue capot rabattu */}
          <div
            className="absolute inset-0 rounded-[var(--radius-device)] rounded-b-[6px] [backface-visibility:hidden]"
            style={{
              transform: "rotateY(180deg)",
              background:
                "linear-gradient(155deg,#f6f2ec 0%,#e7ded2 55%,#dcd1c2 100%)",
              boxShadow: "0 0 0 1px rgba(36,27,75,0.10) inset",
            }}
          >
            {/* Le symbole gravé sur la coque, vu capot rabattu */}
            <img
              src="/logo-mark.png"
              alt=""
              aria-hidden
              className="absolute left-1/2 top-1/2 w-[16%] -translate-x-1/2 -translate-y-1/2 opacity-80 mix-blend-multiply"
            />
          </div>
        </div>

        {/* ---------- BASE / CLAVIER ---------- */}
        <div
          className="absolute left-0 top-full h-[62%] w-full origin-top [transform-style:preserve-3d]"
          style={{ transform: `rotateX(${ANGLE_BASE}deg)` }}
        >
          <div
            className="relative h-full w-full rounded-b-[16px] rounded-t-[4px]"
            style={{
              background:
                "linear-gradient(180deg,#e9e0d4 0%,#f4efe8 26%,#e3d9cb 100%)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(36,27,75,0.12) inset",
            }}
          >
            <div className="absolute inset-x-[16%] top-0 h-[3px] rounded-b bg-[linear-gradient(90deg,transparent,rgba(36,27,75,0.35),transparent)]" />

            <div className="absolute inset-x-[7%] top-[12%] grid h-[54%] grid-rows-5 gap-[1.6%]">
              {[14, 14, 13, 12, 6].map((count, row) => (
                <div
                  key={row}
                  className="grid gap-[0.9%]"
                  style={{
                    gridTemplateColumns: `repeat(${count}, minmax(0,1fr))`,
                  }}
                >
                  {Array.from({ length: count }).map((_, k) => (
                    <span
                      key={k}
                      className="rounded-[2px] bg-[#d7ccbd]"
                      style={{
                        boxShadow:
                          "0 1px 0 rgba(255,255,255,0.75), 0 -0.5px 0 rgba(36,27,75,0.10) inset",
                        gridColumn: row === 4 && k === 3 ? "span 4" : undefined,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="absolute bottom-[8%] left-1/2 h-[26%] w-[30%] -translate-x-1/2 rounded-[6px] bg-[#ded4c6] shadow-[0_0_0_1px_rgba(36,27,75,0.08)_inset]" />
          </div>
        </div>

        {/* ---------- OMBRE ET LUEUR ---------- */}
        <div
          ref={shadow}
          className="pointer-events-none absolute left-1/2 top-[142%] h-[70px] w-[86%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse,rgba(36,27,75,0.30)_0%,rgba(36,27,75,0)_70%)] blur-[18px]"
          style={{ opacity: 0.45 }}
        />
        <div
          ref={glow}
          className="pointer-events-none absolute left-1/2 top-[30%] h-[120%] w-[130%] rounded-[50%] bg-[radial-gradient(ellipse,rgba(107,63,212,0.22)_0%,rgba(242,146,31,0.10)_45%,transparent_72%)] blur-[50px]"
          style={{
            opacity: 0,
            transform: "translateX(-50%) translateZ(-120px)",
          }}
        />
      </div>
    </div>
  );
});

export default Laptop;
