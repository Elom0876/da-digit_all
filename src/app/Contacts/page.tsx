import type { Metadata } from "next";

import PageIntro from "@/components/layout/PageIntro";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Nous accompagnons les entreprises dans leur transformation digitale grâce à des solutions web, mobiles, infrastructures et technologies innovantes, conçues pour accélérer leur croissance et leur performance. Bureaux à Cotonou, interventions dans toute la sous-région.",
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
            <span className="text-orange">Créons les solutions de demain.</span>
          </>
        }
        chapo="Nous imaginons, concevons et développons des solutions numériques qui connectent les idées, les technologies et les personnes afin d'accompagner les entreprises dans une transformation durable, innovante et créatrice de valeur."
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
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Cotonou, Bénin — sur rendez-vous.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-hairline/70 bg-sand/30">
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
