import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { fetchSlamEntryRatings } from '~/server-functions/slamEntryRatings'
import { queryClient } from '~/lib/query-client'

export const slamEntryRatingsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['slamEntryRatings'],
    queryFn: async () => {
      const data = await fetchSlamEntryRatings()
      return data
    },
    getKey: item => item.rating.id,
  }),
)
