import { useState } from 'react'
import { useParams, useLoaderData, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { useForm } from '@tanstack/react-form'
import { Package, Plus } from 'lucide-react'
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
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
import { artistsCollection } from '@/collections'
import { createAssetFn } from '@/server-functions/artists-manage'
import { AssetCard } from './components/asset-card'

export const AssetsSection = () => {
  const { artistName } = useParams({ from: '/artists/$artistName/' })
  const loaderData = useLoaderData({ from: '/artists/$artistName/' })

  const { data: artists = [] } = useLiveQuery(query =>
    query.from({ artistItem: artistsCollection }).where(({ artistItem }) => eq(artistItem.artist.name, artistName)),
  )

  const artist = artists[0]?.artist || loaderData.artist
  const assetsList = artists[0]?.assets || loaderData.assets

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Assets</h2>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{assetsList.length} assets</Badge>
          <AddAssetDialog artistName={artist.name} artistLink={artist.link} />
        </div>
      </div>

      {assetsList.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assetsList.map((asset: any) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyMedia variant="icon">
            <Package />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No assets yet</EmptyTitle>
            <EmptyDescription>This artist hasn't uploaded any assets yet.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  )
}

interface IAddAssetDialogProps {
  artistName: string
  artistLink: string
}

const AddAssetDialog = ({ artistName, artistLink }: IAddAssetDialogProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { name: string; link: string }) =>
      createAssetFn({ data: { ...data, artistName, artistLink } }),
    onSuccess: async (result) => {
      if (result.status === 'success') {
        toast.success('Asset added!')
        setIsOpen(false)
        await queryClient.invalidateQueries({ queryKey: ['artists'] })
        await queryClient.invalidateQueries({ queryKey: ['assets'] })
        router.invalidate()
      } else {
        toast.error('Error', { description: result.message })
      }
    },
    onError: () => {
      toast.error('Error', { description: 'Failed to add asset.' })
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
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="mr-2 h-3 w-3" />
        Add Asset
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Asset</DialogTitle>
          <DialogDescription>Add a new asset for this artist.</DialogDescription>
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
            <FieldLabel htmlFor="asset-name">Name</FieldLabel>
            <FieldContent>
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    if (value === '') return 'Asset name is required'
                    return undefined
                  },
                }}
              >
                {field => (
                  <>
                    <Input
                      id="asset-name"
                      placeholder="e.g. Platformer Pack"
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
            <FieldLabel htmlFor="asset-link">Asset Link</FieldLabel>
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
                      id="asset-link"
                      type="url"
                      placeholder="https://kenney.nl/assets/platformer-pack"
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
            {isPending ? 'Adding...' : 'Add Asset'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
