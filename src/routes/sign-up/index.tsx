import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Auth } from '~/components/Auth'
import { supabaseBrowser as supabase } from '~/lib/supabase.client'

export const Route = createFileRoute('/sign-up/')({
  component: SignUpComponent,
})

function SignUpComponent() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      console.log('🚀 Sign-up attempt:', { email: data.email })

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (error) {
        console.log('❌ Sign-up failed:', error.message)
        throw new Error(error.message)
      }

      console.log('✅ Sign-up successful for:', data.email)
      return { success: true }
    },
    onSuccess: () => {
      console.log('🎉 Sign-up mutation success')
      // Refresh the page to update authentication state
      window.location.href = '/'
    },
    onError: error => {
      console.log('💥 Sign-up mutation error:', error)
    },
  })

  const handleSignUp = (data: { email: string; password: string }) => {
    console.log('📝 Sign-up form submitted with data:', data)
    mutation.mutate(data)
  }

  return (
    <Auth mode="signup" onSubmit={handleSignUp} isSubmitting={mutation.isPending} error={mutation.error?.message} />
  )
}
