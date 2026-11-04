import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') ?? '全部'
    const q = (searchParams.get('q') ?? '').trim().toLowerCase()

    let styles = await db.style.findMany({ orderBy: { id: 'asc' } })
    if (category !== '全部') styles = styles.filter((s) => s.category === category)
    if (q) {
      styles = styles.filter((s) =>
        `${s.name}${s.nameEn}${s.tags}${s.description}`.toLowerCase().includes(q)
      )
    }
    return NextResponse.json({ styles })
  } catch (err) {
    console.error('[api/styles]', err)
    return NextResponse.json({ styles: [], error: '加载失败' }, { status: 500 })
  }
}
