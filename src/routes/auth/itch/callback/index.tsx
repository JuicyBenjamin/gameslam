import { useEffect, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { redirectIfLoggedIn } from '@/server-functions/auth'

interface IItchVerifyResponse {
  status: string
  isNewUser?: boolean
  message?: string
}

export const Route = createFileRoute('/auth/itch/callback/')({
  beforeLoad: () => redirectIfLoggedIn(),
  component: ItchCallbackPage,
})

function ItchCallbackPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const hashString = window.location.hash.slice(1)
    const params = new URLSearchParams(hashString)
    const accessToken = params.get('access_token')

    if (accessToken == null || accessToken === '') {
      setError('No access token received from itch.io. Please try again.')
      return
    }

    window.history.replaceState(null, '', window.location.pathname)

    const verifyToken = async () => {
      try {
        const response = await fetch('/api/auth/itch/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken }),
        })

        const result = (await response.json()) as IItchVerifyResponse

        if (result.status !== 'success') {
          setError(result.message ?? 'Authentication failed. Please try again.')
          return
        }

        await queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        router.invalidate()

        if (result.isNewUser === true) {
          await router.navigate({ to: '/welcome' })
        } else {
          await router.navigate({ to: '/' })
        }
      } catch {
        setError('Something went wrong. Please try again.')
      }
    }

    verifyToken()
  }, [queryClient, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {error != null ? 'Login Failed' : 'Signing you in...'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {error != null ? (
              <>
                <Alert variant="destructive">
                  <AlertTriangle />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
                <Button
                  onClick={() => router.navigate({ to: '/login' })}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </>
            ) : (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
