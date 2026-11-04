import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// 复制提示词时调用：复制数 +1
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const id = Number(body?.id)
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: '缺少有效 id' }, { status: 400 })
    }
    const prompt = await db.prompt.update({
      where: { id },
      data: { copyCount: { increment: 1 } },
    })
    return NextResponse.json({ copyCount: prompt.copyCount })
  } catch (err) {
    console.error('[api/prompts/copy]', err)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}
