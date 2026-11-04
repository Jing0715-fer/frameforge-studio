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
    '镜头 prompt 必须面向 HTML+CSS+JS 单文件实现：画面是时间 t（秒）的纯函数（同一 t 渲染结果一致，禁止 Date.now/无种子随机/累积状态，随机用 mulberry32(seed) 且只初始化一次）；requestAnimationFrame 驱动、?t=3.3 显示单帧；动画只用 transform/opacity/clip-path；写明关键帧时间点，结尾注明「用 Hyperframes 以 1080p/60fps 渲染导出 MP4」。',
  remotion:
    '镜头 prompt 必须面向 Remotion 实现：React 函数组件、useCurrentFrame()/useVideoConfig() 驱动、spring({frame,fps,config}) 与 interpolate(frame,[..],[..],{extrapolateLeft/Right:"clamp"}) 计算动画、<Sequence from={秒*fps}> 编排（Sequence 内是局部帧，全片事件加回 offset 且只加一次）、注册 <Composition fps={30}>，结尾注明「注册到 Remotion Root 并导出」。',
  p5js:
    '镜头 prompt 必须面向 p5.js 实现：setup()/draw() 结构、frameCount 驱动确定性动画、随机数必须固定种子（randomSeed(noiseSeed)）、画布 1920×1080，角色表演链「注意到→反应→行动→结果」，结尾注明「以 p5.js 逐帧录制导出」。',
  generic:
    '镜头 prompt 面向通用剪辑/动效工具：描述图层结构（背景/中景/主体/文字/前景五层）、关键帧时间轴（属性+时间点+缓动）、素材来源建议与导出参数（1080p/30fps/H.264）。',
}

const ASPECT_LABELS: Record<string, string> = {
  '16:9': '横屏 1920×1080',
  '9:16': '竖屏 1080×1920',
  '1:1': '方形 1080×1080',
}

const ASPECT_GUIDES: Record<string, string> = {
  '16:9': '善用水平引导线、横向运动与宽构图',
  '9:16': '主体居中偏上，上下各留 12% 安全区，字幕避开安全区；竖版文字重新分组重排，不能只把横版整体缩小',
  '1:1': '居中构图、信息聚焦，避免边缘元素被裁切',
}

const PACING_LABELS: Record<string, string> = {
  slow: '舒缓叙事',
  medium: '标准节奏',
  fast: '快节奏卡点',
}

const PACING_GUIDES: Record<string, string> = {
  slow: '镜头 3~5 秒，缓动柔缓；允许锁镜、静止、只有 opacity 淡入；蓄势段留白给释放段做对比',
  medium: '镜头 2.5~4 秒，动静结合，转场多样；快慢有对比，有蓄势有释放有安静',
  fast: '镜头 1.5~2.5 秒，强转场（甩镜/变焦打击/网格揭示）对齐 BGM 重拍；甩镜期间不安排需要阅读的文字',
}

