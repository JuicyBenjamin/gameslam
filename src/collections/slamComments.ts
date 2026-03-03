import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { fetchSlamComments } from '~/server-functions/slamComments'
import { queryClient } from '~/lib/query-client'

export const slamCommentsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['slamComments'],
    queryFn: async () => {
      const data = await fetchSlamComments()
      return data
    },
    getKey: item => item.comment.id,
  }),
)
