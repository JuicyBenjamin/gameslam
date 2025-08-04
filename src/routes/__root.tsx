/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { DefaultCatchBoundary } from '../components/DefaultCatchBoundary'
import { NotFound } from '../components/NotFound'

import appCss from '@/styles/app.css?url'

import { seo } from '../utils/seo'
import { Footer } from '~/components/footer'
import { Header } from '~/components/header'

// TODO: Replace with proper Supabase client from our migrated utils
// import { getSupabaseServerClient } from './utils/supabase'

// TODO: Implement proper user fetching with our migrated Supabase setup
// const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
//   const supabase = getSupabaseServerClient()
//   const { data, error: _error } = await supabase.auth.getUser()

//   if (!data.user?.email) {
//     return null
//   }

//   return {
//     email: data.user.email,
//   }
// })

export const Route = createRootRoute({
  beforeLoad: async () => {
    // TODO: Replace with proper user fetching
    // const user = await fetchUser()
    const user = null

    return {
      user,
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'GameSlam - Game Development Challenges',
        description:
          'Join the GameSlam community and participate in game development challenges with other developers.',
      }),
    ],

    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: props => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { user } = Route.useRouteContext()

  return (
    <html className="h-full">
      <head>
        <HeadContent />
      </head>
      <body className="h-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-200">
        <Header />
        <main className="contaier flex min-h-[80vh] flex-col justify-start gap-4 ">{children}</main>
        <Footer />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
