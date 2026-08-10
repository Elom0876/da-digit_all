import type { Metadata } from "next";

import PageIntro from "@/components/layout/PageIntro";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Réalisations",
  description:
    "Master Digit, Garage Digit, Shop Digit, Stock Digit et CRM Digit : les solutions métier conçues et déployées par DA Digit All.",
  openGraph: {
    title: "Réalisations · DA Digit All",
    description:
      "Master Digit, Garage Digit, Shop Digit, Stock Digit et CRM Digit : cinq solutions métier en production.",
  },
};

const PROJETS = [
  {
    num: "01",
    nom: "Master Digit",
    type: "Web & Mobile",
    resume:
      "Gestion métier pour Master Distributeur de téléphonie mobile : stock, approvisionnement virtuel et espèces, transactions Mobile Money, rapports d'activité, capital et chiffre d'affaires par agence.",
  },
  {
    num: "02",
    nom: "Garage Digit",
    type: "Plateforme web",
    resume:
      "Gestion complète de garage automobile : entrée des véhicules, diagnostic, devis, réparations, paiements, sorties et génération de rapports.",
  },
  {
    num: "03",
    nom: "Shop Digit",
    type: "Plateforme web",
    resume:
      "Gestion centralisée du stock, des approvisionnements et des ventes multi-agences, avec supervision depuis la direction.",
  },
  {
    num: "04",
    nom: "Stock Digit",
    type: "Plateforme web",
    resume:
      "Gestion de stock utilisée par les agences et les commerciaux MTN Bénin, notamment chez le Master Distributeur Faghal SA.",
  },
  {
    num: "05",
    nom: "CRM Digit",
    type: "Web & Mobile",
    resume:
      "CRM pour la gestion des activités internes de GreenPay : clients, transactions et suivi commercial.",
  },
];

export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="Réalisations"
        titre={
          <>
            Cinq solutions métier,{" "}
            <span className="text-orange">en production aujourd&apos;hui.</span>
          </>
        }
        chapo="Chacune est née d'un besoin précis, puis affinée par l'usage. Toutes tournent encore."
        aside={
          <Button href="/contact" trailing={<span aria-hidden>→</span>}>
            Discuter de votre besoin
          </Button>
        }
      />

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-hairline md:grid-cols-2">
          {PROJETS.map((p) => (
            <article
              key={p.nom}
              className="bg-canvas p-8 transition-colors hover:bg-white md:p-10"
            >
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[0.6875rem] tracking-[0.18em] text-orange">
                    {p.num}
                  </span>
                  <h2 className="font-display text-[1.5rem] leading-none tracking-[-0.03em]">
                    {p.nom}
                  </h2>
                </div>
                <span className="shrink-0 rounded-full bg-violet/10 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-violet">
                  {p.type}
                </span>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                {p.resume}
              </p>
            </article>
          ))}

          <div className="flex flex-col justify-center bg-canvas p-8 md:p-10">
            <p className="font-display text-[1.25rem] leading-tight tracking-[-0.025em]">
              Votre secteur n&apos;est pas dans cette liste ?
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Les blocages qui coûtent le plus cher se ressemblent d&apos;un
              métier à l&apos;autre.
            </p>
            <div className="mt-6">
              <Button
                href="/contact"
                size="sm"
                trailing={<span aria-hidden>→</span>}
              >
                Décrire votre situation
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
