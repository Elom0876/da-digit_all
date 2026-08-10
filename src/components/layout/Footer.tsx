import Image from "next/image";
import Link from "next/link";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/qui-sommes-nous", label: "Qui sommes-nous ?" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/references", label: "Références" },
  { href: "/offres-emploi", label: "Offres d'emploi" },
  { href: "/contact", label: "Contact" },
];

/** Pied de page des pages intérieures. La page d'accueil n'en a pas :
 *  le parcours s'y termine sur l'appareil, pas sur un plan du site. */
export default function Footer() {
  return (
    /* Bande froide teintée d'encre : à côté du blanc cassé chaud du corps,
       la différence de température suffit à séparer les deux zones sans
       poser un aplat opaque. */
    <footer className="relative mt-28 border-t border-ink/12 bg-ink/[0.045] backdrop-blur-sm">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:px-8">
        <div>
          <Image
            src="/logo.png"
            alt="DA Digit All"
            width={900}
            height={586}
            className="h-10 w-auto"
          />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
            Transformation digitale, développement web et mobile, systèmes et
            infrastructures. Cotonou, Bénin — interventions dans toute la
            sous-région.
          </p>
        </div>

        <nav aria-label="Plan du site">
          <p className="eyebrow">Le site</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((i) => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  className="text-muted transition-colors hover:text-ink"
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow">Nous joindre</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href="mailto:contact@dadigitall.com"
                className="text-muted transition-colors hover:text-ink"
              >
                contact@dadigitall.com
              </a>
            </li>
            <li>
              <a
                href="tel:+2290167086534"
                className="text-muted transition-colors hover:text-ink"
              >
                +229 01 67 08 65 34
              </a>
            </li>
            <li className="pt-2 text-muted">
              1360, Rue 12.052 — Les Cocotiers
            </li>
            <li className="text-muted">Cotonou, Bénin</li>
            <li className="text-muted">Lundi – vendredi, 8h – 18h</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/10 bg-ink/[0.03]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted md:flex-row md:items-center md:justify-between md:px-8">
          <span>© {new Date().getFullYear()} DA Digit All</span>
          <span>Inspirer l&apos;excellence</span>
        </div>
      </div>
    </footer>
  );
}
