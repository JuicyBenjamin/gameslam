import { createBrowserClient } from '@supabase/ssr'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anon) {
  // Fail fast once, instead of causing render loops inside hooks
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}

export const supabaseBrowser = createBrowserClient(url, anon)
