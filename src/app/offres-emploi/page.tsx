import type { Metadata } from "next";

import PageIntro from "@/components/layout/PageIntro";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Offres d'emploi",
  description:
    "DA Digit All n'a pas de poste ouvert actuellement, mais étudie les candidatures spontanées et accueille des stagiaires toute l'année à Cotonou.",
  openGraph: {
    title: "Offres d'emploi · DA Digit All",
    description:
      "Candidatures spontanées et stages : rejoindre une équipe qui reste sur ses projets.",
  },
};

/* Aucun poste n'est ouvert pour l'instant. Plutôt que d'afficher une page
   vide ou de laisser des offres périmées en ligne, on dit clairement ce qui
   reste possible — et on explique ce qu'on cherche, pour que les bonnes
   candidatures spontanées arrivent quand même. */

const PROFILS = [
  "Développement web fullstack",
  "Développement mobile",
  "Systèmes, réseaux et infrastructure",
  "Design produit UI/UX",
  "Conseil et gestion de projet",
];

export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="Offres d'emploi"
        titre={
          <>
            Aucun poste ouvert,{" "}
            <span className="text-orange">
              mais la porte ne l&apos;est pas.
            </span>
          </>
        }
        chapo="Nous ne recrutons pas sur un poste précis en ce moment. Nous lisons en revanche toutes les candidatures spontanées, et nous accueillons des stagiaires toute l'année."
        aside={
          <Button
            href="/contact#formulaire"
            trailing={<span aria-hidden>→</span>}
          >
            Envoyer une candidature
          </Button>
        }
      />

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-hairline md:grid-cols-2">
          <article className="bg-canvas p-9 md:p-11">
            <p className="eyebrow">Candidature spontanée</p>
            <h2 className="mt-4 font-display text-[1.5rem] leading-tight tracking-[-0.03em]">
              Dites-nous ce que vous voudriez construire
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Un CV et quelques lignes suffisent. Pas de lettre de motivation
              type : expliquez plutôt sur quoi vous aimeriez travailler et ce
              que vous savez déjà faire. Nous répondons à tout le monde, même
              quand la réponse est non.
            </p>
            <div className="mt-7">
              <Button href="/contact#formulaire" variant="outline" size="sm">
                Remplir le formulaire
              </Button>
            </div>
          </article>

          <article className="bg-canvas p-9 md:p-11">
            <p className="eyebrow">Stages et alternance</p>
            <h2 className="mt-4 font-display text-[1.5rem] leading-tight tracking-[-0.03em]">
              Des missions réelles, pas de la figuration
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Nous accueillons chaque année des étudiants de l&apos;IFRI et
              d&apos;autres écoles de la place. Chaque stagiaire travaille sur
              un projet client avec un encadrant dédié, et présente son travail
              à l&apos;équipe en fin de mission.
            </p>
            <div className="mt-7">
              <Button
                href="/contact?besoin=stage#formulaire"
                variant="outline"
                size="sm"
              >
                Postuler pour un stage
              </Button>
            </div>
          </article>
        </div>

        <div className="mt-12 grid gap-8 rounded-[var(--radius-card)] border border-ink/10 bg-sand/30 p-8 md:grid-cols-[1fr_1.3fr] md:p-10">
          <div>
            <p className="eyebrow">Les profils qui nous intéressent</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Même sans poste ouvert, une candidature qui correspond à l&apos;un
              de ces domaines est étudiée sérieusement.
            </p>
          </div>
          <ul className="flex flex-wrap content-start gap-2">
            {PROFILS.map((p) => (
              <li
                key={p}
                className="rounded-full bg-canvas px-4 py-2 text-sm text-ink/75 ring-1 ring-inset ring-hairline"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 text-center text-sm text-muted">
          Les postes ouverts seront publiés sur cette page dès qu&apos;il y en
          aura.
        </p>
      </section>

      <Footer />
    </>
  );
}
