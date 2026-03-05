import { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { useLiveQuery } from '@tanstack/react-db'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ButtonLink } from '@/components/ui/button-link'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { redirect } from '@tanstack/react-router'
import { getCurrentUser } from '@/loaders/auth'
import { createSlamFn } from '@/server-functions/slams-create'
import { artistsCollection } from '@/collections'

export const Route = createFileRoute('/slams/create/')({
  component: CreateSlamPage,
  beforeLoad: async () => {
    const user = await getCurrentUser()
    if (user == null) {
      throw redirect({ to: '/login' })
    }
  },
  loader: async () => {
    const user = await getCurrentUser()
    return { user: user! }
  },
})

function CreateSlamPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: artistItems = [] } = useLiveQuery(query =>
    query.from({ artistItem: artistsCollection }),
  )

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { name: string; description: string; artistId: string; assetId: string }) =>
      createSlamFn({ data }),
    onSuccess: async (result) => {
      if (result.status === 'success') {
        toast.success('Slam created!', { description: 'Your new slam is ready to go.' })
        await queryClient.invalidateQueries({ queryKey: ['slams'] })
        router.invalidate()
        await router.navigate({ to: '/slams/show/$id', params: { id: result.slamId } })
      } else {
        toast.error('Error', { description: result.message })
      }
    },
    onError: () => {
      toast.error('Error', { description: 'Failed to create slam. Please try again.' })
    },
  })

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      artistId: '',
      assetId: '',
    },
    onSubmit: async ({ value }) => {
      mutate(value)
    },
  })

  const [selectedArtistId, setSelectedArtistId] = useState('')
  const selectedArtist = artistItems.find(item => item.artist.id === selectedArtistId)
  const availableAssets = selectedArtist?.assets ?? []

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <ButtonLink to="/slams" variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Slams
          </ButtonLink>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create a Slam</CardTitle>
            <CardDescription>
              Set up a new game development challenge for the community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={event => {
                event.preventDefault()
                event.stopPropagation()
                form.handleSubmit()
              }}
              className="space-y-6"
            >
              <Field>
                <FieldLabel htmlFor="name">Slam Name</FieldLabel>
                <FieldContent>
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) => {
                        if (value === '') return 'Slam name is required'
                        return undefined
                      },
                    }}
                  >
                    {field => (
                      <>
                        <Input
                          id="name"
                          placeholder="e.g. 48-Hour Pixel Art Challenge"
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
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <FieldContent>
                  <form.Field
                    name="description"
                    validators={{
                      onChange: ({ value }) => {
                        if (value === '') return 'Description is required'
                        return undefined
                      },
                    }}
                  >
                    {field => (
                      <>
                        <Textarea
                          id="description"
                          placeholder="Describe the challenge, rules, and what participants should create..."
                          rows={4}
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
                <FieldLabel htmlFor="artistId">Artist</FieldLabel>
                <FieldContent>
                  <form.Field
                    name="artistId"
                    validators={{
                      onChange: ({ value }) => {
                        if (value === '') return 'Please select an artist'
                        return undefined
                      },
                    }}
                  >
                    {field => (
                      <>
                        <Select
                          value={field.state.value === '' ? undefined : field.state.value}
                          onValueChange={(value) => {
                            field.handleChange(value ?? '')
                            setSelectedArtistId(value ?? '')
                            form.setFieldValue('assetId', '')
                          }}
                        >
                          <SelectTrigger
                            id="artistId"
                            className="w-full"
                            onBlur={field.handleBlur}
                            aria-invalid={field.state.meta.errors.length > 0}
                          >
                            <SelectValue placeholder="Select an artist..." />
                          </SelectTrigger>
                          <SelectContent>
                            {artistItems.map(item => (
                              <SelectItem key={item.artist.id} value={item.artist.id}>
                                {item.artist.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError>{field.state.meta.errors}</FieldError>
                      </>
                    )}
                  </form.Field>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="assetId">Asset</FieldLabel>
                <FieldContent>
                  <form.Field
                    name="assetId"
                    validators={{
                      onChange: ({ value }) => {
                        if (value === '') return 'Please select an asset'
                        return undefined
                      },
                    }}
                  >
                    {field => (
                      <>
                        <Select
                          value={field.state.value === '' ? undefined : field.state.value}
                          onValueChange={(value) => field.handleChange(value ?? '')}
                          disabled={selectedArtistId === ''}
                        >
                          <SelectTrigger
                            id="assetId"
                            className="w-full"
                            onBlur={field.handleBlur}
                            aria-invalid={field.state.meta.errors.length > 0}
                          >
                            <SelectValue
                              placeholder={
                                selectedArtistId === ''
                                  ? 'Select an artist first...'
                                  : 'Select an asset...'
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {availableAssets.map(asset => (
                              <SelectItem key={asset.id} value={asset.id}>
                                {asset.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError>{field.state.meta.errors}</FieldError>
                      </>
                    )}
                  </form.Field>
                </FieldContent>
              </Field>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Slam'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
