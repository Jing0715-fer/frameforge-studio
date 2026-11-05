import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// 按 id 取单条生成记录的完整内容（载入历史时调用，列表接口不传 output 大字段）
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: raw } = await params
    const id = Number(raw)
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: '缺少有效 id' }, { status: 400 })
    }
    const generation = await db.generation.findUnique({ where: { id } })
    if (!generation) {
      return NextResponse.json({ error: '记录不存在' }, { status: 404 })
    }
    return NextResponse.json({ generation })
  } catch (err) {
    console.error('[api/generations/[id] GET]', err)
    return NextResponse.json({ error: '加载失败' }, { status: 500 })
  }
}
