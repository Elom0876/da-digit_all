#!/usr/bin/env bash
#
# Déploiement du site DA Digit All (Next.js standalone) vers le VPS.
#
# Usage :
#   ./scripts/deploy.sh              # build + transfert + redémarrage
#   ./scripts/deploy.sh --no-build   # transfert + redémarrage seulement
#
# Pré-requis :
#   - Clé SSH ~/.ssh/digital_admin_ed25519 installée pour digital-admin sur le VPS
#   - Host SSH `dadigitall-deploy` configuré dans ~/.ssh/config
#   - Node.js et npm installés localement
#
set -euo pipefail

# ── Configuration ──────────────────────────────────────────────────────────

REMOTE_HOST="dadigitall-deploy"
REMOTE_DIR="/var/www/html/dadigital/nextjs-site"
SERVICE="dadigitall-nextjs"
PORT=3013

# ── Couleurs ───────────────────────────────────────────────────────────────

if [[ -t 1 ]]; then
  BOLD="\033[1m"
  GREEN="\033[32m"
  YELLOW="\033[33m"
  RED="\033[31m"
  CYAN="\033[36m"
  RESET="\033[0m"
else
  BOLD=""; GREEN=""; YELLOW=""; RED=""; CYAN=""; RESET=""
fi

log()  { echo -e "${CYAN}▸${RESET} $*"; }
ok()   { echo -e "${GREEN}✓${RESET} $*"; }
warn() { echo -e "${YELLOW}⚠${RESET} $*"; }
err()  { echo -e "${RED}✗${RESET} $*" >&2; }

# ── Vérifications préalables ───────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_DIR"

if [[ ! -f package.json ]]; then
  err "Aucun package.json trouvé dans $PROJECT_DIR"
  exit 1
fi

if [[ ! -f next.config.ts ]]; then
  err "next.config.ts introuvable — exécuter depuis la racine du projet"
  exit 1
fi

# ── Étapes ─────────────────────────────────────────────────────────────────

DO_BUILD=true
if [[ "${1:-}" == "--no-build" ]]; then
  DO_BUILD=false
fi

# 1. Build
if $DO_BUILD; then
  log "Build du site Next.js (output: standalone)…"
  npm run build

  # Copier les assets statiques dans le standalone
  log "Préparation des artefacts standalone…"
  cp -r .next/static .next/standalone/.next/static
  cp -r public .next/standalone/public
  ok "Build terminé"
else
  warn "Build ignoré (--no-build)"
  if [[ ! -d .next/standalone ]]; then
    err "Aucun build standalone trouvé (.next/standalone). Lancez sans --no-build d'abord."
    exit 1
  fi
fi

# 2. Transfert
log "Transfert vers $REMOTE_HOST:$REMOTE_DIR …"
rsync -avz --delete \
  --exclude='.env.local' \
  .next/standalone/ \
  "$REMOTE_HOST:$REMOTE_DIR/"
ok "Transfert terminé"

# 3. Redémarrage du service
log "Redémarrage du service $SERVICE…"
ssh "$REMOTE_HOST" "sudo systemctl restart $SERVICE && sudo systemctl is-active $SERVICE"
ok "Service redémarré"

# 4. Vérification
log "Vérification du site…"
HTTP_CODE=$(ssh "$REMOTE_HOST" "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$PORT/")

if [[ "$HTTP_CODE" == "200" ]]; then
  ok "Site en ligne — HTTP $HTTP_CODE"
else
  err "Le site répond HTTP $HTTP_CODE — vérifier les logs : ssh $REMOTE_HOST 'sudo journalctl -u $SERVICE -n 50'"
  exit 1
fi

# 5. Vérification HTTPS (optionnel)
log "Vérification HTTPS…"
HTTPS_CODE=$(curl -sL -o /dev/null -w '%{http_code}' https://www.dadigitall.com/ 2>/dev/null || echo "000")

if [[ "$HTTPS_CODE" == "200" ]]; then
  ok "HTTPS OK — https://www.dadigitall.com/ (HTTP $HTTPS_CODE)"
else
  warn "HTTPS a répondu $HTTPS_CODE — le site local répond mais vérifiez Apache/SSL"
fi

echo ""
ok "Déploiement terminé avec succès"
