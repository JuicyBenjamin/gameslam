import React from 'react'
import { Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { AuthSchema } from '~/schemas/auth'
import { parse, safeParse } from 'valibot'
import type { TAuthForm } from '~/schemas/auth'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { AlertTriangle } from 'lucide-react'

interface AuthProps {
  mode: 'login' | 'signup'
  onSubmit: (data: TAuthForm) => void
  isSubmitting: boolean
  error?: string
}

export function Auth({ mode, onSubmit, isSubmitting, error }: AuthProps) {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    // validators: {
    //   onSubmit: ({ value }) => {
    //     const result = safeParse(AuthSchema, value)
    //     return result.success ? undefined : result.issues[0]?.message
    //   }
    // },
    onSubmit: async ({ value }) => {
      console.log('🚀 TanStack form onSubmit callback triggered!')
      alert('Form submitted with: ' + JSON.stringify(value))
      console.log('Form submitted with:', value)
      // await onSubmit(value)
    },
  })

  const isLogin = mode === 'login'
  const actionText = isLogin ? "Let's Go!" : 'Join the Party!'
  const title = isLogin ? 'Ready to slam? 🎮' : 'Join the slam! 🚀'
  const subtitle = isLogin
    ? 'Jump back into your game dev adventures and crush some challenges!'
    : 'Start your game dev journey and become part of the most epic community!'
  const linkText = isLogin
    ? { text: 'New to the slam scene?', link: 'Join the party!', href: '/sign-up' }
    : { text: 'Already part of the crew?', link: 'Welcome back!', href: '/login' }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Main Auth Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">{title}</CardTitle>
            <CardDescription className="text-muted-foreground">{subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Server Error Display */}
            {error && (
              <div className="flex items-center gap-2 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {/* ULTRA SIMPLE TEST */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Testing form submission...</p>

              <form
                onSubmit={e => {
                  console.log('🔥 ULTRA SIMPLE FORM SUBMITTED!')
                  console.log('Event defaultPrevented before:', e.defaultPrevented)
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Event defaultPrevented after:', e.defaultPrevented)
                  alert('ULTRA SIMPLE FORM WORKS!')
                  return false
                }}
              >
                <form.Field name="email">{() => <input type="text" placeholder="test input" />}</form.Field>
                <input type="text" placeholder="test input" />
                <button onClick={form.handleSubmit} className="w-full bg-red-500 text-white p-2 rounded mt-2">
                  ULTRA SIMPLE SUBMIT
                </button>
              </form>

              <button
                onClick={e => {
                  console.log('🔥 BUTTON CLICKED!')
                  console.log('Button click event:', e)
                  e.preventDefault()
                  e.stopPropagation()
                  alert('BUTTON CLICK WORKS!')
                }}
                className="w-full bg-green-500 text-white p-2 rounded"
              >
                TEST BUTTON CLICK
              </button>
            </div>

            {/* Link to other auth page */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {linkText.text}{' '}
                <Link to={linkText.href} className="font-medium text-primary hover:underline">
                  {linkText.link}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
