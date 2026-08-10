<div align="center">
  <img src="public/logo.png" alt="DA Digit All" width="360" />

  # DA Digit All

  **Nous inspirons l'excellence.**

  Site vitrine de DA Digit All, agence béninoise de transformation digitale,
  de conseil et d'ingénierie numérique.

  [Découvrir le site](https://dadigitall.com) · [Nous contacter](mailto:contact@dadigitall.com)
</div>

<br />

## À propos du projet

Ce dépôt contient le site officiel de **DA Digit All**, créée en 2021 à Cotonou.
Le site présente l'agence, ses domaines d'expertise, ses réalisations, ses références
et les opportunités de rejoindre l'équipe.

L'expérience a été pensée comme un parcours éditorial et visuel : une identité
sobre, des transitions fluides et un univers numérique inspiré du motif de
fragmentation du logo. Le site est en français et s'adresse aux organisations du
Bénin et de la sous-région.

### Les expertises mises en avant

- **Transformation digitale 360°** — analyse des processus, solutions sur mesure et déploiement.
- **Étude, audit, conseil et formation** — diagnostic, accompagnement du changement et montée en compétence.
- **Infrastructure, systèmes et réseaux** — architectures, cloud, administration, sécurité et supervision.
- **Assistance à maîtrise d'ouvrage** — cadrage, adjudication et suivi d'exécution.
- **Développement web et mobile** — expériences cohérentes, du bureau au terrain.

## Une expérience de marque

Le site traduit les cinq engagements de DA Digit All :

> **L'Éthique · La Qualité de Service · L'Intégrité · Le Sens de l'Engagement · Le Résultat**

L'interface s'appuie sur le contraste entre le blanc chaud de la toile, l'orange
énergique du logo et le violet profond de la marque. Les composants 3D, le champ de
particules et le défilement doux donnent vie à la page d'accueil sans masquer le
contenu essentiel.

## Stack technique

| Couche | Technologies |
| --- | --- |
| Application | Next.js 16 · React 19 · TypeScript |
| Interface | Tailwind CSS 4 · CSS global · composants réutilisables |
| Motion & 3D | GSAP · Lenis · Three.js · React Three Fiber · Drei |
| Formulaire | Route API Next.js · Nodemailer · notification WhatsApp via WAHA |
| Qualité | ESLint · TypeScript strict |

## Démarrer en local

### Pré-requis

- Node.js 20 ou version plus récente
- npm

### Installation

```bash
npm ci
```

### Lancer le serveur de développement

```bash
npm run dev
```

Le site est alors disponible sur [http://localhost:3000](http://localhost:3000).

### Commandes disponibles

```bash
npm run dev      # serveur de développement
npm run lint     # vérification ESLint
npm run build    # build de production
npm run start    # démarrage du build de production
```

## Configuration du formulaire de contact

Le site peut transmettre les demandes reçues par courriel et par WhatsApp. Ces
services sont optionnels en développement : sans configuration, l'interface reste
accessible mais l'envoi des notifications est désactivé.

Créer un fichier `.env.local` à la racine du projet :

```dotenv
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=contact@dadigitall.com
SMTP_PASS=votre-mot-de-passe-smtp
CONTACT_DESTINATAIRE=contact@dadigitall.com

WAHA_URL=https://votre-instance-waha.example.com
WAHA_API_KEY=votre-cle-api
WAHA_SESSION=default
WAHA_DESTINATAIRE=229XXXXXXXXX
```

Ne jamais versionner `.env.local` ni exposer ces valeurs dans le navigateur.

## Organisation du projet

```text
src/
├── app/                  # pages, métadonnées et route API du contact
├── components/
│   ├── layout/           # en-tête, pied de page, fond et défilement
│   ├── scene/            # scènes 3D et appareils présentés sur l'accueil
│   ├── sections/         # sections éditoriales et parcours principal
│   ├── three/            # composants Three.js / React Three Fiber
│   └── ui/               # boutons, formulaires et composants réutilisables
└── lib/                  # notifications et logique partagée

public/
├── logo.png              # logo principal DA Digit All
├── logo-mark.png         # symbole de la marque
└── references/           # visuels des projets et références clients
```

## Pages du site

- `/` — parcours d'accueil et présentation des expertises
- `/qui-sommes-nous` — vision, mission, valeurs, approche et équipe
- `/realisations` — projets réalisés
- `/references` — organisations et partenaires de confiance
- `/offres-emploi` — candidatures et opportunités
- `/contact` — prise de contact et demande d'accompagnement

## Processus de mise à jour

Le projet utilise un pipeline CI/CD GitHub Actions. La branche `main` est protégée :
aucun push direct ni force push n'est autorisé, et toute modification doit passer par
une pull request dont les vérifications automatiques ont réussi.

### Workflow CI/CD

Le workflow [deploy.yml](.github/workflows/deploy.yml) se déclenche sur chaque
pull request vers `main` et sur chaque push vers `main`. Il est composé de deux jobs :

1. **verify** — s'exécute sur les PR et sur `main` :
   - `npm ci` — installation des dépendances
   - `npm run lint` — vérification ESLint
   - `npm run type-check` — vérification TypeScript (`tsc --noEmit`)
   - `npm run build` — build de production en mode standalone
   - Upload des artefacts de build pour le job de déploiement

2. **deploy** — s'exécute uniquement sur `main`, après que `verify` a passé :
   - Transfert des artefacts vers le VPS via rsync
   - Redémarrage du service systemd `dadigitall-nextjs`
   - Vérification HTTP sur `127.0.0.1:3013`
   - Vérification HTTPS sur `https://www.dadigitall.com/`

### Contribuer une modification

```bash
# 1. Créer une branche depuis main
git checkout main
git pull origin main
git checkout -b feature/ma-modification

# 2. Coder, tester en local
npm run dev
npm run lint
npm run type-check

# 3. Committer et pousser
git add .
git commit -m "Description claire de la modification"
git push -u origin feature/ma-modification

# 4. Créer une pull request sur GitHub
gh pr create --title "Titre de la PR" --body "Description"
```

La PR déclenche le job `verify`. Une fois les vérifications passées, la PR peut être
mergée. Le merge déclenche automatiquement le déploiement vers le VPS.

### Déploiement local (sans GitHub)

Un script de déploiement manuel est disponible pour déployer depuis un poste local
sans passer par GitHub Actions :

```bash
./scripts/deploy.sh              # build + transfert + redémarrage
./scripts/deploy.sh --no-build   # transfert + redémarrage sans rebuild
```

Le script build le site en standalone, transfère les artefacts via rsync vers le VPS,
redémarre le service systemd et vérifie que le site répond.

### Architecture de déploiement

```text
Internet → Apache (:443 SSL) → reverse proxy → Node server.js (:3013)
                                              → /var/www/html/dadigital/nextjs-site/
```

| Composant | Détail |
| --- | --- |
| VPS | DigitalOcean, Ubuntu 22.04, 149.202.51.73:60718 |
| Serveur web | Apache 2 avec mod_proxy, mod_ssl, mod_rewrite |
| Process manager | systemd (`dadigitall-nextjs.service`) |
| SSL | Certificats dans `/etc/ssl/dadigitall/` |
| Build | Next.js standalone (`output: "standalone"` dans `next.config.ts`) |

## Processus de release

Le workflow [release.yml](.github/workflows/release.yml) se déclenche automatiquement
lors de la création d'un tag au format `v*.*.*` (ex: `v1.0.0`, `v1.2.3`).

### Créer une release

```bash
# 1. S'assurer d'être sur main à jour
git checkout main
git pull origin main

# 2. Créer le tag
git tag v1.1.0
git push origin v1.1.0
```

Le workflow génère automatiquement :

- Un **changelog** groupé par type de commit (Features, Fixes, Documentation, Maintenance, Autres)
- Une **GitHub release** publiée avec le changelog
- Les liens vers les commits et les PRs concernés

Les releases sont visibles sur https://github.com/dadigitall/website/releases

### Versionnement

Le projet suit le versionnement sémantique `MAJEUR.MINEUR.CORRECTIF` :

- **MAJEUR** — changements incompatibles
- **MINEUR** — nouvelles fonctionnalités rétrocompatibles
- **CORRECTIF** — corrections de bugs rétrocompatibles

## Règles du projet

### Pas d'emojis dans le code

Les emojis sont interdits dans tout le codebase : code, configuration, workflows CI/CD,
scripts, documentation technique, messages de commit, commentaires, changelogs générés
et descriptions de release.

### Branche principale protégée

- Aucun push direct sur `main` — tout passe par pull request
- Aucun force push — l'historique est linéaire et immuable
- Les vérifications `lint`, `type-check` et `build` doivent passer avant le merge
- Les branches doivent être à jour avec `main` avant le merge

### Secrets et variables d'environnement

- Ne jamais committer de secrets, mots de passe ou clés API dans le dépôt
- Les variables d'environnement vont dans `.env.local` (ignoré par git)
- Les secrets du pipeline CI/CD sont configurés dans GitHub (Settings > Secrets and variables)

## Identité de DA Digit All

**DA Digit All** accompagne les entreprises dans la conception, le déploiement et
l'évolution de solutions numériques fiables, utiles et adaptées à leurs réalités.

- **Adresse :** Zone des Ambassades, Cotonou, Bénin
- **Courriel :** [contact@dadigitall.com](mailto:contact@dadigitall.com)
- **Horaires :** lundi à vendredi, 8 h à 18 h

<div align="center">
  <br />
  <sub>Conçu avec exigence pour DA Digit All · Cotonou, Bénin</sub>
</div>
