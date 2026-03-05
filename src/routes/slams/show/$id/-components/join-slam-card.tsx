import { useState } from 'react'
import { useLoaderData, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { Plus, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonLink } from '@/components/ui/button-link'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { toast } from 'sonner'
import { joinSlamFn } from '@/server-functions/slams-show'

export const JoinSlamCard = () => {
  const loaderData = useLoaderData({ from: '/slams/show/$id/' })
  const isLoggedIn = loaderData.user != null
  const slamId = loaderData.slam.slam.id

  const router = useRouter()
  const queryClient = useQueryClient()

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

  const { mutate: joinSlam, isPending } = useMutation({
    mutationFn: (itchIoLink: string) =>
      joinSlamFn({ data: { itchIoLink, slamId } }),
    onSuccess: async (result) => {
      if (result.status === 'success') {
        toast.success('Success!', {
          description: 'Your entry has been submitted successfully.',
        })
        setIsJoinModalOpen(false)
        form.reset()
        await queryClient.invalidateQueries({ queryKey: ['slamEntries'] })
        await queryClient.invalidateQueries({ queryKey: ['slams'] })
        router.invalidate()
      } else {
        toast.error('Error', {
          description: result.message || 'Failed to submit entry. Please try again.',
        })
      }
    },
    onError: () => {
      toast.error('Error', {
        description: 'Failed to submit entry. Please try again.',
      })
    },
  })

  const form = useForm({
    defaultValues: {
      itchIoLink: '',
    },
    onSubmit: async ({ value }) => {
      joinSlam(value.itchIoLink)
    },
  })

  return (
    <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
      <CardContent className="p-6 text-center">
        <Trophy className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-xl font-bold mb-4">Join the Slam</h3>
        <p className="mb-6 text-primary-foreground/90">
          Ready to showcase your skills? Join this game slam and compete with other talented creators.
          {!isLoggedIn && (
            <span className="block mt-2 text-sm">You'll need to sign up first to participate!</span>
          )}
        </p>

        {isLoggedIn ? (
          <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
            <DialogTrigger render={<Button size="lg" className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90" />}>
              <Plus className="mr-2 h-4 w-4" />
              Join Slam
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Slam</DialogTitle>
                <DialogDescription>
                  Submit your itch.io game entry to participate in this slam.
                </DialogDescription>
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
                  <FieldLabel htmlFor="itchIoLink">Itch.io Entry Link</FieldLabel>
                  <FieldContent>
                    <form.Field
                      name="itchIoLink"
                      validators={{
                        onChange: ({ value }) => {
                          if (value === '') return 'Itch.io link is required'
                          if (!value.includes('itch.io')) return 'Must be an itch.io URL'
                          return undefined
                        },
                      }}
                    >
                      {field => (
                        <>
                          <Input
                            id="itchIoLink"
                            type="url"
                            placeholder="https://example.itch.io/game"
                            value={field.state.value}
                            onChange={event => field.handleChange(event.target.value)}
                            onBlur={field.handleBlur}
                            aria-invalid={field.state.meta.errors.length > 0}
                          />
                          <FieldError>{field.state.meta.errors}</FieldError>
                          <p className="text-sm text-muted-foreground">
                            Paste the URL of your itch.io game entry
                          </p>
                        </>
                      )}
                    </form.Field>
                  </FieldContent>
                </Field>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? 'Submitting...' : 'Submit Entry'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          <ButtonLink
            to="/sign-up"
            size="lg"
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Sign Up to Join
          </ButtonLink>
        )}
      </CardContent>
    </Card>
  )
}
