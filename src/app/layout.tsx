import type { Metadata, Viewport } from "next";
import { Archivo, Inter_Tight, JetBrains_Mono } from "next/font/google";

import AmbientBackground from "@/components/layout/AmbientBackground";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Header from "@/components/layout/Header";
import "./globals.css";

/* Archivo en titrage : ses capitales larges et sa terminaison en pointe sur
   le A répondent directement au « Λ » du logo DA Digit All. L'axe de chasse
   permet d'élargir légèrement les grands titres sans changer de fonte. */
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  axes: ["wdth"],
});

/* Inter Tight en lecture : chasse resserrée, très lisible en petit corps,
   et assez neutre pour laisser Archivo porter la personnalité. */
const inter = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dadigitall.com"),
  title: {
    default: "DA Digit All — Nous inspirons l'excellence",
    template: "%s · DA Digit All",
  },
  description:
    "Transformation digitale, développement web et mobile, intégration d'API, systèmes et réseaux, infrastructures et formation. DA Digit All conçoit, déploie et maintient les solutions numériques des organisations au Bénin et dans la sous-région.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "DA Digit All",
    title: "DA Digit All — Nous inspirons l'excellence",
    description:
      "De la première question posée au système qui tourne encore dans trois ans.",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#FBF7F2",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${archivo.variable} ${inter.variable} ${mono.variable}`}
    >
      <body className="relative min-h-dvh antialiased">
        <AmbientBackground />
        <SmoothScroll />

        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-canvas"
        >
          Aller au contenu
        </a>

        <Header />
        <main id="contenu">{children}</main>
      </body>
    </html>
  );
}
