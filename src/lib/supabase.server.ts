import { createServerClient, type CookieOptions } from '@supabase/ssr'

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
const anon = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY

export function makeSupabaseServerClient(cookies: {
  get: (k: string) => string | undefined
  set: (k: string, v: string, o: CookieOptions) => void
  remove: (k: string, o: CookieOptions) => void
}) {
  if (!url || !anon) throw new Error('Missing SUPABASE_URL/ANON_KEY (or VITE_*) on server')
  return createServerClient(url, anon, { cookies })
}
