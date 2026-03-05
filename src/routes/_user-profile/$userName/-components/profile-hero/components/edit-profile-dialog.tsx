import { useState } from 'react'
import { useLoaderData, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { updateProfileFn } from '@/server-functions/users-manage'

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

export const EditProfileDialog = () => {
  const loaderData = useLoaderData({ from: '/_user-profile/$userName/' })
  const router = useRouter()
  const queryClient = useQueryClient()

  const currentUser = loaderData.currentUser
  const profileUser = loaderData.user

  const isOwnProfile = currentUser != null && profileUser != null && currentUser.id === profileUser.id
  if (!isOwnProfile) return null

  return <EditProfileDialogInner user={profileUser} queryClient={queryClient} router={router} />
}

interface IEditProfileDialogInnerProps {
  user: { name: string; avatarLink: string }
  queryClient: ReturnType<typeof useQueryClient>
  router: ReturnType<typeof useRouter>
}

const EditProfileDialogInner = ({ user, queryClient, router }: IEditProfileDialogInnerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarLink)

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { name: string; avatarLink: string }) =>
      updateProfileFn({ data }),
    onSuccess: async (result) => {
      if (result.status === 'success') {
        toast.success('Profile updated!')
        setIsOpen(false)
        await queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        await queryClient.invalidateQueries({ queryKey: ['users'] })
        router.invalidate()
      } else {
        toast.error('Error', { description: result.message })
      }
    },
    onError: () => {
      toast.error('Error', { description: 'Failed to update profile.' })
    },
  })

  const form = useForm({
    defaultValues: {
      name: user.name,
    },
    onSubmit: async ({ value }) => {
      mutate({ name: value.name, avatarLink: selectedAvatar })
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Pencil className="mr-2 h-3 w-3" />
        Edit Profile
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your display name and avatar.</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          <Avatar className="h-20 w-20 ring-4 ring-primary/20">
            <AvatarImage src={selectedAvatar} alt="Selected avatar" />
            <AvatarFallback className="text-xl">?</AvatarFallback>
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
                <Avatar className="h-10 w-10">
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
            <FieldLabel htmlFor="edit-profile-name">Display Name</FieldLabel>
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
                      id="edit-profile-name"
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
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
