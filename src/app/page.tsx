import ParcoursSection from "@/components/sections/ParcoursSection";

/**
 * La page d'accueil ne contient que la scène.
 *
 * Rien ne suit le parcours : quand le dernier écran a défilé, le visiteur
 * s'arrête sur l'invitation à écrire. Les autres contenus — expertises,
 * réalisations, agence — vivent dans le menu, sur leurs propres pages.
 */
export default function Page() {
  return <ParcoursSection />;
}
