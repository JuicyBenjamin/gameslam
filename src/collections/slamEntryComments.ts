import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { fetchSlamEntryComments } from '~/server-functions/slamEntryComments'
import { queryClient } from '~/lib/query-client'

export const slamEntryCommentsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['slamEntryComments'],
    queryFn: async () => {
      const data = await fetchSlamEntryComments()
      return data
    },
    getKey: item => item.comment.id,
  }),
)
