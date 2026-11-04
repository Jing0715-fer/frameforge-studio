import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') ?? '全部'
    const q = (searchParams.get('q') ?? '').trim().toLowerCase()
    const sort = searchParams.get('sort') ?? 'latest'

    let prompts = await db.prompt.findMany({ orderBy: { id: 'asc' } })
    if (category !== '全部') prompts = prompts.filter((p) => p.category === category)
    if (q) {
      prompts = prompts.filter((p) =>
        `${p.title}${p.content}${p.tags}${p.useCase}`.toLowerCase().includes(q)
      )
    }
    if (sort === 'hot') prompts = [...prompts].sort((a, b) => b.copyCount - a.copyCount)
    return NextResponse.json({ prompts })
  } catch (err) {
    console.error('[api/prompts]', err)
    return NextResponse.json({ prompts: [], error: '加载失败' }, { status: 500 })
  }
}
