"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";

const BESOINS = [
  "Transformation digitale",
  "Développement web",
  "Développement mobile",
  "Infrastructure, système et réseau",
  "Étude, audit ou formation",
  "Stage professionnel",
  "Stage académique",
  "Autre / je ne sais pas encore",
];

type Etat = "repos" | "envoi" | "succes" | "erreur";

/** Numéro WhatsApp de DA Digit All, format international sans le +. */
const WHATSAPP = "2290167086534";

type Props = {
  /** Pré-sélection du champ « besoin », ex. depuis /contact?besoin=Stage%20professionnel */
  besoinInitial?: string;
  /** Restreint les choix du menu « besoin » (ex. uniquement les deux types de stage). */
  options?: string[];
};

export default function ContactForm({ besoinInitial, options }: Props) {
  const listeBesoins = options && options.length > 0 ? options : BESOINS;
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [besoin, setBesoin] = useState(
    besoinInitial && listeBesoins.includes(besoinInitial)
      ? besoinInitial
      : listeBesoins[0],
  );
  const [message, setMessage] = useState("");
  const [site, setSite] = useState(""); // champ piège
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreur, setErreur] = useState("");

  const complet = prenom.trim() && nom.trim() && email.trim() && message.trim();

  /** Composition du message, commune aux deux canaux. */
  const corpsMessage = () =>
    [
      `Prénom : ${prenom}`,
      `Nom : ${nom}`,
      organisation ? `Organisation : ${organisation}` : null,
      `Courriel : ${email}`,
      telephone ? `Téléphone : ${telephone}` : null,
      `Besoin : ${besoin}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

  /* WhatsApp ouvre une conversation pré-remplie plutôt que d'envoyer en
     arrière-plan : le visiteur garde la main sur ce qu'il envoie, et la
     conversation reste dans son historique — ce qu'un envoi silencieux ne
     permettrait pas. */
  const ouvrirWhatsApp = () => {
    if (!complet) return;
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(corpsMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const envoyer = async () => {
    if (!complet || etat === "envoi") return;
    setEtat("envoi");
    setErreur("");

    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom,
          nom,
          organisation,
          email,
          telephone,
          besoin,
          message,
          site,
        }),
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        setErreur(
          data.erreur ?? "L'envoi a échoué. Réessayez dans un instant.",
        );
        setEtat("erreur");
        return;
      }

      setEtat("succes");
    } catch {
      setErreur("Connexion impossible. Vérifiez votre réseau et réessayez.");
      setEtat("erreur");
    }
  };

  const champ =
    "w-full rounded-[10px] border border-hairline bg-white/70 px-4 py-3 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-violet focus:outline-none disabled:opacity-60";

  /* Une confirmation qui remplace le formulaire, plutôt qu'un bandeau vert
     au-dessus de champs encore remplis : rien ne laisse croire qu'il faudrait
     renvoyer le message. */
  if (etat === "succes") {
    return (
      <div className="rounded-[var(--radius-card)] border border-violet/25 bg-violet/[0.06] p-8">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-violet">
          Message envoyé
        </p>
        <p className="mt-4 font-display text-[1.375rem] leading-tight tracking-[-0.025em]">
          Merci {prenom}, nous revenons vers vous.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Vous recevrez une réponse à l&apos;adresse {email}, généralement sous
          vingt-quatre heures ouvrées. Si c&apos;est urgent, appelez le +229 01
          67 08 65 34.
        </p>
        <button
          type="button"
          onClick={() => {
            setEtat("repos");
            setMessage("");
          }}
          className="mt-6 text-sm text-violet underline underline-offset-4 transition-colors hover:text-ink"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  const enCours = etat === "envoi";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="prenom" className="eyebrow">
            Prénom *
          </label>
          <input
            id="prenom"
            value={prenom}
            disabled={enCours}
            autoComplete="given-name"
            onChange={(e) => setPrenom(e.target.value)}
            className={`mt-2 ${champ}`}
            placeholder="Aline"
          />
        </div>
        <div>
          <label htmlFor="nom" className="eyebrow">
            Nom *
          </label>
          <input
            id="nom"
            value={nom}
            disabled={enCours}
            autoComplete="family-name"
            onChange={(e) => setNom(e.target.value)}
            className={`mt-2 ${champ}`}
            placeholder="Dossou"
          />
        </div>
      </div>

      <div>
        <label htmlFor="organisation" className="eyebrow">
          Organisation
        </label>
        <input
          id="organisation"
          value={organisation}
          disabled={enCours}
          autoComplete="organization"
          onChange={(e) => setOrganisation(e.target.value)}
          className={`mt-2 ${champ}`}
          placeholder="Nom de votre entreprise"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="eyebrow">
            Courriel *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            disabled={enCours}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-2 ${champ}`}
            placeholder="aline@exemple.bj"
          />
        </div>
        <div>
          <label htmlFor="telephone" className="eyebrow">
            Téléphone
          </label>
          <input
            id="telephone"
            /* type="tel" ouvre le pavé numérique sur mobile et laisse passer
               les espaces, les points et l'indicatif — un type="number"
               refuserait le « + » et mangerait les zéros initiaux. */
            type="tel"
            inputMode="tel"
            value={telephone}
            disabled={enCours}
            autoComplete="tel"
            onChange={(e) => setTelephone(e.target.value)}
            className={`mt-2 ${champ}`}
            placeholder="+229 01 00 00 00 00"
          />
        </div>
      </div>

      <div>
        <label htmlFor="besoin" className="eyebrow">
          Votre besoin
        </label>
        <select
          id="besoin"
          value={besoin}
          disabled={enCours}
          onChange={(e) => setBesoin(e.target.value)}
          className={`mt-2 ${champ}`}
        >
          {listeBesoins.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="eyebrow">
          Le problème que vous cherchez à régler *
        </label>
        <textarea
          id="message"
          rows={6}
          value={message}
          disabled={enCours}
          onChange={(e) => setMessage(e.target.value)}
          className={`mt-2 resize-y ${champ}`}
          placeholder="Décrivez la situation actuelle plutôt que la solution attendue : c'est ce qui nous aide le plus."
        />
      </div>

      {/* Champ piège : hors écran pour les humains, tentant pour les robots */}
      <div
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="site">Ne pas remplir</label>
        <input
          id="site"
          tabIndex={-1}
          autoComplete="off"
          value={site}
          onChange={(e) => setSite(e.target.value)}
        />
      </div>

      {etat === "erreur" && (
        <p
          role="alert"
          className="rounded-[10px] border border-orange/40 bg-orange/[0.07] px-4 py-3 text-sm text-ink/80"
        >
          {erreur}
        </p>
      )}

      {/* Choix du canal. Deux boutons explicites plutôt qu'une liste
          déroulante : le visiteur voit d'un coup les deux manières de nous
          joindre, et le second bouton n'est pas un repli mais une option. */}
      <div className="mt-2 rounded-[var(--radius-card)] border border-ink/10 bg-sand/25 p-6">
        <p className="eyebrow">Comment nous l&apos;envoyer</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            onClick={envoyer}
            disabled={!complet || enCours}
            trailing={<span aria-hidden>→</span>}
          >
            {enCours ? "Envoi en cours…" : "Envoyer par courriel"}
          </Button>

          <span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted sm:block">
            ou
          </span>

          <Button
            onClick={ouvrirWhatsApp}
            disabled={!complet || enCours}
            variant="outline"
            trailing={<span aria-hidden>↗</span>}
          >
            Continuer sur WhatsApp
          </Button>
        </div>

        <p
          aria-live="polite"
          className="mt-4 text-xs leading-relaxed text-muted"
        >
          {enCours
            ? "Un instant…"
            : "Le courriel part vers contact@dadigitall.com. WhatsApp ouvre une conversation déjà rédigée avec le +229 01 40 26 08 09 — vous n'avez plus qu'à appuyer sur envoyer."}
        </p>
      </div>
    </div>
  );
}
