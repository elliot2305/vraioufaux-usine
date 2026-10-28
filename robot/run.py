#!/usr/bin/env python3
"""Lance Claude (API, crédits mensuels du plan Max) pour fabriquer l'épisode du jour.

Variables : ANTHROPIC_API_KEY, ELEVENLABS_API_KEY, ROBOT_MODEL (défaut claude-sonnet-5-5),
ROBOT_BUDGET_USD (défaut 6 : plafond de dépense par épisode).
Écrit robot/out/run.json (statut, coût) ; l'agent écrit robot/out/episode.json.
"""
import asyncio, json, os, sys, time
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage, TextBlock, ToolUseBlock

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "robot", "out")

PROMPT = """Tu es le robot de l'usine « Vrai ou Faux » (compte TikTok d'Elliot). Tu tournes seul, la nuit, sur un serveur GitHub : personne ne peut te répondre.
Lis d'abord EN ENTIER, dans cet ordre : robot/ROBOT.md (ce qui change en mode robot : il passe avant tout), RUNBOOK.md, LEARNINGS.md.
Puis fabrique l'épisode du jour en suivant ces fichiers à la lettre, jusqu'au fichier robot/out/episode.json.
Si quelque chose bloque ou si la qualité n'est pas au niveau, n'invente rien et ne livre pas une vidéo ratée : écris robot/out/episode.json avec "statut": "echec" et la raison en une phrase, puis arrête-toi."""


async def main():
    os.makedirs(OUT, exist_ok=True)
    budget = float(os.environ.get("ROBOT_BUDGET_USD", "6"))
    opts = ClaudeAgentOptions(
        model=os.environ.get("ROBOT_MODEL", "claude-sonnet-5-5"),
        cwd=ROOT,
        permission_mode="bypassPermissions",
        allowed_tools=["Bash", "Read", "Write", "Edit", "Glob", "Grep", "WebSearch", "WebFetch", "TodoWrite"],
        max_turns=400,
        max_budget_usd=budget,
        setting_sources=[],
    )
    t0 = time.time(); res = None
    async for m in query(prompt=PROMPT, options=opts):
        if isinstance(m, AssistantMessage):
            for b in m.content:
                if isinstance(b, TextBlock) and b.text.strip():
                    print("💬", b.text.strip()[:400], flush=True)
                elif isinstance(b, ToolUseBlock):
                    arg = b.input.get("command") or b.input.get("file_path") or b.input.get("query") or b.input.get("url") or ""
                    print(f"🔧 {b.name} {str(arg)[:160]}", flush=True)
        elif isinstance(m, ResultMessage):
            res = m
    run = {"ok": bool(res and not res.is_error), "cout_usd": round(getattr(res, "total_cost_usd", 0) or 0, 2),
           "tours": getattr(res, "num_turns", None), "minutes": round((time.time() - t0) / 60, 1),
           "fin": (getattr(res, "result", "") or "")[-1500:]}
    json.dump(run, open(os.path.join(OUT, "run.json"), "w"), ensure_ascii=False, indent=1)
    print(json.dumps(run, ensure_ascii=False, indent=1))
    ep = os.path.join(OUT, "episode.json")
    if not os.path.exists(ep):
        json.dump({"statut": "echec", "raison": "Le robot s'est arrêté avant la fin (budget, nombre de tours ou erreur). Voir les logs."},
                  open(ep, "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    asyncio.run(main())
