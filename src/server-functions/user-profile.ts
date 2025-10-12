import { createServerFn } from '@tanstack/react-start'
import { supabase } from '~/lib/supabase.server'
import { db } from '~/server-functions/database'
import { users } from '~/db/schema/users'
import { slams } from '~/db/schema/slams'
import { slamEntries } from '~/db/schema/slamEntries'
import { eq, sql } from 'drizzle-orm'
import type { TUser } from '~/db/schema/users'

// Server function for getting current user from session
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async (ctx): Promise<{ user: TUser | null }> => {
    try {
      // Get Supabase client with proper cookie handling
      const supabaseClient = supabase()

      // Get user from session
      const {
        data: { user: authUser },
        error,
      } = await supabaseClient.auth.getUser()

      if (error || !authUser) {
        return { user: null }
      }

      // Get user from database using the auth user ID
      const userData = await db.select().from(users).where(eq(users.id, authUser.id)).limit(1)
      const user = userData.length > 0 ? userData[0] : null

      return { user }
    } catch (error) {
      console.error('Error getting current user:', error)
      return { user: null }
    }
  },
)

// Server function for getting current user's name
export const getCurrentUserName = createServerFn({ method: 'GET' }).handler(async ctx => {
  try {
    // Get the current user's ID from the request context
    const userId = (ctx.data as any)?.userId
    if (!userId) {
      throw new Error('User ID not provided')
    }

    console.log('🔍 Looking for userId in users table:', userId)

    // Get user by ID from the users table
    const userData = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    console.log('🔍 Database query result from users table:', userData)

    const user = userData.length > 0 ? userData[0] : null
    console.log('🔍 Found user in database:', user)

    if (!user) {
      console.log('🔍 No user found in database for userId:', userId)
      throw new Error('User not found in database')
    }

    console.log('🔍 Returning name from database:', user.name)
    return { name: user.name }
  } catch (error) {
    console.error('Error getting current user name from database:', error)
    throw error
  }
})

// Server function for fetching user profile
export const fetchUserProfile = createServerFn({ method: 'GET' }).handler(async ctx => {
  const userName = (ctx.data as any)?.userName || ''
  console.log('Fetching user profile on server for:', userName)

  try {
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
