import nodemailer from "nodemailer";

/**
 * Les deux canaux de notification d'une demande de contact.
 *
 * Le courriel sert d'archive : il est recherchable, transférable et il
 * survit au téléphone. WhatsApp sert d'alerte : il arrive dans la seconde,
 * là où l'équipe regarde vraiment.
 *
 * Les deux fonctions renvoient un booléen plutôt que de lever une exception.
 * La route appelante décide alors quoi répondre au visiteur — un message
 * parti par un seul des deux canaux reste un message reçu.
 */

export type Demande = {
  prenom: string;
  nom: string;
  organisation?: string;
  email: string;
  telephone?: string;
  besoin: string;
  message: string;
};

/** Nom complet, utilisé dans les objets et les en-têtes. */
export const nomComplet = (d: Demande) => `${d.prenom} ${d.nom}`.trim();

/** Lien de réponse directe sur WhatsApp, à partir du numéro saisi. */
function lienWhatsApp(numero?: string) {
  if (!numero) return null;
  const chiffres = numero.replace(/\D/g, "");
  if (chiffres.length < 8) return null;
  // Un numéro saisi sans indicatif est présumé béninois.
  const international = chiffres.length <= 10 ? `229${chiffres}` : chiffres;
  return `https://wa.me/${international}`;
}

/* ------------------------------------------------------------------ */
/* Courriel — SMTP                                                     */
/* ------------------------------------------------------------------ */

let transporteur: nodemailer.Transporter | null = null;

function getTransporteur() {
  if (transporteur) return transporteur;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  transporteur = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    // 465 impose TLS d'emblée ; 587 démarre en clair puis passe en STARTTLS.
    secure: Number(SMTP_PORT ?? 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporteur;
}

export async function envoyerEmail(d: Demande): Promise<boolean> {
  const envoi = getTransporteur();
  if (!envoi) {
    console.warn("[contact] SMTP non configuré — courriel ignoré");
    return false;
  }

  const lignes = [
    ["Prénom", d.prenom],
    ["Nom", d.nom],
    ["Organisation", d.organisation || "—"],
    ["Courriel", d.email],
    ["Téléphone", d.telephone || "—"],
    ["Besoin", d.besoin],
  ];

  try {
    await envoi.sendMail({
      from: `"Site DA Digit All" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_DESTINATAIRE ?? process.env.SMTP_USER,
      // Répondre au message renvoie directement vers le visiteur.
      replyTo: `"${nomComplet(d)}" <${d.email}>`,
      subject: `Nouveau projet — ${nomComplet(d)}${d.organisation ? ` (${d.organisation})` : ""}`,
      text: [...lignes.map(([k, v]) => `${k} : ${v}`), "", d.message].join(
        "\n",
      ),
      html: `
        <div style="font-family:system-ui,sans-serif;color:#241b4b;max-width:640px">
          <p style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6f668c">
            Demande reçue via dadigitall.com
          </p>
          <h2 style="margin:8px 0 20px;font-size:20px">${echapper(nomComplet(d))}</h2>
          <table style="border-collapse:collapse;font-size:14px;width:100%">
            ${lignes
              .map(
                ([k, v]) => `<tr>
                  <td style="padding:6px 16px 6px 0;color:#6f668c;white-space:nowrap">${k}</td>
                  <td style="padding:6px 0">${echapper(String(v))}</td>
                </tr>`,
              )
              .join("")}
          </table>
          <div style="margin-top:20px;padding:16px;background:#f1e7d9;border-radius:10px;
                      font-size:14px;line-height:1.6;white-space:pre-wrap">${echapper(d.message)}</div>
        </div>`,
    });
    return true;
  } catch (e) {
    console.error("[contact] échec SMTP", e);
    return false;
  }
}

/** Le message du visiteur atterrit dans du HTML : il doit être neutralisé. */
function echapper(t: string) {
  return t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ------------------------------------------------------------------ */
/* WhatsApp — WAHA                                                     */
/* ------------------------------------------------------------------ */

export async function envoyerWhatsApp(d: Demande): Promise<boolean> {
  const { WAHA_URL, WAHA_API_KEY, WAHA_SESSION, WAHA_DESTINATAIRE } =
    process.env;
  if (!WAHA_URL || !WAHA_DESTINATAIRE) {
    console.warn("[contact] WAHA non configuré — WhatsApp ignoré");
    return false;
  }

  // chatId : numéro international sans le +, suffixé @c.us
  const chatId = `${WAHA_DESTINATAIRE.replace(/\D/g, "")}@c.us`;

  const repondre = lienWhatsApp(d.telephone);

  const texte = [
    "*Nouvelle demande — dadigitall.com*",
    "",
    `*Nom* : ${nomComplet(d)}`,
    d.organisation ? `*Organisation* : ${d.organisation}` : null,
    `*Courriel* : ${d.email}`,
    d.telephone ? `*Téléphone* : ${d.telephone}` : null,
    `*Besoin* : ${d.besoin}`,
    "",
    d.message.length > 700 ? `${d.message.slice(0, 700)}…` : d.message,
    // Répondre en un geste, sans recopier le numéro à la main.
    repondre ? `\n_Répondre sur WhatsApp :_ ${repondre}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    // WAHA peut mettre plusieurs secondes à répondre : sans borne, la route
    // resterait suspendue et le visiteur croirait à un échec.
    const stop = AbortSignal.timeout(8000);

    const r = await fetch(`${WAHA_URL.replace(/\/$/, "")}/api/sendText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(WAHA_API_KEY ? { "X-Api-Key": WAHA_API_KEY } : {}),
      },
      body: JSON.stringify({
        session: WAHA_SESSION ?? "default",
        chatId,
        text: texte,
      }),
      signal: stop,
    });

    if (!r.ok) {
      console.error("[contact] WAHA a répondu", r.status, await r.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[contact] échec WAHA", e);
    return false;
  }
}
