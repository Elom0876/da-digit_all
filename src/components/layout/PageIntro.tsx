import type { ReactNode } from "react";

/**
 * L'en-tête commun aux pages intérieures.
 *
 * La page d'accueil a sa propre mise en scène ; toutes les autres partagent
 * ce bloc pour que la navigation entre elles ne donne jamais l'impression de
 * changer de site.
 */
export default function PageIntro({
  eyebrow,
  titre,
  chapo,
  aside,
}: {
  eyebrow: string;
  titre: ReactNode;
  chapo: string;
  aside?: ReactNode;
}) {
  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-16 pt-36 md:px-8 md:pb-24 md:pt-44 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[0.94] tracking-[-0.045em]">
            {titre}
          </h1>
        </div>
        <div>
          <p className="max-w-md text-base leading-relaxed text-muted">
            {chapo}
          </p>
          {aside && <div className="mt-6">{aside}</div>}
        </div>
      </div>
    </header>
  );
}
