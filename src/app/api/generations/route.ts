import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import type { Prisma } from '@prisma/client'

// 列表查询：瘦身 select（不带 output 大字段——列表 UI 只用标题/概述/风格/时间）
// 载入完整结果时走 GET /api/generations/[id]
const listSelect = {
  id: true,
  title: true,
  logline: true,
  framework: true,
  styleName: true,
  starred: true,
  ideaText: true,
  createdAt: true,
} satisfies Prisma.GenerationSelect

// 生成历史列表：支持关键词搜索（标题/概述/创意描述）与收藏过滤
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') ?? '').trim().slice(0, 100)
    const starred = searchParams.get('starred') === '1'
    const take = Math.min(Number(searchParams.get('take')) || 24, 60)

    const where: Prisma.GenerationWhereInput = {}
    if (starred) where.starred = true
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { logline: { contains: q } },
        { ideaText: { contains: q } },
        { styleName: { contains: q } },
      ]
    }

    const [generations, total] = await Promise.all([
      db.generation.findMany({
        where,
        orderBy: [{ starred: 'desc' }, { createdAt: 'desc' }],
        take,
        select: listSelect,
      }),
      db.generation.count({ where }),
    ])
    return NextResponse.json({ generations, total })
  } catch (err) {
    console.error('[api/generations GET]', err)
    return NextResponse.json({ generations: [], error: '加载失败' }, { status: 500 })
  }
}

// 切换收藏状态
export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const parsed = z
      .object({ id: z.number().int().positive(), starred: z.boolean() })
      .safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: '参数不合法（需要 id 与 starred）' }, { status: 400 })
    }
    const generation = await db.generation.update({
      where: { id: parsed.data.id },
      data: { starred: parsed.data.starred },
      select: { id: true, starred: true },
    })
    return NextResponse.json(generation)
  } catch (err) {
    // 记录不存在（Prisma P2025）→ 404；其余 → 500
    if ((err as { code?: string })?.code === 'P2025') {
      return NextResponse.json({ error: '记录不存在' }, { status: 404 })
    }
    console.error('[api/generations PATCH]', err)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}

// 删除一条历史
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = Number(searchParams.get('id'))
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: '缺少有效 id' }, { status: 400 })
    }
    await db.generation.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if ((err as { code?: string })?.code === 'P2025') {
      return NextResponse.json({ error: '记录不存在或已删除' }, { status: 404 })
    }
    console.error('[api/generations DELETE]', err)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
