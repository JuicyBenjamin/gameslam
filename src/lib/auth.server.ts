import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { prisma } from '@/lib/prisma.server'

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: ['https://*.deno.dev', 'https://*.deno.net'],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      isVerified: {
        type: 'boolean',
        defaultValue: false,
        input: false,
      },
      itchId: {
        type: 'number',
        required: false,
        input: false,
      },
      itchUsername: {
        type: 'string',
        required: false,
        input: false,
      },
    },
  },
  plugins: [tanstackStartCookies()],
})
