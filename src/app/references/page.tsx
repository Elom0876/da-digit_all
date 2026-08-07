import type { Metadata } from "next";
import Image from "next/image";

import PageIntro from "@/components/layout/PageIntro";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Références",
  description:
    "MTN, Faghal & Fils, Green-Pay, Challenge SA : les organisations qui font confiance à DA Digit All.",
};

const CLIENTS = [
  { nom: "MTN", secteur: "Télécommunications", fichier: "mtn.png" },
  {
    nom: "Faghal & Fils",
    secteur: "Master Distributeur",
    fichier: "faghal.png",
  },
  { nom: "Green-Pay", secteur: "Services financiers", fichier: "greenpay.png" },
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

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        {/* Les logos clients ont des chartes qui n'ont rien à voir entre elles.
            Le niveau de gris les met au même diapason ; la couleur ne revient
            qu'au survol, sur le logo qu'on regarde. */}
        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {CLIENTS.map((c) => (
            <li
              key={c.nom}
              className="group relative bg-canvas transition-colors duration-300 hover:bg-white"
            >
              <div className="flex h-[9.5rem] items-center justify-center px-10">
                <Image
                  src={`/references/${c.fichier}`}
                  alt={c.nom}
                  width={672}
                  height={240}
                  className="max-h-[3.25rem] w-auto object-contain opacity-55 grayscale transition-all duration-500 ease-[var(--ease-device)] group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0"
                />
              </div>

              <div className="flex items-baseline justify-between border-t border-hairline/70 px-6 py-4">
                <span className="font-display text-[0.875rem] tracking-[-0.015em]">
                  {c.nom}
                </span>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.13em] text-muted">
                  {c.secteur}
                </span>
              </div>
            </li>
          ))}

          <li className="flex flex-col justify-center gap-4 bg-canvas p-8">
            <p className="max-w-[15rem] font-display text-[1.125rem] leading-tight tracking-[-0.02em]">
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
