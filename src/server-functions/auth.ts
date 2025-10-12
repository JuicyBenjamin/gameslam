import { createServerFn } from '@tanstack/react-start'
import { supabase } from '~/lib/supabase.server'
import { db } from '~/server-functions/database'
import { users } from '~/db/schema/users'
import { eq } from 'drizzle-orm'

export const getCurrentUser = createServerFn().handler(async () => {
  const supabaseClient = supabase()
  const { data } = await supabaseClient.auth.getUser()

  if (!data.user) {
    return null
  }

  // Fetch the full user data from the database using the auth user ID
  const userData = await db.select().from(users).where(eq(users.id, data.user.id)).limit(1)
  const user = userData.length > 0 ? userData[0] : null

  return user
})

export const redirectIfLoggedIn = createServerFn().handler(async () => {
  const supabaseClient = supabase()
  const { data } = await supabaseClient.auth.getUser()
  if (data.user) {
    // TODO: Use TanStack Router redirect
    throw new Error('Redirect to /')
  }
})
