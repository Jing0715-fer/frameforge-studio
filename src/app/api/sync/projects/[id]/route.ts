import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// 单条音画对齐项目：完整载入（回填工作台）与删除
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: raw } = await params
    const id = Number(raw)
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: '缺少有效 id' }, { status: 400 })
    }
    const row = await db.syncProject.findUnique({ where: { id } })
    if (!row) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    }
    let analysis = null
    let board = null
    let result = null
    try {
      analysis = JSON.parse(row.analysis)
    } catch {
      /* 历史数据损坏时置空 */
    }
    try {
      board = JSON.parse(row.board)
    } catch {
      /* 同上 */
    }
    try {
      result = JSON.parse(row.result)
    } catch {
      /* 同上 */
    }
    if (!analysis || !board || !result) {
      return NextResponse.json({ error: '项目数据损坏' }, { status: 422 })
    }
    return NextResponse.json({
      project: {
        id: row.id,
        songName: row.songName,
        lyrics: row.lyrics,
        analysis,
        board,
        result,
        createdAt: row.createdAt,
      },
    })
  } catch (err) {
    console.error('[api/sync/projects/[id] GET]', err)
    return NextResponse.json({ error: '载入失败' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: raw } = await params
    const id = Number(raw)
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: '缺少有效 id' }, { status: 400 })
    }
    await db.syncProject.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: '删除失败（项目可能不存在）' }, { status: 500 })
  }
}
