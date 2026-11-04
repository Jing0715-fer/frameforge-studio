import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') ?? '全部'
    const q = (searchParams.get('q') ?? '').trim().toLowerCase()

    let effects = await db.effect.findMany({ orderBy: { id: 'asc' } })
    if (category !== '全部') effects = effects.filter((e) => e.category === category)
    if (q) {
      effects = effects.filter((e) =>
        `${e.name}${e.nameEn}${e.description}`.toLowerCase().includes(q)
      )
    }
    return NextResponse.json({ effects })
  } catch (err) {
    console.error('[api/effects]', err)
    return NextResponse.json({ effects: [], error: '加载失败' }, { status: 500 })
  }
}
