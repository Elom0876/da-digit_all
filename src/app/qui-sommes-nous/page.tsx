import type { Metadata } from "next";

import PageIntro from "@/components/layout/PageIntro";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Qui sommes-nous ?",
  description:
    "Créée en 2021, DA Digit All réunit des ingénieurs juniors et seniors totalisant plus de 25 ans d'expérience cumulée. Vision, valeurs, approche, domaines d'activités et équipe.",
  openGraph: {
    title: "Qui sommes-nous ? · DA Digit All",
    description:
      "Créée en 2021, DA Digit All réunit des ingénieurs totalisant plus de 25 ans d'expérience cumulée. Vision, valeurs, approche et équipe.",
  },
};

const VALEURS = [
  ["L'Éthique", "Honnêteté et transparence dans chacune de nos actions."],
  [
    "La Qualité de Service",
    "L'excellence dans chaque livrable, sans exception.",
  ],
  ["L'Intégrité", "Droiture et cohérence, sur toute la durée de la relation."],
  [
    "Le Sens de l'Engagement",
    "Détermination et responsabilité sur chaque projet.",
  ],
  [
    "Le Résultat",
    "L'impact concret sur votre performance et votre croissance.",
  ],
];

const APPROCHE = [
  ["1", "Analyse", "Diagnostic approfondi de vos enjeux"],
  ["2", "Conception", "Solutions sur mesure et roadmap"],
  ["3", "Réalisation", "Mise en œuvre agile et itérative"],
  ["4", "Accompagnement", "Formation, support et évolution"],
];

const DOMAINES = [
  [
    "01",
    "Transformation Digitale 360°",
    "De l'analyse des processus métiers à la conception des solutions, nous identifions les leviers d'amélioration à chaque étape de votre chaîne de valeur.",
    ["Processus métiers", "Solutions sur mesure", "Efficience durable"],
  ],
  [
    "02",
    "Étude, Audit, Conseil et Formation",
    "Faisabilité, audits organisationnels et SI, pilotage du changement, et programmes de formation pour les corps de métiers comme pour les décideurs.",
    ["Études", "Audits", "Conseils", "Formation"],
  ],
  [
    "03",
    "Infrastructure, Système & Réseau",
    "Architectures évolutives, administration Windows, Linux et Unix en haute disponibilité, réseaux LAN/WAN sécurisés et supervisés.",
    ["Infrastructure", "Systèmes", "Réseaux"],
  ],
  [
    "04",
    "Assistance à Maîtrise d'Ouvrage",
    "Termes de référence, processus d'adjudication et suivi d'exécution, pour garantir que ce qui est livré correspond au besoin.",
    ["Cadrage", "Adjudication", "Suivi"],
  ],
];

const EQUIPE = [
  ["Mathias Codjo DEKADJEVI", "CEO & Co-fondateur"],
  ["Aichatou Adenikè BELLO", "Secrétaire de direction"],
  ["Pôle de Consultant", "Conseil & Expertise"],
  ["Anselme Victor AKPOVI", "Full-stack & DevOps"],
  ["Eden Uriel AHOUSSOU", "Responsable technique"],
  ["Emmeran Malkiel LIMA", "Front-end & UI/UX"],
];

export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="Qui sommes-nous ?"
        titre={
          <>
            Rendre la technologie{" "}
            <span className="text-orange">
              accessible à toutes les entreprises.
            </span>
          </>
        }
        chapo="Créée en 2021, DA Digit All réunit des ingénieurs juniors et seniors totalisant plus de 25 ans d'expérience cumulée."
        aside={
          <Button href="/contact" trailing={<span aria-hidden>→</span>}>
            Nous contacter
          </Button>
        }
      />

      {/* Vision et mission */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-hairline md:grid-cols-2">
          <div className="bg-canvas p-9">
            <p className="eyebrow">Notre vision</p>
            <p className="mt-4 font-display text-[clamp(1.125rem,1.7vw,1.5rem)] leading-[1.2] tracking-[-0.025em]">
              Être la référence incontournable en transformation digitale et en
              conseil aux entreprises au Bénin et en Afrique.
            </p>
          </div>
          <div className="bg-canvas p-9">
            <p className="eyebrow">Notre mission</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Conseiller et accompagner les entreprises, tous secteurs
              confondus, avec des solutions sur mesure — matérielles,
              logicielles ou organisationnelles — pour les conduire vers
              l&apos;efficience.
            </p>
          </div>
        </div>
      </section>

      {/* Valeurs et approche */}
      <section className="border-y border-ink/10 bg-sand/30">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:px-8 md:py-20 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Nos valeurs</p>
            <ul className="mt-6 space-y-4">
              {VALEURS.map(([nom, texte]) => (
                <li
                  key={nom}
                  className="border-b border-ink/10 pb-4 last:border-0"
                >
                  <p className="font-display text-[1.0625rem] tracking-[-0.02em] text-violet">
                    {nom}
                  </p>
                  <p className="mt-1 text-sm text-muted">{texte}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Notre approche</p>
            <ol className="mt-6 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-hairline sm:grid-cols-2">
              {APPROCHE.map(([num, titre, texte]) => (
                <li key={num} className="bg-canvas p-6">
                  <p className="font-display text-[1.75rem] leading-none tracking-[-0.04em] text-orange">
                    {num}
                  </p>
                  <h3 className="mt-3 font-display text-[1.0625rem] tracking-[-0.02em]">
                    {titre}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{texte}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Domaines */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
        <p className="eyebrow">Domaines d&apos;activités</p>
        <div className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-hairline md:grid-cols-2">
          {DOMAINES.map(([num, titre, texte, tags]) => (
            <article
              key={num as string}
              className="bg-canvas p-8 transition-colors hover:bg-white"
            >
              <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-orange">
                {num}
              </p>
              <h2 className="mt-3 font-display text-[1.25rem] leading-tight tracking-[-0.025em]">
                {titre}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{texte}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {(tags as string[]).map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-sand/70 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink/60"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Équipe */}
      <section className="border-t border-ink/10 bg-sand/30">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
          <p className="eyebrow">Notre équipe</p>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {EQUIPE.map(([nom, role]) => (
              <li key={nom} className="flex items-center gap-4 bg-canvas p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] font-display text-sm text-ink/70">
                  {nom
                    .split(" ")
                    .filter((m) => m[0] === m[0].toUpperCase())
                    .slice(0, 2)
                    .map((m) => m[0])
                    .join("")}
                </span>
                <div>
                  <p className="font-display text-[0.9375rem] leading-tight tracking-[-0.015em]">
                    {nom}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </>
  );
}