// ============================================================
// 系统提示词：融合 fy-code-animation《俯仰代码动画》方法论
// + 14 个开源项目的能力（hyperframes 确定性渲染 / lemo-opuscar
// 导演四件套 / onetake 连贯性验收 / ReelMimic 逆向 / …）
// ============================================================
const SYSTEM_PROMPT = `你是「FrameForge 分镜工坊」的首席 AI 导演兼创意工程师。你融会贯通了 15 个顶尖开源项目与一份 341 风格库的创作方法论：
- fy-code-animation《俯仰代码动画》：语义分镜方法论（本技能的灵魂）——读懂全文→语义分段→选画风→镜头/转场/文字/声音设计→代码落地→检查返修
- hyperframes：HTML/CSS 确定性渲染 MP4（画面是时间 t 的纯函数）
- Remotion skills：React 组件化视频（spring/interpolate/Sequence）
- lemo-opuscar：66 种可复用影片风格 + 导演/技术指南（风格=材质+构图+运动语法+镜头语言四件套）
- awesome-opus5-5-videos：703 条爆款提示词的写法规律
- huashu-art-motion：35 艺术风格 × 9 解说语法组合矩阵
- onetake：一镜到底 + 镜头连贯性数学验收
- ReelMimic：参考视频逆向（镜头切分→节奏标定→配色提取→语法归纳）
- mg-styles-15：成片→提示词→源码三位一体
- ClaudeAnimationBase：手绘角色 31 表情 + 表演链（注意到→反应→行动→结果）
- shipvideo：产品发布片四段式（痛点钩子→产品亮相→功能证明→CTA）
- pdoom-video / PDoomVideo：卡拉OK歌词 MV 与同曲双版本对照
- 附件《代码动画》341 风格库：A–G 代码样片 / M 动态 / K 卡通 / Z 中国风 / H 版式 / L Lemo / V mg / X code-video / R 参考 / O 奥斯卡 98 部

【语义分镜铁律（反逐句贴卡）】
1. 每个镜头必须有一个可观察的变化来承载意思（关系、动作、对象状态），而不是「标题+图标+淡入」。观众看完每镜要多知道一件事。
2. 把内容关系翻译成可视操作：
   - 因为A所以B → A先改变，经过可见路径影响B（触发先于反应，不能同时弹出）
   - 不是A而是B → 保留比较维度撤除错误解释；否定词与被否定部分一起出现且必须可读
   - 部分组成整体 → 从真实分件装配（随机粒子聚合≠功能分工）
   - 尺度变化 → 同一对象拉远逐层揭示，小层可追踪
   - 感受转变 → 姿态、空间、颜色、速度共同变化，允许停顿
3. 有贯穿对象和接缝：相邻镜头写清靠什么接（同对象接力/遮罩/翻面/粒子重组/有动机硬切）；上一镜的结果是下一镜的输入。
4. 抽象主题选一种可持续变形的载体（线、纸面、窗口、路、群体、机械件），不是每个名词配一个图标。

【重点词三级力度】
一级用颜色或字重；二级加空间变化或主体回应；三级只给本段真正的转折/高潮（停顿后爆发或突然安静）。否定词和条件词必须可读，不能被弱化。数字与图形共用同一插值数据源。

【文字与阅读窗】
静读窗从最后一个必要字落稳开始算，试算每秒 4–7 个汉字；中文不用空格切分，语义分组显式；1080p 主标题 72–140px、正文 40–56px；中文行高 1.25–1.6；竖版重新分组重排。

【转场谱系（按两镜关系选）】
因果接续→同对象接力（锚点误差≤8px，交接预备.15–.4s）；同空间看另一部分→推移/共享轴；总体到细节→锚点放大/穿越（log 缩放）；回忆时间→叠化（.4–1.2s）；明确对比→有动机硬切（切在动作峰值）；换画风→贯穿物承接。转场时长不能抵扣阅读窗。

【镜头运动四段式】
起势（视线线索）→移动（只改变需要解释的空间关系）→到站（结束大幅位移）→停稳（证据可读）。推近 zoom 1→1.04–1.08（log 空间插值）；多层视差背景 .2–.4/主体 1/前景 1.1–1.4；字幕在屏幕层不被相机带走；读长句时镜头可以完全静止；同一时刻不让视线追三个无关目标。

【风格翻译】
选中画风后，把它的材质→绘制方式/颜色数/线宽、构图→网格/安全区/留白、运动语法→曲线类型/绘制频率、镜头→相机自由度，逐条翻成本片规则——风格不只是配色。

【工程化要求】
1. 镜头数量与总时长匹配：15 秒 5~6 镜、30 秒 7~10 镜、60 秒 12~16 镜、90 秒 16~22 镜；每镜 1.5~5 秒，shots 时间轴从 0 秒连续覆盖到总时长，不得留空隙或重叠。
2. 每镜明确景别、画面五层（背景/中景/主体/文字/前景）的作用、光影与主色 hex、运镜与缓动（如 cubic-bezier(0.22,1,0.36,1) 或 spring 参数）、转场、字幕（≤14字）。禁止「缓缓出现」「很有氛围感」这类含糊表述。
3. 镜头连贯性（onetake 验收标准）：相邻镜头主体屏幕位置衔接、运动方向一致、色温统一；转场与内容强关联。
4. shots[].prompt 必须自包含：读者是 Claude Code + 用户指定的实现框架，照着就能写代码。
5. 叙事遵循「钩子→递进→高潮→收束」；快慢有对比，时长不平均分配。

【输出格式（硬约束）】只输出一个 JSON 对象：严格合法的 JSON——所有冒号用英文半角":"，键名不加空格，字符串值内不要用双引号（用「」），不要任何注释、尾逗号或 markdown 围栏，输出完整不截断。结构如下：
{
  "title": "视频标题（有创意、口语化）",
  "logline": "一句话概述这支视频",
  "meaningArc": "全文理解：主旨 + 观众从什么理解变成什么理解 + 情绪起点→转折→落点（40~80字）",
  "styleGuide": {
    "name": "视觉风格名称",
    "palette": ["#RRGGBB", "#RRGGBB", "#RRGGBB", "#RRGGBB"],
    "typography": "字体与版式建议（含字号层级）",
    "texture": "质感与纹理建议",
    "motionTone": "动效基调（曲线类型与运动语法）"
  },
  "musicStyle": "配乐总体建议（一段）",
  "musicPlans": ["方案A：编制/节奏/动机/口播关系/结尾（各一句）", "方案B：…", "方案C：…", "方案D：…"],
  "energyCurve": "节奏与能量曲线：哪里蓄势、哪里释放、哪里安静（40~80字）",
  "totalDuration": 30,
  "shots": [
    {
      "index": 1,
      "start": 0,
      "end": 3,
      "shotSize": "特写",
      "scene": "画面描述（60~120字：五层各是什么、主体、构图、光影、色彩 hex、观众此镜多知道什么）",
      "motion": "运镜与动效（工程化：四段式、属性、缓动、时长、节拍点）",
      "transition": "转场到下一镜的方式（写明承载物与交接）",
      "caption": "画面字幕（不超过 14 字）",
      "narration": "旁白配音文案（无则空字符串）",
      "sfx": "音效建议（对齐接触事件）",
      "energy": 3,
      "readingWindow": "静读窗说明（如：最后落字后留 1.2s，字幕 10 字约需 1.8s）",
      "seamHandoff": "与下一镜的接缝：靠什么对象/方向/锚点接力",
      "emphasisWords": "本镜重点词与力度（如：『开始』三级，停顿后 slam）",
      "prompt": "该镜头完整实现提示词（120~250 字，面向指定框架，含五层布局、动画时间轴、字体色彩规格与导出参数，可直接投喂 AI 编程工具）"
    }
  ],
  "implementationNotes": ["整体实现建议 3~5 条：工程结构、时间轴管理、确定性要求、资产准备、导出参数"],
  "checklist": ["交付验收要点 4~6 条：连贯性数值、阅读窗、字幕安全区、seek 确定性、性能"]
}`

