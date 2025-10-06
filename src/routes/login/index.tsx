import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Auth } from '~/components/Auth'
import { supabaseBrowser as supabase } from '~/lib/supabase.client'

export const Route = createFileRoute('/login/')({
  component: LoginComponent,
})

function LoginComponent() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      console.log('🚀 Login attempt:', { email: data.email })

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        console.log('❌ Login failed:', error.message)
        throw new Error(error.message)
      }

      console.log('✅ Login successful for:', data.email)
      return { success: true }
    },
    onSuccess: () => {
      console.log('🎉 Login mutation success')
      // Refresh the page to update authentication state
      window.location.href = '/'
    },
    onError: error => {
      console.log('💥 Login mutation error:', error)
    },
  })

  const handleLogin = (data: { email: string; password: string }) => {
    console.log('📝 Form submitted with data:', data)
    mutation.mutate(data)
  }

  return <Auth mode="login" onSubmit={handleLogin} isSubmitting={mutation.isPending} error={mutation.error?.message} />
}
