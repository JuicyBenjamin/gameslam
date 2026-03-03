import { createServerFn } from '@tanstack/react-start'
import { db } from '@/server-functions/database'
import { users } from '@/db/schema/users'
import { slams } from '@/db/schema/slams'
import { slamEntries } from '@/db/schema/slamEntries'
import { eq, sql } from 'drizzle-orm'

export const getCurrentUserName = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const userData = await db.select().from(users).where(eq(users.id, data.userId)).limit(1)
    const user = userData[0]

    if (!user) {
      throw new Error('User not found in database')
    }

    return { name: user.name }
  })

export const fetchUserProfile = createServerFn({ method: 'GET' })
  .inputValidator((data: { userName: string }) => data)
  .handler(async ({ data }) => {
    const userData = await db.select().from(users).where(eq(users.name, data.userName)).limit(1)
    const user = userData[0]

    if (!user) {
      throw new Error('User not found')
    }

    const [userSlams, userEntries, userStats] = await Promise.all([
      db.select().from(slams).where(eq(slams.createdBy, user.id)),
      db.select().from(slamEntries).where(eq(slamEntries.userId, user.id)),
      db
        .select({
          totalSlams: sql<number>`count(distinct ${slams.id})`,
          totalEntries: sql<number>`count(distinct ${slamEntries.id})`,
        })
        .from(slams)
        .leftJoin(slamEntries, eq(slamEntries.slamId, slams.id))
        .where(eq(slams.createdBy, user.id)),
    ])

    return {
      user,
      slams: userSlams,
      entries: userEntries,
      stats: userStats[0] || { totalSlams: 0, totalEntries: 0 },
    }
  })
