#!/usr/bin/env python3
"""Après le robot : met la vidéo en ligne (release GitHub), tente Metricool, et prévient Elliot par une issue.

Metricool (facultatif, offre avec accès API) : secrets METRICOOL_USER_TOKEN et METRICOOL_USER_ID.
Sans eux, ou si Metricool refuse, l'issue dit « à programmer » avec le lien et la légende.
"""
import json, os, subprocess, urllib.parse, urllib.request

REPO = os.environ.get("GITHUB_REPOSITORY", "elliot2305/vraioufaux-usine")
BLOG = "3278629"  # marque « Elliot OFF »
ep = json.load(open("robot/out/episode.json")) if os.path.exists("robot/out/episode.json") else {"statut": "echec", "raison": "Pas de résultat (le robot n'a pas démarré ?)."}
run = json.load(open("robot/out/run.json")) if os.path.exists("robot/out/run.json") else {}
cout = f"{run.get('cout_usd', '?')} $ de crédits API, {run.get('minutes', '?')} min"
logs = f"https://github.com/{REPO}/actions/runs/{os.environ.get('GITHUB_RUN_ID', '')}"


def sh(*a):
    return subprocess.run(a, capture_output=True, text=True)


def issue(title, body):
    r = sh("gh", "issue", "create", "--repo", REPO, "--title", title, "--body", body)
    print(r.stdout or r.stderr)


def metricool(url, ep):
    tok, uid = os.environ.get("METRICOOL_USER_TOKEN"), os.environ.get("METRICOOL_USER_ID")
    if not (tok and uid):
        return None, "pas de clé API Metricool"
    H = {"X-Mc-Auth": tok, "Content-Type": "application/json"}
    q = urllib.parse.urlencode({"blogId": BLOG, "userId": uid})
    try:
        n = urllib.request.Request("https://app.metricool.com/api/actions/normalize/image/url?" + urllib.parse.urlencode({"url": url}) + "&" + q, headers=H)
        media = urllib.request.urlopen(n, timeout=300).read().decode().strip().strip('"') or url
        dt = ep["date"][:19]
        auto = os.environ.get("ROBOT_AUTO") == "1"
        body = {"autoPublish": True, "draft": not auto, "media": [media], "text": ep["legende"],
                "providers": [{"network": "tiktok"}],
                "publicationDate": {"dateTime": dt, "timezone": "Europe/Paris"},
                "tiktokData": {"title": ep["legende"], "isAigc": True, "privacyOption": "PUBLIC_TO_EVERYONE"},
                "descendants": [], "firstCommentText": "", "shortener": False, "smartLinkData": {"ids": []}}
        r = urllib.request.Request("https://app.metricool.com/api/v2/scheduler/posts?" + q, method="POST", headers=H, data=json.dumps(body).encode())
        urllib.request.urlopen(r, timeout=120).read()
        return True, "direct" if auto else "brouillon"
    except Exception as e:
        return False, f"{type(e).__name__}: {getattr(e, 'read', lambda: b'')().decode(errors='replace')[:300] or e}"


if ep.get("statut") != "ok" or not os.path.exists(ep.get("video", "")):
    issue(f"❌ Vrai ou Faux : pas d'épisode cette nuit",
          f"**Raison :** {ep.get('raison', 'vidéo introuvable')}\n\nRien n'a été publié. ({cout})\n\nDétails : {logs}")
    raise SystemExit(0)

tag = f"ep{ep['numero']}"
name = os.path.basename(ep["video"])
r = sh("gh", "release", "create", tag, ep["video"], "--repo", REPO, "--title", f"Épisode {ep['numero']} — {ep['sujet']}",
       "--notes", ep["legende"])
print(r.stdout or r.stderr)
url = f"https://github.com/{REPO}/releases/download/{tag}/{name}"

ok, info = metricool(url, ep)
date = ep["date"][8:10] + "/" + ep["date"][5:7] + " à " + ep["date"][11:16]
if ok:
    etat = (f"✅ **Programmé dans Metricool** pour le {date} (TikTok). Tu peux encore le modifier ou l'annuler dans Metricool." if info == "direct" else
            f"📝 **En brouillon dans Metricool** pour le {date} (TikTok). Regarde la vidéo, puis dans Metricool clique sur le brouillon → Programmer. Sinon, supprime-le.")
else:
    etat = (f"⏳ **À programmer** pour le {date} (TikTok)" + (f" — Metricool a refusé : {info}" if ok is False else "") +
            ". Dis simplement « programme l'épisode " + ep["numero"] + " » à Claude, ou poste-le toi-même.")

body = f"""{etat}

🎬 **Vidéo :** {url}
⏱️ Durée : {ep.get('duree_s', '?')} s

**Légende :**
```
{ep['legende']}
```

**Sources :** {' · '.join(ep.get('sources', []))}

**Point d'attention :** {ep.get('points_attention') or 'rien'}

---
{cout} · [détails]({logs})
Si la vidéo ne te va pas : supprime-la dans Metricool (ou ne la programme pas) et réponds ici ce qui cloche."""
issue(f"🎬 Vrai ou Faux #{ep['numero']} : {ep['sujet']}", body)
