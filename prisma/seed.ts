import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'
import { styleSeeds, promptSeeds, effectSeeds } from './seed-data'
import { extraPromptSeeds, extraEffectSeeds } from './seed-extra'
import { fyRecipeEffectSeeds, fyRecipePromptSeeds } from './seed-fy-recipes'

const db = new PrismaClient()

// 附件《代码动画》341 风格库（解析产物）
interface AttachmentStyle {
  slug: string
  sid: string
  name: string
  nameEn: string
  series: string
  seriesLabel: string
  subCategory: string
  category: string
  looksLike: string
  suitableFor: string
  keywords: string
  styleTag: string
  year: string
  hasStill: boolean
  promptFull: string
}

function loadAttachmentStyles() {
  try {
    const raw = readFileSync(join(__dirname, 'styles-attachment.json'), 'utf-8')
    const data = JSON.parse(raw) as { styles: AttachmentStyle[] }
    return data.styles.map((s) => ({
      slug: s.slug,
      name: s.name,
      nameEn: s.nameEn,
      category: s.seriesLabel,
      description: s.looksLike || `${s.name}（${s.seriesLabel}）`,
      tags: [s.keywords, s.suitableFor, s.styleTag].filter(Boolean).join(',').slice(0, 200),
      palette: extractPalette(s.promptFull),
      sourceRepo:
        s.series === 'L'
          ? 'lemo-opuscar'
          : s.series === 'V'
            ? 'mg-styles-15'
            : s.series === 'X'
              ? 'code-video'
              : 'code-animation-pack',
      difficulty: '',
      starterPrompt: s.promptFull.slice(0, 420),
      series: s.series,
      sid: s.sid,
      looksLike: s.looksLike,
      suitableFor: s.suitableFor,
      promptFull: s.promptFull,
      hasStill: s.hasStill,
    }))
  } catch (err) {
    console.warn('[seed] 附件风格库加载失败，跳过', err)
    return []
  }
}

// 附件 A–G 代码样片 Canvas 动效（解析产物）
function loadAgEffects() {
  try {
    const raw = readFileSync(join(__dirname, 'effects-ag.json'), 'utf-8')
    return JSON.parse(raw) as Array<{
      name: string
      nameEn: string
      category: string
      description: string
      codeSnippet: string
      prompt: string
      sourceRepo: string
      demo: string
    }>
  } catch (err) {
    console.warn('[seed] A-G 动效加载失败，跳过', err)
    return []
  }
}

// 从风格提示词原文提取十六进制色板（首次遇到的 ≤4 个）
const HEX_RE = /#[0-9a-fA-F]{6}\b/g
function extractPalette(text: string): string {
  const hexes = Array.from(new Set((text || '').match(HEX_RE) || []))
  return hexes.length >= 2 ? hexes.slice(0, 4).join(',') : ''
}

async function main() {
  const attachmentStyles = loadAttachmentStyles()
  const agEffects = loadAgEffects()

  // 精选风格：补系列字段
  const curatedStyles = styleSeeds.map((s) => ({
    ...s,
    series: '精选',
    sid: '',
    looksLike: '',
    suitableFor: '',
    promptFull: '',
    hasStill: false,
  }))

  const allStyles = [...curatedStyles, ...attachmentStyles]
  const allPrompts = [...promptSeeds, ...extraPromptSeeds, ...fyRecipePromptSeeds]
  const allEffects = [...effectSeeds, ...extraEffectSeeds, ...agEffects, ...fyRecipeEffectSeeds]

  // 幂等：清空后重灌（Generation 是用户数据，绝不在这里清空）
  await db.effect.deleteMany()
  await db.prompt.deleteMany()
  await db.style.deleteMany()

  const batchSize = 50
  for (let i = 0; i < allStyles.length; i += batchSize) {
    await db.style.createMany({ data: allStyles.slice(i, i + batchSize) })
  }
  for (let i = 0; i < allPrompts.length; i += batchSize) {
    await db.prompt.createMany({
      data: allPrompts.slice(i, i + batchSize).map((p) => ({
        ...p,
        copyCount: 0, // 真实计数从 0 开始，不伪造数据
      })),
    })
  }
  for (let i = 0; i < allEffects.length; i += batchSize) {
    await db.effect.createMany({ data: allEffects.slice(i, i + batchSize) })
  }

  console.log(
    `Seeded: ${allStyles.length} styles (${curatedStyles.length} curated + ${attachmentStyles.length} attachment), ${allPrompts.length} prompts, ${allEffects.length} effects (${agEffects.length} AG canvas + ${fyRecipeEffectSeeds.length} fy recipes)`
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
