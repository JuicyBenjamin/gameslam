import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { createArtistFn } from '@/server-functions/artists-manage'

export const ArtistsHeader = () => {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Artists
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Discover talented creators in our game development community
        </p>
      </div>
      <AddArtistDialog />
    </div>
  )
}

const AddArtistDialog = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { name: string; link: string }) =>
      createArtistFn({ data }),
    onSuccess: async (result) => {
      if (result.status === 'success') {
        toast.success('Artist added!')
        setIsOpen(false)
        await queryClient.invalidateQueries({ queryKey: ['artists'] })
        router.invalidate()
      } else {
        toast.error('Error', { description: result.message })
      }
    },
    onError: () => {
      toast.error('Error', { description: 'Failed to add artist.' })
    },
  })

  const form = useForm({
    defaultValues: {
      name: '',
      link: '',
    },
    onSubmit: async ({ value }) => {
      mutate(value)
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Add Artist
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Artist</DialogTitle>
          <DialogDescription>Add a new artist to the community.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={event => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <Field>
            <FieldLabel htmlFor="artist-name">Name</FieldLabel>
            <FieldContent>
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    if (value === '') return 'Artist name is required'
                    return undefined
                  },
                }}
              >
                {field => (
                  <>
                    <Input
                      id="artist-name"
                      placeholder="e.g. Kenney"
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

          <Field>
            <FieldLabel htmlFor="artist-link">Website / Profile Link</FieldLabel>
            <FieldContent>
              <form.Field
                name="link"
                validators={{
                  onChange: ({ value }) => {
                    if (value === '') return 'Link is required'
                    return undefined
                  },
                }}
              >
                {field => (
                  <>
                    <Input
                      id="artist-link"
                      type="url"
                      placeholder="https://kenney.nl"
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
            {isPending ? 'Adding...' : 'Add Artist'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
