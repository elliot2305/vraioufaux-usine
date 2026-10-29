#!/usr/bin/env python3
"""Lance Claude (API, crédits mensuels du plan Max) pour fabriquer l'épisode du jour.

Variables : ANTHROPIC_API_KEY, ELEVENLABS_API_KEY, ROBOT_MODEL (défaut claude-sonnet-5-5),
ROBOT_BUDGET_USD (défaut 6 : plafond de dépense par épisode).
Écrit robot/out/run.json (statut, coût) ; l'agent écrit robot/out/episode.json.
Journal complet : robot/logs/AAAA-MM-JJ_HHMM.log (gardé dans le dépôt).
Si le moteur plante en route, on reprend la même session (3 reprises au plus).
"""
import json, os, sys, time, traceback
import anyio
from claude_agent_sdk import (query, ClaudeAgentOptions, AssistantMessage, ResultMessage, SystemMessage,
                              TextBlock, ToolUseBlock)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "robot", "out")
LOGS = os.path.join(ROOT, "robot", "logs")
os.makedirs(OUT, exist_ok=True); os.makedirs(LOGS, exist_ok=True)
LOG = open(os.path.join(LOGS, time.strftime("%Y-%m-%d_%H%M") + ".log"), "a", buffering=1)


def log(s):
    print(s, flush=True); LOG.write(s + "\n")


PROMPT = """Tu es le robot de l'usine « Vrai ou Faux » (compte TikTok d'Elliot). Tu tournes seul, la nuit, sur un serveur GitHub : personne ne peut te répondre.
Lis d'abord EN ENTIER, dans cet ordre : robot/ROBOT.md (ce qui change en mode robot : il passe avant tout), RUNBOOK.md, LEARNINGS.md.
Puis fabrique l'épisode du jour en suivant ces fichiers à la lettre, jusqu'au fichier robot/out/episode.json.
Si quelque chose bloque ou si la qualité n'est pas au niveau, n'invente rien et ne livre pas une vidéo ratée : écris robot/out/episode.json avec "statut": "echec" et la raison en une phrase, puis arrête-toi."""

RESUME = """Le moteur a planté en route ; tu reprends la même session. Regarde où tu en étais (fichiers déjà faits dans pNN/, frames, vidéo) et continue sans refaire ce qui est fini, jusqu'à robot/out/episode.json.
Rappel : le serveur http (port 8770) a peut-être été coupé : relance-le en arrière-plan si besoin."""

state = {"session": None, "cost": 0.0, "turns": 0, "result": None}


async def one(prompt, budget, resume=None):
    opts = ClaudeAgentOptions(
        model=os.environ.get("ROBOT_MODEL", "claude-sonnet-5-5"),
        cwd=ROOT,
        permission_mode="bypassPermissions",
        allowed_tools=["Bash", "Read", "Write", "Edit", "Glob", "Grep", "WebSearch", "WebFetch", "TodoWrite"],
        max_turns=400,
        max_budget_usd=budget,
        setting_sources=[],
        resume=resume,
        stderr=lambda l: LOG.write("[moteur] " + l.rstrip() + "\n"),
    )
    async for m in query(prompt=prompt, options=opts):
        if isinstance(m, SystemMessage) and getattr(m, "data", None):
            state["session"] = m.data.get("session_id") or state["session"]
        elif isinstance(m, AssistantMessage):
            for b in m.content:
                if isinstance(b, TextBlock) and b.text.strip():
                    log("💬 " + b.text.strip()[:600])
                elif isinstance(b, ToolUseBlock):
                    arg = b.input.get("command") or b.input.get("file_path") or b.input.get("query") or b.input.get("url") or ""
                    log(f"🔧 {b.name} {str(arg)[:200]}")
        elif isinstance(m, ResultMessage):
            state["result"] = m
            state["session"] = getattr(m, "session_id", None) or state["session"]
            state["cost"] += getattr(m, "total_cost_usd", 0) or 0
            state["turns"] += getattr(m, "num_turns", 0) or 0


async def main():
    budget = float(os.environ.get("ROBOT_BUDGET_USD", "6"))
    t0 = time.time(); ep = os.path.join(OUT, "episode.json"); err = None
    for attempt in range(4):
        if os.path.exists(ep):
            break
        left = budget - state["cost"]
        if left < 0.5 or time.time() - t0 > 140 * 60:
            err = "budget ou temps épuisé"; break
        try:
            state["result"] = None
            await one(PROMPT if attempt == 0 or not state["session"] else RESUME, left,
                      resume=state["session"] if attempt else None)
            if state["result"] is not None:
                break  # session terminée normalement
        except Exception as e:
            err = f"{type(e).__name__}: {e}"
            log(f"⚠️ Plantage du moteur (essai {attempt + 1}) : {err}\n{traceback.format_exc()}")
            await anyio.sleep(5)
    res = state["result"]
    run = {"ok": bool(res and not res.is_error), "cout_usd": round(state["cost"], 2), "tours": state["turns"],
           "minutes": round((time.time() - t0) / 60, 1), "erreur": err,
           "fin": (getattr(res, "result", "") or "")[-1500:] if res else ""}
    json.dump(run, open(os.path.join(OUT, "run.json"), "w"), ensure_ascii=False, indent=1)
    log(json.dumps(run, ensure_ascii=False, indent=1))
    if not os.path.exists(ep):
        json.dump({"statut": "echec", "raison": f"Le robot s'est arrêté avant la fin ({err or 'raison inconnue'}). Journal : robot/logs/."},
                  open(ep, "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    anyio.run(main)
