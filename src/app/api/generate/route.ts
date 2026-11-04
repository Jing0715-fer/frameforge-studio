import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'
import type { StoryboardResult, StoryboardShot } from '@/lib/types'

export const maxDuration = 300

const FRAMEWORK_LABELS: Record<string, string> = {
  hyperframes: 'Hyperframes（HTML/CSS 确定性渲染成 MP4）',
  remotion: 'Remotion（React 组件化视频）',
  p5js: 'p5.js（代码手绘动画）',
  generic: '通用剪辑/动效工具（剪映 / AE / Blender）',
}

const FRAMEWORK_GUIDES: Record<string, string> = {
  hyperframes:
    '镜头 prompt 必须面向 HTML+CSS+JS 实现：单文件、requestAnimationFrame 驱动 60fps 确定性时间轴、动画只用 transform/opacity/clip-path、写明关键帧时间点，结尾注明「用 Hyperframes 以 1080p/60fps 渲染导出 MP4」。',
  remotion:
    '镜头 prompt 必须面向 Remotion 实现：React 函数组件、useCurrentFrame()/useVideoConfig() 驱动、spring() 与 interpolate() 计算动画、<Sequence> 编排时序、注册 <Composition fps={30}>，结尾注明「注册到 Remotion Root 并导出」。',
  p5js:
    '镜头 prompt 必须面向 p5.js 实现：setup()/draw() 结构、frameCount 驱动确定性动画、随机数必须固定种子、画布 1920×1080，结尾注明「以 p5.js 逐帧录制导出」。',
  generic:
    '镜头 prompt 面向通用剪辑/动效工具：描述图层结构、关键帧时间轴（属性+时间点+缓动）、素材来源建议与导出参数（1080p/30fps/H.264）。',
}

const ASPECT_LABELS: Record<string, string> = {
  '16:9': '横屏 1920×1080',
  '9:16': '竖屏 1080×1920',
  '1:1': '方形 1080×1080',
}

const ASPECT_GUIDES: Record<string, string> = {
  '16:9': '善用水平引导线、横向运动与宽构图',
  '9:16': '主体居中偏上，上下各留 12% 安全区，字幕避开安全区',
  '1:1': '居中构图、信息聚焦，避免边缘元素被裁切',
}

const PACING_LABELS: Record<string, string> = {
  slow: '舒缓叙事',
  medium: '标准节奏',
  fast: '快节奏卡点',
}

const PACING_GUIDES: Record<string, string> = {
  slow: '镜头 3~5 秒，缓动柔缓，以叠化与淡入淡出为主',
  medium: '镜头 2.5~4 秒，动静结合，转场多样',
  fast: '镜头 1.5~2.5 秒，强转场（变焦打击/故障切换/匹配剪辑）对齐 BGM 重拍',
}

