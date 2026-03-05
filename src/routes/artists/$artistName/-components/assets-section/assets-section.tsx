import { useState } from 'react'
import { useParams, useLoaderData, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { useForm } from '@tanstack/react-form'
import { Package, Plus } from 'lucide-react'
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

  const artistId = artists[0]?.artist.id || loaderData.artist.id
  const assetsList = artists[0]?.assets || loaderData.assets

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Assets</h2>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{assetsList.length} assets</Badge>
          <AddAssetDialog artistId={artistId} />
        </div>
      </div>

      {assetsList.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assetsList.map((asset: any) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No assets yet</h3>
          <p className="text-muted-foreground">This artist hasn't uploaded any assets yet.</p>
        </div>
      )}
    </section>
  )
}

interface IAddAssetDialogProps {
  artistId: string
}

const AddAssetDialog = ({ artistId }: IAddAssetDialogProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { name: string; link: string }) =>
      createAssetFn({ data: { ...data, artistId } }),
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
