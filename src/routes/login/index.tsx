import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Auth } from '@/components/Auth'
import { authClient } from '@/lib/auth-client'
import { redirectIfLoggedIn } from '@/server-functions/auth'

const LoginComponent = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })

      if (result.error != null) {
        throw new Error(result.error.message)
      }

      return result.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      router.invalidate()
      await router.navigate({ to: '/' })
    },
  })

  return (
    <Auth
      mode="login"
      onSubmit={data => mutate(data)}
      isSubmitting={isPending}
      error={error?.message}
    />
  )
}

export const Route = createFileRoute('/login/')({
  beforeLoad: () => redirectIfLoggedIn(),
  component: LoginComponent,
})
