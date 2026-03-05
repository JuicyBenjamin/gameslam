import { PrismaClient } from '@/generated/prisma/client'

let prisma: PrismaClient

if (process.env.DIRECT_DATABASE_URL != null) {
  const { PrismaPg } = await import('@prisma/adapter-pg')
  const adapter = new PrismaPg({ connectionString: process.env.DIRECT_DATABASE_URL })
  prisma = new PrismaClient({ adapter })
} else {
  prisma = new PrismaClient()
}

export { prisma }
