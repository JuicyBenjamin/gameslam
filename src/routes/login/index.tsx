import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { redirectIfLoggedIn } from '@/server-functions/auth'
import { fetchItchOAuthUrl } from '@/server-functions/itch-auth.functions'

export const Route = createFileRoute('/login/')({
  beforeLoad: () => redirectIfLoggedIn(),
  component: LoginPage,
})

function LoginPage() {
  const { data: oauthUrl, isLoading } = useQuery({
    queryKey: ['itchOAuthUrl'],
    queryFn: () => fetchItchOAuthUrl(),
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Welcome to GameSlam</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in with your itch.io account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              size="lg"
              disabled={isLoading || oauthUrl == null}
              onClick={() => {
                if (oauthUrl != null) {
                  window.location.href = oauthUrl
                }
              }}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ItchIcon className="mr-2 h-5 w-5" />
              )}
              Sign in with itch.io
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const ItchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 245.371 220.736" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M31.99 1.365C21.287 7.72.2 31.945 0 38.298v10.516C0 62.144 12.46 73.86 23.773 73.86c13.584 0 24.902-11.258 24.903-24.62 0 13.362 10.93 24.62 24.515 24.62 13.586 0 23.722-11.258 23.722-24.62 0 13.362 11.715 24.62 25.3 24.62 13.585 0 25.3-11.258 25.3-24.62 0 13.362 10.136 24.62 23.722 24.62 13.584 0 24.515-11.258 24.515-24.62 0 13.362 11.32 24.62 24.903 24.62 11.313 0 23.773-11.714 23.773-25.046V38.298c-.2-6.354-21.287-30.58-31.988-36.933C180.118.197 157.056-.005 122.685 0 88.316-.005 65.253.197 31.99 1.365zm65.194 66.217a28.025 28.025 0 0 1-4.78 6.155c-5.128 5.014-12.157 8.122-19.906 8.122a28.482 28.482 0 0 1-19.948-8.126c-1.858-1.82-3.27-3.766-4.563-6.032l-.006.004c-1.292 2.27-3.092 4.215-4.954 6.037a28.5 28.5 0 0 1-19.948 8.12c-.934 0-1.906-.258-2.692-.528-1.092 11.372-1.553 22.24-1.716 30.164l-.002.045c-.02 4.024-.04 7.333-.06 11.93.21 23.86-2.363 77.334 10.52 90.473 19.964 4.655 56.7 6.775 93.555 6.788h.006c36.854-.013 73.59-2.133 93.554-6.788 12.883-13.14 10.31-66.613 10.52-90.474-.022-4.596-.04-7.905-.06-11.93l-.003-.044c-.162-7.926-.623-18.793-1.715-30.165-.786.27-1.757.528-2.692.528a28.5 28.5 0 0 1-19.948-8.12c-1.862-1.822-3.662-3.766-4.955-6.037l-.006-.004c-1.294 2.266-2.705 4.213-4.563 6.032a28.48 28.48 0 0 1-19.947 8.126c-7.748 0-14.778-3.108-19.906-8.122a28.025 28.025 0 0 1-4.78-6.155 27.99 27.99 0 0 1-4.736 6.155 28.49 28.49 0 0 1-19.95 8.122c-7.748 0-14.778-3.108-19.906-8.122a27.99 27.99 0 0 1-4.736-6.155zm-20.486 26.49l-.002.01h.015c8.113.017 15.32 0 24.25 9.746 7.028-.737 14.372-1.105 21.722-1.094h.006c7.35-.01 14.694.357 21.723 1.094 8.93-9.747 16.137-9.73 24.25-9.746h.014l-.002-.01c14.652 0 30.172 10.22 30.172 26.2 0 11.8-6.473 19.512-12.478 30.676-6.2 11.522-12.285 24.09-12.285 38.03 0 2.154-.4 8.872-9.752 13.15-7.597 3.075-18.385 4.885-32.036 5.572h-.008c-1.494.06-2.986.14-4.473.14h-.006c-1.487 0-2.98-.08-4.473-.14h-.008c-13.65-.687-24.44-2.497-32.036-5.572-9.35-4.278-9.75-10.996-9.75-13.15 0-13.94-6.086-26.508-12.286-38.03-6.005-11.164-12.478-18.876-12.478-30.676 0-15.98 15.52-26.2 30.172-26.2zm42.61 22.593c-9.833 0-12.593 7.222-12.593 13.61v.003c0 4.15 0 6.32 3.2 10.87 3.2 4.55 7.39 4.982 9.393 4.982s6.193-.43 9.392-4.982c3.2-4.55 3.2-6.72 3.2-10.87v-.003c0-6.388-2.76-13.61-12.593-13.61z"
      fill="currentColor"
    />
  </svg>
)
