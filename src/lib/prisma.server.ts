import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL!,
  max: 1,
  idleTimeoutMillis: 1,
})

export const prisma = new PrismaClient({ adapter })
