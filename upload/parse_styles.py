# -*- coding: utf-8 -*-
"""解析附件《代码动画》341 种风格提示词 → prisma/styles-attachment.json"""
import json
import os
import re
from pathlib import Path

ROOT = Path("/home/z/my-project/upload/extracted_code_animation/代码动画/风格提示词")
OUT = Path("/home/z/my-project/prisma/styles-attachment.json")

SERIES = [
    ("A-G_代码样片", "AG", "A–G 代码样片", "字、粒子、线与墨、光与天气、图形与纸、讲解、质感，每种附参考实现代码"),
    ("M_动态风格", "M", "M 动态风格", "整段视频怎么动、怎么剪、怎么讲的结构性风格"),
    ("K_卡通画风", "K", "K 卡通画风", "角色和画面长什么样的卡通画风"),
    ("Z_中国风", "Z", "Z 中国风", "水墨、工笔、剪纸、皮影、敦煌等中国风格"),
    ("H_现成版式", "H", "H 现成版式", "配色加字体的整套现成搭配"),
    ("L_Lemo-Opuscar", "L", "L Lemo-Opuscar", "开源项目 Lemo-Opuscar 的 66 种影片风格，每种有完整做法"),
    ("V_mg-styles-15", "V", "V mg-styles-15", "开源项目 mg-styles-15 的 15 种 MG 动效风格"),
    ("X_code-video", "X", "X code-video", "开源项目 code-video 的 31 种风格"),
    ("R_照参考学来的", "R", "R 照参考学来的", "照参考学着用代码画的赛博朋克等风格"),
    ("O_奥斯卡98部", "O", "O 奥斯卡 98 部", "98 部奥斯卡最佳影片，每部提炼一种画风"),
]


def slugify(series: str, sid: str) -> str:
    s = sid.lower().replace("–", "-").replace(" ", "")
    return f"{series.lower()}-{s}"


def parse_file(path: Path, series_key: str, series_label: str) -> dict | None:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()

    # --- 标题：# A1 字雨（Gone with the Wind） ---
    title = ""
    m = re.match(r"^#\s+(\S+)\s*(.*)$", lines[0] if lines else "")
    if not m:
        return None
    sid = m.group(1).strip()
    rest = m.group(2).strip()
    # 英文名（括号内）
    name_en = ""
    em = re.search(r"[（(]([^（）()]*)[)）]\s*$", rest)
    if em and re.search(r"[A-Za-z]", em.group(1)):
        name_en = em.group(1).strip()
        rest = rest[: em.start()].strip()
    name = rest.strip(" ·/－-—")

    # --- 元数据字段 ---
    meta = {}
    for line in lines[1:40]:
        if line.startswith("## "):
            break
        fm = re.match(r"^-\s*([^：:]{1,8})[：:]\s*(.*)$", line)
        if fm:
            key = fm.group(1).strip()
            val = fm.group(2).strip()
            if val:
                meta[key] = val

    category = meta.get("分类", series_label)
    looks_like = meta.get("长什么样", "")
    suitable = meta.get("适合", "")
    keywords = meta.get("关键词", "")
    style_tag = meta.get("风格", "")
    year = meta.get("年份", "")

    # --- 提示词正文：## 风格提示词 到下一个 ## 或 EOF ---
    prompt = ""
    in_prompt = False
    prompt_lines = []
    for line in lines:
        if line.startswith("## "):
            if in_prompt:
                break
            if line.strip() == "## 风格提示词":
                in_prompt = True
                continue
        if in_prompt:
            prompt_lines.append(line)
    prompt = "\n".join(prompt_lines).strip()

    # 无「风格提示词」段的文件：取正文全部（去掉头部元数据）
    if not prompt:
        body_start = 0
        for i, line in enumerate(lines):
            if line.startswith("## "):
                body_start = i
                break
        prompt = "\n".join(lines[body_start:]).strip()

    # 空条目过滤：无名且无实质内容
    if not name and len(prompt) < 30:
        return None
    if len(prompt) < 2:
        return None
    # 极短提示词用「长什么样」补全，保证可用
    if len(prompt) < 12 and looks_like:
        prompt = f"{prompt}\n{looks_like}" if prompt != looks_like else looks_like

    has_still = path.with_suffix(".jpg").exists()

    # 系列子分类（分类字段中 · 后面的部分）
    sub = ""
    if "·" in category:
        sub = category.split("·", 1)[1].strip()

    return {
        "slug": slugify(series_key, sid),
        "sid": sid,
        "name": name or sid,
        "nameEn": name_en,
        "series": series_key,
        "seriesLabel": series_label,
        "subCategory": sub,
        "category": category,
        "looksLike": looks_like,
        "suitableFor": suitable,
        "keywords": keywords,
        "styleTag": style_tag,
        "year": year,
        "hasStill": has_still,
        "promptFull": prompt,
    }


def main():
    styles = []
    skipped = []
    for folder, key, label, _desc in SERIES:
        d = ROOT / folder
        if not d.exists():
            print(f"!! missing folder {folder}")
            continue
        for f in sorted(d.glob("*.md")):
            parsed = parse_file(f, key, label)
            if parsed:
                styles.append(parsed)
            else:
                skipped.append(f.name)

    series_meta = [
        {"key": key, "label": label, "desc": desc, "count": sum(1 for s in styles if s["series"] == key)}
        for _f, key, label, desc in SERIES
    ]

    OUT.write_text(
        json.dumps({"styles": styles, "seriesMeta": series_meta}, ensure_ascii=False, indent=1),
        encoding="utf-8",
    )
    print(f"parsed: {len(styles)} styles -> {OUT}")
    print(f"skipped: {len(skipped)}: {skipped}")
    by = {}
    for s in styles:
        by[s["series"]] = by.get(s["series"], 0) + 1
    print("by series:", by)
    with_still = sum(1 for s in styles if s["hasStill"])
    print(f"with still: {with_still}")
    # 输出一些名字抽查
    for s in styles[::40]:
        print(f"  {s['sid']} {s['name']} / {s['nameEn']} | suitable={s['suitableFor'][:20]} | prompt={len(s['promptFull'])}ch")


if __name__ == "__main__":
    main()
