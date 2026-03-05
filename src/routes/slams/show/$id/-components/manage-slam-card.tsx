import { useState } from 'react'
import { useLoaderData, useParams, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Pencil, Trash2, Settings } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { slamsCollection } from '@/collections'
import { updateSlamFn, deleteSlamFn } from '@/server-functions/slams-manage'

export const ManageSlamCard = () => {
  const { id: slamId } = useParams({ from: '/slams/show/$id/' })
  const loaderData = useLoaderData({ from: '/slams/show/$id/' })
  const router = useRouter()
  const queryClient = useQueryClient()

  const currentUserId = loaderData.user?.id
  const slamCreatorId = loaderData.slam.createdBy?.id

  const { data: slams = [] } = useLiveQuery(query =>
    query.from({ slamItem: slamsCollection }).where(({ slamItem }) => eq(slamItem.slam.id, slamId)),
  )

  const slam = slams[0]?.slam || loaderData.slam.slam

  const isOwner = currentUserId != null && currentUserId === slamCreatorId
  if (!isOwner) return null

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Manage Slam
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <EditSlamDialog slam={slam} slamId={slamId} queryClient={queryClient} router={router} />
        <DeleteSlamDialog slamId={slamId} queryClient={queryClient} router={router} />
      </CardContent>
    </Card>
  )
}

interface IEditSlamDialogProps {
  slam: { name: string; description: string }
  slamId: string
  queryClient: ReturnType<typeof useQueryClient>
  router: ReturnType<typeof useRouter>
}

const EditSlamDialog = ({ slam, slamId, queryClient, router }: IEditSlamDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      updateSlamFn({ data: { ...data, slamId } }),
    onSuccess: async (result) => {
      if (result.status === 'success') {
        toast.success('Slam updated!')
        setIsOpen(false)
        await queryClient.invalidateQueries({ queryKey: ['slams'] })
        router.invalidate()
      } else {
        toast.error('Error', { description: result.message })
      }
    },
    onError: () => {
      toast.error('Error', { description: 'Failed to update slam.' })
    },
  })

  const form = useForm({
    defaultValues: {
      name: slam.name,
      description: slam.description,
    },
    onSubmit: async ({ value }) => {
      mutate(value)
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant="outline" className="w-full" />}>
        <Pencil className="mr-2 h-4 w-4" />
        Edit Slam
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Slam</DialogTitle>
          <DialogDescription>Update your slam's name and description.</DialogDescription>
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
            <FieldLabel htmlFor="edit-name">Name</FieldLabel>
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
                      id="edit-name"
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
            <FieldLabel htmlFor="edit-description">Description</FieldLabel>
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
                      id="edit-description"
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

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface IDeleteSlamDialogProps {
  slamId: string
  queryClient: ReturnType<typeof useQueryClient>
  router: ReturnType<typeof useRouter>
}

const DeleteSlamDialog = ({ slamId, queryClient, router }: IDeleteSlamDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteSlamFn({ data: { slamId } }),
    onSuccess: async (result) => {
      if (result.status === 'success') {
        toast.success('Slam deleted')
        await queryClient.invalidateQueries({ queryKey: ['slams'] })
        router.invalidate()
        await router.navigate({ to: '/slams' })
      } else {
        toast.error('Error', { description: result.message })
      }
    },
    onError: () => {
      toast.error('Error', { description: 'Failed to delete slam.' })
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant="destructive" className="w-full" />}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Slam
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Slam</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this slam? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => mutate()} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
