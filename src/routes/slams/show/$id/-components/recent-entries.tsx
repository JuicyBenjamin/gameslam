import { useState } from 'react'
import { useParams, useLoaderData, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Trophy, ExternalLink, ThumbsUp, ThumbsDown, Star } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
import { slamEntriesCollection, slamEntryRatingsCollection } from '@/collections'
import { createEntryRatingFn } from '@/server-functions/ratings-manage'

export const RecentEntries = () => {
  const { id: slamId } = useParams({ from: '/slams/show/$id/' })
  const loaderData = useLoaderData({ from: '/slams/show/$id/' })
  const isLoggedIn = loaderData.user != null

  const { data: collectionEntries = [] } = useLiveQuery(query =>
    query
      .from({ entryItem: slamEntriesCollection })
      .where(({ entryItem }) => eq(entryItem.entry.slamId, slamId))
      .orderBy(({ entryItem }) => entryItem.entry.createdAt, 'desc'),
  )

  const { data: allRatings = [] } = useLiveQuery(query =>
    query.from({ ratingItem: slamEntryRatingsCollection }),
  )

  const entries = collectionEntries.length > 0
    ? collectionEntries.map(entryItem => ({ ...entryItem.entry, user: entryItem.user }))
    : loaderData.slam.entries

  const validEntries = entries.filter((entry: any) => entry !== null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Recent Entries
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {validEntries.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No entries yet. Be the first to join!
            </p>
          )}
          {validEntries.slice(0, 5).map((entry: any) => {
            const entryRatings = allRatings.filter(
              ratingItem => ratingItem.rating.slamEntryId === entry.id && !ratingItem.rating.isDeleted,
            )
            const recommendCount = entryRatings.filter(ratingItem => ratingItem.rating.isRecommended).length
            const currentUserRated = isLoggedIn && entryRatings.some(
              ratingItem => ratingItem.author?.id === loaderData.user?.id,
            )

            return (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{entry.name}</p>
                  <p className="text-sm text-muted-foreground">
                    by {entry.user?.name || 'Unknown User'}
                  </p>
                  {entryRatings.length > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <ThumbsUp className="h-3 w-3 text-primary" />
                      <span className="text-xs text-muted-foreground">
                        {recommendCount}/{entryRatings.length} recommend
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {isLoggedIn && !currentUserRated && (
                    <RateEntryDialog entryId={entry.id} entryName={entry.name} />
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <a href={entry.linkToEntry} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

interface IRateEntryDialogProps {
  entryId: string
  entryName: string
}

const RateEntryDialog = ({ entryId, entryName }: IRateEntryDialogProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [isRecommended, setIsRecommended] = useState<boolean | null>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { content: string }) =>
      createEntryRatingFn({
        data: { slamEntryId: entryId, isRecommended: isRecommended === true, content: data.content },
      }),
    onSuccess: async (result) => {
      if (result.status === 'success') {
        toast.success('Rating submitted!')
        setIsOpen(false)
        setIsRecommended(null)
        form.reset()
        await queryClient.invalidateQueries({ queryKey: ['slamEntryRatings'] })
        router.invalidate()
      } else {
        toast.error('Error', { description: result.message })
      }
    },
    onError: () => {
      toast.error('Error', { description: 'Failed to submit rating.' })
    },
  })

  const form = useForm({
    defaultValues: {
      content: '',
    },
    onSubmit: async ({ value }) => {
      mutate({ content: value.content })
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Rate this entry">
          <Star className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate Entry</DialogTitle>
          <DialogDescription>Share your thoughts on "{entryName}"</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={event => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div>
            <p className="text-sm font-medium mb-3">Do you recommend this entry?</p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={isRecommended === true ? 'default' : 'outline'}
                onClick={() => setIsRecommended(true)}
                className="flex-1"
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Recommend
              </Button>
              <Button
                type="button"
                variant={isRecommended === false ? 'destructive' : 'outline'}
                onClick={() => setIsRecommended(false)}
                className="flex-1"
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Not for me
              </Button>
            </div>
            {isRecommended == null && (
              <p className="text-sm text-muted-foreground mt-2">
                Please select a recommendation
              </p>
            )}
          </div>

          <Field>
            <FieldLabel htmlFor="rating-content">Your review</FieldLabel>
            <FieldContent>
              <form.Field
                name="content"
                validators={{
                  onChange: ({ value }) => {
                    if (value.trim() === '') return 'Review content is required'
                    return undefined
                  },
                }}
              >
                {field => (
                  <>
                    <Textarea
                      id="rating-content"
                      placeholder="What did you think about this entry?"
                      value={field.state.value}
                      onChange={event => field.handleChange(event.target.value)}
                      onBlur={field.handleBlur}
                      rows={3}
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    <FieldError>{field.state.meta.errors}</FieldError>
                  </>
                )}
              </form.Field>
            </FieldContent>
          </Field>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || isRecommended == null}
          >
            {isPending ? 'Submitting...' : 'Submit Rating'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