// ============================================================
// 任务卡模式系统提示词（fy-code-animation 任务卡规格 12 节）
// ============================================================
const TASK_CARD_PROMPT = `你是「FrameForge 分镜工坊」的 AI 导演，精通 fy-code-animation《俯仰代码动画》方法论。本次交付一份「动画任务卡」——一份能让另一个 AI Agent 或工程师拿到后不用回看聊天就能直接开工的完整设计文档。本次只交任务卡：不生成动画、静帧、音乐，不渲染。

按以下 12 节输出 Markdown 文档（用二级标题分节，表格用 Markdown 表格）：

## 0. 卡头
作品名、阶段（card）、规格（画幅/fps/目标时长）、本卡版本。

## 1. 全文理解
一句话主旨；观众从什么理解变成什么理解；情绪起点→转折→落点；全文结构按「提出/解释/证据/限制或反转/落点」标注（没有反转不硬造）。

## 2. 语义分段
表格：段ID | 原文要点 | 本段职责 | 与前后段关系（因果/对比/递进/转折）| 快慢倾向及理由。

## 3. 重点词与气势词
表格：词 | 语义角色（结论/转折/否定/数字/对比/情绪/动作/专名）| 力度等级（一/二/三级）| 表达手段（字重/颜色/位置/留白/停顿/物件动作/镜头/声音）| 为什么用这个手段而不是放大。否定词和条件词不能被弱化。

## 4. 画风安排与风格卡
画风选择及依据；风格卡六项：语法（材质/构图/运动/镜头如何构成）、文字（字体/字号层级/出现方式）、运动（连续或逐格/相机自由度/碰撞规则）、声音（声部/密度方向）、依赖（字体/素材/引擎，缺项列明）、内容适配（保留语法换掉示例故事）。如指定了风格库条目，完整翻译其视觉语法为本片规则。

## 5. 统一视觉系统
字体（中文字族/字重层级/行高字距/画幅重排规则）、色彩与留白（主色/识别色/背景层级/阅读区）、网格与构图（安全区/主体区/字幕区）、贯穿对象（串场线索，跨镜身份保持）、背景机制（每段背景承担什么，怎样给阅读区让位）。

## 6. 逐镜分镜（核心，每镜写到拿去就能写代码）
每镜：ID/语义段/起止秒/信息任务（观众要看懂什么）｜画面五层（背景/中景/主体/文字/前景）各是什么怎么动｜主动作（准备→主动作→停留→退出，曲线类型与参数如 spring(ζ0.85,ω14) 或 power3.out 0.6s）｜镜头（锁定/推/拉/摇/跟随，起止取景与锚点）｜文字（出现方式/最后落字时间/静读窗秒数）｜接缝（与上下镜靠什么接：同对象接力/遮罩/翻面/粒子重组/硬切，交接帧状态）｜声音（音乐职责/音效事件）｜实现提示（面向指定框架的完整 prompt，可直接投喂 AI 编程工具）。

## 7. 节奏与能量曲线
全片能量表：段/镜 | 时间 | 运动能量0–5 | 视觉/声音密度0–5 | 留白/阅读窗；哪里蓄势、释放、安静；快慢对比说明。

## 8. 事件表
表格：id | 局部秒 | 全局秒 | 信息变化 | 画面动作 | 声音职责（全部标 planned）。

## 9. 音乐与音效方案
从能量曲线推出音乐结构（建立/推进/蓄势/释放/收束）；四案音乐（每案：编制/节奏/动机/能量曲线/口播关系/结尾方式，至少三维实质差异）；音效表（事件/对象材质/力度/同步关系/密度控制）。

## 10. 实现路线
引擎（Remotion/Canvas/HTML）及理由；时间基准（秒为交换单位、fps）；确定性要求（seed、不依赖累计状态、任意帧可 seek 重现）；要复用的组件与要新写的部分；依赖清单。

## 11. 检查计划
静帧阶段看哪些镜头哪个时刻；动画阶段看哪些接缝与动作中段；声音阶段核对哪些同步点。

## 12. 风险与待定项
缺的素材/字体/依赖；会改变含义或主要审美的选择（选项/影响/建议）。

【风格要求】禁止「酷炫转场」「有质感」「丝滑」这类不可执行形容词；每处写具体数值与对象；诚实标注 planned/待定，不虚构已验证。只输出 Markdown 文档本身，开头是「# 任务卡：{作品名}」。`

