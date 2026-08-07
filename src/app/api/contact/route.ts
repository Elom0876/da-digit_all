import { NextResponse } from "next/server";

import {
  envoyerEmail,
  envoyerWhatsApp,
  type Demande,
} from "@/lib/notifications";

export const runtime = "nodejs"; // nodemailer a besoin de Node, pas de l'edge

/* Limitation simple par adresse IP. En mémoire : suffisant pour un
   formulaire de contact sur une seule instance, à remplacer par Redis le
   jour où le site tourne sur plusieurs machines. */
const FENETRE = 10 * 60 * 1000;
const MAX = 3;
const envois = new Map<string, number[]>();

function tropDeDemandes(ip: string) {
  const maintenant = Date.now();
  const recents = (envois.get(ip) ?? []).filter(
    (t) => maintenant - t < FENETRE,
  );
  envois.set(ip, [...recents, maintenant]);
  return recents.length >= MAX;
}

const EMAIL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnu";

  if (tropDeDemandes(ip)) {
    return NextResponse.json(
      { erreur: "Trop de demandes. Réessayez dans quelques minutes." },
      { status: 429 },
    );
  }

  let corps: Record<string, unknown>;
  try {
    corps = await req.json();
  } catch {
    return NextResponse.json({ erreur: "Requête invalide." }, { status: 400 });
  }

  // Champ piège : invisible pour un humain, rempli par la plupart des robots.
  if (typeof corps.site === "string" && corps.site.length > 0) {
    return NextResponse.json({ ok: true }); // on feint la réussite
  }

  const texte = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";

  const demande: Demande = {
    prenom: texte(corps.prenom, 80),
    nom: texte(corps.nom, 80),
    organisation: texte(corps.organisation, 120),
    email: texte(corps.email, 160),
    telephone: texte(corps.telephone, 40),
    besoin: texte(corps.besoin, 80) || "Non précisé",
    message: texte(corps.message, 4000),
  };

  if (
    !demande.prenom ||
    !demande.nom ||
    !demande.message ||
    !EMAIL_VALIDE.test(demande.email)
  ) {
    return NextResponse.json(
      { erreur: "Prénom, nom, courriel valide et message sont requis." },
      { status: 422 },
    );
  }

  // Le téléphone est facultatif, mais s'il est saisi il doit être plausible.
  if (demande.telephone && demande.telephone.replace(/\D/g, "").length < 8) {
    return NextResponse.json(
      { erreur: "Le numéro de téléphone semble incomplet." },
      { status: 422 },
    );
  }

  // Les deux canaux partent en parallèle et échouent indépendamment :
  // un WhatsApp indisponible ne doit pas empêcher le courriel de partir.
  const [mail, whatsapp] = await Promise.all([
    envoyerEmail(demande),
    envoyerWhatsApp(demande),
  ]);

  if (!mail && !whatsapp) {
    return NextResponse.json(
      {
        erreur:
          "L'envoi a échoué. Écrivez-nous directement à contact@dadigitall.com.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, mail, whatsapp });
}
