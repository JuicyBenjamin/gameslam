import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase.server'
import { db } from '@/server-functions/database'
import { users } from '@/db/schema/users'
import { eq } from 'drizzle-orm'

export const getCurrentUser = createServerFn().handler(async () => {
  const supabaseClient = supabase()
  const { data } = await supabaseClient.auth.getUser()

  if (!data.user) {
    return null
  }

  const userData = await db.select().from(users).where(eq(users.id, data.user.id)).limit(1)

  if (!userData[0]) {
    // Auth user exists but no matching DB row — orphaned session.
    // Sign them out so they're not stuck in a broken limbo state.
    await supabaseClient.auth.signOut()
    return null
  }

  return userData[0]
})

export const redirectIfLoggedIn = createServerFn().handler(async () => {
  const user = await getCurrentUser()
  if (user) {
    throw redirect({ to: '/' })
  }
})
