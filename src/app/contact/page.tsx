import type { Metadata } from "next";

import PageIntro from "@/components/layout/PageIntro";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Parler d'un projet avec DA Digit All : premier échange d'une heure, gratuit et sans engagement. Bureaux à Cotonou, interventions dans toute la sous-région.",
};

const QUESTIONS = [
  {
    q: "Combien coûte un projet ?",
    r: "Cela dépend entièrement du périmètre, et personne ne peut répondre sérieusement avant le cadrage. Ce que nous pouvons garantir : un chiffrage écrit avant la signature, et aucune facturation d'un travail qui n'a pas été validé.",
  },
  {
    q: "Combien de temps avant une première version ?",
    r: "Entre six et douze semaines pour une première version utilisable en conditions réelles, selon la complexité de l'intégration avec vos systèmes existants. Nous préférons livrer un périmètre réduit qui fonctionne plutôt qu'un ensemble complet en retard.",
  },
  {
    q: "Travaillez-vous en dehors du Bénin ?",
    r: "Oui. Nous intervenons au Togo, en Côte d'Ivoire et au Nigéria, en français comme en anglais. Le cadrage se fait sur place ; le reste peut se conduire à distance avec des points réguliers.",
  },
  {
    q: "Que se passe-t-il après la livraison ?",
    r: "La supervision, les correctifs sous quatre heures et les évolutions trimestrielles font partie du contrat de maintenance. Nous ne considérons pas un projet terminé le jour de la mise en ligne.",
  },
  {
    q: "Pouvez-vous reprendre un projet commencé par quelqu'un d'autre ?",
    r: "Souvent, oui. Nous commençons par un audit du code et de l'infrastructure existants, à l'issue duquel nous vous disons franchement s'il vaut mieux reprendre ou repartir. Les deux réponses arrivent.",
  },
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
        chapo="Nous accompagnons les entreprises dans leur transformation digitale grâce à des solutions web, mobiles, infrastructures et technologies innovantes, conçues pour accélérer leur croissance et leur performance. Bureaux à Cotonou, interventions dans toute la sous-région."
      />

      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.05] tracking-[-0.035em]">
              Parler d&apos;un projet
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
              Plus vous décrivez la situation actuelle — qui fait quoi, avec
              quels outils, où ça coince — plus notre première réponse sera
              utile.
            </p>
            <div className="mt-10">
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
                Zone des Ambassades
                <br />
                Cotonou, Bénin
              </p>
              <p className="mt-3 text-sm text-muted">
                Sur rendez-vous — écrivez-nous la veille.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-hairline/70 bg-sand/30">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-24">
          <p className="eyebrow">Questions fréquentes</p>
          <div className="mt-10 space-y-px overflow-hidden rounded-[var(--radius-card)] bg-hairline">
            {QUESTIONS.map((item) => (
              <div
                key={item.q}
                className="grid gap-4 bg-canvas p-8 md:grid-cols-[1fr_1.6fr] md:p-10"
              >
                <h3 className="font-display text-[1.1875rem] leading-tight tracking-[-0.025em]">
                  {item.q}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{item.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
