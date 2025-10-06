import { createServerFn } from '@tanstack/react-start'

// Server function for fetching user profile
export const fetchUserProfile = createServerFn({ method: 'GET' }).handler(async ctx => {
  const userName = (ctx.data as any)?.userName || ''
  console.log('Fetching user profile on server for:', userName)

  try {
    // Import server-side dependencies only inside the server function
    const { db } = await import('~/server-functions/database')
    const { users, slams, slamEntries } = await import('~/db/server-only')
    const { eq, sql } = await import('drizzle-orm')

    // Get user by name
    const userData = await db.select().from(users).where(eq(users.name, userName)).limit(1)
    const user = userData.length > 0 ? userData[0] : null

    if (!user) {
      throw new Error('User not found')
    }

    // Get user's slams
    const userSlams = await db.select().from(slams).where(eq(slams.createdBy, user.id))

    // Get user's slam entries
    const userEntries = await db.select().from(slamEntries).where(eq(slamEntries.userId, user.id))

    // Get user's slam participation stats
    const userStats = await db
      .select({
        totalSlams: sql<number>`count(distinct ${slams.id})`,
        totalEntries: sql<number>`count(distinct ${slamEntries.id})`,
      })
      .from(slams)
      .leftJoin(slamEntries, eq(slamEntries.slamId, slams.id))
      .where(eq(slams.createdBy, user.id))

    const result = {
      user,
      slams: userSlams,
      entries: userEntries,
      stats: userStats[0] || { totalSlams: 0, totalEntries: 0 },
    }

    return result
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
})
