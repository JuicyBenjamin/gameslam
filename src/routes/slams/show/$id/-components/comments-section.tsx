import { useState } from 'react'
import { useParams, useLoaderData, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { MessageSquare, Reply, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldError } from '@/components/ui/field'
import { slamEntriesCollection, slamEntryCommentsCollection } from '@/collections'
import {
  createEntryCommentFn,
  updateEntryCommentFn,
  deleteEntryCommentFn,
} from '@/server-functions/comments-manage'

export const CommentsSection = () => {
  const { id: slamId } = useParams({ from: '/slams/show/$id/' })
  const loaderData = useLoaderData({ from: '/slams/show/$id/' })
  const isLoggedIn = loaderData.user != null

  const { data: collectionEntries = [] } = useLiveQuery(query =>
    query
      .from({ entryItem: slamEntriesCollection })
      .where(({ entryItem }) => eq(entryItem.entry.slamId, slamId)),
  )

  const entryIds = collectionEntries.length > 0
    ? collectionEntries.map(entryItem => entryItem.entry.id)
    : loaderData.slam.entries.filter((entry: any) => entry !== null).map((entry: any) => entry.id)

  const { data: allComments = [] } = useLiveQuery(query =>
    query.from({ commentItem: slamEntryCommentsCollection }),
  )

  const slamComments = allComments.filter(
    commentItem =>
      entryIds.includes(commentItem.comment.slamEntryId) && !commentItem.comment.isDeleted,
  )

  const topLevelComments = slamComments.filter(
    commentItem => commentItem.comment.parentCommentId == null,
  )

  const getReplies = (parentId: string) =>
    slamComments.filter(commentItem => commentItem.comment.parentCommentId === parentId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({slamComments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoggedIn && entryIds.length > 0 && (
          <NewCommentForm slamEntryId={entryIds[0]} />
        )}

        {topLevelComments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}

        <div className="space-y-4">
          {topLevelComments.map(commentItem => (
            <CommentThread
              key={commentItem.comment.id}
              commentItem={commentItem}
              getReplies={getReplies}
              currentUserId={loaderData.user?.id}
              isLoggedIn={isLoggedIn}
              depth={0}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface INewCommentFormProps {
  slamEntryId: string
  parentCommentId?: string
  onSuccess?: () => void
  placeholder?: string
}

const NewCommentForm = ({
  slamEntryId,
  parentCommentId,
  onSuccess,
  placeholder = 'Share your thoughts...',
}: INewCommentFormProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (comment: string) =>
      createEntryCommentFn({
        data: { slamEntryId, comment, parentCommentId: parentCommentId ?? null },
      }),
    onSuccess: async (result) => {
      if (result.status === 'success') {
        form.reset()
        await queryClient.invalidateQueries({ queryKey: ['slamEntryComments'] })
        router.invalidate()
        onSuccess?.()
      } else {
        toast.error('Error', { description: result.message })
      }
    },
    onError: () => {
      toast.error('Error', { description: 'Failed to post comment.' })
    },
  })

  const form = useForm({
    defaultValues: {
      comment: '',
    },
    onSubmit: async ({ value }) => {
      mutate(value.comment)
    },
  })

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
      className="flex gap-3"
    >
      <Field className="flex-1">
        <FieldContent>
          <form.Field
            name="comment"
            validators={{
              onChange: ({ value }) => {
                if (value.trim() === '') return 'Comment cannot be empty'
                return undefined
              },
            }}
          >
            {field => (
              <>
                <Textarea
                  placeholder={placeholder}
                  value={field.state.value}
                  onChange={event => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  rows={2}
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
        size="sm"
        disabled={isPending}
        className="self-end"
      >
        {isPending ? '...' : 'Post'}
      </Button>
    </form>
  )
}

interface ICommentThreadProps {
  commentItem: any
  getReplies: (parentId: string) => Array<any>
  currentUserId: string | undefined
  isLoggedIn: boolean
  depth: number
}

const CommentThread = ({
  commentItem,
  getReplies,
  currentUserId,
  isLoggedIn,
  depth,
}: ICommentThreadProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const isAuthor = currentUserId != null && currentUserId === commentItem.author?.id
  const replies = getReplies(commentItem.comment.id)

  const { mutate: updateComment, isPending: isUpdating } = useMutation({
    mutationFn: (comment: string) =>
      updateEntryCommentFn({
        data: { commentId: commentItem.comment.id, comment },
      }),
    onSuccess: async (result) => {
      if (result.status === 'success') {
        setIsEditing(false)
        await queryClient.invalidateQueries({ queryKey: ['slamEntryComments'] })
        router.invalidate()
      } else {
        toast.error('Error', { description: result.message })
      }
    },
  })

  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: () =>
      deleteEntryCommentFn({ data: { commentId: commentItem.comment.id } }),
    onSuccess: async (result) => {
      if (result.status === 'success') {
        toast.success('Comment deleted')
        await queryClient.invalidateQueries({ queryKey: ['slamEntryComments'] })
        router.invalidate()
      } else {
        toast.error('Error', { description: result.message })
      }
    },
  })

  const createdAt = new Date(commentItem.comment.createdAt)
  const timeAgo = formatTimeAgo(createdAt)

  return (
    <div className={depth > 0 ? 'ml-8 border-l-2 border-muted pl-4' : ''}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={undefined} />
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {commentItem.author?.name?.charAt(0).toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{commentItem.author?.name || 'Unknown'}</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>

          {isEditing ? (
            <EditCommentForm
              initialContent={commentItem.comment.comment}
              isPending={isUpdating}
              onSave={comment => updateComment(comment)}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <p className="text-sm text-foreground mt-1">{commentItem.comment.comment}</p>
          )}

          {!isEditing && (
            <div className="flex items-center gap-2 mt-2">
              {isLoggedIn && depth < 2 && (
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setIsReplying(!isReplying)}>
                  <Reply className="mr-1 h-3 w-3" />
                  Reply
                </Button>
              )}
              {isAuthor && (
                <>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setIsEditing(true)}>
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                    onClick={() => deleteComment()}
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          )}

          {isReplying && (
            <div className="mt-3">
              <NewCommentForm
                slamEntryId={commentItem.comment.slamEntryId}
                parentCommentId={commentItem.comment.id}
                onSuccess={() => setIsReplying(false)}
                placeholder={`Reply to ${commentItem.author?.name || 'Unknown'}...`}
              />
            </div>
          )}
        </div>
      </div>

      {replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {replies.map((reply: any) => (
            <CommentThread
              key={reply.comment.id}
              commentItem={reply}
              getReplies={getReplies}
              currentUserId={currentUserId}
              isLoggedIn={isLoggedIn}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface IEditCommentFormProps {
  initialContent: string
  isPending: boolean
  onSave: (comment: string) => void
  onCancel: () => void
}

const EditCommentForm = ({ initialContent, isPending, onSave, onCancel }: IEditCommentFormProps) => {
  const form = useForm({
    defaultValues: {
      comment: initialContent,
    },
    onSubmit: async ({ value }) => {
      onSave(value.comment)
    },
  })

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
      className="mt-2 space-y-2"
    >
      <Field>
        <FieldContent>
          <form.Field
            name="comment"
            validators={{
              onChange: ({ value }) => {
                if (value.trim() === '') return 'Comment cannot be empty'
                return undefined
              },
            }}
          >
            {field => (
              <>
                <Textarea
                  value={field.state.value}
                  onChange={event => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  rows={2}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                <FieldError>{field.state.meta.errors}</FieldError>
              </>
            )}
          </form.Field>
        </FieldContent>
      </Field>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? '...' : 'Save'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
