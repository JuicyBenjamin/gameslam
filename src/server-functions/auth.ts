import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getSession } from '@/server-functions/auth.server'

export const getCurrentUser = createServerFn().handler(async () => {
  const session = await getSession()

  if (session == null) {
    return null
  }

  return session.user
})

export const redirectIfLoggedIn = createServerFn().handler(async () => {
  const session = await getSession()
  if (session != null) {
    throw redirect({ to: '/' })
  }
})
