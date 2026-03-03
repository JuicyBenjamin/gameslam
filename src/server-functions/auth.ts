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
  return userData[0] ?? null
})

export const redirectIfLoggedIn = createServerFn().handler(async () => {
  const supabaseClient = supabase()
  const { data } = await supabaseClient.auth.getUser()
  if (data.user) {
    throw redirect({ to: '/' })
  }
})
