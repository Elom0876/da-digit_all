"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Laptop, { type LaptopHandle } from "@/components/scene/Laptop";
import Phone, { type PhoneHandle } from "@/components/scene/Phone";
import SiteInterieur, { SITE_PAGES } from "@/components/scene/SiteInterieur";

gsap.registerPlugin(ScrollTrigger);

/**
 * Le parcours d'un projet numérique, raconté par le scroll.
 *
 *   0 → 6 %    l'appareil reste rabattu. Rien ne bouge, le titre respire.
 *   6 → 22 %   le capot se lève, la dalle s'allume, le titre s'efface.
 *   22 → 100 % le site défile dans la dalle, les textes suivent de part
 *              et d'autre. Le téléphone entre à l'étape mobile.
 */

/* La chorégraphie est exprimée en hauteurs d'écran, pas en pourcentages :
   c'est la seule unité qui reste lisible quand on ajuste le rythme.
   L'appareil reste rabattu pendant un écran et demi entier, puis met un
   écran et demi de plus à s'ouvrir — sans cette lenteur, on ne voit jamais
   l'objet fermé. */
const ECRANS_ATTENTE = 0.25;
const ECRANS_OUVERTURE = 2;
const ECRANS_TOTAL = SITE_PAGES + ECRANS_ATTENTE + ECRANS_OUVERTURE + 1;

const ATTENTE = ECRANS_ATTENTE / ECRANS_TOTAL;
const OUVERTURE = (ECRANS_ATTENTE + ECRANS_OUVERTURE) / ECRANS_TOTAL;

/* Le capot répond dès le premier cran de molette, mais lentement : la courbe
   étale le début du geste au lieu de le retarder. C'est ce qui permet à la
   fois de voir l'appareil fermé et de sentir que le scroll agit tout de suite. */
const COURBE_OUVERTURE = gsap.parseEase("power1.inOut");

/**
 * Les cinq panneaux latéraux.
 *
 * Colonne gauche : les quatre domaines d'activité officiels de DA Digit All,
 * plus un panneau sur la suite logicielle. Colonne droite : les cinq valeurs
 * de la marque dans leur formulation exacte, une par panneau, avec le produit
 * affiché à l'écran au même moment.
 */
const ETAPES = [
  {
    num: "01",
    domaine: "Transformation Digitale 360°",
    titre: "De l'analyse des processus à la solution déployée",
    texte:
      "Nous accompagnons les organisations dans l'identification des leviers d'amélioration à chaque étape de leur chaîne de valeur, puis nous concevons les outils sur mesure qui allient rapidité, sécurité et optimisation des ressources humaines, matérielles et financières.",
    valeur: "L'Éthique",
    devise: "Honnêteté et transparence dans chacune de nos actions",
    livrables: [
      "Analyse des processus métiers",
      "Conception sur mesure",
      "Déploiement et suivi",
    ],
  },
  {
    num: "02",
    domaine: "Étude, Audit, Conseil et Formation",
    titre: "Diagnostiquer avant de décider",
    texte:
      "Études de faisabilité et d'impact, audits organisationnels, fonctionnels ou du système d'information, conseil en pilotage du changement. Nos formations s'adressent aussi bien aux corps de métiers qu'à l'encadrement et aux décideurs.",
    valeur: "La Qualité de Service",
    devise: "L'excellence dans chaque livrable",
    livrables: [
      "Études de faisabilité",
      "Audits et recommandations",
      "Programmes de formation",
    ],
  },
  {
    num: "03",
    domaine: "Infrastructure, Système & Réseau",
    titre: "Ce qui tient debout quand personne ne regarde",
    texte:
      "Architectures robustes et évolutives — serveurs, stockage, virtualisation, cloud. Déploiement et administration Windows, Linux et Unix en haute disponibilité. Conception de réseaux LAN/WAN, pare-feu, VPN, supervision continue.",
    valeur: "L'Intégrité",
    devise: "Droiture et cohérence, sur la durée",
    livrables: [
      "Architecture et cloud",
      "Administration systèmes",
      "Réseaux et sécurité",
    ],
  },
  {
    num: "04",
    domaine: "Assistance à Maîtrise d'Ouvrage",
    titre: "Nous portons le projet à vos côtés",
    texte:
      "Élaboration des termes de référence, conduite du processus d'adjudication, suivi rigoureux de l'exécution. L'AMOA garantit que ce qui est commandé correspond au besoin, et que ce qui est livré correspond à la commande.",
    valeur: "Le Sens de l'Engagement",
    devise: "Nous nous investissons pleinement dans chaque projet",
    livrables: [
      "Termes de référence",
      "Processus d'adjudication",
      "Suivi d'exécution",
    ],
  },
  {
    num: "05",
    domaine: "Web et mobile, d'un seul tenant",
    titre: "La même solution, du bureau au terrain",
    texte:
      "Nous concevons les interfaces web et mobiles ensemble, sur la même base de données et le même langage visuel. Vos équipes retrouvent les mêmes chiffres et les mêmes gestes, qu'elles soient devant un écran ou sur le terrain.",
    valeur: "Le Résultat",
    devise: "L'impact concret sur votre performance",
    livrables: [
      "Application web",
      "Application mobile",
      "Socle de données commun",
    ],
  },
];

/** Le téléphone entre au panneau 02, quand le laptop affiche Master Digit :
 *  les deux appareils montrent alors le même produit, web et mobile. */
const ENTREE_TELEPHONE = 1 / ETAPES.length;

