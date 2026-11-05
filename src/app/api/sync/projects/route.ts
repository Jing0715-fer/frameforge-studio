import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// 音画对齐项目列表（不带大字段；载入单条时按 id 拉全文）
export async function GET() {
  try {
    const rows = await db.syncProject.findMany({
      orderBy: { createdAt: 'desc' },
      take: 40,
      select: { id: true, songName: true, duration: true, bpm: true, board: true, result: true, createdAt: true },
    })
    const projects = rows.map((r) => {
      let unitCount = 0
      let shotCount = 0
      try {
        const board = JSON.parse(r.board) as { units?: { shots?: unknown[] }[] }
        unitCount = board.units?.length ?? 0
        shotCount = board.units?.reduce((s, u) => s + (u.shots?.length ?? 0), 0) ?? 0
      } catch {
        /* 计数失败显示 0 */
      }
      return {
        id: r.id,
        songName: r.songName,
        duration: r.duration,
        bpm: r.bpm,
        unitCount,
        shotCount,
        createdAt: r.createdAt,
      }
    })
    return NextResponse.json({ projects })
  } catch (err) {
    console.error('[api/sync/projects GET]', err)
    return NextResponse.json({ error: '历史加载失败' }, { status: 500 })
  }
}
