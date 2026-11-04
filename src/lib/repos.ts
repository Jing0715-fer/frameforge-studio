// 15 个灵感来源开源仓库 + 附件《代码动画》风格库（数据来自用户提供榜单与附件）
export interface RepoInfo {
  slug: string
  name: string
  stars: string
  desc: string
  rank: number
}

export const REPOS: RepoInfo[] = [
  { slug: 'hyperframes', name: 'heygen-com/hyperframes', stars: '7.8万', desc: 'HTML/CSS 渲染成确定性 MP4 的框架，内置 20+ Agent Skills，是整个工具链的底座', rank: 1 },
  { slug: 'awesome-opus5-5-videos', name: 'yihui-dev/awesome-opus5-5-videos', stars: '1.3万', desc: '703 条爆款视频提示词，418 个带「实时重制」演示，最大的案例库', rank: 2 },
  { slug: 'lemo-opuscar', name: 'lemomo-ai/lemo-opuscar', stars: '1.15万', desc: '66 种可复用影片风格 + 纯代码样片 + 导演/技术指南，装成 Claude Code Skill 即用', rank: 3 },
  { slug: 'remotion-skills', name: 'remotion-dev/skills', stars: '6.0千', desc: 'Remotion 官方 Agent Skills，教 Agent 用 React 组件写视频并导出', rank: 4 },
  { slug: 'huashu-art-motion', name: 'alchaincyf/huashu-art-motion', stars: '6.0千', desc: '35 种艺术风格 + 9 种解说语法，把静态画面用代码动起来', rank: 5 },
  { slug: 'pdoom-video', name: 'mexicat/pdoom-video', stars: '3.8千', desc: '完整的一支歌词卡拉 OK MV 工程，本地可渲 4K60', rank: 6 },
  { slug: 'onetake', name: 'feitangyuan/onetake', stars: '3.3千', desc: '一镜到底产品发布片 Skill，用数学指标自动验收镜头连贯度', rank: 7 },
  { slug: 'PDoomVideo', name: 'JohnHeibel/PDoomVideo', stars: '2.7千', desc: '同一首歌的另一支手绘风 MV 源码，可与 pdoom-video 对照拆解', rank: 8 },
  { slug: 'mg-styles-15', name: 'Vincentwei1021/mg-styles-15', stars: '2.5千', desc: '15 种 MG 动效风格，成片、提示词、源码全开源', rank: 9 },
  { slug: 'ClaudeAnimationBase', name: 'JohnHeibel/ClaudeAnimationBase', stars: '2.2千', desc: '手绘卡通角色动画起步包，p5.js + p5.brush，自带 31 种表情', rank: 10 },
  { slug: 'ReelMimic', name: 'edenfunf/ReelMimic', stars: '1.4千', desc: '分析参考视频的镜头、节奏、配色，再产出一支同风格新片', rank: 11 },
  { slug: 'awesome-claude-5-5-videos', name: 'athemeroy/awesome-claude-5-5-videos', stars: '750', desc: '对 1000+ 支视频做抽样核验的来源索引，标注每支视频由谁完成渲染', rank: 12 },
  { slug: 'opus-video-prompts', name: 'joeseesun/opus-video-prompts', stars: '520', desc: '中文案例 + 可直接复制的提示词，按「一句话/模板/参考图/长提示词」分类', rank: 13 },
  { slug: 'shipvideo', name: 'diggerhq/shipvideo', stars: '340', desc: '丢一个网址或描述，自动产出一支 20~40 秒产品发布片，含完整服务端渲染 Agent', rank: 14 },
  { slug: 'fy-code-animation', name: 'Akillll-DuoHe/fy-code-animation', stars: '新', desc: '《俯仰代码动画》创作方法论技能：语义分镜 + 341 风格库检索 + 镜头/转场/文字/音乐配方 + 任务卡与返修体系，本平台 AI 能力的骨架', rank: 15 },
  { slug: 'code-animation-pack', name: '附件《代码动画》341 风格库', stars: '附件', desc: '341 种代码动画风格提示词（A–G 代码样片/M 动态/K 卡通/Z 中国风/H 版式/L Lemo/V mg/X code-video/R 参考/O 奥斯卡 98 部），193 种带静帧', rank: 16 },
]

export function getRepo(slug: string): RepoInfo | undefined {
  return REPOS.find((r) => r.slug === slug)
}
