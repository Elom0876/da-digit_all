import type { Metadata } from "next";

import PageIntro from "@/components/layout/PageIntro";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Offres d'emploi",
  description:
    "Rejoindre DA Digit All à Cotonou : développement fullstack et mobile, administration systèmes, design produit, stages et candidatures spontanées.",
};

const POSTES = [
  {
    intitule: "Développeur·se fullstack",
    contrat: "CDI · Cotonou · 3 ans et +",
    mission:
      "Concevoir et développer des applications métier de bout en bout, du modèle de données à l'interface.",
    cles: ["TypeScript", "Laravel ou NestJS", "PostgreSQL", "Tests"],
  },
  {
    intitule: "Développeur·se mobile",
    contrat: "CDI · Cotonou · 2 ans et +",
    mission:
      "Construire des applications terrain qui fonctionnent sans réseau : saisie hors ligne, synchronisation différée.",
    cles: ["React Native ou Flutter", "Base locale", "Synchronisation"],
  },
  {
    intitule: "Administrateur·rice systèmes et réseaux",
    contrat: "CDI · Cotonou · 3 ans et +",
    mission:
      "Dimensionner, déployer et superviser les infrastructures de nos clients, avec astreinte partagée.",
    cles: ["Linux", "Conteneurs", "CI/CD", "Supervision"],
  },
  {
    intitule: "Designer produit UI/UX",
    contrat: "CDI ou temps partiel · 2 ans et +",
    mission:
      "Mener la recherche utilisateur, concevoir les parcours et maintenir nos systèmes de composants.",
    cles: ["Recherche utilisateur", "Design system", "Interfaces métier"],
  },
];

export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="Offres d'emploi"
        titre={
          <>
            Nous recrutons des gens qui{" "}
            <span className="text-orange">restent sur leurs projets.</span>
          </>
        }
        chapo="Chez nous, on ne livre pas pour passer au suivant : on supervise, on corrige et on fait évoluer ce qu'on a construit."
        aside={
          <Button href="mailto:recrutement@dadigitall.com" variant="outline">
            Candidature spontanée
          </Button>
        }
      />

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-hairline md:grid-cols-2">
          {POSTES.map((p) => (
            <article
              key={p.intitule}
              className="bg-canvas p-8 transition-colors hover:bg-white md:p-10"
            >
              <h2 className="font-display text-[1.375rem] leading-tight tracking-[-0.03em]">
                {p.intitule}
              </h2>
              <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.13em] text-muted">
                {p.contrat}
              </p>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                {p.mission}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {p.cles.map((c) => (
                  <li
                    key={c}
                    className="rounded-full bg-sand/70 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink/60"
                  >
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button
                  href={`mailto:recrutement@dadigitall.com?subject=${encodeURIComponent(`Candidature — ${p.intitule}`)}`}
                  size="sm"
                  trailing={<span aria-hidden>→</span>}
                >
                  Postuler
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-8 rounded-[var(--radius-card)] border border-ink/10 bg-sand/30 p-8 md:grid-cols-[1fr_1.4fr] md:p-10">
          <div>
            <p className="eyebrow">Le processus</p>
            <p className="mt-3 font-display text-[1.25rem] leading-tight tracking-[-0.025em]">
              Quatre étapes, deux semaines, une réponse dans tous les cas.
            </p>
          </div>
          <ol className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {[
              ["01", "Candidature — CV et quelques lignes"],
              ["02", "Échange de 45 minutes"],
              ["03", "Exercice technique court, rémunéré"],
              ["04", "Rencontre de l'équipe"],
            ].map(([n, t]) => (
              <li key={n} className="flex gap-3 text-sm text-ink/75">
                <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-orange">
                  {n}
                </span>
                {t}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Footer />
    </>
  );
}
