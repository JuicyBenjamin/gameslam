// src/server/supabase.ts
import { getRequest } from '@tanstack/react-start/server'
import { createServerClient, type CookieMethodsServer } from '@supabase/ssr'
import { parse as parseCookieHeader, serialize as serializeCookieHeader, type SerializeOptions } from 'cookie'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}

export function supabase() {
  const request = getRequest()
  if (!request) throw new Error('supabase() must be called during a request')

  const responseHeaders = request.headers

  const cookies: CookieMethodsServer = {
    async getAll() {
      const rawCookieHeader = request.headers.get('cookie') ?? ''
      if (!rawCookieHeader) return []
      const parsedCookies = parseCookieHeader(rawCookieHeader)
      return Object.entries(parsedCookies).map(([name, value]) => ({
        name,
        value: String(value ?? ''),
      }))
    },

    setAll(cookiesToSet) {
      for (const cookieDescriptor of cookiesToSet) {
        const { name, value, options } = cookieDescriptor

        // Merge with sensible defaults for server cookies
        const mergedOptions: SerializeOptions = {
          path: '/',
          httpOnly: true,
          secure: true,
          ...options,
        }

        // Normalize SameSite for the `cookie` library (expects lowercase string)
        if (typeof mergedOptions.sameSite === 'string') {
          const sameSiteLower = mergedOptions.sameSite.toLowerCase()
          if (sameSiteLower === 'lax' || sameSiteLower === 'strict' || sameSiteLower === 'none') {
            mergedOptions.sameSite = sameSiteLower as SerializeOptions['sameSite']
          } else {
            delete mergedOptions.sameSite
          }
        }

        responseHeaders.append('set-cookie', serializeCookieHeader(name, String(value ?? ''), mergedOptions))
      }
    },
  }

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, { cookies })
}
