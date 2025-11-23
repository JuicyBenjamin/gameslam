import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { fetchSlams } from '~/server-functions/slams'
import { queryClient } from '~/lib/query-client'

export const slamsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['slams'],
    queryFn: async () => {
      const data = await fetchSlams()
      return data
    },
    getKey: item => item.slam.id,
  }),
)