const SYSTEM_PROMPT = `你是「FrameForge 分镜工坊」的首席 AI 导演兼创意工程师。你融会贯通了 14 个顶尖开源视频项目的创作方法论：Hyperframes（HTML/CSS 确定性渲染 MP4）、Remotion（React 组件化视频）、lemo-opuscar（66 种可复用影片风格）、huashu-art-motion（35 种艺术风格 + 9 种解说语法）、awesome-opus5-5-videos（703 条爆款视频提示词）、onetake（一镜到底连贯性数学验收）、ReelMimic（镜头/节奏/配色分析复刻）、mg-styles-15（15 种 MG 动效）、ClaudeAnimationBase（手绘角色动画 31 种表情）、pdoom-video（卡拉 OK 歌词 MV 本地渲染 4K60）等。

你的任务：根据用户需求，产出一份可直接投入生产的详细分镜稿，并为每个镜头撰写可直接投喂给 AI 编程工具（Claude Code 等）的实现提示词。

【导演准则】
1. 镜头数量与总时长匹配：15 秒 5~6 镜、30 秒 7~10 镜、60 秒 12~16 镜、90 秒 16~22 镜；每镜 1.5~5 秒，shots 时间轴从 0 秒连续覆盖到总时长，不得留空隙或重叠。
2. 每个镜头必须专业完整：明确景别（远景/全景/中景/近景/特写）、画面主体与构图（三分法/中心对称/引导线/负空间）、光影与色彩（给出主色 hex）、运镜与动效、转场方式、字幕文案。
3. 动效描述必须工程化：写明动画属性（transform/opacity/clip-path/filter）、缓动曲线（如 cubic-bezier(0.22,1,0.36,1) 或 spring 弹性）、时长与延迟、节拍对齐点。禁止「缓缓出现」「很有氛围感」这类含糊表述。
4. 镜头连贯性（onetake 验收标准）：相邻镜头主体屏幕位置衔接、运动方向一致、色温统一；转场与内容强关联（match cut / 形变 / 擦除 / 变焦打击）。
5. 字幕安全区：竖屏 9:16 时上下各留 12% 安全边距；字幕与旁白/音乐对齐，单条字幕不超过 14 个字。
6. shots[].prompt 必须自包含：读者是 Claude Code + 用户指定的实现框架。prompt 中包含该镜头的画面布局、动画时间轴、字体/色彩规格与导出参数，照着就能写出代码，无需参考其他镜头。
7. 叙事遵循「钩子→递进→高潮→收束」：前 2 秒抓住注意力，结尾留下记忆点与行动号召（如适用）。

【输出格式】只输出一个 JSON 对象，禁止用 markdown 代码块包裹，禁止输出任何解释文字。结构如下：
{
  "title": "视频标题（有创意、口语化）",
  "logline": "一句话概述这支视频",
  "styleGuide": {
    "name": "视觉风格名称",
    "palette": ["#RRGGBB", "#RRGGBB", "#RRGGBB", "#RRGGBB"],
    "typography": "字体与版式建议",
    "texture": "质感与纹理建议",
    "motionTone": "动效基调"
  },
  "musicStyle": "配乐与音效总体建议",
  "totalDuration": 30,
  "shots": [
    {
      "index": 1,
      "start": 0,
      "end": 3,
      "shotSize": "特写",
      "scene": "画面描述（60~120 字：主体、环境、构图、光影、色彩 hex）",
      "motion": "运镜与动效（工程化：属性、缓动、时长、节拍点）",
      "transition": "转场到下一镜的方式",
      "caption": "画面字幕（不超过 14 字）",
      "narration": "旁白配音文案（无则空字符串）",
      "sfx": "音效建议",
      "prompt": "该镜头完整实现提示词（120~250 字，面向指定框架，可直接投喂 AI 编程工具）"
    }
  ],
  "implementationNotes": ["整体实现建议 3~5 条：工程结构、时间轴管理、资产准备、导出参数"],
  "checklist": ["交付验收要点 4~6 条：连贯性、卡点、字幕安全区、性能"]
}`

// 从模型输出中稳健提取 JSON（容忍 ```json 围栏、前后杂讯、尾逗号）
function extractJson(text: string): unknown | null {
  let t = text.trim()
  const fenced = t.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) t = fenced[1].trim()
  const start = t.indexOf('{')
  const end = t.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  let candidate = t.slice(start, end + 1)
  try {
    return JSON.parse(candidate)
  } catch {
    /* 尝试修复 */
  }
  candidate = candidate.replace(/,\s*([}\]])/g, '$1')
  try {
    return JSON.parse(candidate)
  } catch {
    return null
  }
}

