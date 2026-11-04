# -*- coding: utf-8 -*-
"""从附件 A–G 代码样片提取 Canvas 动效 → prisma/effects-ag.json"""
import json
import re
from pathlib import Path

data = json.load(open("/home/z/my-project/prisma/styles-attachment.json", encoding="utf-8"))
out = []

DEMO_MAP = {
    "A1": "particles", "A2": "typewriter", "A3": "punch", "A4": "zoom", "A5": "particles",
    "B1": "particles", "B2": "particles", "B3": "morph", "B4": "particles", "B5": "pulse",
    "C1": "morph", "C2": "stroke", "C3": "morph", "C4": "pulse",
    "D1": "particles", "D2": "parallax", "D3": "particles", "D4": "flash",
    "E1": "orbit", "E2": "wipe", "E3": "typewriter",
    "F1": "highlight", "F2": "orbit", "F3": "wipe",
    "G1": "shake", "G2": "glitch",
}

for s in data["styles"]:
    if s["series"] != "AG":
        continue
    sid = s["sid"]
    codes = re.findall(r"```js\n(.*?)```", s["promptFull"], re.S)
    code = codes[0].strip() if codes else ""
    # 去掉 code 的效果，用提示词正文做 prompt（代码内嵌在正文里）
    prompt_body = s["promptFull"].split("```js")[0].strip()
    if not prompt_body or len(prompt_body) < 20:
        prompt_body = f"{s['name']}：{s.get('looksLike','')}。适合：{s.get('suitableFor','')}"
    header = (
        f"// A–G 代码样片 · {sid} {s['name']}（Canvas 2D 绘制函数，t 为秒）\n"
        f"// 依赖同库 _公共函数.js 的工具：rng / vgrad / glowDot / hex / ss / eOut / nz / paperTex 等\n"
    )
    out.append({
        "name": f"{s['name']}（{sid}）",
        "nameEn": s.get("nameEn", ""),
        "category": "代码样片",
        "description": (s.get("looksLike") or s["name"]) + ("；适合：" + s["suitableFor"] if s.get("suitableFor") else ""),
        "codeSnippet": header + (code if code else "// 该样片以完整提示词形式给出，见风格库 " + sid),
        "prompt": (prompt_body[:900] + ("…" if len(prompt_body) > 900 else "")) + (f"\n\n完整参考实现：\n{code[:1200]}" if code else ""),
        "sourceRepo": "code-animation-pack",
        "demo": DEMO_MAP.get(sid, "particles"),
    })

Path("/home/z/my-project/prisma/effects-ag.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8"
)
print(f"AG effects: {len(out)} -> prisma/effects-ag.json")
for e in out:
    print(f"  {e['name']} | code={len(e['codeSnippet'])}ch | demo={e['demo']}")