// 从模型输出中稳健提取 JSON（容忍 ```json 围栏、前后杂讯、尾逗号、全角冒号、键内空格）
function repairJson(candidate: string): string {
  let c = candidate
  // 尾逗号
  c = c.replace(/,\s*([}\]])/g, '$1')
  // 键后的全角冒号（含键尾空格）："key "： → "key":
  c = c.replace(/"\s*\s*：/g, '":')
  c = c.replace(/"\s*：/g, '":')
  // 值中把中文引号包围的字符串统一（如 “xxx” → "xxx"）在 JSON 外部场景常见，此处跳过
  // 单引号键/值（罕见）：'key': → "key":
  c = c.replace(/'([A-Za-z_][A-Za-z0-9_]*)'\s*:/g, '"$1":')
  return c
}

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
  try {
    return JSON.parse(repairJson(candidate))
  } catch {
    /* 截断补救 */
  }
  // 截断的 JSON：逐层收尾（找到最后一个完整的对象/数组边界，闭合悬挂括号）
  const repaired = repairJson(candidate)
  const lastObj = repaired.lastIndexOf('}')
  if (lastObj > 0) {
    const truncated = repaired.slice(0, lastObj + 1)
    const opens = (truncated.match(/[{[]/g) ?? []).length
    const closes = (truncated.match(/[}\]]/g) ?? []).length
    const dangling = truncated.slice(-(opens - closes) * 200)
    void dangling
    let salvaged = truncated
    // 移除尾部不完整的键值片段（以逗号/引号结尾的）
    salvaged = salvaged.replace(/,?\s*"[^":,]*$/, '')
    for (let i = opens - closes; i > 0; i--) {
      salvaged += salvaged.trimEnd().endsWith('}') ? ']' : '}'
    }
    try {
      return JSON.parse(salvaged)
    } catch {
      return null
    }
  }
  return null
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
    energy: Math.min(5, Math.max(0, num(raw.energy, 3))),
    readingWindow: str(raw.readingWindow) || undefined,
    seamHandoff: str(raw.seamHandoff) || undefined,
    emphasisWords: str(raw.emphasisWords) || undefined,
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
    const outputMode = String(body?.outputMode ?? 'storyboard') === 'taskcard' ? 'taskcard' : 'storyboard'

    if (idea.length < 4) {
      return NextResponse.json({ error: '请先填写创意描述（至少 4 个字）' }, { status: 400 })
    }

    // 解析风格：优先注入完整风格提示词原文（fy 方法论：读全文再决定）
    let styleName = '由 AI 自由发挥'
    let stylePrompt = ''
    let styleBrief = ''
    if (styleSlug && styleSlug !== 'auto') {
      const style = await db.style.findUnique({ where: { slug: styleSlug } })
      if (style) {
        styleName = style.name
        const full = style.promptFull || style.starterPrompt
        // 完整原文过长时截断到 1800 字，保留开头（视觉语法核心通常在前部）
        stylePrompt = full.length > 1800 ? `${full.slice(0, 1800)}\n…（原文截断，语法核心已保留）` : full
        styleBrief = [
          style.suitableFor ? `适合讲：${style.suitableFor}` : '',
          style.looksLike ? `长什么样：${style.looksLike}` : '',
        ]
          .filter(Boolean)
          .join('；')
      }
    }

    const userPrompt = [
      '【创作需求】',
      `- 创意描述：${idea}`,
      `- 视频类型：${videoType}`,
      `- 视觉风格：${styleSlug === 'auto' ? '由你决定最合适的风格（先想想内容最贴近哪种材质与运动语法），并在 styleGuide.name 中写明选择理由' : `${styleName}（${styleBrief}）`}`,
      stylePrompt
        ? `- 风格提示词原文（必须完整保留其视觉语法：材质、构图、运动语法、镜头语言都要体现在分镜里，不只是配色）：\n<<<\n${stylePrompt}\n>>>`
        : '',
      `- 总时长：${duration} 秒（shots 时间轴必须从 0 连续覆盖到 ${duration}）`,
      `- 画幅：${aspect}（${ASPECT_LABELS[aspect] ?? ''}，${ASPECT_GUIDES[aspect] ?? ''}）`,
      `- 实现框架：${FRAMEWORK_LABELS[framework] ?? framework}——${FRAMEWORK_GUIDES[framework] ?? ''}`,
      `- 节奏：${PACING_LABELS[pacing] ?? pacing}（${PACING_GUIDES[pacing] ?? ''}）`,
      extra ? `- 附加要求：${extra}` : '',
      '',
      outputMode === 'taskcard'
        ? '请输出完整任务卡 Markdown 文档（12 节），只输出文档本身。'
        : '请开始创作，只输出 JSON。',
    ]
      .filter(Boolean)
      .join('\n')

    const zai = await ZAI.create()
    const callLlm = (systemPrompt: string, userPromptText: string) =>
      zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: systemPrompt },
          { role: 'user', content: userPromptText },
        ],
        thinking: { type: 'disabled' },
      })

    let content = ''
    if (outputMode === 'taskcard') {
      const completion = await callLlm(TASK_CARD_PROMPT, userPrompt)
      content = completion.choices[0]?.message?.content ?? ''
    } else {
      const completion = await callLlm(SYSTEM_PROMPT, userPrompt)
      content = completion.choices[0]?.message?.content ?? ''
      // 首次解析失败 → 带纠错提示重试一次
      const first = extractJson(content) as StoryboardResult | null
      if (!first || !Array.isArray(first.shots) || first.shots.length === 0) {
        console.warn('[api/generate] 首次 JSON 解析失败，带纠错提示重试')
        const retry = await callLlm(
          SYSTEM_PROMPT +
            '\n\n【格式硬约束（上一次输出解析失败）】必须是严格合法的 JSON：所有冒号用英文半角\":\"；键名不加空格；字符串值内的引号用「」；不要任何注释、尾逗号或 markdown 围栏；输出完整，不得截断。',
          userPrompt + '\n\n请重新输出，只输出严格合法的完整 JSON。'
        )
        content = retry.choices[0]?.message?.content ?? content
        const retryParsed = extractJson(content) as StoryboardResult | null
        if (!retryParsed || !Array.isArray(retryParsed.shots) || retryParsed.shots.length === 0) {
          // 重试仍失败则回退首次输出（交给下方统一解析/报错）
        }
      }
    }

    // ============ 任务卡模式：原文即交付 ============
    if (outputMode === 'taskcard') {
      let markdown = content.trim()
      const fenced = markdown.match(/```(?:markdown)?\s*([\s\S]*?)```/)
      if (fenced && fenced[1].trim().length > 200) markdown = fenced[1].trim()
      if (markdown.length < 300) {
        console.error('[api/generate] 任务卡输出过短，前 400 字：', content.slice(0, 400))
        return NextResponse.json({ error: 'AI 返回内容过短，请再试一次' }, { status: 502 })
      }
      const titleMatch = markdown.match(/^#\s*(?:任务卡[：:]?)?\s*(.+)$/m)
      const title = (titleMatch?.[1] ?? '动画任务卡').trim()
      const saved = await db.generation.create({
        data: {
          title: title.slice(0, 120),
          logline: `fy 任务卡 · ${styleSlug === 'auto' ? 'AI 自选风格' : styleName}`,
          framework,
          styleName: styleSlug === 'auto' ? 'AI 自由发挥' : styleName,
          input: JSON.stringify({ idea, videoType, styleSlug, duration, aspect, framework, pacing, extra, outputMode }),
          output: JSON.stringify({ title, markdown }),
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
          output: { title, markdown },
          createdAt: saved.createdAt,
        },
      })
    }

    // ============ 分镜稿模式：JSON 解析 ============
    const parsed = extractJson(content) as StoryboardResult | null
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.shots) || parsed.shots.length === 0) {
      console.error('[api/generate] JSON 解析失败，原始输出前 600 字：', content.slice(0, 600))
      return NextResponse.json(
        { error: 'AI 返回格式异常，请再试一次（通常第二次即可成功）' },
        { status: 502 }
      )
    }

    const shots = parsed.shots.map((s, i) =>
      normalizeShot(s as unknown as Record<string, unknown>, i)
    )
    const result: StoryboardResult = {
      title: String(parsed.title ?? '未命名分镜'),
      logline: String(parsed.logline ?? ''),
      styleGuide: parsed.styleGuide ?? {},
      musicStyle: String(parsed.musicStyle ?? ''),
      totalDuration: Number(parsed.totalDuration) || duration,
      shots,
      meaningArc: typeof parsed.meaningArc === 'string' ? parsed.meaningArc : undefined,
      energyCurve: typeof parsed.energyCurve === 'string' ? parsed.energyCurve : undefined,
      musicPlans: Array.isArray(parsed.musicPlans) ? parsed.musicPlans.map(String).slice(0, 6) : undefined,
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
        input: JSON.stringify({ idea, videoType, styleSlug, duration, aspect, framework, pacing, extra, outputMode }),
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
