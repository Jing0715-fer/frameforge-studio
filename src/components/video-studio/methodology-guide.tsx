'use client'

import { useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Camera,
  CheckCircle2,
  FileText,
  Github,
  Lightbulb,
  Music,
  PenLine,
  Route,
  Sparkles,
  Target,
  Type,
  Wrench,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppStore } from '@/lib/store'
import {
  ATTACHMENT_SERIES,
  CAMERA_MOVES,
  EMPHASIS_LEVELS,
  FY_PHASES,
  FY_WORKFLOW,
  MOTION_PARAMS,
  MOTION_RULES,
  MUSIC_PLANS,
  QUALITY_BASELINES,
  READING_RULES,
  REPAIR_TABLE,
  REPO_KNOWLEDGE,
  SEMANTIC_MAPPINGS,
  TRANSITION_RECIPES,
  TYPE_TECHNIQUES,
} from '@/lib/methodology'
import { getRepo } from '@/lib/repos'
import { cn } from '@/lib/utils'

const STEP_COLORS = [
  'from-amber-500/20 to-amber-500/5 border-amber-500/30',
  'from-orange-500/20 to-orange-500/5 border-orange-500/30',
  'from-rose-500/20 to-rose-500/5 border-rose-500/30',
]

export function MethodologyGuide() {
  const setTab = useAppStore((s) => s.setTab)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-50">创作方法论</h2>
        <p className="mt-1 text-sm text-zinc-500">
          提炼自 fy-code-animation《俯仰代码动画》+ 15 个开源项目 · 这些方法已全部注入 AI
          分镜工坊的「大脑」，也供你人工查阅
        </p>
      </div>

      <Tabs defaultValue="workflow" className="w-full">
        <TabsList className="mb-5 h-auto w-full flex-wrap justify-start gap-1 bg-zinc-900/60 p-1">
          {[
            { v: 'workflow', label: '十步创作流程', icon: Route },
            { v: 'semantic', label: '语义分镜', icon: Lightbulb },
            { v: 'camera', label: '镜头与转场', icon: Camera },
            { v: 'type', label: '动态文字', icon: Type },
            { v: 'motion', label: '运动与节奏', icon: Wrench },
            { v: 'music', label: '声音设计', icon: Music },
            { v: 'quality', label: '质量底线', icon: CheckCircle2 },
            { v: 'repos', label: '15+1 知识地图', icon: Github },
          ].map((t) => (
            <TabsTrigger
              key={t.v}
              value={t.v}
              className="data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-300"
            >
              <t.icon className="mr-1.5 size-3.5" />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ============ 十步创作流程 ============ */}
        <TabsContent value="workflow" className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Route className="size-4 text-amber-400" />
                fy-code-animation 固定创作顺序（不能跳步）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2.5">
                {FY_WORKFLOW.map((s, i) => (
                  <li
                    key={s.step}
                    className={cn(
                      'flex gap-3 rounded-lg border bg-gradient-to-r p-3',
                      STEP_COLORS[i % STEP_COLORS.length]
                    )}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-950/60 font-mono text-xs font-bold text-amber-300">
                      {s.step}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-100">
                        {s.title}
                        <span className="ml-2 font-mono text-[10px] font-normal text-zinc-500">
                          {s.loads}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4 text-amber-400" />
                四级交付阶段（按授权推进，范围不清按更小的执行）
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {FY_PHASES.map((p) => (
                <div key={p.key} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
                  <p className="font-mono text-xs font-bold text-amber-300">{p.name}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{p.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 to-transparent p-4">
            <p className="text-sm text-zinc-300">
              <Sparkles className="mr-1.5 inline size-4 text-amber-400" />
              这套流程已内置到 AI 分镜工坊：工坊的「任务卡模式」按此流程产出 12 节设计文档；「分镜稿模式」按语义分镜铁律产出逐镜脚本。
            </p>
            <Button
              size="sm"
              onClick={() => setTab('studio')}
              className="mt-3 bg-gradient-to-r from-amber-500 to-orange-500 font-semibold text-zinc-950 hover:from-amber-400 hover:to-orange-400"
            >
              去工坊试试
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </TabsContent>

        {/* ============ 语义分镜 ============ */}
        <TabsContent value="semantic" className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="size-4 text-amber-400" />
                语义关系 → 可视操作映射（把关系变成动作）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[720px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500">
                      <th className="pb-2 pr-3 font-medium">内容关系</th>
                      <th className="pb-2 pr-3 font-medium">可视操作</th>
                      <th className="pb-2 pr-3 font-medium">必须成立的证据</th>
                      <th className="pb-2 font-medium">常见错误与修正</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SEMANTIC_MAPPINGS.map((m) => (
                      <tr key={m.relation} className="border-b border-zinc-800/60 align-top">
                        <td className="py-2.5 pr-3 font-semibold text-amber-300">{m.relation}</td>
                        <td className="py-2.5 pr-3 leading-relaxed text-zinc-300">{m.operation}</td>
                        <td className="py-2.5 pr-3 leading-relaxed text-zinc-400">{m.evidence}</td>
                        <td className="py-2.5 leading-relaxed text-rose-300/80">{m.pitfall}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                反「逐句贴卡 PPT」铁律：每镜要有一个可观察的变化来承载意思（关系、动作、对象状态），而不是「标题+图标+淡入」；抽象主题先选一种可持续变形的载体（线、纸面、窗口、路、群体、机械件）。
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="size-4 text-amber-400" />
                重点词三级力度（不是每个词都放大砸字）
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {EMPHASIS_LEVELS.map((l, i) => (
                <div key={l.level} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      'mb-2',
                      i === 0 && 'border-emerald-500/40 text-emerald-400',
                      i === 1 && 'border-amber-500/40 text-amber-400',
                      i === 2 && 'border-rose-500/40 text-rose-400'
                    )}
                  >
                    {l.level}
                  </Badge>
                  <p className="text-xs leading-relaxed text-zinc-300">{l.usage}</p>
                  <p className="mt-1.5 text-[11px] text-zinc-500">例：{l.example}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="size-4 text-amber-400" />
                阅读窗与排版规则
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {READING_RULES.map((r) => (
                <p key={r} className="flex gap-2 rounded-lg bg-zinc-950/40 px-3 py-2 text-xs leading-relaxed text-zinc-400">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-400/80" />
                  {r}
                </p>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 镜头与转场 ============ */}
        <TabsContent value="camera" className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Camera className="size-4 text-amber-400" />
                转场谱系（10 类接缝 · 转场的输入是一对已成立的镜头，不是效果名称）
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {TRANSITION_RECIPES.map((t) => (
                <div key={t.name} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3.5">
                  <p className="text-sm font-semibold text-zinc-100">{t.name}</p>
                  <p className="mt-1 text-[11px] text-emerald-300/80">适用：{t.fit}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{t.construction}</p>
                  <p className="mt-1.5 font-mono text-[10px] leading-relaxed text-amber-300/70">{t.params}</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-rose-300/70">⚠ {t.pitfall}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Route className="size-4 text-amber-400" />
                镜头运动词汇表（四段式：起势→移动→到站→停稳）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[680px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500">
                      <th className="pb-2 pr-3 font-medium">镜头</th>
                      <th className="pb-2 pr-3 font-medium">表达（与不用的情形）</th>
                      <th className="pb-2 pr-3 font-medium">可执行步骤</th>
                      <th className="pb-2 font-medium">参数起点</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CAMERA_MOVES.map((m) => (
                      <tr key={m.name} className="border-b border-zinc-800/60 align-top">
                        <td className="py-2.5 pr-3 font-semibold text-zinc-200">{m.name}</td>
                        <td className="py-2.5 pr-3 leading-relaxed text-zinc-400">{m.express}</td>
                        <td className="py-2.5 pr-3 leading-relaxed text-zinc-400">{m.steps}</td>
                        <td className="py-2.5 font-mono text-[10px] leading-relaxed text-amber-300/70">{m.params}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 动态文字 ============ */}
        <TabsContent value="type" className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Type className="size-4 text-amber-400" />
                中文动态文字手法谱系（文字先承担句意，再承担动作）
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {TYPE_TECHNIQUES.map((t) => (
                <div key={t.name} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3.5">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-semibold text-zinc-100">{t.name}</p>
                    <span className="text-[10px] text-zinc-500">{t.fit}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{t.how}</p>
                  <p className="mt-1.5 font-mono text-[10px] leading-relaxed text-amber-300/70">{t.params}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 运动与节奏 ============ */}
        <TabsContent value="motion" className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Wrench className="size-4 text-amber-400" />
                弹簧参数速查（ζ=c/(2√km)、ω=√(k/m)）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[560px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500">
                      <th className="pb-2 pr-3 font-medium">用途</th>
                      <th className="pb-2 pr-3 font-medium">可起步参数</th>
                      <th className="pb-2 font-medium">调整路径</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOTION_PARAMS.map((m) => (
                      <tr key={m.use} className="border-b border-zinc-800/60 align-top">
                        <td className="py-2.5 pr-3 font-semibold text-zinc-200">{m.use}</td>
                        <td className="py-2.5 pr-3 font-mono text-amber-300/80">{m.params}</td>
                        <td className="py-2.5 leading-relaxed text-zinc-400">{m.tip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 space-y-1.5">
                {MOTION_RULES.map((r) => (
                  <p key={r} className="flex gap-2 text-xs leading-relaxed text-zinc-400">
                    <span className="text-amber-400">▸</span>
                    {r}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4 text-amber-400" />
                返修症状速查表
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {REPAIR_TABLE.map((r) => (
                <div key={r.symptom} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
                  <p className="text-sm font-semibold text-rose-300/90">「{r.symptom}」</p>
                  <p className="mt-1 text-xs text-zinc-400">先检查：{r.check}</p>
                  <p className="mt-1 text-xs text-emerald-300/80">修法：{r.fix}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 声音设计 ============ */}
        <TabsContent value="music" className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Music className="size-4 text-amber-400" />
                音乐四案差异矩阵（至少三维实质差异，不是四种 seed）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[640px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500">
                      <th className="pb-2 pr-3 font-medium">方案</th>
                      <th className="pb-2 pr-3 font-medium">编制/节奏</th>
                      <th className="pb-2 pr-3 font-medium">动机/曲线</th>
                      <th className="pb-2 font-medium">人声关系/结尾</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MUSIC_PLANS.map((m) => (
                      <tr key={m.plan} className="border-b border-zinc-800/60 align-top">
                        <td className="py-2.5 pr-3 font-semibold text-amber-300">{m.plan}</td>
                        <td className="py-2.5 pr-3 leading-relaxed text-zinc-300">{m.texture}</td>
                        <td className="py-2.5 pr-3 leading-relaxed text-zinc-400">{m.motive}</td>
                        <td className="py-2.5 leading-relaxed text-zinc-400">{m.vocal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 space-y-1.5 text-xs leading-relaxed text-zinc-400">
                <p>▸ 四层声音：口播（句意与自然气口）＞ 音乐（长线情绪，中频让位口播）＞ 音效（从接触/触发事件产生，不每次入场同一个 whoosh）＞ 环境（空间连续性）。</p>
                <p>▸ 计划时间标 planned，不虚构「已卡点」「实测 BPM」；混音目标网络片 −14 LUFS / ≤−1 dBTP 起步。</p>
                <p>▸ caption 公式：器乐性质与情绪→核心编制→节奏动机→段落密度→口播空间→结尾→避免项。</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 质量底线 ============ */}
        <TabsContent value="quality" className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="size-4 text-amber-400" />
                质量底线 10 条（「好不好」的底线，不是要求每片用上所有效果）
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {QUALITY_BASELINES.map((q, i) => (
                <div key={q.title} className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 font-mono text-[11px] font-bold text-amber-300">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">{q.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">{q.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4 text-amber-400" />
                分层审片（验证按证据分层，不打混合总分）
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {['文件/契约', '纯逻辑测试', '语法/类型/构建', '静帧', '连续视频与音频', '作者采用'].map(
                (layer, i) => (
                  <div key={layer} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-2.5 text-center">
                    <p className="font-mono text-[10px] text-amber-300/70">L{i + 1}</p>
                    <p className="mt-1 text-[11px] font-medium text-zinc-300">{layer}</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 15+1 知识地图 ============ */}
        <TabsContent value="repos" className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Github className="size-4 text-amber-400" />
                15 个开源项目 + 附件风格库 · 知识地图（每一条都已注入平台）
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {REPO_KNOWLEDGE.map((r) => {
                const repo = getRepo(r.slug)
                return (
                  <div
                    key={r.slug}
                    className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-950/40 p-3.5"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-[13px] font-semibold text-zinc-100">{r.name}</p>
                      <Badge
                        variant="outline"
                        className="shrink-0 border-zinc-700 text-[10px] font-normal text-zinc-500"
                      >
                        {r.stars}
                      </Badge>
                    </div>
                    <Badge className="mt-1.5 w-fit bg-amber-500/15 text-[10px] text-amber-300">
                      {r.role}
                    </Badge>
                    <ul className="mt-2.5 space-y-1.5">
                      {r.essence.map((e) => (
                        <li key={e} className="flex gap-1.5 text-[11px] leading-relaxed text-zinc-400">
                          <span className="mt-0.5 shrink-0 text-amber-400/70">▸</span>
                          {e}
                        </li>
                      ))}
                    </ul>
                    {repo && (
                      <p className="mt-2.5 border-t border-zinc-800/60 pt-2 text-[10px] leading-relaxed text-zinc-600">
                        {repo.desc}
                      </p>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <PenLine className="size-4 text-amber-400" />
                附件《代码动画》341 风格库 · 10 大系列
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ATTACHMENT_SERIES.map((s) => (
                <div key={s.key} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
                  <p className="font-mono text-xs font-bold text-amber-300">{s.key}</p>
                  <p className="mt-0.5 text-sm font-semibold text-zinc-100">{s.label}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">{s.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
