"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import SocialLinks from "@/components/ui/SocialLinks";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/qui-sommes-nous", label: "Qui sommes-nous ?" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/references", label: "Références" },
  { href: "/offres-emploi", label: "Offres d'emploi" },
  { href: "/contact", label: "Contact" },
];

/**
 * La barre de navigation.
 *
 * Deux états. En haut de page elle est transparente : rien ne doit voler la
 * vedette à l'appareil fermé. Dès quarante pixels de défilement, un fond
 * dépoli et un filet apparaissent — la barre s'ancre, et le texte reste
 * lisible quel que soit ce qui passe dessous.
 */
export default function Header() {
  const [ancree, setAncree] = useState(false);
  const [menu, setMenu] = useState(false);
  const chemin = usePathname();

  useEffect(() => {
    const onScroll = () => setAncree(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Le menu mobile ne survit pas au passage en grand écran : le panneau est
  // masqué par `lg:hidden`, mais l'overflow du body resterait bloqué.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setMenu(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      {/* La barre est toujours teintée, jamais transparente : le blanc froid
          se détache du blanc cassé chaud du corps de page. Au défilement, la
          teinte se densifie et une ombre basse détache la barre du contenu. */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ${
          ancree
            ? "border-ink/10 bg-white/80 shadow-[0_1px_24px_-12px_rgba(36,27,75,0.30)]"
            : "border-ink/[0.06] bg-white/55"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-8 px-5 md:px-8">
          <Link
            href="/"
            aria-label="DA Digit All, accueil"
            className="group flex items-center"
          >
            {/* Le logo complet dès que la place le permet ; le symbole seul
                en dessous, où le lettrage deviendrait illisible. */}
            <Image
              src="/logo.png"
              alt="DA Digit All"
              width={900}
              height={586}
              priority
              className="hidden h-9 w-auto sm:block"
            />
            <Image
              src="/logo-mark.png"
              alt="DA Digit All"
              width={480}
              height={358}
              priority
              className="h-8 w-auto sm:hidden"
            />
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {NAV.map((item) => {
                const actif = chemin === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={actif ? "page" : undefined}
                      className="group relative block py-2 text-[0.875rem] text-ink/70 transition-colors duration-200 hover:text-ink"
                    >
                      {item.label}
                      <span
                        className={`absolute inset-x-0 bottom-0 h-px origin-left bg-orange transition-transform duration-300 ease-[var(--ease-device)] ${
                          actif
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <SocialLinks className="hidden sm:flex" />

            <a
              href="tel:+2290142260809"
              className="hidden font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink xl:block"
            >
              +229 01 42 26 08 09
            </a>
            <Button
              href="/contact"
              size="sm"
              className="hidden sm:inline-flex"
              trailing={<span aria-hidden>→</span>}
            >
              Démarrer un projet
            </Button>

            <button
              type="button"
              onClick={() => setMenu((v) => !v)}
              aria-expanded={menu}
              aria-controls="menu-mobile"
              aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full ring-1 ring-inset ring-hairline transition-colors hover:ring-violet lg:hidden"
            >
              <span
                className={`block h-px w-4 bg-ink transition-transform duration-300 ${menu ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-4 bg-ink transition-transform duration-300 ${menu ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        hidden={!menu}
        className="fixed inset-0 z-40 bg-canvas/95 backdrop-blur-2xl lg:hidden"
      >
        <nav
          aria-label="Navigation mobile"
          className="flex h-full flex-col justify-center px-8"
        >
          <ul className="space-y-2">
            {NAV.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenu(false)}
                  className="flex items-baseline gap-4 py-3 font-display text-[clamp(2rem,9vw,3rem)] leading-none tracking-[-0.04em] transition-colors hover:text-violet"
                >
                  <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-orange">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 border-t border-hairline pt-8">
            <Image
              src="/logo-mark.png"
              alt=""
              width={480}
              height={358}
              className="mb-6 h-10 w-auto opacity-90"
            />
            <p className="eyebrow">Écrire</p>
            <a
              href="mailto:contact@dadigitall.com"
              onClick={() => setMenu(false)}
              className="mt-2 block text-lg text-ink"
            >
              contact@dadigitall.com
            </a>
            <a
              href="tel:+2290167086534"
              className="mt-1 block text-lg text-muted"
            >
              +229 01 42 26 08 09
            </a>
            <SocialLinks className="mt-6" iconClassName="h-[18px] w-[18px]" />
          </div>
        </nav>
      </div>
    </>
  );
}
