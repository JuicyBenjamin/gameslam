import { Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { safeParse } from 'valibot'
import { AuthSchema } from '@/schemas/auth'
import type { TAuthForm } from '@/schemas/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

interface IAuthProps {
  mode: 'login' | 'signup'
  onSubmit: (data: TAuthForm) => void
  isSubmitting: boolean
  error?: string
}

export const Auth = ({ mode, onSubmit, isSubmitting, error }: IAuthProps) => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = safeParse(AuthSchema, value)
        return result.success ? undefined : result.issues[0]?.message
      },
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
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
            {error != null && error !== '' && (
              <Alert variant="destructive">
                <AlertTriangle />
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}

            {/* Auth Form */}
            <form
              onSubmit={e => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
              className="space-y-4"
            >
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <form.Field
                    name="email"
                    validators={{
                      onChange: ({ value }) => {
                        if (value === '') return 'Email is required'
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                          return 'Please enter a valid email address'
                        }
                        return undefined
                      },
                    }}
                  >
                    {field => (
                      <>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={field.state.value}
                          onChange={e => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={field.state.meta.errors.length > 0}
                        />
                        <FieldError>{field.state.meta.errors}</FieldError>
                      </>
                    )}
                  </form.Field>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldContent>
                  <form.Field
                    name="password"
                    validators={{
                      onChange: ({ value }) => {
                        if (value === '') return 'Password is required'
                        if (value.length < 8) {
                          return 'Password must be at least 8 characters long'
                        }
                        return undefined
                      },
                    }}
                  >
                    {field => (
                      <>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={field.state.value}
                          onChange={e => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={field.state.meta.errors.length > 0}
                        />
                        <FieldError>{field.state.meta.errors}</FieldError>
                      </>
                    )}
                  </form.Field>
                </FieldContent>
              </Field>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : actionText}
              </Button>
            </form>

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
