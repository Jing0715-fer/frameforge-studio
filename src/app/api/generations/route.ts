import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// 生成历史列表
export async function GET() {
  try {
    const generations = await db.generation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 24,
    })
    return NextResponse.json({ generations })
  } catch (err) {
    console.error('[api/generations GET]', err)
    return NextResponse.json({ generations: [], error: '加载失败' }, { status: 500 })
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
    console.error('[api/generations DELETE]', err)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
