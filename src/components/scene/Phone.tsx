"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import gsap from "gsap";

/**
 * iPhone 17 Pro Max — dessiné, pas photographié.
 *
 * Proportions du modèle : dalle de 6,9 pouces, 2868 × 1320 points, soit un
 * rapport de 1 : 2,17. Rails en titane, Dynamic Island, bouton Action à
 * gauche et Camera Control à droite. Ces détails ne sont pas de la
 * coquetterie : c'est ce qui fait qu'on reconnaît l'appareil au premier
 * coup d'œil plutôt que de voir « un rectangle noir ».
 */

const PAGES = 3;

export type PhoneHandle = {
  /** 0 = hors scène, 1 = posé au premier plan. */
  setEntree: (p: number) => void;
  /** 0 = haut de l'app, 1 = bas de l'app. */
  setAppScroll: (p: number) => void;
};

type Props = {
  width?: string;
  className?: string;
};

const Phone = forwardRef<PhoneHandle, Props>(function Phone(
  { width = "min(30vw, 26vh, 260px)", className = "" },
  ref,
) {
  const device = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);

  const setEntree = useCallback((p: number) => {
    const el = device.current;
    if (!el) return;
    const v = gsap.utils.clamp(0, 1, p);
    el.style.opacity = `${v}`;
    el.style.transform = `translate3d(${(1 - v) * 26}%, ${(1 - v) * 14}%, 0) rotateY(${-16 + v * 8}deg) rotateZ(${(1 - v) * 6}deg) scale(${0.9 + v * 0.1})`;
  }, []);

  const setAppScroll = useCallback((p: number) => {
    const el = page.current;
    if (!el) return;
    const v = gsap.utils.clamp(0, 1, p);
    el.style.transform = `translate3d(0, ${(-(PAGES - 1) / PAGES) * 100 * v}%, 0)`;
  }, []);

  useImperativeHandle(ref, () => ({ setEntree, setAppScroll }), [
    setEntree,
    setAppScroll,
  ]);

  useLayoutEffect(() => {
    setEntree(0);
    setAppScroll(0);
  }, [setEntree, setAppScroll]);

  return (
    <div className={`[perspective:1600px] ${className}`} style={{ width }}>
      <div
        ref={device}
        className="relative aspect-[1/2.17] w-full will-change-transform"
        style={{ opacity: 0 }}
      >
        {/* Rails en titane */}
        <div
          className="absolute inset-0 rounded-[16%/7.4%]"
          style={{
            background:
              "linear-gradient(145deg,#b9b3ab 0%,#7d7770 18%,#e6e1da 34%,#8b857d 52%,#cfc9c1 72%,#6f6a63 100%)",
            boxShadow: "0 2.4em 4em -1.6em rgba(36,27,75,0.55)",
          }}
        />

        {/* Bouton Action, volume, Camera Control */}
        <span className="absolute left-[-1.4%] top-[16%] h-[4%] w-[1.6%] rounded-l-full bg-[#8e887f]" />
        <span className="absolute left-[-1.4%] top-[24%] h-[7%] w-[1.6%] rounded-l-full bg-[#8e887f]" />
        <span className="absolute left-[-1.4%] top-[33%] h-[7%] w-[1.6%] rounded-l-full bg-[#8e887f]" />
        <span className="absolute right-[-1.4%] top-[27%] h-[9%] w-[1.6%] rounded-r-full bg-[#8e887f]" />
        <span className="absolute right-[-1.2%] top-[40%] h-[5%] w-[1.4%] rounded-r-full bg-[#a49d94]" />

        {/* Dalle */}
        <div
          className="absolute inset-[1.4%] overflow-hidden rounded-[15%/6.8%] bg-[#0a0817]"
          style={{
            containerType: "inline-size",
            fontSize: "clamp(4px, 5.2cqi, 13px)",
          }}
        >
          <div
            ref={page}
            className="absolute inset-x-0 top-0 will-change-transform"
            style={{ height: `${PAGES * 100}%` }}
          >
            <AppTerrain />
          </div>

          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-[1.6%] z-20 h-[3.2%] w-[30%] -translate-x-1/2 rounded-full bg-black">
            <span className="absolute right-[14%] top-1/2 h-[38%] w-[14%] -translate-y-1/2 rounded-full bg-[#15122a]" />
          </div>

          {/* Reflet */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.03)_20%,transparent_44%)] mix-blend-screen" />

          {/* Barre d'accueil */}
          <span className="absolute bottom-[1.2%] left-1/2 z-20 h-[0.45%] w-[32%] -translate-x-1/2 rounded-full bg-white/45" />
        </div>
      </div>
    </div>
  );
});

export default Phone;
export { PAGES as PHONE_PAGES };

/* ---------------------------------------------------------------- */

