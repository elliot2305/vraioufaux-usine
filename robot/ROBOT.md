# Mode robot (GitHub Actions) — ce qui change par rapport au RUNBOOK

Tu tournes seul sur un serveur GitHub, sans connecteurs (pas de Google Sheets, pas d'outils ElevenLabs « creative_* », pas de Metricool).
Tout ce qui est écrit ici **passe avant le RUNBOOK**. Pour le reste (règles éditoriales, scène 3D, contrôles, mix, encodage), suis RUNBOOK.md à la lettre.

## 0. Démarrage
- `./setup.sh` a déjà été lancé par le workflow (npm, Chromium, sons convertis). Ne relance pas d'installation.
- Serveur pour les pages : `python3 -m http.server 8770 --bind 127.0.0.1` **en arrière-plan** (option run_in_background du Bash, ou `nohup … &`).
- Tu as environ **2 h** en tout et un budget limité : ne lis pas de gros fichiers en entier pour rien, ne relance pas un rendu complet sans raison.
- **Ne fais ni commit, ni push, ni publication** : le workflow s'en charge après toi.

## 1. Sujet : `robot/sujets.json` (remplace le Google Sheet)
- Prends le meilleur `score` dont `statut` = « À produire », en respectant l'alternance des familles (LEARNINGS.md : au plus 1 sujet « sale » sur 3, jamais deux « hygiène » d'affilée).
- Passe son `statut` à « En cours » dès le début, puis à « Prêt JJ/MM 12h30 » à la fin (ou « À produire » si tu échoues).
- Numéro d'épisode NN = le plus grand numéro trouvé dans `videos/` et dans les statuts, plus 1, sur 2 chiffres.
- **Date de publication** : le premier jour, à partir d'aujourd'hui (heure de Paris), qu'aucun statut « Programmé JJ/MM » ou « Prêt JJ/MM » n'occupe déjà. Heure : 12h30 Europe/Paris.
- Pas de stats Metricool en mode robot : saute l'étape 3 du RUNBOOK (« Apprendre des stats »).

## 2. Voix : `robot/tts.py` (remplace creative_generate_speech + Scribe)
1. Écris `pNN/segments.json` : `{"hook": "…", "a": "…", "b": "…", "c": "…", "e": "…", "g": "…", "i": "…", "i2": "…", "j": "…"}` (mêmes rôles que p3, balises `[short pause]` / `[softly]` seulement).
2. `python3 robot/tts.py pNN pNN/segments.json` → `pNN/wav/<sid>_a.wav`, `<sid>_b.wav`, et les mots dans `pNN/tr_a.json`, `pNN/tr_b.json`.
3. Choisis la prise la plus expressive par segment (écart-type d'énergie, cf. RUNBOOK) et écris `pNN/tr.json` = `{sid: mots de la prise retenue}` (même format que `p3/tr.json`), et `PICK` dans `pNN/build.py`.
4. Les prises réutilisées (faux, pire, r1, r2, r3, r4/r46_b) restent celles de `wav/` avec leurs mots dans `tr.json` / `tr6.json`, comme dans `p3/build.py`.
5. Le script s'arrête tout seul si le modèle eleven_v4 n'existe pas : **jamais** de modèle multilingual. Si ElevenLabs refuse (crédits épuisés…), c'est un échec : voir §5.

## 3. Compte à rebours 3-2-1 DIT PAR LA VOIX (demande d'Elliot du 28/10)
- Le 3-2-1 n'est plus silencieux : Lucie dit « Trois… deux… un… ».
- Si `wav/cd_a.wav` n'existe pas encore : `echo '{"cd": "Trois… [short pause] deux… [short pause] un…"}' > cd.json && python3 robot/tts.py cdtmp cd.json`, garde la prise la plus nette (débit posé, environ une seconde par chiffre), copie-la en `wav/cd_a.wav` et ses mots en `wav/cd.json` (`{"cd": [...]}`). Elle sera réutilisée par tous les épisodes suivants (le workflow la garde dans le dépôt).
- Dans `pNN/build.py` : à la place de `pad(COUNTDOWN)` après le hook, insère l'audio `wav/cd_a.wav` (découpé comme les autres segments) et pose les marques `cd3`, `cd2`, `cd1` = début de chaque mot (« trois », « deux », « un »), plus `cd0` (début) et `cd1end` (fin).
- Dans `pNN/mid.js` : `const CD=[M.cd3,M.cd2,M.cd1]` pour que chaque chiffre affiché tombe pile sur le chiffre dit. Garde les tics.
- Au contrôle, vérifie (marques de la timeline + planches) que les chiffres affichés et la voix sont calés.

## 4. Rendu, contrôle, encodage
- Comme le RUNBOOK, mais le serveur GitHub a 4 cœurs : `NW=3`, trois rendus en parallèle (`WK=0`, `WK=1`, `WK=2`).
- Les contrôles visuels (planches avant rendu, puis QC image par image) sont **obligatoires** : regarde vraiment chaque planche avec Read.
- Vidéo finale : `videos/NN_slug.mp4` (> 60 s, I ≈ −14 LUFS, pic < −1 dB).

## 5. Fin : `robot/out/episode.json`
Réussite :
```json
{"statut": "ok", "numero": "04", "slug": "telephone", "sujet": "Ton téléphone est plus sale que tes toilettes",
 "video": "videos/04_telephone.mp4", "date": "2026-10-30T12:30:00+01:00", "duree_s": 78.4,
 "legende": "phrase choc + avis tranché 👇 #vraioufaux #lesaviezvous #… #… #apprendresurtiktok",
 "sources": ["https://…"], "points_attention": "rien / ou une phrase"}
```
Échec (crédits, outil cassé, qualité insuffisante) :
```json
{"statut": "echec", "raison": "une phrase claire pour Elliot"}
```
Puis ajoute 2–3 lignes à `LEARNINGS.md` (sujet, famille, date, ce qui a posé problème) et arrête-toi. Ne publie jamais une vidéo ratée.
