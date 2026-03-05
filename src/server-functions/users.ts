import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma.server'

export const fetchUsers = createServerFn({ method: 'GET' }).handler(async () => {
  return prisma.user.findMany({ orderBy: { name: 'asc' } })
})
