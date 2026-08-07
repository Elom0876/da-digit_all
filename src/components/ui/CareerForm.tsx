"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";

const DOMAINES = [
  "Développement web",
  "Développement mobile",
  "Design UI/UX",
  "Systèmes, réseaux et infrastructures",
  "Formation et accompagnement",
  "Autre",
];

/**
 * Aucun poste n'est publié pour l'instant : plutôt que de laisser la page
 * vide, on ouvre une candidature spontanée. Même logique que ContactForm —
 * le message part vraiment par courriel, pas de faux bouton « Envoyer ».
 */
export default function CareerForm() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [domaine, setDomaine] = useState(DOMAINES[0]);
  const [lien, setLien] = useState("");
  const [message, setMessage] = useState("");

  const complet = nom.trim() && email.trim() && message.trim();

  const envoyer = () => {
    const corps = [
      `Nom : ${nom}`,
      `Courriel : ${email}`,
      `Domaine souhaité : ${domaine}`,
      lien && `CV / portfolio : ${lien}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:recrutement@dadigitall.com?subject=${encodeURIComponent(
      `Candidature spontanée — ${nom}`,
    )}&body=${encodeURIComponent(corps)}`;
  };

  const champ =
    "w-full rounded-[10px] border border-hairline bg-white/70 px-4 py-3 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-violet focus:outline-none";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-nom" className="eyebrow">
            Votre nom *
          </label>
          <input
            id="c-nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className={`mt-2 ${champ}`}
            placeholder="Aline Dossou"
          />
        </div>
        <div>
          <label htmlFor="c-email" className="eyebrow">
            Courriel *
          </label>
          <input
            id="c-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-2 ${champ}`}
            placeholder="aline@exemple.bj"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-domaine" className="eyebrow">
            Domaine souhaité
          </label>
          <select
            id="c-domaine"
            value={domaine}
            onChange={(e) => setDomaine(e.target.value)}
            className={`mt-2 ${champ}`}
          >
            {DOMAINES.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="c-lien" className="eyebrow">
            CV ou portfolio (lien)
          </label>
          <input
            id="c-lien"
            value={lien}
            onChange={(e) => setLien(e.target.value)}
            className={`mt-2 ${champ}`}
            placeholder="linkedin.com/in/…"
          />
        </div>
      </div>

      <div>
        <label htmlFor="c-message" className="eyebrow">
          Pourquoi DA Digit All *
        </label>
        <textarea
          id="c-message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`mt-2 resize-y ${champ}`}
          placeholder="Ce que vous avez déjà fait, ce que vous cherchez à faire ensuite."
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button
          onClick={envoyer}
          disabled={!complet}
          trailing={<span aria-hidden>→</span>}
        >
          Envoyer ma candidature
        </Button>
        <p className="text-xs text-muted">
          Ouvre votre messagerie avec le message pré-rempli.
        </p>
      </div>
    </div>
  );
}
