import { getRequest } from '@tanstack/react-start/server'
import { makeSupabaseServerClient } from '~/lib/supabase.server'

// Regular function to create Supabase client with proper cookie handling
export async function getSupabaseServerClient() {
  const request = getRequest()

  // Parse cookies from the request headers
  const cookieHeader = request.headers.get('cookie')
  const cookies = cookieHeader
    ? Object.fromEntries(
        cookieHeader.split('; ').map(cookie => {
          const [name, value] = cookie.split('=')
          return [name, decodeURIComponent(value || '')]
        }),
      )
    : {}

  return makeSupabaseServerClient({
    get: (key: string) => cookies[key],
    set: (key: string, value: string) => {
      // TanStack Start v1 handles setting cookies automatically
      console.log(`Setting cookie: ${key}=${value}`)
    },
    remove: (key: string) => {
      console.log(`Removing cookie: ${key}`)
    },
  })
}