function Page({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full ${className}`}
      style={{ height: `${100 / PAGES}%` }}
    >
      {children}
    </div>
  );
}

/**
 * L'application mobile Veyla — le pendant terrain du site affiché sur le
 * laptop. Les deux appareils montrent le même produit : la couverture web et
 * mobile se démontre en une seconde, là où une phrase demanderait un
 * paragraphe.
 */
function AppTerrain() {
  return (
    <div className="h-full w-full bg-[#0a0817] font-sans text-white">
      {/* Accueil */}
      <Page className="px-[1.3em] pt-[3.2em]">
        <div className="flex items-center justify-between">
          <p className="font-display text-[0.9em] tracking-[-0.02em]">Veyla</p>
          <span className="h-[1.5em] w-[1.5em] rounded-full bg-white/10" />
        </div>

        <p className="mt-[1em] text-[0.58em] text-white/40">
          Chiffre d&apos;affaires du mois
        </p>
        <p className="mt-[0.2em] font-display text-[1.75em] leading-none tracking-[-0.035em]">
          4 260 000 F
        </p>
        <p className="mt-[0.35em] font-mono text-[0.55em] text-violet">
          + 12,4 % vs mars
        </p>

        <div className="mt-[1em] flex h-[4.5em] items-end gap-[0.25em] rounded-[0.7em] bg-white/[0.045] p-[0.7em]">
          {[42, 58, 47, 66, 60, 78, 71, 88].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-[0.1em]"
              style={{
                height: `${h}%`,
                background:
                  i === 7 ? "var(--color-orange)" : "rgba(107,63,212,0.65)",
              }}
            />
          ))}
        </div>

        <div className="mt-[0.8em] grid grid-cols-2 gap-[0.5em]">
          {[
            ["Commandes", "128"],
            ["Encours", "610 K"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-[0.6em] bg-white/[0.045] p-[0.7em]">
              <p className="text-[0.5em] text-white/40">{k}</p>
              <p className="mt-[0.2em] font-display text-[0.85em] tracking-[-0.02em]">
                {v}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-[0.8em] rounded-[0.7em] bg-orange py-[0.65em] text-center text-[0.68em] font-medium text-[#140f27]">
          Nouvelle commande
        </div>
      </Page>

      {/* Activité */}
      <Page className="px-[1.3em] pt-[1.2em]">
        <p className="font-mono text-[0.55em] uppercase tracking-[0.14em] text-white/35">
          Activité du jour
        </p>

        <div className="mt-[0.7em] space-y-[0.45em]">
          {[
            ["Commande #4471", "+ 340 000", "09:14"],
            ["Règlement client", "+ 1 200 000", "10:02"],
            ["Achat fournisseur", "− 480 000", "11:37"],
            ["Commande #4472", "+ 215 000", "13:20"],
            ["Frais de transport", "− 95 000", "15:05"],
          ].map(([t, m, h], i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-[0.6em] bg-white/[0.045] px-[0.8em] py-[0.6em]"
            >
              <div>
                <p className="text-[0.58em] text-white/70">{t}</p>
                <p className="font-mono text-[0.48em] text-white/30">{h}</p>
              </div>
              <p
                className="font-mono text-[0.6em]"
                style={{
                  color: (m as string).startsWith("+")
                    ? "var(--color-violet)"
                    : "var(--color-orange)",
                }}
              >
                {m}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-[0.7em] flex items-center justify-between rounded-[0.6em] border border-white/10 px-[0.8em] py-[0.6em]">
          <span className="text-[0.56em] text-white/45">Solde net</span>
          <span className="font-display text-[0.85em] tracking-[-0.02em]">
            + 1 180 000 F
          </span>
        </div>
      </Page>

      {/* Alertes et stock */}
      <Page className="flex flex-col justify-center px-[1.3em]">
        <div className="rounded-[0.8em] bg-white/[0.05] p-[1em]">
          <p className="font-mono text-[0.54em] uppercase tracking-[0.14em] text-orange">
            3 alertes de stock
          </p>
          <div className="mt-[0.7em] space-y-[0.5em]">
            {[
              ["Référence A-220", 18],
              ["Référence B-104", 34],
              ["Référence C-771", 9],
            ].map(([r, taux]) => (
              <div key={r as string}>
                <div className="flex items-center justify-between text-[0.54em]">
                  <span className="text-white/60">{r}</span>
                  <span className="font-mono text-white/35">
                    {taux as number} %
                  </span>
                </div>
                <div className="mt-[0.25em] h-[0.28em] w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-orange"
                    style={{ width: `${taux}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-[0.9em] text-center text-[0.58em] leading-relaxed text-white/40">
          Les mêmes données que le tableau de bord, dans votre poche.
        </p>
      </Page>
    </div>
  );
}