export default function ParcoursSection() {
  const root = useRef<HTMLDivElement>(null);
  const accueil = useRef<HTMLDivElement>(null);
  const laptop = useRef<LaptopHandle>(null);
  const phone = useRef<PhoneHandle>(null);
  const indexRef = useRef(0);
  const ouvertRef = useRef(false);

  const [index, setIndex] = useState(0);
  const [ouvert, setOuvert] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const appliquer = (p: number) => {
        // L'attente, puis l'ouverture
        const brut = gsap.utils.clamp(
          0,
          1,
          (p - ATTENTE) / (OUVERTURE - ATTENTE),
        );
        const ouverture = COURBE_OUVERTURE(brut);
        laptop.current?.setProgress(ouverture);

        gsap.set(accueil.current, {
          autoAlpha: 1 - gsap.utils.clamp(0, 1, ouverture / 0.7),
          y: -70 * ouverture,
        });

        const estOuvert = ouverture > 0.85;
        if (estOuvert !== ouvertRef.current) {
          ouvertRef.current = estOuvert;
          setOuvert(estOuvert);
        }

        // La lecture du site
        const lecture = gsap.utils.clamp(
          0,
          1,
          (p - OUVERTURE) / (1 - OUVERTURE),
        );
        laptop.current?.setSiteScroll(lecture);

        // Le téléphone : entrée sur une demi-étape, puis défilement de l'app
        phone.current?.setEntree(
          gsap.utils.clamp(
            0,
            1,
            (lecture - ENTREE_TELEPHONE) / (0.5 / ETAPES.length),
          ),
        );
        phone.current?.setAppScroll(
          gsap.utils.clamp(
            0,
            1,
            (lecture - ENTREE_TELEPHONE - 0.1) / (1 - ENTREE_TELEPHONE - 0.1),
          ),
        );

        const i = Math.min(
          ETAPES.length - 1,
          Math.floor(lecture * 0.9999 * ETAPES.length),
        );
        if (i !== indexRef.current) {
          indexRef.current = i;
          setIndex(i);
        }
      };

      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        // markers: true,
        onUpdate: (self) => appliquer(self.progress),
        onRefresh: (self) => appliquer(self.progress),
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
      appliquer(trigger.progress);

      return () => trigger.kill();
    }, root);

    return () => ctx.revert();
  }, []);

  const etape = ETAPES[index];

  return (
    <section
      ref={root}
      id="parcours"
      aria-label="Le parcours d'un projet numérique"
      style={{ height: `${ECRANS_TOTAL * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-dvh items-center overflow-hidden px-5 pt-20">
        {/* Accueil — visible tant que l'appareil est rabattu */}
        <div
          ref={accueil}
          className="pointer-events-none absolute inset-x-0 top-[15vh] z-30 mx-auto max-w-3xl px-5 text-center"
        >
          <p className="eyebrow">
            Nous inspirons l&apos;excellence · Cotonou, Bénin
          </p>
          <h1 className="mt-5 font-display text-display leading-[0.86] tracking-[-0.05em]">
            Votre partenaire
            <br />
            en
            <br />
            <span className="text-orange">transformation digitale</span>
          </h1>
          <p className="mx-auto mt-7 max-w-lg text-base leading-relaxed text-muted">
            Accélérez votre efficience avec nos solutions digitales uniques,
            fiables et sur mesure.
          </p>
        </div>

        {/* Scène et textes : trois colonnes sur grand écran */}
        {/* La grille reste visible en permanence : c'est la scène. Seules les
            deux colonnes de texte apparaissent une fois l'appareil ouvert. */}
        <div className="mx-auto grid w-full max-w-[1500px] items-center gap-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,15rem)] xl:gap-14">
          {/* Colonne gauche — l'étape */}
          <div
            className="relative order-2 transition-opacity duration-500 lg:order-1 lg:text-right"
            style={{ opacity: ouvert ? 1 : 0 }}
          >
            <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-orange">
              {etape.num} / {String(ETAPES.length).padStart(2, "0")} · Domaine
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.5rem,2.2vw,2.125rem)] leading-[1.02] tracking-[-0.035em]">
              {etape.domaine}
            </h2>
            <p className="mt-3 font-display text-[0.9375rem] leading-snug tracking-[-0.01em] text-ink/70">
              {etape.titre}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {etape.texte}
            </p>
          </div>

          {/* Colonne centrale — les appareils */}
          <div className="relative order-1 flex justify-center lg:order-2">
            <Laptop
              ref={laptop}
              drive="manual"
              sitePages={SITE_PAGES}
              width="min(92vw, 68vh, 880px)"
            >
              <SiteInterieur />
            </Laptop>

            <Phone
              ref={phone}
              className="pointer-events-none absolute bottom-[-4%] right-[-2%] z-20 lg:right-[-6%]"
              width="min(26vw, 34vh, 250px)"
            />
          </div>

          {/* Colonne droite — livrables et aparté */}
          <div
            className="order-3 transition-opacity duration-500"
            style={{ opacity: ouvert ? 1 : 0 }}
          >
            <p className="eyebrow">Notre valeur</p>
            <p className="mt-3 font-display text-[clamp(1.25rem,1.7vw,1.625rem)] leading-none tracking-[-0.03em] text-violet">
              {etape.valeur}
            </p>
            <p className="mt-2 text-sm text-muted">{etape.devise}</p>

            <p className="eyebrow mt-8 block">Ce que vous recevez</p>
            <ul className="mt-4 space-y-2.5">
              {etape.livrables.map((l) => (
                <li
                  key={l}
                  className="flex items-start gap-2.5 text-sm text-ink/75"
                >
                  <span className="mt-[0.45em] h-[5px] w-[5px] shrink-0 bg-orange" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Indice de défilement */}
        <div
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center transition-opacity duration-500"
          style={{ opacity: ouvert ? 0 : 1 }}
        >
          <span className="eyebrow">Défiler</span>
          <span className="mx-auto mt-2 block h-8 w-px bg-gradient-to-b from-ink/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
