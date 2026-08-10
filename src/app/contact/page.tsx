import type { Metadata } from "next";

import PageIntro from "@/components/layout/PageIntro";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Parler d'un projet avec DA Digit All : premier échange d'une heure, gratuit et sans engagement. Siège au 1360, Rue 12.052, Les Cocotiers, Cotonou.",
  openGraph: {
    title: "Contact · DA Digit All",
    description:
      "Un premier échange d'une heure suffit à savoir si un projet tient debout. Siège au 1360, Rue 12.052, Les Cocotiers, Cotonou.",
  },
};

const QUESTIONS = [
  [
    "Combien coûte un projet ?",
    "Impossible de répondre sérieusement avant le cadrage. Ce que nous garantissons : un chiffrage écrit avant signature, et rien de facturé qui n'ait été validé.",
  ],
  [
    "Combien de temps avant une première version ?",
    "Six à douze semaines pour une version utilisable en conditions réelles, selon la complexité de l'intégration avec vos systèmes.",
  ],
  [
    "Que se passe-t-il après la livraison ?",
    "Supervision, correctifs et évolutions font partie du contrat de maintenance. Un projet ne se termine pas à la mise en ligne.",
  ],
];

export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        titre={
          <>
            Décrivez-nous le problème.{" "}
            <span className="text-orange">Pas la solution.</span>
          </>
        }
        chapo="Un premier échange d'une heure suffit à savoir si un projet tient debout. Il est gratuit et sans engagement."
      />

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.05] tracking-[-0.035em]">
              Parler d&apos;un projet
            </h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-px self-start overflow-hidden rounded-[var(--radius-card)] bg-hairline">
            <div className="bg-canvas p-8">
              <p className="eyebrow">Écrire directement</p>
              <a
                href="mailto:contact@dadigitall.com"
                className="mt-3 block font-display text-[1.125rem] tracking-[-0.02em] transition-colors hover:text-violet"
              >
                contact@dadigitall.com
              </a>
              <a
                href="mailto:recrutement@dadigitall.com"
                className="mt-1 block text-sm text-muted transition-colors hover:text-ink"
              >
                recrutement@dadigitall.com
              </a>
            </div>

            <div className="bg-canvas p-8">
              <p className="eyebrow">Appeler</p>
              <a
                href="tel:+2290167086534"
                className="mt-3 block font-display text-[1.125rem] tracking-[-0.02em] transition-colors hover:text-violet"
              >
                +229 01 67 08 65 34
              </a>
              <p className="mt-2 text-sm text-muted">
                Lundi au vendredi, 8h – 18h
              </p>
            </div>

            <div className="bg-canvas p-8">
              <p className="eyebrow">Nous rendre visite</p>
              <address className="mt-3 text-sm not-italic leading-relaxed text-muted">
                1360, Rue 12.052
                <br />
                Les Cocotiers
                <br />
                Cotonou, Bénin
              </address>
              <p className="mt-3 text-sm text-muted">Sur rendez-vous.</p>
            </div>

            <div className="bg-canvas p-8">
              <p className="eyebrow">La direction</p>
              <p className="mt-3 font-display text-[1.0625rem] tracking-[-0.02em]">
                DEKADJEVI Codjo Mathias
              </p>
              <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.13em] text-muted">
                Chief Executive Officer · MBA, Ing
              </p>
              <a
                href="tel:+2290167086534"
                className="mt-3 block text-sm text-muted transition-colors hover:text-ink"
              >
                +229 01 67 08 65 34
              </a>
              <a
                href="mailto:mdekadjevi@dadigitall.com"
                className="block text-sm text-muted transition-colors hover:text-ink"
              >
                mdekadjevi@dadigitall.com
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* Carte du siège. L'iframe « output=embed » ne demande pas de clé
          d'API ; loading="lazy" évite de charger Google avant que le
          visiteur ne descende jusqu'ici. */}
      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-[1400px] px-5 pb-4 pt-14 md:px-8">
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-ink/10">
            <iframe
              title="Siège de DA Digit All — 1360, Rue 12.052, Les Cocotiers, Cotonou"
              src="https://www.google.com/maps?q=1360%20Rue%2012.052%20Les%20Cocotiers%20Cotonou%20B%C3%A9nin&hl=fr&z=16&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[320px] w-full border-0 md:h-[420px]"
            />
          </div>
          <p className="mt-3 text-xs text-muted">
            1360, Rue 12.052 — Les Cocotiers, Cotonou.{" "}
            <a
              href="https://www.google.com/maps/search/?api=1&query=1360+Rue+12.052+Les+Cocotiers+Cotonou+B%C3%A9nin"
              target="_blank"
              rel="noreferrer"
              className="text-violet underline underline-offset-4 transition-colors hover:text-ink"
            >
              Ouvrir dans Google Maps
            </a>
          </p>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-sand/30">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-16">
          <p className="eyebrow">Questions fréquentes</p>
          <div className="mt-10 space-y-px overflow-hidden rounded-[var(--radius-card)] bg-hairline">
            {QUESTIONS.map(([q, r]) => (
              <div
                key={q}
                className="grid gap-3 bg-canvas p-7 md:grid-cols-[1fr_1.6fr] md:p-8"
              >
                <h3 className="font-display text-[1.0625rem] leading-tight tracking-[-0.02em]">
                  {q}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
