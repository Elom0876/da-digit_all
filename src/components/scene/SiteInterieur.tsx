"use client";

/**
 * Le site qui défile dans la dalle.
 *
 * Marque entièrement fictive — Veyla — pour montrer un livrable crédible sans
 * engager un client réel. C'est une page vitrine complète, de la barre du
 * navigateur au pied de page, qui défile sous le cadre comme si un visiteur
 * la parcourait : un écran qui change par fondu se lit comme un diaporama,
 * un écran qui défile se lit comme un vrai produit.
 *
 * Tout est en `em`. La dalle fixe sa font-size en `cqi`, donc l'intérieur
 * suit la largeur de l'appareil sans point de rupture. Chaque <Page> fait
 * exactement une hauteur d'écran.
 */

const PAGES = 5;

function Page({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{ height: `${100 / PAGES}%` }}
    >
      {children}
    </div>
  );
}

export default function SiteInterieur() {
  return (
    <div className="h-full w-full bg-[#0d0a1c] font-sans text-white">
      {/* --- 01 · Accueil ------------------------------------------------- */}
      <Page className="overflow-hidden">
        <div className="flex items-center gap-[0.6em] border-b border-white/8 bg-[#141024] px-[1.4em] py-[0.7em]">
          <span className="h-[0.4em] w-[0.4em] rounded-full bg-white/18" />
          <span className="h-[0.4em] w-[0.4em] rounded-full bg-white/18" />
          <span className="h-[0.4em] w-[0.4em] rounded-full bg-white/18" />
          <span className="ml-[0.8em] flex-1 rounded-full bg-white/[0.06] px-[1em] py-[0.25em] font-mono text-[0.6em] text-white/40">
            veyla.app
          </span>
        </div>

        <div className="flex items-center justify-between px-[2.4em] py-[1.1em]">
          <span className="font-display text-[0.95em] font-semibold tracking-[-0.02em]">
            Veyla
          </span>
          <nav className="flex gap-[1.4em] text-[0.66em] text-white/55">
            <span>Produit</span>
            <span>Tarifs</span>
            <span>Ressources</span>
            <span>Contact</span>
          </nav>
          <span className="rounded-full bg-orange px-[1.1em] py-[0.4em] text-[0.62em] font-medium text-[#140f27]">
            Essai gratuit
          </span>
        </div>

        <div className="relative px-[2.4em] pt-[1.6em]">
          <div className="absolute right-[-6%] top-[-40%] h-[24em] w-[24em] rounded-full bg-[radial-gradient(circle,rgba(242,146,31,0.32),transparent_62%)] blur-[2em]" />
          <p className="font-mono text-[0.6em] uppercase tracking-[0.22em] text-orange">
            Plateforme de pilotage
          </p>
          <h1 className="mt-[0.5em] font-display text-[2.6em] leading-[0.94] tracking-[-0.04em]">
            Toute votre activité,
            <br />
            sur un seul écran.
          </h1>
          <p className="mt-[1em] max-w-[22em] text-[0.72em] leading-relaxed text-white/55">
            Ventes, stocks, trésorerie et équipes réunis dans une interface
            unique. Fini les tableurs qui se contredisent.
          </p>
          <div className="mt-[1.3em] flex gap-[0.7em]">
            <span className="rounded-full bg-orange px-[1.4em] py-[0.55em] text-[0.66em] font-medium text-[#140f27]">
              Démarrer
            </span>
            <span className="rounded-full px-[1.4em] py-[0.55em] text-[0.66em] text-white/60 ring-1 ring-inset ring-white/15">
              Voir la démo
            </span>
          </div>
        </div>
      </Page>

      {/* --- 02 · Fonctionnalités ----------------------------------------- */}
      <Page className="flex flex-col justify-center border-t border-white/6 bg-[#100c22] px-[2.4em]">
        <p className="font-mono text-[0.6em] uppercase tracking-[0.22em] text-white/35">
          Ce que fait Veyla
        </p>
        <h2 className="mt-[0.4em] font-display text-[1.5em] leading-[1.05] tracking-[-0.035em]">
          Quatre modules, une seule base de données.
        </h2>

        <div className="mt-[1.2em] grid grid-cols-4 gap-[0.8em]">
          {[
            [
              "Ventes",
              "Devis, commandes, facturation et relances automatiques.",
              "orange",
            ],
            [
              "Stocks",
              "Entrées, sorties et seuils d'alerte par entrepôt.",
              "violet",
            ],
            [
              "Trésorerie",
              "Encaissements, échéances et prévisionnel à 90 jours.",
              "azure",
            ],
            [
              "Équipes",
              "Plannings, temps passés et objectifs individuels.",
              "violet",
            ],
          ].map(([titre, texte, c]) => (
            <div
              key={titre}
              className="rounded-[0.6em] bg-white/[0.045] p-[1em]"
            >
              <span
                className="block h-[0.7em] w-[0.7em] rounded-[0.15em]"
                style={{ background: `var(--color-${c})` }}
              />
              <p className="mt-[0.7em] font-display text-[0.85em] tracking-[-0.02em]">
                {titre}
              </p>
              <p className="mt-[0.4em] text-[0.58em] leading-snug text-white/45">
                {texte}
              </p>
            </div>
          ))}
        </div>
      </Page>

      {/* --- 03 · Le produit en situation ---------------------------------- */}
      <Page className="flex flex-col border-t border-white/6 px-[2.4em] py-[1.6em]">
        <div className="flex items-baseline justify-between">
          <p className="font-display text-[1em] tracking-[-0.025em]">
            Tableau de bord
          </p>
          <p className="flex items-center gap-[0.4em] font-mono text-[0.58em] text-violet">
            <span className="h-[0.4em] w-[0.4em] rounded-full bg-violet" />
            Données à jour
          </p>
        </div>

        <div className="mt-[0.9em] grid grid-cols-4 gap-[0.7em]">
          {[
            ["Chiffre d'affaires", "48,2 M", "orange"],
            ["Marge nette", "22,6 %", "violet"],
            ["Commandes", "1 284", "white"],
            ["Encours client", "6,1 M", "white"],
          ].map(([k, v, c]) => (
            <div
              key={k}
              className="rounded-[0.55em] bg-white/[0.045] p-[0.9em]"
            >
              <p className="text-[0.55em] leading-tight text-white/45">{k}</p>
              <p
                className="mt-[0.4em] font-display text-[1.15em] leading-none tracking-[-0.03em]"
                style={{
                  color: c === "white" ? undefined : `var(--color-${c})`,
                }}
              >
                {v}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-[0.8em] flex flex-1 gap-[0.7em]">
          <div className="flex flex-[1.7] flex-col rounded-[0.55em] bg-white/[0.035] p-[1em]">
            <p className="font-mono text-[0.55em] uppercase tracking-[0.14em] text-white/35">
              Évolution sur 12 mois
            </p>
            <div className="mt-[0.8em] flex flex-1 items-end gap-[0.35em]">
              {[38, 52, 44, 61, 55, 72, 66, 84, 71, 90, 82, 96].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-[0.12em]"
                  style={{
                    height: `${h}%`,
                    background:
                      i === 11
                        ? "linear-gradient(180deg,var(--color-orange),rgba(242,146,31,0.18))"
                        : "linear-gradient(180deg,rgba(107,63,212,0.75),rgba(107,63,212,0.1))",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 rounded-[0.55em] bg-white/[0.035] p-[1em]">
            <p className="font-mono text-[0.55em] uppercase tracking-[0.14em] text-white/35">
              Alertes
            </p>
            <div className="mt-[0.7em] space-y-[0.5em]">
              {[
                ["Stock bas · Entrepôt Nord", "orange"],
                ["3 factures échues", "orange"],
                ["Objectif trimestre atteint", "violet"],
              ].map(([l, c]) => (
                <div
                  key={l}
                  className="flex items-start gap-[0.45em] text-[0.56em] text-white/55"
                >
                  <span
                    className="mt-[0.35em] h-[0.35em] w-[0.35em] shrink-0 rounded-full"
                    style={{ background: `var(--color-${c})` }}
                  />
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Page>

      {/* --- 04 · Chiffres et confiance ------------------------------------ */}
      <Page className="flex flex-col justify-center border-t border-white/6 bg-[#100c22] px-[2.4em]">
        <div className="grid grid-cols-3 gap-[1.2em]">
          {[
            ["2 400+", "utilisateurs quotidiens", "orange"],
            ["99,97 %", "de disponibilité", "violet"],
            ["12 min", "pour la mise en route", "azure"],
          ].map(([v, k, c]) => (
            <div key={k}>
              <p
                className="font-display text-[2em] leading-none tracking-[-0.04em]"
                style={{ color: `var(--color-${c})` }}
              >
                {v}
              </p>
              <p className="mt-[0.5em] text-[0.62em] text-white/45">{k}</p>
            </div>
          ))}
        </div>

        <div className="mt-[1.6em] max-w-[26em] border-l-[0.15em] border-orange pl-[1.2em]">
          <p className="font-display text-[0.95em] leading-[1.3] tracking-[-0.02em]">
            « Nous avons remplacé onze tableurs par une seule interface. Le
            comité de direction lit désormais les mêmes chiffres que le terrain.
            »
          </p>
          <p className="mt-[0.7em] font-mono text-[0.55em] uppercase tracking-[0.14em] text-white/35">
            Directrice des opérations
          </p>
        </div>
      </Page>

      {/* --- 05 · Appel à l'action et pied de page -------------------------- */}
      <Page className="flex flex-col justify-between border-t border-white/6 px-[2.4em] py-[1.8em]">
        <div className="relative flex flex-1 flex-col justify-center">
          <div className="absolute left-[30%] top-[-20%] h-[20em] w-[20em] rounded-full bg-[radial-gradient(circle,rgba(107,63,212,0.30),transparent_62%)] blur-[2em]" />
          <div className="relative">
            <h2 className="max-w-[16em] font-display text-[1.9em] leading-[1] tracking-[-0.04em]">
              Essayez Veyla pendant trente jours.
            </h2>
            <p className="mt-[0.7em] max-w-[20em] text-[0.68em] leading-relaxed text-white/50">
              Sans carte bancaire, sans engagement, avec vos données réelles
              importées dès le premier jour.
            </p>
            <div className="mt-[1.1em] flex gap-[0.7em]">
              <span className="rounded-full bg-orange px-[1.4em] py-[0.55em] text-[0.66em] font-medium text-[#140f27]">
                Créer un compte
              </span>
              <span className="rounded-full px-[1.4em] py-[0.55em] text-[0.66em] text-white/60 ring-1 ring-inset ring-white/15">
                Parler à un conseiller
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/8 pt-[1em] font-mono text-[0.55em] uppercase tracking-[0.16em] text-white/25">
          <span>Veyla</span>
          <span>Produit · Tarifs · Sécurité · Contact</span>
        </div>
      </Page>
    </div>
  );
}

export { PAGES as SITE_PAGES };
