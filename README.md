# FrameForge 分镜工坊

> 从一句话创意，到可直接开拍的分镜稿 —— AI 视频分镜与动效灵感库

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org) [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)](https://www.typescriptlang.org) [![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io) [![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8)](https://tailwindcss.com)

**FrameForge** 融汇 15 个开源视频创作项目与一份 341 风格库附件的方法论，把「语义分镜」做成一条流水线：

1. **风格素材库** —— 369 种可复用影片风格（36 精选详解 + 333 附件系列），每种带完整风格提示词原文与 CSS 动画小样
2. **Prompt 库** —— 80 条精选提示词（一句话灵感 / 完整模板 / 长提示词 / fy 创作法…），一键复制或带入工坊
3. **动效库** —— 85 种运镜 / 转场 / 文字动效预设（含参考实现代码）
4. **创作方法论** —— fy《俯仰代码动画》语义分镜指南
5. **AI 分镜工坊** —— 按 fy 方法论生成分镜稿（逐镜头 JSON：景别 / 运镜 / 转场 / 字幕 / 阅读窗 / 接缝 / 实现提示词）或 12 节任务卡全案；支持 **AI 改稿**（对结果下增量修改指令）

生成结果自动保存到历史，支持**搜索与收藏**；分镜稿可导出 Markdown，实现提示词可直接投喂 Claude Code（Hyperframes / Remotion / p5.js / 通用剪辑）。

## ✨ 功能亮点

| 模块 | 能力 |
| --- | --- |
| AI 分镜工坊 | 分镜稿（逐镜 JSON·快）与任务卡（12 节全案·深）双模式 |
| **AI 改稿** | 对当前结果下增量指令（换开场钩子 / 调镜头时长 / 改字幕 / 增删镜头），未提及部分保持原样 |
| **历史搜索 + 收藏** | 标题 / 概述 / 创意 / 风格全文检索；星标收藏置顶 |
| **风格收藏夹** | localStorage 持久化，素材库与工坊下拉共享；工坊风格选择支持 369 项全文搜索 |
| 风格小样 | 79 个 motif × 构图 × 质感的差异化 CSS 动画预览，`prefers-reduced-motion` 自动降级 |
| 导出 | 分镜稿 / 任务卡导出 Markdown；一键复制全部实现 Prompt |

## 🚀 快速开始

```bash
# 1. 安装依赖
bun install

# 2. 初始化数据库（SQLite，首次会自动建表 + 灌入素材）
bun run db:push
bun run db:seed

# 3. 启动
bun run dev          # http://localhost:3000
```

> `db:seed` 只重灌 Style / Prompt / Effect 素材表，**不会清空**你的生成历史（Generation 表是用户数据）。
> 数据库文件位于 `db/custom.db`（见 `.env.example`），随项目目录自包含。

## 🛠 技术栈

- **框架**：Next.js 16（App Router）+ TypeScript 5
- **样式**：Tailwind CSS 4 + shadcn/ui（New York）
- **状态**：Zustand（含 persist）；服务端数据走 SSR props + 按需 fetch
- **数据库**：Prisma 6 + SQLite（零配置，开箱即用）
- **AI**：`z-ai-web-dev-sdk`（LLM 分镜生成与改稿），输入经 Zod 白名单校验

## 📦 项目结构

```
prisma/                 # schema 与种子数据（341 风格库 JSON 附件）
src/
  app/
    api/
      generate/         # 分镜/任务卡生成（Zod 校验 + LLM 容错解析管线）
        refine/         # AI 改稿：对已有结果做增量修改
      generations/      # 历史列表（搜索/收藏/瘦身 select）+ [id] 详情
      styles|effects|prompts
    page.tsx            # 单页应用入口（force-dynamic SSR）
  components/
    video-studio/       # 工坊 UI（studio / history / styles / storyboard-result…）
  lib/
    storyboard.ts       # 系统提示词 + JSON 修复解析（generate/refine 共用）
    store.ts            # Zustand（表单 persist + 风格收藏夹）
    types.ts            # 共享类型
```

## 🧠 AI 工程质量

- **LLM 输出防御性解析**：容忍 markdown 围栏 / 全角冒号 / 尾逗号 / 截断 JSON；解析失败自动带纠错提示重试一次
- **输入校验**：`/api/generate` 与 `/api/generate/refine` 全部 Zod 白名单（时长/画幅/框架/节奏枚举 + 长度上限），拒绝任意字符串注入
- **传输瘦身**：历史列表与首屏 SSR 不携带 `output` 大字段，载入时按需拉 `/api/generations/[id]`
- **竞态安全**：长请求期间的历史变更使用函数式 state 更新，已删除记录不会"复活"

## 📜 许可与来源

风格素材整合自 15 个开源项目（hyperframes / awesome-opus5-5-videos / lemo-opuscar / mg-styles-15 / huashu-art-motion / onetake / ReelMimic / fy-code-animation 等，完整列表见页脚），341 风格库附件的第三方许可见 `upload/extracted_code_animation/代码动画/第三方许可/`。
