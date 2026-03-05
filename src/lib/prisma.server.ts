import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool(
  process.env.DIRECT_DATABASE_URL != null
    ? { connectionString: process.env.DIRECT_DATABASE_URL }
    : undefined,
)

const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter })
