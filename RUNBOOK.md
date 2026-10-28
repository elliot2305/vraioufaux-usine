# Usine « Vrai ou Faux » — mode d'emploi d'un épisode

Ce fichier est la référence de chaque épisode. Le lire en entier avant de commencer. En mode robot (GitHub Actions), lire d'abord robot/ROBOT.md, qui passe avant ce fichier.
Compte : TikTok d'Elliot (ancien @rediff_first, renommé « Vrai ou Faux »), publié via Metricool.

## 0. Identifiants fixes
- Voix : ElevenLabs « Lucie » `LAUUUZAQpu1khF4zl6Vl`, modèle **eleven_v4** UNIQUEMENT (jamais multilingual : jugé « trop IA »).
- Flow ElevenLabs : `vkNi8ipN3leDfEilQfyf` (voix + Scribe).
- Metricool : blogId `3278629` (marque « Elliot OFF »), réseau **tiktok uniquement** (ne pas publier sur YouTube).
- Banque de sujets : Google Sheet `1cIhewivB44171AyVaellYZv35-YTcmUNQIOV8TfcW_c`, onglet `Sujets` (colonne J = statut).
- Bible du format : Google Doc « Vrai ou Faux — Bible du format » (dossier Drive « Vrai ou Faux — Usine »).
- Vidéos hébergées ici : `videos/NN_slug.mp4` → URL pour Metricool : `https://github.com/elliot2305/vraioufaux-usine/raw/main/videos/NN_slug.mp4`
  (l'URL raw.githubusercontent est refusée par Metricool ; la forme github.com/…/raw/… marche. Metricool copie le fichier chez lui.)

## 1. Règles éditoriales validées par Elliot (ne pas les re-discuter)
- Structure (≈ 70–85 s, toujours > 60 s) : accroche → **3-2-1 dit par la voix de Lucie** (« Trois… deux… un… », prise réutilisée wav/cd_a.wav) avec les tics → **voix « Faux ! »** (prise réutilisée) → « La vérité… est bien pire » (prise réutilisée, NON chuchotée) → faits en escalade → relances r1/r2/r3 (prises réutilisées) → conseil utile → **chuchotement** « Bon. Le truc que tu vas regretter… » (prise r46_b) → **rupture** (fondu au noir, plongée caméra, pas d'explosion) → la bombe → nuance → **fin = un avis tranché qui crée un camp contre l'autre** (pas une simple question « tous les combien ? »), puis écran « LE VRAI DÉBAT » avec deux boutons de camp.
- Pas de cartons plein écran pour les relances : sous-titre jaune en majuscules sur l'image qui continue.
- Visuels : fonds de couleurs vives différents à chaque plan, écrans coupés (split) 2–3 fois, plâtre blanc qui prend ses couleurs au FAUX, mur de plâtre qui éclate à l'entrée du « monde » principal, émojis sur les mots forts, étiquettes (CHIPS) et gros chiffres (POPS).
- Habillage = celui de `pilote3.html` (bandeau pilule ronde, sous-titres Montserrat « mot surligné », tailles du pilote 3). Elliot trouve que c'est encore un peu gros : ne pas grossir.
- **Alterner les familles** : corps / histoire / animaux / « sale » (au plus 1 sujet « sale » sur 3). Éviter deux sujets « hygiène » d'affilée.
- Faits : vérifier CHAQUE chiffre sur une source (WebSearch/WebFetch). Une affirmation discutée est attribuée (« des microbiologistes conseillent… »). Aucune invention.
- Légende TikTok : 1 phrase choc + l'avis tranché du débat + 👇 + 5 hashtags (#vraioufaux #lesaviezvous + 2 du sujet + #apprendresurtiktok). `isAigc: true`. Le champ `tiktokData.title` est OBLIGATOIRE (mettre la légende complète).

## 2. Fabriquer l'épisode NN (dans un conteneur neuf)
```
git clone --depth 1 https://github.com/elliot2305/vraioufaux-usine && cd vraioufaux-usine && ./setup.sh
python3 -m http.server 8770 --bind 127.0.0.1   # en tâche de fond suivie (run_in_background)
```
1. **Sujet** : lire le Sheet, prendre le meilleur score avec statut « À produire » en respectant l'alternance (lire `LEARNINGS.md`). Passer son statut à « En cours ».
2. **Script** : 9 segments neufs `hook a b c e g i i2 j` (même rôles que `p3/` : voir `p3/tr.json` pour les textes du pilote 3). Phrases courtes, ton complice, balises `[short pause]` / `[softly]` seulement.
3. **Voix** : `creative_generate_speech` (eleven_v4, voix Lucie, flow ci-dessus, 2 prises par segment). Les résultats de statut sont gros : ils sont sauvés dans un fichier tool-results → `python3 tools/dlgen.py <fichier> pNN/gens.json pNN/wav`. Choisir la prise la plus expressive (écart-type d'énergie le plus grand, cf. pilote 3).
4. **Timings** : `creative_add_flow_asset_node` (generation_id de la prise retenue) puis `creative_transcribe_audio` (eleven_scribe_v1) → extraire les mots dans `pNN/tr.json` (format : `{sid: [{text,start,end}]}`).
5. **Montage voix** : copier `p3/build.py` en `pNN/build.py`, changer chemins `p3`→`pNN`, `PICK`, `DISP` (chiffres écrits en lettres → chiffres), la fusion de mots spéciale. Lancer → `pNN/voice.wav` + `timeline_pNN.json`.
6. **Scène 3D** : copier `p3/scene.js` et `p3/mid.js` en `pNN/` et RÉÉCRIRE les mondes pour le sujet (objets en primitives three.js, matériaux PMk = plâtre qui se colore au FAUX, COLk = couleur directe). Garder : HAND-like monde d'accroche en plâtre + éclats + poussière, mur WALL, camTop/camBot, sparks éventuels. Dans `mid.js` : CAMS (keyframes KF), SHOTS (full/split, fond `bg`), CHIPS, POPS, `updateWorlds`, `setWorld`, `tint`. Copier `p3/assemble.py` → `pNN/assemble.py` et adapter : timeline, texte barré de l'accroche (`claim`), écran de fin (émoji, question, deux boutons), dictionnaire `EMO`. Lancer → `piloteNN.html`.
7. **Contrôle avant rendu** : `PAGE=piloteNN.html OUT=qNN node tools/preview.js t1 t2 …` (12–20 instants clés) puis `python3 tools/sheet.py qNN planche.jpg 6` et REGARDER la planche (Read). Corriger cadrages coupés, objets invisibles, textes qui se chevauchent. Répéter jusqu'à propre.
8. **Mix** : copier `p3/mix.py` → `pNN/mix.py`, chemins `p3`→`pNN`, adapter la liste des bruitages au sujet (sfx/ : crack, shatter, impact, whoosh, pops, drops, skitter, sneeze, riser). → `pNN/mix.wav`. Musique : `music/m3.wav` (montage déjà calé : la partie tension démarre à la révélation).
9. **Rendu** : `NW=2 WK=0 PAGE=piloteNN.html TL=timeline_pNN.json FR=framesNN node tools/render.js` + même chose avec `WK=1`, en parallèle (≈ 20 min).
10. **Contrôle image par image** : `python3 tools/qc.py framesNN timeline_pNN.json qcNN` puis REGARDER toutes les planches. Les seules images noires admises : la rupture après le chuchotement. Si un plan est raté : corriger, supprimer les images concernées, relancer le rendu (il saute les images existantes).
11. **Encodage** : `tools/encode.sh framesNN pNN/mix.wav videos/NN_slug.mp4` (vérifier I ≈ −14 LUFS, pic < −1 dB).
12. **Publication** : commit + push (git config user.name "Claude"), puis `createScheduledPost` Metricool, TikTok seul, `autoPublish: true`, à **12h30 Europe/Paris** du premier jour sans post déjà programmé (vérifier avec `getScheduledPosts`). Passer le statut du Sheet à « Programmé JJ/MM 12h30 ».
13. **Ménage** : supprimer de `videos/` les mp4 de plus de 10 jours (Metricool a sa copie). Ne pas committer frames/ ni wav de travail.

## 3. Apprendre des stats
Avant de choisir le sujet : `getAnalyticsDataByMetrics` (TikTok, 7 derniers jours) → vues, durée moyenne, commentaires, partages par vidéo. Noter en 2–3 lignes dans `LEARNINGS.md` ce qui marche (famille de sujet, accroche, fin) et en tenir compte.

## 4. Si ça bloque
- Crédits ElevenLabs insuffisants, connecteur absent, rendu impossible : NE PAS publier une vidéo dégradée. Écrire le problème dans `LEARNINGS.md`, prévenir Elliot (message de fin de session, court), et s'arrêter.
- Ne jamais réutiliser une vidéo déjà publiée.
