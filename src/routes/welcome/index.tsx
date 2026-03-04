import { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { setupProfileFn, checkAuthForWelcomeFn } from '@/server-functions/users-manage'

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/9.x/pixel-art/svg?seed=gamer1',
  'https://api.dicebear.com/9.x/pixel-art/svg?seed=gamer2',
  'https://api.dicebear.com/9.x/pixel-art/svg?seed=gamer3',
  'https://api.dicebear.com/9.x/pixel-art/svg?seed=gamer4',
  'https://api.dicebear.com/9.x/pixel-art/svg?seed=gamer5',
  'https://api.dicebear.com/9.x/pixel-art/svg?seed=gamer6',
  'https://api.dicebear.com/9.x/pixel-art/svg?seed=gamer7',
  'https://api.dicebear.com/9.x/pixel-art/svg?seed=gamer8',
]

export const Route = createFileRoute('/welcome/')({
  component: WelcomePage,
  beforeLoad: () => checkAuthForWelcomeFn(),
})

function WelcomePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0])

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { name: string; avatarLink: string }) =>
      setupProfileFn({ data }),
    onSuccess: async (result) => {
      if (result.status === 'success') {
        toast.success('Welcome aboard!', { description: 'Your profile is all set.' })
        await queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        await queryClient.invalidateQueries({ queryKey: ['users'] })
        router.invalidate()
        await router.navigate({ to: '/' })
      } else {
        toast.error('Error', { description: result.message })
      }
    },
    onError: () => {
      toast.error('Error', { description: 'Something went wrong. Please try again.' })
    },
  })

  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      mutate({ name: value.name, avatarLink: selectedAvatar })
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Welcome to GameSlam!</CardTitle>
            <CardDescription>
              Choose a display name and avatar to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                <AvatarImage src={selectedAvatar} alt="Selected avatar" />
                <AvatarFallback className="text-2xl">?</AvatarFallback>
              </Avatar>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-3">Choose your avatar</p>
              <div className="grid grid-cols-4 gap-3">
                {AVATAR_OPTIONS.map(avatarUrl => (
                  <button
                    key={avatarUrl}
                    type="button"
                    onClick={() => setSelectedAvatar(avatarUrl)}
                    className={`rounded-full p-1 transition-all ${
                      selectedAvatar === avatarUrl
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                        : 'hover:ring-2 hover:ring-muted-foreground/30'
                    }`}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={avatarUrl} alt="Avatar option" />
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={event => {
                event.preventDefault()
                event.stopPropagation()
                form.handleSubmit()
              }}
              className="space-y-4"
            >
              <Field>
                <FieldLabel htmlFor="name">Display Name</FieldLabel>
                <FieldContent>
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) => {
                        if (value === '') return 'Display name is required'
                        if (value.length < 2) return 'Must be at least 2 characters'
                        if (value.length > 30) return 'Must be 30 characters or less'
                        return undefined
                      },
                    }}
                  >
                    {field => (
                      <>
                        <Input
                          id="name"
                          placeholder="Choose a display name"
                          value={field.state.value}
                          onChange={event => field.handleChange(event.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={field.state.meta.errors.length > 0}
                        />
                        <FieldError>{field.state.meta.errors}</FieldError>
                      </>
                    )}
                  </form.Field>
                </FieldContent>
              </Field>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Setting up...' : "Let's Go!"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
