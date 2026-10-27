#!/bin/bash
# Prépare l'usine dans un conteneur neuf (à lancer depuis la racine du dépôt)
set -e
npm i --no-audit --no-fund >/dev/null
for f in sfx/*.mp3 music/*.mp3; do ffmpeg -v error -y -i "$f" -ar 44100 "${f%.mp3}.wav"; done
python3 -c "import numpy, scipy, PIL" || pip install --break-system-packages numpy scipy pillow
echo OK
