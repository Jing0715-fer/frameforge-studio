import { PrismaClient } from '@prisma/client'
import { styleSeeds, promptSeeds, effectSeeds } from './seed-data'

const db = new PrismaClient()

async function main() {
  // 幂等：清空后重灌
  await db.generation.deleteMany()
  await db.effect.deleteMany()
  await db.prompt.deleteMany()
  await db.style.deleteMany()

  for (const s of styleSeeds) {
    await db.style.create({ data: s })
  }
  for (const p of promptSeeds) {
    await db.prompt.create({ data: { ...p, copyCount: Math.floor(Math.random() * 40) } })
  }
  for (const e of effectSeeds) {
    await db.effect.create({ data: e })
  }

  console.log(
    `Seeded: ${styleSeeds.length} styles, ${promptSeeds.length} prompts, ${effectSeeds.length} effects`
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
