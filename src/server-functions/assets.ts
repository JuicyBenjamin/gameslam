import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma.server'

export const fetchAssets = createServerFn({ method: 'GET' }).handler(async () => {
  return prisma.asset.findMany({ orderBy: { name: 'asc' } })
})
