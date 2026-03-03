import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { fetchSlamRatings } from '~/server-functions/slamRatings'
import { queryClient } from '~/lib/query-client'

export const slamRatingsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['slamRatings'],
    queryFn: async () => {
      const data = await fetchSlamRatings()
      return data
    },
    getKey: item => item.rating.id,
  }),
)
