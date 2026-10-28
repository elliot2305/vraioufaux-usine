#!/usr/bin/env python3
"""Voix Lucie via l'API ElevenLabs, avec les temps de chaque mot.

Usage : python3 robot/tts.py pNN segments.json
  segments.json = {"hook": "texte…", "a": "texte…", …}
Produit, pour chaque segment, 2 prises :
  pNN/wav/<sid>_a.wav et pNN/wav/<sid>_b.wav (mono 44,1 kHz)
et pNN/tr_a.json / pNN/tr_b.json au format {sid: [{text,start,end}]}
(même format que p3/tr.json, qui venait de Scribe).

Variables : ELEVENLABS_API_KEY (obligatoire), ELEVEN_MODEL (défaut eleven_v4).
Jamais de repli sur un modèle « multilingual » : Elliot le trouve « grave IA ».
"""
import base64, json, os, subprocess, sys, tempfile, time, urllib.request, urllib.error

VOICE = "LAUUUZAQpu1khF4zl6Vl"  # Lucie
API = "https://api.elevenlabs.io/v1"
KEY = os.environ["ELEVENLABS_API_KEY"]


def call(method, path, body=None):
    req = urllib.request.Request(API + path, method=method, headers={"xi-api-key": KEY, "Content-Type": "application/json"},
                                 data=json.dumps(body).encode() if body is not None else None)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")[:500]
            if e.code in (429, 500, 502, 503) and attempt < 3:
                time.sleep(10 * (attempt + 1)); continue
            sys.exit(f"ElevenLabs {e.code} sur {path} : {msg}")


def pick_model():
    want = os.environ.get("ELEVEN_MODEL", "eleven_v4")
    ids = [m["model_id"] for m in call("GET", "/models")]
    if want in ids:
        return want
    v4 = [i for i in ids if "v4" in i and "multilingual" not in i]
    if v4:
        return v4[0]
    sys.exit(f"Modèle {want} introuvable chez ElevenLabs (dispo : {ids}). On s'arrête : pas de repli multilingual.")


def words(al):
    ch, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    out, cur = [], None
    for c, s, e in zip(ch, st, en):
        if c.isspace():
            if cur: out.append(cur); cur = None
            continue
        if cur is None: cur = {"text": c, "start": round(s, 3), "end": round(e, 3)}
        else: cur["text"] += c; cur["end"] = round(e, 3)
    if cur: out.append(cur)
    # retire les balises de jeu [softly], [short pause]…
    return [w for w in out if not (w["text"].startswith("[") or w["text"].endswith("]"))]


def main():
    pdir, segfile = sys.argv[1], sys.argv[2]
    segs = json.load(open(segfile))
    model = pick_model()
    os.makedirs(f"{pdir}/wav", exist_ok=True)
    tr = {"a": {}, "b": {}}
    for take in ("a", "b"):
        p = f"{pdir}/tr_{take}.json"
        if os.path.exists(p): tr[take] = json.load(open(p))
    for sid, text in segs.items():
        for take in ("a", "b"):
            wav = f"{pdir}/wav/{sid}_{take}.wav"
            if os.path.exists(wav) and sid in tr[take]:
                continue
            r = call("POST", f"/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128",
                     {"text": text, "model_id": model})
            with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
                f.write(base64.b64decode(r["audio_base64"])); mp3 = f.name
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mp3, "-ac", "1", "-ar", "44100", wav], check=True)
            os.unlink(mp3)
            tr[take][sid] = words(r.get("alignment") or r["normalized_alignment"])
            json.dump(tr[take], open(f"{pdir}/tr_{take}.json", "w"), ensure_ascii=False)
            print(f"{sid}_{take}  {len(tr[take][sid])} mots")
    print("modèle", model)


if __name__ == "__main__":
    main()