function normalizeShot(raw: Record<string, unknown>, i: number): StoryboardShot {
  const num = (v: unknown, fallback = 0) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
  }
  const str = (v: unknown) => (typeof v === 'string' ? v : '')
  return {
    index: num(raw.index, i + 1),
    start: num(raw.start),
    end: num(raw.end),
    shotSize: str(raw.shotSize) || '中景',
    scene: str(raw.scene),
    motion: str(raw.motion),
    transition: str(raw.transition),
    caption: str(raw.caption),
    narration: str(raw.narration),
    sfx: str(raw.sfx),
    prompt: str(raw.prompt),
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const idea = String(body?.idea ?? '').trim()
    const videoType = String(body?.videoType ?? '社交短视频')
    const styleSlug = String(body?.styleSlug ?? 'auto')
    const duration = Number(body?.duration) || 30
    const aspect = String(body?.aspect ?? '16:9')
    const framework = String(body?.framework ?? 'generic')
    const pacing = String(body?.pacing ?? 'medium')
    const extra = String(body?.extra ?? '').trim()

    if (idea.length < 4) {
      return NextResponse.json({ error: '请先填写创意描述（至少 4 个字）' }, { status: 400 })
    }

    // 解析风格：从风格库读取 starterPrompt 作为风格参考
    let styleName = '由 AI 自由发挥'
    let stylePrompt = ''
    if (styleSlug && styleSlug !== 'auto') {
      const style = await db.style.findUnique({ where: { slug: styleSlug } })
      if (style) {
        styleName = style.name
        stylePrompt = style.starterPrompt
      }
    }

    const userPrompt = [
      '【创作需求】',
      `- 创意描述：${idea}`,
      `- 视频类型：${videoType}`,
      `- 视觉风格：${styleSlug === 'auto' ? '由你决定最合适的风格，并在 styleGuide.name 中写明' : styleName}`,
      stylePrompt ? `- 风格参考（风格库沉淀的实现要点，请遵循其色彩与质感）：${stylePrompt}` : '',
      `- 总时长：${duration} 秒（shots 时间轴必须从 0 连续覆盖到 ${duration}）`,
      `- 画幅：${aspect}（${ASPECT_LABELS[aspect] ?? ''}，${ASPECT_GUIDES[aspect] ?? ''}）`,
      `- 实现框架：${FRAMEWORK_LABELS[framework] ?? framework}——${FRAMEWORK_GUIDES[framework] ?? ''}`,
      `- 节奏：${PACING_LABELS[pacing] ?? pacing}（${PACING_GUIDES[pacing] ?? ''}）`,
      extra ? `- 附加要求：${extra}` : '',
      '',
      '请开始创作，只输出 JSON。',
    ]
      .filter(Boolean)
      .join('\n')

    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    })

    const content = completion.choices[0]?.message?.content ?? ''
    const parsed = extractJson(content) as StoryboardResult | null
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.shots) || parsed.shots.length === 0) {
      console.error('[api/generate] JSON 解析失败，原始输出前 600 字：', content.slice(0, 600))
      return NextResponse.json(
        { error: 'AI 返回格式异常，请再试一次（通常第二次即可成功）' },
        { status: 502 }
      )
    }

    const shots = parsed.shots.map((s, i) => normalizeShot(s as Record<string, unknown>, i))
    const result: StoryboardResult = {
      title: String(parsed.title ?? '未命名分镜'),
      logline: String(parsed.logline ?? ''),
      styleGuide: parsed.styleGuide ?? {},
      musicStyle: String(parsed.musicStyle ?? ''),
      totalDuration: Number(parsed.totalDuration) || duration,
      shots,
      implementationNotes: Array.isArray(parsed.implementationNotes)
        ? parsed.implementationNotes.map(String)
        : [],
      checklist: Array.isArray(parsed.checklist) ? parsed.checklist.map(String) : [],
    }

    const saved = await db.generation.create({
      data: {
        title: result.title,
        logline: result.logline,
        framework,
        styleName: styleSlug === 'auto' ? (result.styleGuide?.name ?? 'AI 自由发挥') : styleName,
        input: JSON.stringify({ idea, videoType, styleSlug, duration, aspect, framework, pacing, extra }),
        output: JSON.stringify(result),
      },
    })

    return NextResponse.json({
      generation: {
        id: saved.id,
        title: saved.title,
        logline: saved.logline,
        framework: saved.framework,
        styleName: saved.styleName,
        input: saved.input,
        output: result,
        createdAt: saved.createdAt,
      },
    })
  } catch (err) {
    console.error('[api/generate]', err)
    const message = err instanceof Error ? err.message : '未知错误'
    return NextResponse.json({ error: `生成失败：${message}` }, { status: 500 })
  }
}
