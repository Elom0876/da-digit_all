import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import PageIntro from "@/components/layout/PageIntro";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Références",
  description:
    "MTN, Faghal & Fils, Green-Pay, Challenge SA et Keyla Beauty font confiance à DA Digit All pour leurs solutions métier.",
  openGraph: {
    title: "Références · DA Digit All",
    description:
      "MTN, Faghal & Fils, Green-Pay, Challenge SA et Keyla Beauty font confiance à DA Digit All.",
  },
};

type Client = {
  nom: string;
  secteur: string;
  fichier: string;
  /** Solution livrée, uniquement quand elle est publique. */
  solution?: string;
};

const CLIENTS: Client[] = [
  {
    nom: "MTN",
    secteur: "Télécommunications",
    fichier: "mtn.png",
    solution: "Stock Digit",
  },
  {
    nom: "Faghal & Fils",
    secteur: "Master Distributeur",
    fichier: "faghal.png",
    solution: "Stock Digit",
  },
  {
    nom: "Green-Pay",
    secteur: "Services financiers",
    fichier: "greenpay.png",
    solution: "CRM Digit",
  },
  { nom: "Challenge SA", secteur: "Distribution", fichier: "challenge.png" },
  { nom: "Keyla Beauty", secteur: "Cosmétique", fichier: "keyla.png" },
];

export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="Références"
        titre={
          <>
            Ils nous font <span className="text-orange">confiance.</span>
          </>
        }
        chapo="Des opérateurs télécoms aux services financiers, nos solutions tournent chaque jour dans des organisations qui ne peuvent pas se permettre une interruption."
        aside={
          <Button href="/realisations" variant="outline">
            Voir les solutions livrées
          </Button>
        }
      />

      {/* Bandeau défilant — la première impression, avant tout détail.
          Les logos passent en couleur : c'est une frise, pas une grille, donc
          l'hétérogénéité des chartes ne se lit plus comme un désordre. */}
      <section className="bandeau-logos relative overflow-hidden border-b border-ink/10 bg-white/50 py-12">
        <div className="piste-logos flex w-max items-center gap-20 px-10">
          {[...CLIENTS, ...CLIENTS].map((c, i) => (
            <Image
              key={`${c.nom}-${i}`}
              src={`/references/${c.fichier}`}
              alt={i < CLIENTS.length ? c.nom : ""}
              aria-hidden={i >= CLIENTS.length}
              width={672}
              height={240}
              className="h-12 w-auto shrink-0 object-contain"
            />
          ))}
        </div>

        {/* Dégradés latéraux : la frise sort du cadre au lieu d'être coupée net */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-canvas to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-canvas to-transparent" />
      </section>

      {/* Le détail client par client */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-xl font-display text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.05] tracking-[-0.035em]">
            Cinq organisations, quatre secteurs, une même exigence de
            continuité.
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Certaines de ces plateformes tournent sans interruption depuis leur
            mise en service.
          </p>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {CLIENTS.map((c) => (
            <li
              key={c.nom}
              className="group relative flex flex-col bg-canvas transition-colors duration-300 hover:bg-white"
            >
              <div className="flex flex-1 items-center justify-center px-10 py-14">
                <Image
                  src={`/references/${c.fichier}`}
                  alt={c.nom}
                  width={672}
                  height={240}
                  className="max-h-14 w-auto object-contain opacity-60 grayscale transition-all duration-500 ease-[var(--ease-device)] group-hover:scale-[1.05] group-hover:opacity-100 group-hover:grayscale-0"
                />
              </div>

              <div className="border-t border-hairline/70 px-6 py-5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-[0.9375rem] tracking-[-0.015em]">
                    {c.nom}
                  </span>
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.13em] text-muted">
                    {c.secteur}
                  </span>
                </div>

                {c.solution ? (
                  <Link
                    href="/realisations"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-violet transition-colors hover:text-ink"
                  >
                    <span className="h-[5px] w-[5px] bg-orange" />
                    {c.solution}
                  </Link>
                ) : (
                  <span className="mt-3 block text-xs text-muted">
                    Accompagnement sur mesure
                  </span>
                )}
              </div>
            </li>
          ))}

          <li className="flex flex-col justify-center gap-5 bg-canvas p-8">
            <p className="max-w-[15rem] font-display text-[1.1875rem] leading-tight tracking-[-0.02em]">
              La prochaine organisation de cette liste est peut-être la vôtre.
            </p>
            <div>
              <Button
                href="/contact"
                size="sm"
                trailing={<span aria-hidden>→</span>}
              >
                Nous écrire
              </Button>
            </div>
          </li>
        </ul>
      </section>

      <Footer />
    </>
  );
}
