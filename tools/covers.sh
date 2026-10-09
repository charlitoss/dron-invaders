#!/usr/bin/env bash
# Regenerates the social images in img/share/ from tools/covers.html using headless Chrome.
# Usage (from the repo root): tools/covers.sh
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT=8799
mkdir -p img/share
python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER' EXIT
sleep 1

shot() { # name width height
  "$CHROME" --headless=new --hide-scrollbars --force-device-scale-factor=1 --mute-audio \
    --window-size="$2,$3" --virtual-time-budget=6000 \
    --screenshot="img/share/$1.png" "http://127.0.0.1:$PORT/tools/covers.html?w=$2&h=$3" >/dev/null 2>&1
  echo "img/share/$1.png  $2x$3"
}

shot og              1200 630   # link previews (WhatsApp, X, Facebook, LinkedIn, Slack)
shot post-square     1080 1080  # Instagram / Facebook post
shot story           1080 1920  # Instagram / WhatsApp story
shot header-x        1500 500   # X profile header
shot cover-facebook  1640 624   # Facebook page cover
